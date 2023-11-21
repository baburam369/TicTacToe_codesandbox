import { useState } from "react";
function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice(); //creates a copy of squares
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }
  const isTie = () => {
    // Check if all cells are filled and there's no winner
    return squares.every((cell) => cell !== null) && !calculateWinner(squares);
  };

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningSquares = result ? result.winningSquares : null;
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (isTie()) {
    status = "It's a draw!";
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0, winningSquares)}
        {renderSquare(1, winningSquares)}
        {renderSquare(2, winningSquares)}
      </div>
      <div className="board-row">
        {renderSquare(3, winningSquares)}
        {renderSquare(4, winningSquares)}
        {renderSquare(5, winningSquares)}
      </div>
      <div className="board-row">
        {renderSquare(6, winningSquares)}
        {renderSquare(7, winningSquares)}
        {renderSquare(8, winningSquares)}
      </div>
    </>
  );

  function renderSquare(i, winningSquares) {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={winningSquares && winningSquares.includes(i)}
      />
    );
  }
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const xIsNext = currentMove % 2 === 0;

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let moveDescription;
    if (move > 0) {
      moveDescription = "Go to move #" + move;
    } else {
      moveDescription = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}> {moveDescription} </button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: [a, b, c]
      };
    }
  }

  return null;
}
