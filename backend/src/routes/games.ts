import express, { Request, Response } from 'express';
import { BingoEngine } from '../game/BingoEngine';
import { BotPlayer } from '../game/BotPlayer';

const router = express.Router();
const games = new Map<string, any>();

router.post('/', (req: Request, res: Response) => {
  const { playerName } = req.body;
  const gameId = Math.random().toString(36).substring(7);
  const players: any[] = [];

  players.push({
    id: 'player-' + Math.random().toString(36).substring(7),
    name: playerName || 'Player 1',
    role: 'human',
    card: {
      id: 'card-' + Math.random().toString(36).substring(7),
      numbers: BingoEngine.generateCard(),
      marked: Array(5).fill(null).map(() => Array(5).fill(false)),
    },
    score: 0,
  });

  const numBots = Math.floor(Math.random() * 3) + 2;

  for (let i = 0; i < numBots; i++) {
    const bot = new BotPlayer();
    players.push({
      id: 'bot-' + Math.random().toString(36).substring(7),
      name: bot.getName(),
      role: 'bot',
      difficulty: 'expert',
      card: {
        id: 'card-' + Math.random().toString(36).substring(7),
        numbers: BingoEngine.generateCard(),
        marked: Array(5).fill(null).map(() => Array(5).fill(false)),
      },
      score: 0,
      reactionTimeMs: bot.getReactionDelay(),
    });
  }

  const game = {
    id: gameId,
    status: 'in-progress',
    players,
    calledNumbers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  games.set(gameId, game);

  res.status(201).json({
    gameId,
    message: 'Game created successfully',
    game: {
      id: game.id,
      status: game.status,
      players: game.players.map((p: any) => ({
        id: p.id,
        name: p.name,
        card: p.card,
        score: p.score,
        isWinner: p.isWinner,
      })),
      calledNumbers: game.calledNumbers,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    },
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const game = games.get(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json({
    id: game.id,
    status: game.status,
    players: game.players.map((p: any) => ({
      id: p.id,
      name: p.name,
      card: p.card,
      score: p.score,
      isWinner: p.isWinner,
    })),
    calledNumbers: game.calledNumbers,
    currentNumber: game.currentNumber,
    winner: game.winner ? { id: game.winner.id, name: game.winner.name, score: game.winner.score } : undefined,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  });
});

router.post('/:id/call-number', (req: Request, res: Response) => {
  const game = games.get(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const calledSet = new Set(game.calledNumbers);
  const nextNumber = BingoEngine.getNextNumber(calledSet);

  game.calledNumbers.push(nextNumber);
  game.currentNumber = nextNumber;
  game.updatedAt = new Date();

  simulateBotResponses(game, nextNumber);

  res.json({
    calledNumber: nextNumber,
    allCalled: game.calledNumbers,
  });
});

router.post('/:id/mark', (req: Request, res: Response) => {
  const { playerId, row, col } = req.body;
  const game = games.get(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const player = game.players.find((p: any) => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  player.card.marked[row][col] = true;

  if (BingoEngine.checkWin(player.card.marked)) {
    player.isWinner = true;
    player.score += 10;
    game.status = 'completed';
    game.winner = player;
  }

  game.updatedAt = new Date();

  res.json({
    success: true,
    isWinner: player.isWinner,
  });
});

function simulateBotResponses(game: any, calledNumber: number): void {
  const bots = game.players.filter((p: any) => p.role === 'bot');

  bots.forEach((bot: any) => {
    const botInstance = new BotPlayer();

    setTimeout(() => {
      if (botInstance.shouldMarkNumber(bot.card.numbers, calledNumber)) {
        const pos = BingoEngine.findNumberPosition(bot.card.numbers, calledNumber);
        if (pos) {
          const [row, col] = pos;
          bot.card.marked[row][col] = true;

          if (BingoEngine.checkWin(bot.card.marked)) {
            bot.isWinner = true;
            bot.score += 10;
            if (game.status !== 'completed') {
              game.status = 'completed';
              game.winner = bot;
            }
          }
        }
      }
    }, botInstance.getReactionDelay());
  });
}

export default router;