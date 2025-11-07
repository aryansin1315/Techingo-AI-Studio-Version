
import React, { useState } from 'react';
import { ChevronLeft, Play } from './icons';

interface JoinGamePageProps {
  onJoinGame: (name: string, code: string) => void;
  error: string | null;
  onNavigateHome: () => void;
}

export const JoinGamePage: React.FC<JoinGamePageProps> = ({ onJoinGame, error, onNavigateHome }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && code.trim()) {
      onJoinGame(name.trim(), code.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
       <button onClick={onNavigateHome} className="absolute top-4 left-4 flex items-center text-slate-600 hover:text-slate-900">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
        </button>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Join Game</h1>
        <p className="text-slate-600 mb-8 text-center">Enter your name and the game code to start.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">Game Code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="A1B2C3"
              maxLength={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-xl tracking-widest text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition uppercase"
              required
            />
          </div>
          
          {error && <p className="text-accent-red text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-gradient-success text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            disabled={!name.trim() || !code.trim()}
          >
            <Play className="w-5 h-5 mr-2" />
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};
