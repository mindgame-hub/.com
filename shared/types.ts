export type GameStatus = 'waiting' | 'in-progress' | 'completed';
export type PlayerRole = 'human' | 'bot';
export type DifficultyLevel = 'expert';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  difficulty?: DifficultyLevel;
  card: BingoCard;
  score: number;
  isWinner?: boolean;
  reactionTimeMs?: number;
}

export interface BingoCard {
  id: string;
  numbers: number[][];
  marked: boolean[][];
}

export interface BingoGame {
  id: string;
  status: GameStatus;
  players: Player[];
  calledNumbers: number[];
  currentNumber?: number;
  winner?: Player;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameEvent {
  type: 'number-called' | 'player-marked' | 'player-won' | 'game-ended';
  gameId: string;
  playerId?: string;
  data: any;
  timestamp: Date;
}

export interface PlayerStats {
  playerId: string;
  totalGames: number;
  wins: number;
  winRate: number;
  totalPoints: number;
  averagePointsPerGame: number;
}