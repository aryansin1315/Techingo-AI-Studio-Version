import React, { useState, useCallback, useEffect } from 'react';
import { Page, GameState, Player, Clue, GameStatus, BingoGridType } from './types';
import { LandingPage } from './components/LandingPage';
import { AdminPage } from './components/AdminPage';
import { JoinGamePage } from './components/JoinGamePage';
import { GamePage } from './components/GamePage';
import { DemoPage } from './components/DemoPage';

const CLUE_REVEAL_INTERVAL = 10000; // 10 seconds

// Helper functions
const generateGameCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createBingoTicket = (clues: Clue[], gridSize: number): BingoGridType => {
  const shuffledClues = shuffleArray(clues);
  const grid: BingoGridType = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  let clueIndex = 0;
  
  const hasFreeSpace = gridSize % 2 !== 0;
  const center = Math.floor(gridSize / 2);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (hasFreeSpace && i === center && j === center) {
        grid[i][j] = { id: i * gridSize + j, clue: null, marked: true, isFreeSpace: true };
      } else {
        if (clueIndex < shuffledClues.length) {
          grid[i][j] = {
            id: i * gridSize + j,
            clue: shuffledClues[clueIndex],
            marked: false,
            isFreeSpace: false,
          };
          clueIndex++;
        }
      }
    }
  }
  return grid;
};

const checkWinningPatterns = (grid: BingoGridType): boolean => {
  const size = grid.length;
  if (size === 0) return false;

  // Check rows
  for (let i = 0; i < size; i++) {
    if (grid[i].every(cell => cell?.marked)) return true;
  }
  // Check columns
  for (let j = 0; j < size; j++) {
    if (grid.every(row => row[j]?.marked)) return true;
  }
  // Check diagonals
  if (grid.every((row, i) => row[i]?.marked)) return true;
  if (grid.every((row, i) => row[size - 1 - i]?.marked)) return true;

  // Check four corners
  if (
    grid[0][0]?.marked &&
    grid[0][size - 1]?.marked &&
    grid[size - 1][0]?.marked &&
    grid[size - 1][size - 1]?.marked
  ) {
    return true;
  }

  return false;
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const clearGameTimers = useCallback(() => {
    setGameState(prev => {
        if (!prev) return null;
        if (prev.clueRevealIntervalId) clearInterval(prev.clueRevealIntervalId);
        if (prev.countdownIntervalId) clearInterval(prev.countdownIntervalId);
        return { ...prev, clueRevealIntervalId: null, countdownIntervalId: null };
    });
  }, []);

  useEffect(() => {
    // Cleanup timers when the component unmounts or gameState is cleared
    return () => {
        if(gameState) {
            clearGameTimers();
        }
    };
  }, [gameState, clearGameTimers]);


  const handleNavigate = (page: 'admin' | 'join' | 'demo') => {
    if (page === 'admin') setCurrentPage(Page.Admin);
    if (page === 'join') setCurrentPage(Page.Join);
    if (page === 'demo') setCurrentPage(Page.Demo);
  };

  const handleNavigateHome = () => {
    clearGameTimers();
    setCurrentPage(Page.Landing);
    setGameState(null);
    setCurrentPlayer(null);
    setJoinError(null);
  }

  const handleGameCreate = useCallback((clues: Clue[], topic: string, gridSize: number) => {
    const newGameState: GameState = {
      gameCode: generateGameCode(),
      topic: topic,
      gridSize: gridSize,
      status: GameStatus.Lobby,
      players: [],
      clues: clues,
      revealedClues: [],
      currentClueIndex: -1,
      adminId: 'admin',
      clueRevealIntervalId: null,
      countdownIntervalId: null,
      timeUntilNextClue: CLUE_REVEAL_INTERVAL / 1000,
      winner: null,
    };
    setGameState(newGameState);
  }, []);

  const handleJoinGame = useCallback((name: string, code: string) => {
    if (gameState && gameState.gameCode === code) {
      const newPlayer: Player = {
        id: `player-${Math.random().toString(36).substring(2, 9)}`,
        name,
        score: 0,
        ticket: createBingoTicket(gameState.clues, gameState.gridSize),
        canClaimBingo: false,
      };
      setGameState(prev => prev ? { ...prev, players: [...prev.players, newPlayer] } : null);
      setCurrentPlayer(newPlayer);
      setCurrentPage(Page.Game);
      setJoinError(null);
    } else {
      setJoinError('Invalid game code. Please try again.');
    }
  }, [gameState]);

  const revealNextClue = useCallback(() => {
    setGameState(prev => {
      if (!prev || prev.status !== GameStatus.InProgress || prev.currentClueIndex >= prev.clues.length - 1) {
        if (prev && prev.status === GameStatus.InProgress) {
            clearGameTimers();
            return { ...prev, status: GameStatus.Finished, winner: prev.players.sort((a,b)=> b.score - a.score)[0] ?? null };
        }
        return prev;
      }
      const nextIndex = prev.currentClueIndex + 1;
      return {
        ...prev,
        currentClueIndex: nextIndex,
        revealedClues: [...prev.revealedClues, prev.clues[nextIndex]],
        timeUntilNextClue: CLUE_REVEAL_INTERVAL / 1000,
      };
    });
  }, [clearGameTimers]);

  const handleStartGame = useCallback(() => {
    revealNextClue(); // Reveal first clue immediately
    
    const clueInterval = window.setInterval(revealNextClue, CLUE_REVEAL_INTERVAL);
    
    const countdownInterval = window.setInterval(() => {
        setGameState(prev => {
            if (!prev || prev.status !== GameStatus.InProgress) return prev;
            return {...prev, timeUntilNextClue: Math.max(0, prev.timeUntilNextClue - 1)};
        })
    }, 1000);

    setGameState(prev => prev ? {
        ...prev,
        status: GameStatus.InProgress,
        clueRevealIntervalId: clueInterval,
        countdownIntervalId: countdownInterval
    } : null);

  }, [revealNextClue]);

  const handleMarkCell = useCallback((playerId: string, cellId: number) => {
    setGameState(prev => {
        if (!prev) return null;
        
        const updatedPlayers = prev.players.map(player => {
            if (player.id !== playerId) return player;
            
            let correctMark = false;
            const updatedTicket = player.ticket.map(row => row.map(cell => {
                if (cell && cell.id === cellId && !cell.marked) {
                    // Check if the cell's clue has been revealed
                    if (cell.clue && prev.revealedClues.some(rc => rc.clueText === cell.clue?.clueText)) {
                        correctMark = true;
                        return { ...cell, marked: true };
                    }
                }
                return cell;
            }));

            const canClaimBingo = checkWinningPatterns(updatedTicket);
            const scoreIncrease = correctMark ? 10 : 0;

            if (currentPlayer && currentPlayer.id === playerId) {
              setCurrentPlayer(p => p ? {...p, ticket: updatedTicket, score: p.score + scoreIncrease, canClaimBingo} : null);
            }

            return { ...player, ticket: updatedTicket, score: player.score + scoreIncrease, canClaimBingo };
        });

        return { ...prev, players: updatedPlayers };
    });
  }, [currentPlayer]);

  const handleClaimBingo = useCallback((playerId: string) => {
    setGameState(prev => {
        if (!prev || prev.status === GameStatus.Finished) return prev;
        
        const player = prev.players.find(p => p.id === playerId);
        if (!player || !player.canClaimBingo) {
            return prev;
        }

        clearGameTimers();

        const winnerBonus = 100;
        let winner: Player | null = null;
        const updatedPlayers = prev.players.map(p => {
            if (p.id === playerId) {
                winner = { ...p, score: p.score + winnerBonus };
                return winner;
            }
            return p;
        });
        
        return {
            ...prev,
            status: GameStatus.Finished,
            players: updatedPlayers,
            winner: winner,
        };
    });
  }, [clearGameTimers]);

  const handleLeaveGame = () => {
    if (currentPlayer && gameState) {
      setGameState(prev => prev ? {
        ...prev,
        players: prev.players.filter(p => p.id !== currentPlayer.id)
      } : null);
    }
    setCurrentPlayer(null);
    setCurrentPage(Page.Landing);
    if(gameState?.players.length === 1) { // last player left
        handleNavigateHome();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Admin:
        return <AdminPage onGameCreate={handleGameCreate} gameState={gameState} onStartGame={handleStartGame} onNavigateHome={handleNavigateHome}/>;
      case Page.Join:
        return <JoinGamePage onJoinGame={handleJoinGame} error={joinError} onNavigateHome={handleNavigateHome} />;
      case Page.Game:
        if (currentPlayer && gameState) {
          return <GamePage player={currentPlayer} gameState={gameState} onMarkCell={handleMarkCell} onLeaveGame={handleLeaveGame} onClaimBingo={handleClaimBingo} />;
        }
        setCurrentPage(Page.Join);
        return <JoinGamePage onJoinGame={handleJoinGame} error={"An error occurred. Please join again."} onNavigateHome={handleNavigateHome} />;
      case Page.Demo:
        return <DemoPage onNavigateHome={handleNavigateHome} />;
      case Page.Landing:
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return <main>{renderPage()}</main>;
};

export default App;
