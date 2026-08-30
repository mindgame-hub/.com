import React, { useState, useEffect } from 'react';
import BingoCard from './BingoCard';

interface GameBoardProps {
  gameId: string;
  playerId: string;
}

interface Player {
  id: string;
  name: string;
  card: { numbers: number[][]; marked: boolean[][] };
  score: number;
  isWinner?: boolean;
}

interface GameState {
  id: string;
  status: string;
  players: Player[];
  calledNumbers: number[];
  currentNumber?: number;
  winner?: { id: string; name: string; score: number };
}

const GameBoard: React.FC<GameBoardProps> = ({ gameId, playerId }) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 500);
    return () => clearInterval(interval);
  }, [gameId]);

  const fetchGameState = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/games/${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch game state');
      const data = await response.json();
      setGame(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const handleCallNumber = async () => {
    try {
      await fetch(`http://localhost:5000/api/games/${gameId}/call-number`, {
        method: 'POST',
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchGameState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to call number');
    }
  };

  const handleMarkNumber = async (row: number, col: number) => {
    try {
      await fetch(`http://localhost:5000/api/games/${gameId}/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, row, col }),
      });
      fetchGameState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark number');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>Loading game...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px', fontSize: '18px' }}>Error: {error}</div>;
  if (!game) return <div style={{ textAlign: 'center', padding: '40px' }}>Game not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>🎮 Bingo Game</h2>
        <div style={{ margin: '15px 0', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Called Number: {game.currentNumber || 'Waiting...'}</h3>
          <button 
            onClick={handleCallNumber} 
            disabled={game.status === 'completed'}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: game.status === 'completed' ? '#ccc' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: game.status === 'completed' ? 'not-allowed' : 'pointer',
            }}
          >
            📢 Call Next Number
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '15px 0' }}>
        <p>Status: <strong>{game.status.toUpperCase()}</strong></p>
        {game.winner && (
          <p style={{ fontSize: '18px', color: '#d4af37' }}>🏆 Winner: <strong>{game.winner.name}</strong> earned {game.winner.score} points!</p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', margin: '20px 0' }}>
        {game.players.map(player => (
          <div 
            key={player.id} 
            style={{
              position: 'relative',
              border: player.id === playerId ? '2px solid #2196f3' : '2px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              background: player.id === playerId ? '#e3f2fd' : 'white',
              boxShadow: player.id === playerId ? '0 0 10px rgba(33, 150, 243, 0.3)' : 'none',
            }}
          >
            <BingoCard
              numbers={player.card.numbers}
              marked={player.card.marked}
              onNumberClick={player.id === playerId ? handleMarkNumber : () => {}}
              playerName={`${player.name} (${player.score}pts)`}
              isCurrentPlayer={player.id === playerId}
            />
            {player.isWinner && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#ffc107',
                color: '#333',
                padding: '5px 10px',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}>🏆 WINNER</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>📋 Numbers Called ({game.calledNumbers.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {game.calledNumbers.map(num => (
            <span 
              key={num} 
              style={{
                background: '#2196f3',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;