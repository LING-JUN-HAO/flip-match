# Repository Guidelines

## Project Structure & Module Organization
This repository is currently minimal and only contains repository metadata. There is no `src/`, `tests/`, or build configuration checked in yet. As code is added, keep the layout predictable:

- `src/` for application code
- `tests/` for automated tests
- `assets/` for static files such as images or fixtures
- `docs/` for design notes or contributor-facing documentation

Prefer small, focused modules. Group related code by feature or domain rather than by file type when the project starts to grow.

## Build, Test, and Development Commands
No build, test, or local development commands are defined yet. If you introduce tooling, document it in `README.md` and keep the command surface simple. Typical examples:

- `npm install` to install dependencies
- `npm run dev` to start a local development server
- `npm test` to run the test suite
- `npm run lint` to check formatting and code quality

Only add commands that are used regularly by contributors.

## Coding Style & Naming Conventions
Use consistent formatting from the start. Prefer 2-space indentation for JavaScript, TypeScript, JSON, and Markdown. Use:

- `camelCase` for variables and functions
- `PascalCase` for classes and component files
- `kebab-case` for directory names and non-component filenames

Adopt an automated formatter and linter early, such as Prettier and ESLint, and commit their configuration with the first substantial code addition.

## Testing Guidelines
There is no test framework configured yet. When adding one, place tests under `tests/` or beside source files using a clear suffix such as `*.test.ts` or `*.spec.ts`. Favor fast, deterministic tests and make sure new features include coverage for core behavior and edge cases.

## Commit & Pull Request Guidelines
Git history is not available in this workspace, so no repository-specific commit convention can be inferred. Use short, imperative commit messages such as `Add match scoring utility` or `Set up ESLint`.

Pull requests should include:

- a brief summary of what changed
- any setup or migration steps
- test evidence, if tests exist
- screenshots for UI changes

## Security & Configuration Tips
Do not commit secrets, API keys, or local environment files. Add sensitive values to `.env.local` or a similar ignored file, and provide a sanitized `.env.example` when configuration becomes necessary.
