import React, { useState } from 'react';

interface GameLobbyProps {
  onCreateGame: (playerName: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onCreateGame }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateGame(playerName);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', margin: '0 0 10px 0', fontSize: '28px' }}>
          🎮 Bingo Battle Royale
        </h1>
        <p style={{ textAlign: 'center', color: '#666', margin: '5px 0' }}>
          Play bingo against real opponents and climb the leaderboard!
        </p>
        <p style={{ textAlign: 'center', color: '#999', margin: '5px 0', fontSize: '14px' }}>
          Compete, win points, and prove your bingo skills!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '30px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              Enter Your Name:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="What should we call you?"
              required
              maxLength={30}
              style={{
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                transition: 'border-color 0.3s',
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={!playerName.trim()}
            style={{
              padding: '14px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: playerName.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: playerName.trim() ? 'pointer' : 'not-allowed',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            🚀 Join Game
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '8px',
          borderLeft: '4px solid #667eea',
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>How to Play</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li style={{ margin: '5px 0' }}>✓ You'll be matched with other players</li>
            <li style={{ margin: '5px 0' }}>✓ Numbers are called randomly</li>
            <li style={{ margin: '5px 0' }}>✓ First to get 5 in a row wins!</li>
            <li style={{ margin: '5px 0' }}>✓ Win: 10 points | Runner-up: 5 points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;