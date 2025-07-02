"use client";
import type React from "react";
import { useState, useEffect, JSX } from "react";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function Game() {
  const emptyBoard = Array(9).fill(null);
  const availableSymbols = [
    "❌", "⭕", "⭐", "❤️", "👍", "🦄", "🔥", "🍀", "🌈", "👑", "⚡", "🎯"
  ];

  const [board, setBoard] = useState<(string | null)[]>(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [player1Symbol, setPlayer1Symbol] = useState<string | null>(null);
  const [player2Symbol, setPlayer2Symbol] = useState<string | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [draws, setDraws] = useState(0);
  const [roundTarget, setRoundTarget] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const currentRound = p1Score + p2Score + draws + 1;

  useEffect(() => {
    if (winner && player1Symbol && player2Symbol) {
      if (winner === player1Symbol) {
        const nextP1 = p1Score + 1;
        setP1Score(nextP1);
        checkEndOfMatch(nextP1, p2Score, draws);
      } else if (winner === player2Symbol) {
        const nextP2 = p2Score + 1;
        setP2Score(nextP2);
        checkEndOfMatch(p1Score, nextP2, draws);
      }
      setTimeout(() => resetBoard(), 1500);
    } else if (isDraw && player1Symbol && player2Symbol) {
      const nextDraws = draws + 1;
      setDraws(nextDraws);
      checkEndOfMatch(p1Score, p2Score, nextDraws);
      setTimeout(() => resetBoard(), 1500);
    }
  }, [winner, isDraw, player1Symbol, player2Symbol]);

  function checkEndOfMatch(p1: number, p2: number, d: number) {
    if (roundTarget && p1 + p2 + d >= roundTarget) {
      setGameOver(true);
      if (p1 > p2) {
        setFinalWinner("Player 1");
      } else if (p2 > p1) {
        setFinalWinner("Player 2");
      } else {
        setFinalWinner("No one — it's a tie!");
      }
    }
  }

  function handleClick(idx: number): void {
    if (!player1Symbol || !player2Symbol || gameOver) return;
    if (board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = xIsNext ? player1Symbol : player2Symbol;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function resetBoard() {
    setBoard(emptyBoard);
    setXIsNext(true);
  }

  function resetMatch() {
    setP1Score(0);
    setP2Score(0);
    setDraws(0);
    setPlayer1Symbol(null);
    setPlayer2Symbol(null);
    setRoundTarget(null);
    setGameOver(false);
    setFinalWinner(null);
    resetBoard();
  }

  function renderSquare(idx: number): JSX.Element {
    const isWinning =
      winner && calculateWinnerIndexes(board)?.includes(idx);
    return (
      <button
        key={idx}
        className={`w-20 h-20 rounded-xl text-4xl flex items-center justify-center
        border backdrop-blur
        ${
          isWinning
            ? "bg-emerald-300/60 border-emerald-600 shadow-lg scale-105"
            : "bg-white/30 border-slate-300 hover:bg-white/50 dark:bg-neutral-700/30 dark:border-neutral-500 dark:hover:bg-neutral-600"
        }
        transition-all duration-200 ease-in`}
        onClick={() => handleClick(idx)}
      >
        {board[idx]}
      </button>
    );
  }

  return (
    <>
      {gameOver && (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl
          bg-white/30 backdrop-blur border border-slate-300
          dark:bg-neutral-800/50 dark:border-neutral-600 max-w-md w-full text-center gap-4 animate-pulse">
          <ShineBorder shineColor={["#14B8A6", "#10B981", "#38BDF8"]} />
          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
            🎉 Congratulations {finalWinner === "Player 1" ? player1Symbol : finalWinner === "Player 2" ? player2Symbol : "🤝"}! 🎉
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Total draws: {draws}
          </p>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 transition-colors shadow"
            onClick={resetMatch}
          >
            Play Again
          </button>
        </div>
      )}

      {!player1Symbol || !player2Symbol || !roundTarget ? (
        <section className="flex flex-col items-center gap-6 p-8 rounded-2xl shadow-xl
          bg-white/20 backdrop-blur-md border border-slate-300
          dark:bg-neutral-800/40 dark:border-neutral-600 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow mb-2">
            Tic Tac Toe
          </h2>
          {!player1Symbol ? (
            <>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Player 1, pick your symbol:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {availableSymbols.map((symbol) => (
                  <button
                    key={symbol}
                    className="px-4 py-2 rounded-full text-2xl bg-teal-600 text-white hover:bg-teal-700 shadow"
                    onClick={() => setPlayer1Symbol(symbol)}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </>
          ) : !player2Symbol ? (
            <>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Player 2, pick your symbol:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {availableSymbols.filter(s => s !== player1Symbol).map((symbol) => (
                  <button
                    key={symbol}
                    className="px-4 py-2 rounded-full text-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                    onClick={() => setPlayer2Symbol(symbol)}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Choose rounds (best of):
              </p>
              <div className="flex gap-3">
                {[3, 5, 7].map((round) => (
                  <button
                    key={round}
                    className="px-4 py-2 rounded-full text-xl bg-purple-600 text-white hover:bg-purple-700 shadow"
                    onClick={() => setRoundTarget(round)}
                  >
                    {round}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      ) : !gameOver && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-5xl">
          {/* Board */}
          <section className="flex flex-col items-center gap-6 p-8 rounded-2xl shadow-xl
            bg-white/20 backdrop-blur-md border border-slate-300
            dark:bg-neutral-800/40 dark:border-neutral-600 w-full max-w-md order-1">
            <ShineBorder shineColor={["#14B8A6", "#10B981", "#38BDF8"]} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow">
              Tic Tac Toe
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Round {currentRound} of {roundTarget}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {board.map((_, idx) => renderSquare(idx))}
            </div>
            <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-2 min-h-[1.5em]">
              {winner
                ? `🎉 Winner: ${winner}`
                : isDraw
                ? "🤝 It's a draw!"
                : `Next: ${xIsNext ? player1Symbol : player2Symbol}`}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors shadow"
                onClick={resetMatch}
              >
                Reset Match
              </button>
              <button
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-colors shadow"
                onClick={() => {
                  setP1Score(0);
                  setP2Score(0);
                  setDraws(0);
                }}
              >
                Reset Scores
              </button>
            </div>
          </section>

          {/* Scorecards */}
          <div className="flex flex-row md:flex-col justify-center gap-4 order-2 md:order-none">
            <div className="flex flex-col items-center px-4 py-3 rounded-xl
              bg-teal-400/30 backdrop-blur shadow dark:bg-teal-800/50 min-w-[80px]">
              <span className="text-base font-medium text-teal-900 dark:text-teal-200">Player 1</span>
              <span className="text-2xl font-bold">{p1Score}</span>
              <span className="text-xl mt-1">{player1Symbol}</span>
            </div>
            <div className="flex flex-col items-center px-4 py-3 rounded-xl
              bg-emerald-400/30 backdrop-blur shadow dark:bg-emerald-800/50 min-w-[80px]">
              <span className="text-base font-medium text-emerald-900 dark:text-emerald-200">Player 2</span>
              <span className="text-2xl font-bold">{p2Score}</span>
              <span className="text-xl mt-1">{player2Symbol}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function calculateWinnerIndexes(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

function calculateWinner(squares: (string | null)[]) {
  const indexes = calculateWinnerIndexes(squares);
  return indexes ? squares[indexes[0]] : null;
}
