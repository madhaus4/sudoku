"use client";

import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import NumbersBoard from "./components/NumbersBoard";

// Create an empty 9x9 board filled with 0s (0 represents empty cell)
const createEmptyBoard = () => {
  return Array(9).fill().map(() => Array(9).fill(0));
};

// Core validation function - checks if placing a number at (row, col) is valid
const is_valid = (board, num, row, col) => {
  // Check row constraint
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num && x !== col) {
      return false;
    }
  }

  // Check column constraint
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num && x !== row) {
      return false;
    }
  }

  // Check 3x3 box constraint
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const checkRow = startRow + i;
      const checkCol = startCol + j;
      if (board[checkRow][checkCol] === num && (checkRow !== row || checkCol !== col)) {
        return false;
      }
    }
  }

  return true;
};

// Check if a number is correct according to the solution
const is_correct = (solutionBoard, num, row, col) => {
  return solutionBoard[row][col] === num;
};

// Check if all instances of a number are correctly placed
const isNumberCompleted = (gameState, solutionBoard, number) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (solutionBoard[row][col] === number) {
        // If the solution has this number here, check if it's correctly placed
        if (gameState[row][col] !== number) {
          return false; // This instance is not correctly placed
        }
      }
    }
  }
  return true; // All instances are correctly placed
};

// Check if the board is completely solved
const is_solved = (board, solutionBoard) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return false; // Found empty cell
      }
      if (board[row][col] !== solutionBoard[row][col]) {
        return false; // Found incorrect number
      }
    }
  }
  return true;
};

// Generate a complete solved Sudoku board using backtracking
const generateSolvedBoard = () => {
  const board = createEmptyBoard();
  
  const solve = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // Try numbers 1-9 in random order for variety
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
          }
          
          for (let num of numbers) {
            if (is_valid(board, num, row, col)) {
              board[row][col] = num;
              if (solve(board)) {
                return true;
              }
              board[row][col] = 0; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  solve(board);
  return board;
};

// Generate a puzzle by removing numbers from a solved board
const generatePuzzle = (difficulty = 'medium') => {
  const solvedBoard = generateSolvedBoard();
  const puzzle = solvedBoard.map(row => [...row]); // Deep copy
  
  // Number of cells to remove based on difficulty
  const cellsToRemove = {
    'easy': 40,
    'medium': 50,
    'hard': 60
  };
  
  const removeCount = cellsToRemove[difficulty] || 50;
  let removed = 0;
  
  // Remove numbers randomly while ensuring the puzzle remains solvable
  while (removed < removeCount) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      const originalValue = puzzle[row][col];
      puzzle[row][col] = 0;
      
      // Check if puzzle is still solvable (basic check)
      const tempBoard = puzzle.map(row => [...row]);
      if (hasUniqueSolution(tempBoard)) {
        removed++;
      } else {
        puzzle[row][col] = originalValue; // Restore if not solvable
      }
    }
  }
  
  return { puzzle, solution: solvedBoard };
};

// Simple check for unique solution (simplified version)
const hasUniqueSolution = (board) => {
  // This is a simplified check - in a full implementation,
  // you'd want a more robust uniqueness verification
  return true;
};

const App = () => {
  const [gameState, setGameState] = useState(createEmptyBoard());
  const [originalPuzzle, setOriginalPuzzle] = useState(createEmptyBoard());
  const [solutionBoard, setSolutionBoard] = useState(createEmptyBoard()); // Store the complete solution
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [difficulty, setDifficulty] = useState('medium');
  const [gameWon, setGameWon] = useState(false);
  const [invalidCells, setInvalidCells] = useState(new Set());
  const [lastPlacedCell, setLastPlacedCell] = useState(null);
  const [completedNumbers, setCompletedNumbers] = useState(new Set()); // Track which numbers (1-9) are fully completed

  // Generate new game
  const generateNewGame = () => {
    const { puzzle, solution } = generatePuzzle(difficulty);
    setGameState(puzzle);
    setOriginalPuzzle(puzzle.map(row => [...row])); // Deep copy of the original puzzle
    setSolutionBoard(solution); // Store the complete solution
    setSelectedNumber(null);
    setSelectedCell({ row: null, col: null });
    setGameWon(false);
    setInvalidCells(new Set());
    setLastPlacedCell(null);
    setCompletedNumbers(new Set()); // Reset completed numbers
  };

  // Initialize with a new game on component mount
  useEffect(() => {
    generateNewGame();
  }, [difficulty]);

  // Check if a cell is part of the original puzzle (locked)
  const isOriginalCell = (row, col) => {
    return originalPuzzle[row][col] !== 0;
  };

  // Update completed numbers based on current game state
  const updateCompletedNumbers = (currentGameState) => {
    const newCompletedNumbers = new Set();
    for (let num = 1; num <= 9; num++) {
      if (isNumberCompleted(currentGameState, solutionBoard, num)) {
        newCompletedNumbers.add(num);
      }
    }
    setCompletedNumbers(newCompletedNumbers);
  };

  // Handle cell selection on game board
  const handleCellClick = (row, col) => {
    // Only allow selection of non-original cells
    if (!isOriginalCell(row, col)) {
      setSelectedCell({ row, col });
      
      // If a number is selected, place it in the cell
      if (selectedNumber !== null) {
        const newBoard = gameState.map(row => [...row]);
        newBoard[row][col] = selectedNumber;
        setGameState(newBoard);
        
        // Track the last placed cell
        setLastPlacedCell({ row, col });
        
        // Check if the newly placed number is correct according to the solution
        const isCorrect = is_correct(solutionBoard, selectedNumber, row, col);
        
        // Update invalid cells - only mark the newly placed cell if it's incorrect
        const newInvalidCells = new Set(invalidCells);
        const cellKey = `${row}-${col}`;
        
        if (isCorrect) {
          // Remove from invalid cells if it was there
          newInvalidCells.delete(cellKey);
        } else {
          // Add to invalid cells
          newInvalidCells.add(cellKey);
        }
        
        setInvalidCells(newInvalidCells);
        
        // Update completed numbers after placing a number
        updateCompletedNumbers(newBoard);
        
        // Check if game is won (only if no invalid cells)
        if (newInvalidCells.size === 0 && is_solved(newBoard, solutionBoard)) {
          setGameWon(true);
        }
      }
    }
  };

  // Handle clicking outside the game board to deselect
  const handleAppClick = (event) => {
    // Check if the click is outside the game board
    const gameBoard = event.target.closest('.game-board');
    if (!gameBoard) {
      setSelectedCell({ row: null, col: null });
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (selectedCell.row !== null && selectedCell.col !== null) {
        const key = event.key;
        
        // Handle number keys 1-9
        if (key >= '1' && key <= '9') {
          const number = parseInt(key);
          // Only allow placing numbers in non-original cells
          if (!isOriginalCell(selectedCell.row, selectedCell.col)) {
            setSelectedNumber(number);
            handleCellClick(selectedCell.row, selectedCell.col);
          }
        }
        
        // Handle delete/backspace to clear cell
        if (key === 'Delete' || key === 'Backspace') {
          // Only allow clearing cells that are not part of the original puzzle
          if (!isOriginalCell(selectedCell.row, selectedCell.col)) {
            const newBoard = gameState.map(row => [...row]);
            newBoard[selectedCell.row][selectedCell.col] = 0;
            setGameState(newBoard);
            
            // Clear the last placed cell if it's the one being cleared
            if (lastPlacedCell && 
                lastPlacedCell.row === selectedCell.row && 
                lastPlacedCell.col === selectedCell.col) {
              setLastPlacedCell(null);
            }
            
            // Remove this cell from invalid cells
            const cellKey = `${selectedCell.row}-${selectedCell.col}`;
            const newInvalidCells = new Set(invalidCells);
            newInvalidCells.delete(cellKey);
            setInvalidCells(newInvalidCells);
            
            // Update completed numbers after clearing a cell
            updateCompletedNumbers(newBoard);
          }
        }
        
        // Handle arrow keys for navigation
        if (key === 'ArrowUp' && selectedCell.row > 0) {
          setSelectedCell({ row: selectedCell.row - 1, col: selectedCell.col });
        } else if (key === 'ArrowDown' && selectedCell.row < 8) {
          setSelectedCell({ row: selectedCell.row + 1, col: selectedCell.col });
        } else if (key === 'ArrowLeft' && selectedCell.col > 0) {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col - 1 });
        } else if (key === 'ArrowRight' && selectedCell.col < 8) {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, gameState, invalidCells, isOriginalCell, handleCellClick, lastPlacedCell, updateCompletedNumbers]);

  // Handle number selection from number board
  const handleNumberClick = (number) => {
    // Don't allow selecting completed numbers
    if (completedNumbers.has(number)) {
      return;
    }
    
    if (selectedNumber === number) {
      setSelectedNumber(null);
    } else {
      setSelectedNumber(number);
    }
  };

  // Handle clearing the selected cell
  const handleClearCell = () => {
    if (selectedCell.row !== null && selectedCell.col !== null) {
      // Only allow clearing cells that are not part of the original puzzle
      if (!isOriginalCell(selectedCell.row, selectedCell.col)) {
        const newBoard = gameState.map(row => [...row]);
        newBoard[selectedCell.row][selectedCell.col] = 0;
        setGameState(newBoard);
        
        // Clear the last placed cell if it's the one being cleared
        if (lastPlacedCell && 
            lastPlacedCell.row === selectedCell.row && 
            lastPlacedCell.col === selectedCell.col) {
          setLastPlacedCell(null);
        }
        
        // Remove this cell from invalid cells
        const cellKey = `${selectedCell.row}-${selectedCell.col}`;
        const newInvalidCells = new Set(invalidCells);
        newInvalidCells.delete(cellKey);
        setInvalidCells(newInvalidCells);
        
        // Update completed numbers after clearing a cell
        updateCompletedNumbers(newBoard);
      }
    }
  };

  return (
    <div className="app" onClick={handleAppClick}>
      <div className="header">
        <h1>Sudoku</h1>
        <div className="controls">
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="difficulty-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={generateNewGame} className="new-game-btn">
            New Game
          </button>
        </div>
      </div>
      
      {gameWon && (
        <div className="win-message">
          <h2>🎉 Winner, winner, chick&apos;n dinner! 🎉</h2>
        </div>
      )}
      
      <div className="game-container">
        <GameBoard
          gameState={gameState}
          selectedCell={selectedCell}
          selectedNumber={selectedNumber}
          invalidCells={invalidCells}
          isOriginalCell={isOriginalCell}
          onCellClick={handleCellClick}
        />
        <div className="right-panel">
          <NumbersBoard
            selectedNumber={selectedNumber}
            onNumberClick={handleNumberClick}
            onClearCell={handleClearCell}
            completedNumbers={completedNumbers}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
