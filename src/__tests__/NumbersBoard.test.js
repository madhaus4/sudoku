import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NumbersBoard from '../components/NumbersBoard';

describe('NumbersBoard Component', () => {
  const defaultProps = {
    selectedNumber: null,
    onNumberClick: jest.fn(),
    onClearCell: jest.fn(),
    completedNumbers: new Set(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the numbers board with title', () => {
      render(<NumbersBoard {...defaultProps} />);
      
      expect(screen.getByText('Select Number')).toBeInTheDocument();
      expect(screen.getByText('Clear Cell')).toBeInTheDocument();
    });

    it('should render all number buttons from 1 to 9', () => {
      render(<NumbersBoard {...defaultProps} />);
      
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should render the clear button', () => {
      render(<NumbersBoard {...defaultProps} />);
      
      const clearButton = screen.getByText('Clear Cell');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveClass('clear-btn');
    });
  });

  describe('Number Button Interactions', () => {
    it('should call onNumberClick when a number button is clicked', () => {
      const mockOnNumberClick = jest.fn();
      render(<NumbersBoard {...defaultProps} onNumberClick={mockOnNumberClick} />);
      
      const numberButton = screen.getByText('5');
      fireEvent.click(numberButton);
      
      expect(mockOnNumberClick).toHaveBeenCalledWith(5);
      expect(mockOnNumberClick).toHaveBeenCalledTimes(1);
    });

    it('should call onNumberClick for each number button', () => {
      const mockOnNumberClick = jest.fn();
      render(<NumbersBoard {...defaultProps} onNumberClick={mockOnNumberClick} />);
      
      for (let i = 1; i <= 9; i++) {
        const numberButton = screen.getByText(i.toString());
        fireEvent.click(numberButton);
        expect(mockOnNumberClick).toHaveBeenCalledWith(i);
      }
      
      expect(mockOnNumberClick).toHaveBeenCalledTimes(9);
    });

    it('should not call onNumberClick when a completed number is clicked', () => {
      const mockOnNumberClick = jest.fn();
      const completedNumbers = new Set([3, 7]);
      render(
        <NumbersBoard 
          {...defaultProps} 
          onNumberClick={mockOnNumberClick}
          completedNumbers={completedNumbers}
        />
      );
      
      // Click a completed number
      const completedButton = screen.getByText('3');
      fireEvent.click(completedButton);
      
      expect(mockOnNumberClick).not.toHaveBeenCalled();
    });
  });

  describe('Clear Button Interaction', () => {
    it('should call onClearCell when clear button is clicked', () => {
      const mockOnClearCell = jest.fn();
      render(<NumbersBoard {...defaultProps} onClearCell={mockOnClearCell} />);
      
      const clearButton = screen.getByText('Clear Cell');
      fireEvent.click(clearButton);
      
      expect(mockOnClearCell).toHaveBeenCalledTimes(1);
    });
  });

  describe('Selected Number Styling', () => {
    it('should apply selected class to the selected number button', () => {
      render(<NumbersBoard {...defaultProps} selectedNumber={5} />);
      
      const selectedButton = screen.getByText('5');
      expect(selectedButton).toHaveClass('selected');
    });

    it('should not apply selected class to non-selected number buttons', () => {
      render(<NumbersBoard {...defaultProps} selectedNumber={5} />);
      
      const nonSelectedButton = screen.getByText('3');
      expect(nonSelectedButton).not.toHaveClass('selected');
    });

    it('should not apply selected class when no number is selected', () => {
      render(<NumbersBoard {...defaultProps} selectedNumber={null} />);
      
      for (let i = 1; i <= 9; i++) {
        const button = screen.getByText(i.toString());
        expect(button).not.toHaveClass('selected');
      }
    });
  });

  describe('Completed Numbers Styling and Behavior', () => {
    it('should apply completed class to completed number buttons', () => {
      const completedNumbers = new Set([2, 4, 8]);
      render(<NumbersBoard {...defaultProps} completedNumbers={completedNumbers} />);
      
      expect(screen.getByText('2')).toHaveClass('completed');
      expect(screen.getByText('4')).toHaveClass('completed');
      expect(screen.getByText('8')).toHaveClass('completed');
    });

    it('should not apply completed class to non-completed number buttons', () => {
      const completedNumbers = new Set([2, 4, 8]);
      render(<NumbersBoard {...defaultProps} completedNumbers={completedNumbers} />);
      
      expect(screen.getByText('1')).not.toHaveClass('completed');
      expect(screen.getByText('3')).not.toHaveClass('completed');
      expect(screen.getByText('5')).not.toHaveClass('completed');
      expect(screen.getByText('6')).not.toHaveClass('completed');
      expect(screen.getByText('7')).not.toHaveClass('completed');
      expect(screen.getByText('9')).not.toHaveClass('completed');
    });

    it('should disable completed number buttons', () => {
      const completedNumbers = new Set([3, 7]);
      render(<NumbersBoard {...defaultProps} completedNumbers={completedNumbers} />);
      
      expect(screen.getByText('3')).toBeDisabled();
      expect(screen.getByText('7')).toBeDisabled();
    });

    it('should not disable non-completed number buttons', () => {
      const completedNumbers = new Set([3, 7]);
      render(<NumbersBoard {...defaultProps} completedNumbers={completedNumbers} />);
      
      expect(screen.getByText('1')).not.toBeDisabled();
      expect(screen.getByText('2')).not.toBeDisabled();
      expect(screen.getByText('4')).not.toBeDisabled();
      expect(screen.getByText('5')).not.toBeDisabled();
      expect(screen.getByText('6')).not.toBeDisabled();
      expect(screen.getByText('8')).not.toBeDisabled();
      expect(screen.getByText('9')).not.toBeDisabled();
    });

    it('should handle empty completed numbers set', () => {
      render(<NumbersBoard {...defaultProps} completedNumbers={new Set()} />);
      
      for (let i = 1; i <= 9; i++) {
        const button = screen.getByText(i.toString());
        expect(button).not.toHaveClass('completed');
        expect(button).not.toBeDisabled();
      }
    });
  });

  describe('Combined States', () => {
    it('should handle a number that is both selected and completed', () => {
      const completedNumbers = new Set([5]);
      render(
        <NumbersBoard 
          {...defaultProps} 
          selectedNumber={5}
          completedNumbers={completedNumbers}
        />
      );
      
      const button = screen.getByText('5');
      expect(button).toHaveClass('selected');
      expect(button).toHaveClass('completed');
      expect(button).toBeDisabled();
    });

    it('should not call onNumberClick for a selected and completed number', () => {
      const mockOnNumberClick = jest.fn();
      const completedNumbers = new Set([5]);
      render(
        <NumbersBoard 
          {...defaultProps} 
          selectedNumber={5}
          onNumberClick={mockOnNumberClick}
          completedNumbers={completedNumbers}
        />
      );
      
      const button = screen.getByText('5');
      fireEvent.click(button);
      
      expect(mockOnNumberClick).not.toHaveBeenCalled();
    });
  });

  describe('Component Structure', () => {
    it('should have correct CSS classes on container elements', () => {
      render(<NumbersBoard {...defaultProps} />);
      
      const numbersBoard = screen.getByText('Select Number').closest('.numbers-board');
      expect(numbersBoard).toBeInTheDocument();
      
      const numberButtons = screen.getByText('1').closest('.number-buttons');
      expect(numberButtons).toBeInTheDocument();
    });

    it('should render number buttons with correct CSS classes', () => {
      render(<NumbersBoard {...defaultProps} />);
      
      for (let i = 1; i <= 9; i++) {
        const button = screen.getByText(i.toString());
        expect(button).toHaveClass('number-btn');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle null selectedNumber prop', () => {
      render(<NumbersBoard {...defaultProps} selectedNumber={null} />);
      
      // Should not throw an error and should render normally
      expect(screen.getByText('Select Number')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should handle all numbers being completed', () => {
      const allCompletedNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      render(<NumbersBoard {...defaultProps} completedNumbers={allCompletedNumbers} />);
      
      for (let i = 1; i <= 9; i++) {
        const button = screen.getByText(i.toString());
        expect(button).toHaveClass('completed');
        expect(button).toBeDisabled();
      }
    });
  });
});
