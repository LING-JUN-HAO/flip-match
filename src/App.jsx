import { useEffect, useRef, useState } from "react";

const LEVELS = [
  { id: 1, pairCount: 6 },
  { id: 2, pairCount: 4 },
  { id: 3, pairCount: 2 },
];

const CARD_SYMBOLS = [
  "🍓",
  "🚀",
  "🐼",
  "🎧",
  "🌈",
  "⚽",
  "🍩",
  "🎲",
  "🦊",
  "🎯",
];
const STAGE = {
  intro: "intro",
  playing: "playing",
  gameOver: "gameOver",
  victory: "victory",
};

function shuffle(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function createDeck(pairCount) {
  return shuffle(
    CARD_SYMBOLS.slice(0, pairCount).flatMap((symbol, pairIndex) => [
      {
        id: `${pairIndex}-a-${crypto.randomUUID()}`,
        symbol,
        matched: false,
      },
      {
        id: `${pairIndex}-b-${crypto.randomUUID()}`,
        symbol,
        matched: false,
      },
    ]),
  );
}

function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stage, setStage] = useState(STAGE.intro);
  const timeoutRef = useRef(null);
  const stageTimeoutRef = useRef(null);

  const level = LEVELS[levelIndex];
  const previewLevel =
    stage === STAGE.intro && cards.length > 0
      ? LEVELS[Math.min(levelIndex + 1, LEVELS.length - 1)]
      : LEVELS[0];
  const displayedLevel = stage === STAGE.intro ? previewLevel : level;
  const matchedPairs = cards.filter((card) => card.matched).length / 2;
  const isBoardLocked = flippedIds.length === 2;

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
      window.clearTimeout(stageTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (stage !== STAGE.playing) {
      return undefined;
    }

    if (timeLeft <= 0) {
      setStage(STAGE.gameOver);
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [stage, timeLeft]);

  useEffect(() => {
    if (flippedIds.length !== 2) {
      return undefined;
    }

    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) {
      return undefined;
    }

    if (firstCard.symbol === secondCard.symbol) {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.symbol === firstCard.symbol ? { ...card, matched: true } : card,
        ),
      );
      setScore((currentScore) => currentScore + 100 + timeLeft * 5);
      setFlippedIds([]);
      return undefined;
    }

    timeoutRef.current = window.setTimeout(() => {
      setFlippedIds([]);
    }, 500);

    return () => window.clearTimeout(timeoutRef.current);
  }, [cards, flippedIds, timeLeft]);

  useEffect(() => {
    if (stage !== STAGE.playing || cards.length === 0) {
      return;
    }

    const allMatched = cards.every((card) => card.matched);

    if (!allMatched) {
      return;
    }

    if (levelIndex === LEVELS.length - 1) {
      setStage(STAGE.victory);
      return;
    }

    setStage(STAGE.intro);
    stageTimeoutRef.current = window.setTimeout(() => {
      startLevel(levelIndex + 1);
    }, 1400);
  }, [cards, levelIndex, stage]);

  function startLevel(targetLevelIndex) {
    const nextLevel = LEVELS[targetLevelIndex];

    if (!nextLevel) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    window.clearTimeout(stageTimeoutRef.current);
    setLevelIndex(targetLevelIndex);
    setCards(createDeck(nextLevel.pairCount));
    setFlippedIds([]);
    setTimeLeft(30);
    setStage(STAGE.playing);
  }

  function handleStartGame() {
    setScore(0);
    startLevel(0);
  }

  function handleRestart() {
    window.clearTimeout(timeoutRef.current);
    window.clearTimeout(stageTimeoutRef.current);
    setScore(0);
    setLevelIndex(0);
    setCards([]);
    setFlippedIds([]);
    setTimeLeft(30);
    setStage(STAGE.intro);
  }

  function handleCardClick(cardId) {
    if (stage !== STAGE.playing || isBoardLocked) {
      return;
    }

    const card = cards.find((item) => item.id === cardId);

    if (!card || card.matched || flippedIds.includes(cardId)) {
      return;
    }

    setFlippedIds((current) => [...current, cardId]);
  }

  const overlayContent = {
    [STAGE.intro]: {
      title: cards.length === 0 ? "翻牌配對遊戲" : `第 ${previewLevel.id} 關`,
      text:
        cards.length === 0
          ? "共三關，每關限時 30 秒，成功配對即可依剩餘時間加分。"
          : `${previewLevel.pairCount} 組牌，準備開始。`,
      actionLabel: cards.length === 0 ? "開始遊戲" : null,
      onAction: cards.length === 0 ? handleStartGame : null,
    },
    [STAGE.gameOver]: {
      title: "遊戲結束",
      text: "時間到，尚未完成本關配對。",
      actionLabel: "重新開始",
      onAction: handleRestart,
    },
    [STAGE.victory]: {
      title: "全部通關",
      text: `最終分數：${score}`,
      actionLabel: "重新開始",
      onAction: handleRestart,
    },
  };

  const showOverlay = stage !== STAGE.playing;
  const currentOverlay = overlayContent[stage];

  return (
    <main className="app-shell">
      <section className="game-panel">
        <header className="status-bar">
          <div>
            <span className="status-label">關卡</span>
            <strong>{displayedLevel?.id ?? 1} / 3</strong>
          </div>
          <div>
            <span className="status-label">分數</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span className="status-label">時間</span>
            <strong className={timeLeft <= 10 ? "time-alert" : ""}>
              {Math.max(timeLeft, 0)}s
            </strong>
          </div>
        </header>

        <div className={`board board-${displayedLevel?.pairCount ?? 6}`}>
          {cards.map((card) => {
            const isFlipped = card.matched || flippedIds.includes(card.id);

            return (
              <button
                key={card.id}
                type="button"
                className={`card ${isFlipped ? "is-flipped" : ""}`}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched}
              >
                <span className="card-face card-front">{card.symbol}</span>
                <span className="card-face card-back">✦</span>
              </button>
            );
          })}
        </div>

        <footer className="progress-note">
          已完成 {matchedPairs} / {displayedLevel?.pairCount ?? 0} 組配對
        </footer>

        {showOverlay ? (
          <div className="overlay">
            <div className="overlay-card">
              <p className="overlay-kicker">Memory Match</p>
              <h1>{currentOverlay.title}</h1>
              <p>{currentOverlay.text}</p>
              {currentOverlay.actionLabel ? (
                <button
                  type="button"
                  className="primary-button"
                  onClick={currentOverlay.onAction}
                >
                  {currentOverlay.actionLabel}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default App;
