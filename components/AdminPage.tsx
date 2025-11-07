import React, { useState, useCallback } from 'react';
import { GameState, Clue, GameStatus } from '../types';
import { generateClues } from '../services/geminiService';
import { WandSparkles, ArrowRight, ChevronLeft, Users, ClipboardList, Hash, Loader2, Crown, Play } from './icons';

interface AdminPageProps {
  onGameCreate: (clues: Clue[], topic: string, gridSize: number) => void;
  gameState: GameState | null;
  onStartGame: () => void;
  onNavigateHome: () => void;
}

const prebuiltTopics = ["Tech Company Taglines", "Programming Languages", "Cloud Computing Concepts", "Video Game Studios"];

const GameCreationForm: React.FC<{
  onGameCreate: (clues: Clue[], topic: string, gridSize: number) => void;
  onNavigateHome: () => void;
}> = ({ onGameCreate, onNavigateHome }) => {
  const [topic, setTopic] = useState('');
  const [gridSize, setGridSize] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClues = useCallback(async (selectedTopic: string) => {
    if (!selectedTopic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const clues = await generateClues(selectedTopic, gridSize);
      const requiredClues = gridSize % 2 !== 0 ? (gridSize * gridSize) - 1 : gridSize * gridSize;
      if (clues.length < requiredClues) {
        throw new Error("Not enough unique clues generated. Please try a broader topic.");
      }
      onGameCreate(clues, selectedTopic, gridSize);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [onGameCreate, gridSize]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <button onClick={onNavigateHome} className="absolute top-4 left-4 flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
      </button>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create a New Game</h1>
        <p className="text-slate-600 mb-6 text-center">Enter a topic for AI-generated clues or choose a pre-built set.</p>
        
        <div className="space-y-4">
            <div className="mb-4">
              <p className="font-semibold text-slate-700 mb-2">Select Grid Size:</p>
              <div className="flex justify-center space-x-2 bg-slate-100 p-1 rounded-lg">
                {[3, 4, 5].map(size => (
                  <button 
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${gridSize === size ? 'bg-primary-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            <p className="font-semibold text-slate-700">Choose a pre-built topic:</p>
            <div className="flex flex-wrap gap-2">
                {prebuiltTopics.map(t => (
                    <button key={t} onClick={() => { setTopic(t); handleGenerateClues(t); }} className="bg-primary-50 text-primary-600 font-medium px-4 py-2 rounded-full hover:bg-primary-100 transition disabled:opacity-50" disabled={isLoading}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-sm text-slate-500">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'Software Development Acronyms'"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateClues(topic)}
            />
        </div>

        {error && <p className="text-accent-red mt-4 text-center">{error}</p>}
        
        <button
          onClick={() => handleGenerateClues(topic)}
          disabled={isLoading || !topic}
          className="mt-6 w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-white" />
          ) : (
            <>
              <WandSparkles className="w-5 h-5 mr-2" />
              Generate with Custom Topic
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{
  gameState: GameState;
  onStartGame: () => void;
  onNavigateHome: () => void;
}> = ({ gameState, onStartGame, onNavigateHome }) => {
    const { gameCode, topic, status, players, revealedClues, clues, timeUntilNextClue, gridSize } = gameState;
    const isGameFinished = status === GameStatus.Finished;
    
    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <div>
                        <button onClick={onNavigateHome} className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-2">
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                        </button>
                        <div className="flex items-center space-x-4">
                            <h1 className="text-4xl font-bold text-slate-900 capitalize">{topic}</h1>
                            <span className="bg-primary-100 text-primary-600 font-bold px-3 py-1 rounded-full text-lg">{gridSize}x{gridSize}</span>
                        </div>
                        <p className="text-slate-500">Admin Dashboard</p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-white p-4 rounded-xl shadow-sm border text-center">
                        <p className="text-sm text-slate-500">Game Code</p>
                        <p className="font-mono text-3xl font-bold text-primary-600 tracking-widest">{gameCode}</p>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
                        <div className="bg-primary-100 p-3 rounded-full"><Users className="w-6 h-6 text-primary-600" /></div>
                        <div>
                            <p className="text-slate-500 text-sm">Players</p>
                            <p className="text-3xl font-bold text-slate-800">{players.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
                        <div className="bg-accent-purple/10 p-3 rounded-full"><ClipboardList className="w-6 h-6 text-accent-purple" /></div>
                        <div>
                            <p className="text-slate-500 text-sm">Clues Revealed</p>
                            <p className="text-3xl font-bold text-slate-800">{revealedClues.length} / {clues.length}</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
                        <div className="bg-accent-amber/10 p-3 rounded-full"><Hash className="w-6 h-6 text-accent-amber" /></div>
                        <div>
                            <p className="text-slate-500 text-sm">Next Clue In</p>
                            <p className="text-3xl font-bold text-slate-800">{status === GameStatus.InProgress ? `${timeUntilNextClue}s` : '--'}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Players List */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Participants</h2>
                        <div className="max-h-96 overflow-y-auto pr-2">
                           {players.length > 0 ? (
                                <div className="space-y-3">
                                    {players.sort((a,b) => b.score - a.score).map((player, index) => (
                                        <div key={player.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                                            <div className="flex items-center">
                                                <span className="text-sm font-bold text-slate-500 w-8">{index + 1}.</span>
                                                <span className="font-medium text-slate-800">{player.name}</span>
                                                {index === 0 && player.score > 0 && <Crown className="w-5 h-5 ml-2 text-amber-400" />}
                                            </div>
                                            <div className="font-bold text-primary-600">{player.score} pts</div>
                                        </div>
                                    ))}
                                </div>
                           ) : (
                                <div className="text-center py-12 text-slate-500">Waiting for players to join...</div>
                           )}
                        </div>
                    </div>

                    {/* Controls & Clues */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                           <h2 className="text-2xl font-bold text-slate-800 mb-4">Game Controls</h2>
                            <button
                                onClick={onStartGame}
                                disabled={status !== GameStatus.Lobby}
                                className="w-full bg-gradient-primary text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:bg-none"
                            >
                                {status === GameStatus.Lobby && <><Play className="w-6 h-6 mr-2" /> Start Game</>}
                                {status === GameStatus.InProgress && 'Game In Progress...'}
                                {status === GameStatus.Finished && 'Game Over'}
                            </button>
                        </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border">
                           <h2 className="text-xl font-bold text-slate-800 mb-3">Current Clue</h2>
                            <div className="bg-primary-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
                                {revealedClues.length > 0 ? (
                                    <p className="text-primary-900 text-center text-lg">{revealedClues[revealedClues.length - 1].clueText}</p>
                                ) : (
                                    <p className="text-slate-500 text-center">Waiting for game to start.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const AdminPage: React.FC<AdminPageProps> = ({ onGameCreate, gameState, onStartGame, onNavigateHome }) => {
  if (gameState) {
    return <AdminDashboard gameState={gameState} onStartGame={onStartGame} onNavigateHome={onNavigateHome} />;
  }
  return <GameCreationForm onGameCreate={onGameCreate} onNavigateHome={onNavigateHome} />;
};
