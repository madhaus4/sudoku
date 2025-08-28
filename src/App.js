"use client";
import { useState } from "react";
import GameBoard from "./components/GameBoard";
import NumbersBoard from "./components/NumbersBoard";

const EMPTY_BOARD = [
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];

const App = () => {
  const [gameState, setGameState] = useState(EMPTY_BOARD);

  const handleNumberClick = (number) => {
    console.log("Number clicked:", number);
  };

  return (
    <div>
      <h1>App</h1>
      <GameBoard gameState={gameState} />
      <NumbersBoard onNumberClick={handleNumberClick} />
    </div>
  );
};

export default App;
