import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<number[]>([]); // To store previous run counts
  const [mode, setMode] = useState("Lilli"); // "Lilli" or "Intelligent Lilli"

  const fullWord = mode === "Lilli" ? "Lilli" : "Intelligent Lilli";
  const lettersArray = fullWord.split("");
  const slotCount = lettersArray.length;

  // Initialize particles based on the selected word
  const [particles, setParticles] = useState(
    lettersArray.map((char, i) => ({ char, pos: i })),
  );

  const reset = () => {
    setCount(0);
    setSuccess(false);
    setParticles(lettersArray.map((char, i) => ({ char, pos: i })));
  };

  // Re-initialize when mode changes
  useEffect(() => {
    reset();
  }, [mode]);

  const handleClick = () => {
    let next;
    if (count === 0) {
      // THE "EXPLOSION" STEP: Every particle moves 1 or 2 slots away
      next = particles.map((p, i) => ({
        ...p,
        pos: Math.max(
          0,
          Math.min(slotCount - 1, i + (Math.random() > 0.5 ? 1 : -1)),
        ),
      }));
    } else {
      next = particles.map((p) => {
        const move = Math.random() > 0.5 ? 1 : -1;
        return {
          ...p,
          pos: Math.max(0, Math.min(slotCount - 1, p.pos + move)),
        };
      });
    }

    setParticles(next);
    const sortedNext = [...next].sort((a, b) => a.pos - b.pos);

    const isOrdered = sortedNext.map((p) => p.char).join("") === fullWord;
    if (isOrdered) {
      setSuccess(true);
      setHistory((prev) => [count + 1, ...prev]);
    }
    setCount((prev) => prev + 1);
  };

  const sortedParticles = [...particles].sort((a, b) => a.pos - b.pos);
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "2.5rem",
          width: "100%",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <img src={"lilli-128-teal.png"} className="logo" alt="Lilli logo" />
        <h1 style={{ color: success ? "#5de2d4" : "black", margin: 0 }}>
          {success ? "Order Restored!" : "Arrange Lilli"}
        </h1>
        <div style={{ width: "50px" }} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          minHeight: "4rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {sortedParticles.map((p, index) => (
          <div
            key={index}
            style={{
              fontSize: "5rem",
              fontWeight: "bold",
              transition: "all 0.2s ease", // Makes the 'walk' look smoother
            }}
          >
            {p.char}
          </div>
        ))}
      </div>
      <div className="card">
        <button onClick={handleClick} disabled={success}>
          Take a walk
        </button>
        <div className="card">drunken walks: {count}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {success && <button onClick={reset}>Play again</button>}
        <button
          onClick={() => {
            setMode(mode === "Lilli" ? "Intelligent Lilli" : "Lilli");
            setHistory([]);
          }}
        >
          {mode === "Lilli" ? "Hard mode" : "Easy mode"}
        </button>
      </div>
      {history.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            maxWidth: "300px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h3>Attempt History</h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {history.map((score, i) => (
              <li
                key={i}
                style={{
                  padding: "4px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Run {history.length - i}: <strong>{score} steps</strong>
              </li>
            ))}
          </ul>
          <p className="average">
            Average steps to reverse entropy:
            <strong>
              {" "}
              {(history.reduce((a, b) => a + b, 0) / history.length).toFixed(1)}
            </strong>
          </p>
        </div>
      )}
    </>
  );
}

export default App;
