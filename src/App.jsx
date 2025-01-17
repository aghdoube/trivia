import "./App.css";
import { useEffect, useMemo, useState } from "react";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import "font-awesome/css/font-awesome.min.css";

function App() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [earned, setEarned] = useState({
    amount: "Beginner, but keep going!",
    icon: "",
  });
  const [data, setData] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [stopTimer, setStopTimer] = useState(false);

  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: "Trivia Novice", icon: "fa-user " },
        { id: 2, amount: "Trivia Enthusiast", icon: "fa-bookmark" },
        { id: 3, amount: "Quiz Wizard", icon: "fa-magic" },
        { id: 4, amount: "Fast Thinker", icon: "fa-bolt" },
        { id: 5, amount: "Mastermind", icon: "fa-puzzle-piece" },
        { id: 6, amount: "Trivia King", icon: "fa-crown" },
        { id: 7, amount: "Quiz Overlord", icon: "fa-chess" },
        { id: 8, amount: "Brainiac", icon: "fa-gear" },
        { id: 9, amount: "Legendary", icon: "fa-star" },
        { id: 10, amount: "Trivia Hero ", icon: "fa-sun" },
        { id: 11, amount: "Champion", icon: "fa-trophy" },
        { id: 12, amount: "Supreme Genius", icon: "fa-lightbulb-o" },
        { id: 13, amount: "Ultimate Winner", icon: "fa-diamond" },
        { id: 14, amount: "Quiz Maestro", icon: "fa-shield" },
        { id: 15, amount: "Trivia God", icon: "fa-graduation-cap " },
      ].reverse(),
    []
  );

  const handleBackToStart = () => {
    setDifficulty(null);
    setQuestionNumber(1);
    setEarned({ amount: "No Badge", icon: "" });
    setStop(false);

    setStopTimer(false);
    setData([]);
  };

  // Fisher-Yates Shuffle function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (difficulty) {
      console.log("questions for difficulty: ", difficulty);

      fetch(`https://the-trivia-api.com/v2/questions?difficulty=${difficulty}`)
        .then((response) => response.json())
        .then((fetchedData) => {
          const formattedData = fetchedData.slice(0, 20).map((item, index) => {
            // Shuffle answers Fisher-Yates algorithm
            const answers = [...item.incorrectAnswers, item.correctAnswer].map(
              (answer) => ({
                text: answer,
                correct: answer === item.correctAnswer,
              })
            );
            shuffleArray(answers);

            return {
              id: index + 1,
              question: item.question.text,
              answers: answers,
            };
          });

          setData(formattedData);
          console.log("Questions fetched: ", formattedData);
          console.log("Fetched data length: ", fetchedData.length);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [difficulty]);

  useEffect(() => {
    if (questionNumber > 1) {
      const earnedBadge = moneyPyramid.find((m) => m.id === questionNumber - 1);
      setEarned({ amount: earnedBadge.amount, icon: earnedBadge.icon });
    }
  }, [moneyPyramid, questionNumber]);

  return (
    <div className="app">
      {difficulty ? (
        <>
          <div className="main">
            {stop ? (
              <div className="endContainer">
                <h1 className="endText">
                  You are a :{" "}
                  <span className="earnedBadge">
                    <i className={`fa ${earned.icon} earnedIcon`}></i>{" "}
                    {earned.amount}
                  </span>
                </h1>
                <button onClick={handleBackToStart} className="backButton">
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="top">
                  <div className="timer">
                    <Timer
                      setStop={setStop}
                      questionNumber={questionNumber}
                      stopTimer={stopTimer}
                    />
                  </div>
                </div>
                <div className="bottom">
                  <Trivia
                    data={data}
                    setStop={setStop}
                    questionNumber={questionNumber}
                    setQuestionNumber={setQuestionNumber}
                    setStopTimer={setStopTimer}
                  />
                </div>
              </>
            )}
          </div>

          <div className="pyramid">
            <ul className="moneyList">
              {moneyPyramid.map((m) => (
                <li
                  key={m.id}
                  className={
                    questionNumber === m.id
                      ? "moneyListItem active"
                      : "moneyListItem"
                  }
                >
                  <span className="moneyListItemAmount">
                    <i className={`fa ${m.icon} money-icon`}></i>
                    <span className="money-text">{m.amount}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Start setDifficulty={setDifficulty} />
      )}
    </div>
  );
}

export default App;
