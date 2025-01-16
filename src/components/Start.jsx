import React, { useState, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function Start({ setDifficulty }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [countdown, setCountdown] = useState(0);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const handleStart = () => {
    if (selectedDifficulty) {
      let count = 3;
      const interval = setInterval(() => {
        setCountdown(count);
        count--;
        if (count < 0) {
          clearInterval(interval);
          setDifficulty(selectedDifficulty);
        }
      }, 1000);
    } else {
      iziToast.error({
        title: "Ups!",
        message: "Please select a difficulty level to start!",
        position: "topRight",
        backgroundColor: "#2397d8",
        color: "#fff",
        timeout: 5000,
      });
    }
  };

  return (
    <div className="start">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#202030",
            },
          },
          fpsLimit: 60,
          particles: {
            color: { value: "#ffffff" },
            links: { enable: true, color: "#ffffff", distance: 150 },
            move: { enable: true, speed: 1 },
            number: { value: 50 },
            size: { value: 3 },
          },
        }}
      />

      <div className="startContent">
        <h1 className="quizTitle">The Ultimate Trivia Challenge!</h1>
        <h2>Select Difficulty</h2>
        <div className="difficultyOptions">
          <button
            className={`difficultyButton ${
              selectedDifficulty === "easy" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("easy")}
          >
            🛡 Easy
          </button>
          <button
            className={`difficultyButton ${
              selectedDifficulty === "medium" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("medium")}
          >
            ⚖ Medium
          </button>
          <button
            className={`difficultyButton ${
              selectedDifficulty === "hard" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("hard")}
          >
            ⚡ Hard
          </button>
        </div>
        <button
          className={`startButton ${countdown > 0 ? "loading" : ""}`}
          onClick={handleStart}
          disabled={countdown > 0}
        >
          {countdown > 0 ? countdown : "Start"}
        </button>
      </div>
    </div>
  );
}
