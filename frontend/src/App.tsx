import React, { useState } from 'react';
import GameLobby from './pages/GameLobby';
import GameBoard from './components/GameBoard';

function App() {
  const [gameState, setGameState] = useState<{ gameId: string; playerId: string } | null>(null);

  const handleCreateGame = async (playerName: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      });
      const data = await response.json();
      if (response.ok) {
        setGameState({
          gameId: data.gameId,
          playerId: data.game.players[0].id,
        });
      }
    } catch (err) {
      console.error('Error creating game:', err);
    }
  };

  return (
    <div>
      {!gameState ? (
        <GameLobby onCreateGame={handleCreateGame} />
      ) : (
        <GameBoard gameId={gameState.gameId} playerId={gameState.playerId} />
      )}
    </div>
  );
}

export default App;