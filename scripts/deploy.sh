#!/usr/bin/env bash
set -euo pipefail

COMMIT_MESSAGE="${1:-Deploy latest changes}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

parse_github_remote() {
  local remote_url="$1"

  if [[ "$remote_url" =~ ^git@github\.com:(.+)/(.+)\.git$ ]]; then
    echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]}"
    return 0
  fi

  if [[ "$remote_url" =~ ^https://github\.com/(.+)/(.+)\.git$ ]]; then
    echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]}"
    return 0
  fi

  if [[ "$remote_url" =~ ^https://github\.com/(.+)/(.+)$ ]]; then
    echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]}"
    return 0
  fi

  return 1
}

require_command npm
require_command git

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This directory is not a git repository."
  echo "Run: git init"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Git remote 'origin' is not configured."
  echo "Create a GitHub repo, then run:"
  echo "git remote add origin <your-github-repo-url>"
  exit 1
fi

REMOTE_URL="$(git remote get-url origin)"

if ! REPO_INFO="$(parse_github_remote "$REMOTE_URL")"; then
  echo "Origin must point to a GitHub repository."
  echo "Current origin: $REMOTE_URL"
  exit 1
fi

OWNER="$(echo "$REPO_INFO" | awk '{print $1}')"
REPO="$(echo "$REPO_INFO" | awk '{print $2}')"
PAGES_URL="https://${OWNER}.github.io/${REPO}/"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Unable to determine current branch."
  exit 1
fi

if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "GitHub Pages workflow deploys from 'main'."
  echo "Current branch: $CURRENT_BRANCH"
  echo "Switch or rename your branch first:"
  echo "git branch -M main"
  exit 1
fi

echo "Building project..."
npm run build

echo "Staging changes..."
git add -A

if ! git diff --cached --quiet; then
  echo "Git changes detected. Creating commit..."
  git commit -m "$COMMIT_MESSAGE"
else
  echo "No git changes detected. Skipping commit."
fi

echo "Pushing to origin/main..."
git push -u origin main

echo "Expected GitHub Pages URL:"
echo "$PAGES_URL"

if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    echo "Waiting for GitHub Pages workflow..."
    RUN_ID="$(gh run list \
      --repo "${OWNER}/${REPO}" \
      --workflow "Deploy GitHub Pages" \
      --branch main \
      --limit 1 \
      --json databaseId \
      --jq '.[0].databaseId')"

    if [[ -n "$RUN_ID" && "$RUN_ID" != "null" ]]; then
      gh run watch "$RUN_ID" --repo "${OWNER}/${REPO}" --exit-status
      ACTUAL_URL="$(gh api "repos/${OWNER}/${REPO}/pages" --jq '.html_url' 2>/dev/null || true)"

      if [[ -n "$ACTUAL_URL" && "$ACTUAL_URL" != "null" ]]; then
        echo "Live URL:"
        echo "$ACTUAL_URL"
        exit 0
      fi
    fi
  fi
fi

echo "Deployment was pushed. If GitHub Actions is enabled, the site will be available at:"
echo "$PAGES_URL"
