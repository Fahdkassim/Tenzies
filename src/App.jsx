import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import Confetti from "react-confetti";

export default function App() {
  //setting dice random dice state

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState();
  
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSame = dice.every((die) => die.value === firstValue);

    if (allHeld && allSame) {
      setTenzies(true);
      setTimerOn(false)
    }
  }, [dice]);

  //generating 10 die components
  const diElements = dice.map((die) => {
    return (
      <Die
        value={die.value}
        isHeld={die.isHeld}
        key={die.id}
        hold={() => {
          holdDice(die.id)
          setTimerOn(true)
        }}
      />
    );
  });

  function holdDice(id) {
    setDice((prevNumber) =>
      prevNumber.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  // random number functions
  function allNewDice() {
    let randomArray = [];

    for (let i = 0; i < 10; i++) {
      let random = {
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
        id: nanoid(),
      };
      randomArray.push(random);
    }
    return randomArray;
  }
  //roll button function

  function roll() {
    startTimer()
    return setDice((prevdice) =>
      prevdice.map((die) => {
        return die.isHeld
          ? die
          : {
              value: Math.floor(Math.random() * 6) + 1,
              isHeld: false,
              id: nanoid(),
            };
      })
    );
  }

  function reset() {
    stopTimer()
    setDice(allNewDice());
    setTenzies(false);
  }
  // timer code
  function startTimer() {
    setTimerOn(true);
  }
  function stopTimer() {
    setTimerOn(false);
    setTime(0)
  }

  useEffect(() => {
   
    let interval = null;
    if (timerOn===true) {
      interval = setInterval(() => {
        setTime(time + 1);
      }, 1000);
    } else{
      clearInterval(interval);
      
    }
    return () => {
      clearInterval(interval);
    };
  },[time, timerOn]);

  

  return (
    <main className="main-container">
      {tenzies && <Confetti width={1300} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. <br />
        Click each die to freeze it at its current value between rolls.
      </p>
      <div className="dice-container">{diElements}</div>
      <p className="seconds">
        Time lapsed is <strong>{time}</strong> seconds
      </p>

      <button className="roll-btn" onClick={tenzies ? reset : roll}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
