"use client";

const GameBoard = ({ gameState, selectedCell, selectedNumber, invalidCells, isOriginalCell, onCellClick }) => {
  const handleGameBoardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="game-board" onClick={handleGameBoardClick}>
      <div className="sudoku-grid">
        {gameState.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
              const isInvalid = invalidCells.has(cellKey);
              const hasSameNumber = selectedNumber !== null && cell === selectedNumber;
              const isOriginal = isOriginalCell(rowIndex, colIndex);
              
              return (
                <div
                  key={colIndex}
                  className={`sudoku-cell ${
                    isSelected ? 'selected' : ''
                  } ${
                    isInvalid ? 'invalid' : ''
                  } ${
                    hasSameNumber ? 'same-number' : ''
                  } ${
                    isOriginal ? 'original' : ''
                  }`}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
