import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Type, Play, Clock } from "lucide-react";

// Simple sound utility
const playSound = (type, volume) => {
  try {
    if (volume <= 0) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const maxGain = 2.0; // Increased base loudness further
    const targetGain = maxGain * volume;

    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(targetGain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        targetGain * 0.1,
        ctx.currentTime + 0.1,
      );
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "incorrect") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(targetGain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        targetGain * 0.1,
        ctx.currentTime + 0.2,
      );
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export default function TypingEngine({
  passage,
  onFinish,
  activeKeyHandler,
  onProgress,
  soundVolume,
  onKeyStroke,
  onActiveTick,
  isPaused,
  onBack,
  onRestart,
  lockOnError,
}) {
  const [inputState, setInputState] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [currentLetterError, setCurrentLetterError] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [cursorPos, setCursorPos] = useState({
    left: 0,
    top: 0,
    width: 0,
    opacity: 0,
  });
  const containerRef = useRef(null);
  const [pressedKey, setPressedKey] = useState(null);
  const paragraphRef = useRef(null);

  const calculateStats = (currentState, timeMs, currentIncorrectCount = null) => {
    const timeElapsedMin = timeMs / 60000;
    const words = currentState.length / 5;
    const wpm = timeElapsedMin > 0 ? Math.round(words / timeElapsedMin) : 0;

    const correctChars = currentState.filter((v) => v).length;
    
    let incorrectChars, totalChars;
    if (lockOnError && currentIncorrectCount !== null) {
      incorrectChars = currentIncorrectCount;
      totalChars = correctChars + incorrectChars;
    } else {
      incorrectChars = currentState.length - correctChars;
      totalChars = currentState.length;
    }

    const accuracy =
      totalChars > 0
        ? Math.round((correctChars / totalChars) * 100)
        : 100;

    return {
      wpm,
      accuracy,
      timeSpentSeconds: Math.floor(timeMs / 1000),
      correctChars,
      incorrectChars,
      totalChars,
      inputState: currentState,
    };
  };

  useEffect(() => {
    let interval;
    if (startTime && inputState.length < passage.length && !isPaused) {
      interval = setInterval(() => {
        const timeMs = Date.now() - startTime;
        setElapsedTime(Math.floor(timeMs / 1000));
        if (onProgress) {
          onProgress(calculateStats(inputState, timeMs, incorrectCount));
        }
        if (onActiveTick) {
          onActiveTick();
        }
      }, 1000);
    } else if (inputState.length >= passage.length && startTime) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [
    startTime,
    inputState.length,
    passage.length,
    onProgress,
    inputState,
    isPaused,
    incorrectCount,
    lockOnError,
  ]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
    setInputState([]);
    setStartTime(null);
    setElapsedTime(0);
    activeKeyHandler(null);
    setCurrentLetterError(false);
    setIncorrectCount(0);
  }, [passage]);

  useEffect(() => {
    const activeEl = document.getElementById(`letter-${inputState.length}`);
    const textContainer = document.querySelector(".typing-text");
    if (activeEl && textContainer && isFocused) {
      const activeRect = activeEl.getBoundingClientRect();
      const containerRect = textContainer.getBoundingClientRect();

      setCursorPos({
        left: activeRect.left - containerRect.left,
        top: activeRect.bottom - containerRect.top - 2, // Slight offset to look like an underline
        width: activeRect.width,
        opacity: 1,
      });
    } else {
      setCursorPos((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [inputState.length, passage, isFocused]);



  const handleKeyDown = (e) => {
    if (isPaused) return;

    setPressedKey(e.key.toLowerCase());

    if (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "Tab" ||
      e.key === "CapsLock"
    ) {
      activeKeyHandler(e.key.toLowerCase());
      return;
    }

    if (e.key === " ") {
      e.preventDefault();
      activeKeyHandler(" ");
    }

    if (!startTime && inputState.length === 0 && e.key.length === 1) {
      setStartTime(Date.now());
    }

    if (e.key === "Backspace") {
      activeKeyHandler("backspace");
      if (lockOnError && currentLetterError) {
        setCurrentLetterError(false);
      } else {
        setInputState((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (e.key === "Enter") {
      activeKeyHandler("enter");
      return;
    }

    if (e.key.length === 1) {
      activeKeyHandler(e.key.toLowerCase());

      const targetChar = passage[inputState.length];
      if (!targetChar) return;

      const isCorrect = e.key === targetChar;

      if (lockOnError) {
        if (isCorrect) {
          const newState = [...inputState, !currentLetterError];
          setInputState(newState);

          if (onKeyStroke) {
            onKeyStroke(true);
          }

          playSound("correct", soundVolume);
          setCurrentLetterError(false);

          if (onProgress) {
            onProgress(
              calculateStats(newState, Date.now() - (startTime || Date.now()), incorrectCount),
            );
          }

          if (newState.length === passage.length) {
            onFinish(
              calculateStats(newState, Date.now() - (startTime || Date.now()), incorrectCount),
            );
          }
        } else {
          setIncorrectCount((prev) => {
            const next = prev + 1;
            if (onKeyStroke) {
              onKeyStroke(false);
            }
            return next;
          });
          setCurrentLetterError(true);
          playSound("incorrect", soundVolume);

          if (containerRef.current) {
            gsap.fromTo(
              containerRef.current,
              { x: -5 },
              {
                x: 5,
                duration: 0.05,
                yoyo: true,
                repeat: 3,
                onComplete: () => gsap.set(containerRef.current, { x: 0 }),
              },
            );
          }

          if (onProgress) {
            onProgress(
              calculateStats(inputState, Date.now() - (startTime || Date.now()), incorrectCount + 1),
            );
          }
        }
      } else {
        const newState = [...inputState, isCorrect];
        setInputState(newState);

        if (onKeyStroke) {
          onKeyStroke(isCorrect);
        }

        const nextIncorrectCount = incorrectCount + (isCorrect ? 0 : 1);
        if (!isCorrect) {
          setIncorrectCount((prev) => prev + 1);
          playSound("incorrect", soundVolume);
          if (containerRef.current) {
            gsap.fromTo(
              containerRef.current,
              { x: -5 },
              {
                x: 5,
                duration: 0.05,
                yoyo: true,
                repeat: 3,
                onComplete: () => gsap.set(containerRef.current, { x: 0 }),
              },
            );
          }
        } else {
          playSound("correct", soundVolume);
        }

        if (onProgress) {
          onProgress(
            calculateStats(newState, Date.now() - (startTime || Date.now()), nextIncorrectCount),
          );
        }

        if (newState.length === passage.length) {
          onFinish(
            calculateStats(newState, Date.now() - (startTime || Date.now()), nextIncorrectCount),
          );
        }
      }
    }
  };

  const handleKeyUp = () => {
    if (isPaused) return;
    setPressedKey(null);
    activeKeyHandler(null);
  };

  const renderPassage = () => {
    const words = passage.split(" ");
    let globalIndex = 0;

    const elements = [];
    words.forEach((word, wIdx) => {
      const isLastWord = wIdx === words.length - 1;
      const wordChars = isLastWord ? word : word + " ";

      elements.push(
        <div key={`word-${wIdx}`} className="screenBasic-word">
          {wordChars.split("").map((char, cIdx) => {
            const index = globalIndex++;
            let className = "letter letter--basic screenBasic-letter";

            if (index < inputState.length) {
              if (lockOnError) {
                className += " correct";
              } else {
                className += inputState[index] ? " correct" : " incorrect";
              }
            } else if (index === inputState.length) {
              className += " is-active";
              if (lockOnError && currentLetterError) {
                className += " incorrect";
              }
            }

            return (
              <div key={index} id={`letter-${index}`} className={className}>
                {char === " " ? "\u00A0" : char}
              </div>
            );
          })}
        </div>,
      );
    });

    return elements;
  };

  const progress =
    passage.length > 0 ? (inputState.length / passage.length) * 100 : 0;

  return (
    <div>
      {/* ── Compact toolbar: buttons | timer | progress ── */}
      <div className="te-toolbar">
        <div className="te-toolbar-left">
          {onBack && (
            <button
              className="engine-action-btn engine-btn-back"
              onClick={onBack}
              title="Back to Setup"
            >
              <span style={{ userSelect: "none" }}>👈</span>
              <span>Setup</span>
            </button>
          )}
          {onRestart && (
            <button
              className="engine-action-btn engine-btn-restart"
              onClick={onRestart}
              title="New Passage"
            >
              <span style={{ userSelect: "none" }}>🔄</span>
              <span>Restart</span>
            </button>
          )}
        </div>

        <div className="timer-display">
          <Clock size={14} />
          <span>
            {Math.floor(elapsedTime / 60)}:
            {(elapsedTime % 60).toString().padStart(2, "0")}
          </span>
        </div>

        <div
          className="te-toolbar-right"
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <span className="te-progress-badge">
            {Math.round(progress)}% Done
          </span>
        </div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: "1rem" }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="typing-wrapper">
        <div
          className="typing-container"
          tabIndex="0"
          ref={containerRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {!isFocused && (
            <div
              className="blur-overlay"
              onClick={() => containerRef.current?.focus()}
            >
              <span className="blur-text neon-text-cyan">
                <Play
                  size={28}
                  className="neon-icon-cyan"
                  style={{ marginRight: "0.5rem" }}
                />{" "}
                Click to focus &amp; type
              </span>
            </div>
          )}
          <div className="typing-text js-screen-lines">
            {renderPassage()}
            <div
              className="cursor-underline"
              style={{
                position: "absolute",
                height: "3px",
                backgroundColor: "var(--accent)",
                zIndex: 9999,
                pointerEvents: "none",
                transition:
                  "left 0.1s ease-out, top 0.1s ease-out, width 0.1s ease-out, opacity 0.2s",
                left: `${cursorPos.left}px`,
                top: `${cursorPos.top}px`,
                width: `${cursorPos.width}px`,
                opacity: cursorPos.opacity,
              }}
            ></div>
          </div>
        </div>
      </div>


    </div>
  );
}
