"use client";

const NumbersBoard = ({ selectedNumber, onNumberClick, onClearCell, completedNumbers }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="numbers-board">
      <h3>Select Number</h3>
      <div className="number-buttons">
        {numbers.map((number) => {
          const isCompleted = completedNumbers.has(number);
          return (
            <button 
              key={number} 
              className={`number-btn ${selectedNumber === number ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => onNumberClick(number)}
              disabled={isCompleted}
            >
              {number}
            </button>
          );
        })}
      </div>
      <button 
        className="clear-btn"
        onClick={onClearCell}
      >
        Clear Cell
      </button>
    </div>
  );
};

export default NumbersBoard;
