import React, { useEffect, useState } from "react";

const Timer = ({ setStop, questionNumber, stopTimer }) => {
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    let interval = null;

    console.log("stopTimer value:", stopTimer);

    if (!stopTimer && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setStop(true);
    }

    return () => clearInterval(interval);
  }, [timer, setStop, stopTimer]);

  useEffect(() => {
    setTimer(15);
  }, [questionNumber]);

  return <div>{timer}</div>;
};

export default Timer;
