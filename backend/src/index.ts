import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import gamesRouter from './routes/games';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/games', gamesRouter);

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('join-game', (gameId, playerName) => {
    socket.join(`game-${gameId}`);
    console.log(`${playerName} joined game ${gameId}`);
    io.to(`game-${gameId}`).emit('player-joined', { playerId: socket.id, playerName });
  });

  socket.on('mark-number', (gameId, position) => {
    io.to(`game-${gameId}`).emit('number-marked', { playerId: socket.id, position });
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🎮 Bingo server running on port ${PORT}`);
});