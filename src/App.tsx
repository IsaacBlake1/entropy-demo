import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [particles, setParticles] = useState([
    { char: "L", pos: 0 },
    { char: "i", pos: 1 },
    { char: "l", pos: 2 },
    { char: "l", pos: 3 },
    { char: "i", pos: 4 },
  ]);
  const [history, setHistory] = useState<number[]>([]); // To store previous run counts
  const handleClick = () => {
    let next;
    if (count === 0) {
      next = [
        { char: "L", pos: 1 }, // moved from 0
        { char: "i", pos: 0 }, // moved from 1
        { char: "l", pos: 3 }, // moved from 2
        { char: "l", pos: 2 }, // moved from 3
        { char: "i", pos: 3 }, // moved from 4 (overlapping with 'l')
      ];
    } else {
      next = particles.map((p) => {
        const move = Math.random() > 0.5 ? 1 : -1;
        // Calculate new position, constrained between slot 0 and 4
        let newPos = p.pos + move;
        if (newPos < 0) newPos = 0;
        if (newPos > 4) newPos = 4;

        return { ...p, pos: newPos };
      });
    }
    setParticles(next);
    const sortedNext = [...next].sort((a, b) => a.pos - b.pos);

    const isOrdered = sortedNext.map((p) => p.char).join("") === "Lilli";
    if (isOrdered) {
      setSuccess(true);
      setHistory((prev) => [count + 1, ...prev]);
    } else {
      setSuccess(false);
    }
    setCount((count) => count + 1);
  };

  const sortedParticles = [...particles].sort((a, b) => a.pos - b.pos);
  return (
    <>
      <div>
        <img src={"lilli-128-teal.png"} className="logo" alt="Lilli logo" />
      </div>
      <h1 style={{ color: success ? "#5de2d4" : "white" }}>
        {success ? "Order Restored!" : "Arrange Lilli"}
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          minHeight: "4rem",
          alignItems: "center",
        }}
      >
        {sortedParticles.map((p, index) => (
          <div
            key={index}
            style={{
              fontSize: "3rem",
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
      </div>
      <div className="card">count is {count}</div>
      {success && (
        <div className="card">
          <button
            onClick={() => {
              setCount(0);
              setSuccess(false);
              setParticles([
                { char: "L", pos: 0 },
                { char: "i", pos: 1 },
                { char: "l", pos: 2 },
                { char: "l", pos: 3 },
                { char: "i", pos: 4 },
              ]);
            }}
          >
            Play again
          </button>
        </div>
      )}
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
