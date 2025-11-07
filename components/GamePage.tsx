import React, { useState, useEffect } from 'react';
import { Player, Clue, BingoGridType, GameState } from '../types';
import { BingoGrid } from './BingoGrid';
import { ChevronLeft, Users, Trophy } from './icons';

interface GamePageProps {
  player: Player;
  gameState: GameState;
  onMarkCell: (playerId: string, cellId: number) => void;
  onLeaveGame: () => void;
  onClaimBingo: (playerId: string) => void;
}

const Leaderboard: React.FC<{ players: Player[], currentPlayerId: string }> = ({ players, currentPlayerId }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-slate-700">
        <h3 className="font-bold text-slate-200 mb-3 flex items-center"><Users className="w-5 h-5 mr-2 text-primary-500" /> Leaderboard</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {players.sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={p.id} className={`flex justify-between items-center p-2 rounded-md ${p.id === currentPlayerId ? 'bg-primary-500/30' : 'bg-slate-700/50'}`}>
                    <p className="font-medium text-slate-200">{i + 1}. {p.name}</p>
                    <p className="font-bold text-primary-400">{p.score} pts</p>
                </div>
            ))}
        </div>
    </div>
);

export const GamePage: React.FC<GamePageProps> = ({ player, gameState, onMarkCell, onLeaveGame, onClaimBingo }) => {
  const [grid, setGrid] = useState<BingoGridType>(player.ticket);
  const [clueAnimationKey, setClueAnimationKey] = useState(0);
  
  const { status, revealedClues, players, timeUntilNextClue, winner, gridSize } = gameState;

  useEffect(() => {
    setGrid(player.ticket);
  }, [player.ticket]);

  const handleCellClick = (cellId: number) => {
    if (status === 'in-progress') {
        onMarkCell(player.id, cellId);
    }
  };
  
  const currentClue = revealedClues.length > 0 ? revealedClues[revealedClues.length - 1] : null;
  const revealedClueTexts = revealedClues.map(c => c.clueText);

  useEffect(() => {
    if (currentClue) {
        setClueAnimationKey(prev => prev + 1); // Trigger animation on new clue
    }
  }, [currentClue]);

  if (status === 'finished') {
      return (
        <div className="min-h-screen bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white text-center animate-fadeInUp">
            <Trophy className="w-24 h-24 text-amber-400 mb-4" />
            <h1 className="text-5xl font-bold mb-2">Game Over!</h1>
            {winner ? (
                <h2 className="text-3xl mb-8">Winner: <span className="text-amber-300 font-bold">{winner.name}</span></h2>
            ) : (
                <h2 className="text-3xl mb-8">The game has ended.</h2>
            )}
            <Leaderboard players={players} currentPlayerId={player.id} />
            <button onClick={onLeaveGame} className="mt-8 bg-white text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105">
                Back to Home
            </button>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6 lg:p-8 font-sans">
       <div className="absolute top-4 left-4">
          <button onClick={onLeaveGame} className="flex items-center text-slate-300 hover:text-white transition-colors z-20">
              <ChevronLeft className="w-5 h-5 mr-1" /> Leave Game
          </button>
        </div>

      <div className="container mx-auto grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
            <div className="mb-6 text-center lg:text-left">
                <h1 className="text-4xl font-bold">Welcome, {player.name}!</h1>
                <p className="text-lg text-slate-300">Your score: <span className="font-bold text-primary-500">{player.score}</span></p>
            </div>
            <BingoGrid grid={grid} onCellClick={handleCellClick} revealedClues={revealedClueTexts} gridSize={gridSize} />
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-slate-200">Current Clue</h2>
                    {status === 'in-progress' && (
                        <div className="text-sm font-mono text-amber-300">
                           Next clue in: {timeUntilNextClue}s
                        </div>
                    )}
                </div>
                <div key={clueAnimationKey} className="bg-primary-900/30 border border-primary-500/50 p-4 rounded-lg min-h-[120px] flex items-center justify-center animate-fadeInUp">
                    {currentClue ? (
                         <p className="text-primary-100 text-center text-lg">{currentClue.clueText}</p>
                    ) : (
                        <p className="text-slate-400 text-center">Waiting for the game to start...</p>
                    )}
                </div>
            </div>

            {player.canClaimBingo && status === 'in-progress' && (
                <button 
                    onClick={() => onClaimBingo(player.id)}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-6 px-6 rounded-2xl text-4xl flex items-center justify-center shadow-lg animate-glow transition-transform hover:scale-105"
                >
                    BINGO!
                </button>
            )}

            <Leaderboard players={players} currentPlayerId={player.id} />
        </div>
      </div>
    </div>
  );
};
