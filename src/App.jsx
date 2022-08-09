import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import Confetti from "react-confetti";
// import useWindowSize from "@react-hook/window-size"

export default function App() {
  //setting dice random dice state
  const [dice, setDice] = React.useState(allNewDice());

  const [tenzies, setTenzies] = React.useState(false);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSame = dice.every((die) => die.value === firstValue);

    if (allHeld && allSame) {
      setTenzies(true);
    }
  }, [dice]);

  //generating 10 die components
  const diElements = dice.map((die) => {
    return (
      <Die
        value={die.value}
        isHeld={die.isHeld}
        key={die.id}
        hold={() => holdDice(die.id)}
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
    setDice(allNewDice());
    setTenzies(false);
  }

  // const { width, height } = useWindowSize();
 
  return (
    <main className="main-container">
      {tenzies && <Confetti width={1300}/>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. <br />
        Click each die to freeze it at its current value between rolls.
      </p>
      <div className="dice-container">{diElements}</div>
      <button className="roll-btn" onClick={tenzies ? reset : roll}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
