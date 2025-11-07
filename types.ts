export interface Clue {
  companyName: string;
  clueText: string;
}

export interface BingoCell {
  id: number;
  clue: Clue | null;
  marked: boolean;
  isFreeSpace: boolean;
}

export type BingoGridType = (BingoCell | null)[][];

export interface Player {
  id: string;
  name: string;
  score: number;
  ticket: BingoGridType;
  canClaimBingo: boolean;
}

export enum GameStatus {
  Lobby = 'lobby',
  InProgress = 'in-progress',
  Finished = 'finished',
}

export interface GameState {
  gameCode: string;
  topic: string;
  gridSize: number;
  status: GameStatus;
  players: Player[];
  clues: Clue[];
  revealedClues: Clue[];
  currentClueIndex: number;
  adminId: string;
  clueRevealIntervalId: number | null;
  countdownIntervalId: number | null;
  timeUntilNextClue: number;
  winner: Player | null;
}

export enum Page {
  Landing,
  Admin,
  Join,
  Game,
  Demo,
}
