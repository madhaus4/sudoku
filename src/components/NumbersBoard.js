"use client";

const NumbersBoard = ({ onNumberClick }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <h1>Numbers Board</h1>
      {numbers.map((number) => (
        <button key={number} onClick={() => onNumberClick(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default NumbersBoard;
