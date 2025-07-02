"use client";
import React, { useState, useEffect } from "react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Meteors } from "@/components/magicui/meteors";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { SparklesText } from "@/components/magicui/sparkles-text";
import Footer from "@/app/Footer";
import Game from "./game";

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6
      bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700
      font-sans">
        
      <Meteors number={7} />
      {!showGame ? (
  <div className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-8 md:p-10 rounded-2xl shadow-2xl
    bg-gradient-to-br from-white/30 to-slate-200/20 backdrop-blur border border-slate-300
    dark:from-neutral-700/30 dark:to-neutral-800/40 dark:border-neutral-600
    max-w-xs sm:max-w-md w-full text-center animate-fade-in">

    <ShineBorder shineColor={["#14B8A6", "#10B981", "#38BDF8"]} />

    <SparklesText className="text-2xl sm:text-3xl md:text-4xl">
      🎮 Welcome to Tic Tac Toe!
    </SparklesText>

    <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 animate-fade-in-up">
      Challenge a friend in a fun, customizable game of
      <span className="inline-block animate-pulse ml-1">❌⭕</span>
    </p>
    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 animate-fade-in-up delay-200">
      Choose your symbols, set the rounds, and see who becomes the champion! 🏆
    </p>

    <ShimmerButton
      className="px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600
      text-base sm:text-xl font-semibold shadow-lg hover:scale-105 transition-transform"
      onClick={() => setShowGame(true)}
    >
      🚀 Start Game
    </ShimmerButton>
  </div>
) : (
  <Game />
)}

      <Footer />
    </div>
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
