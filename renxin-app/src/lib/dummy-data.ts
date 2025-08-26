export interface Player {
  id: string;
  name: string;
  rating: number;
}

export interface GameStats {
  ppd: number; // Points Per Dart for 01 games
  mpr: number; // Marks Per Round for Cricket
}

export interface GameHistory {
  id: string;
  date: string;
  gameType: '01 GAME' | 'CRICKET';
  result: 'WIN' | 'LOSE';
  stats: GameStats;
}

export const dummyPlayer: Player = {
  id: 'player-1',
  name: 'JULES',
  rating: 7.85,
};

export const dummyGameHistory: GameHistory[] = [
  {
    id: 'game-1',
    date: '2025-08-26',
    gameType: '01 GAME',
    result: 'WIN',
    stats: { ppd: 85.2, mpr: 0 },
  },
  {
    id: 'game-2',
    date: '2025-08-25',
    gameType: 'CRICKET',
    result: 'LOSE',
    stats: { ppd: 0, mpr: 2.8 },
  },
  {
    id: 'game-3',
    date: '2025-08-24',
    gameType: '01 GAME',
    result: 'WIN',
    stats: { ppd: 90.1, mpr: 0 },
  },
];
