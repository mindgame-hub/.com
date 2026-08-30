import React from 'react';

interface BingoCardProps {
  numbers: number[][];
  marked: boolean[][];
  onNumberClick: (row: number, col: number) => void;
  playerName: string;
  isCurrentPlayer?: boolean;
}

const BingoCard: React.FC<BingoCardProps> = ({ numbers, marked, onNumberClick, playerName, isCurrentPlayer }) => {
  const LABELS = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="bingo-card">
      <h3>{playerName}</h3>
      <div className="card-grid">
        <div className="headers">
          {LABELS.map(label => (
            <div key={label} className="header-cell">{label}</div>
          ))}
        </div>
        <div className="cells">
          {numbers.map((column, colIndex) =>
            column.map((number, rowIndex) => (
              <div
                key={`${colIndex}-${rowIndex}`}
                className={`cell ${marked[rowIndex] && marked[rowIndex][colIndex] ? 'marked' : ''} ${number === 0 ? 'free' : ''}`}
                onClick={() => isCurrentPlayer && onNumberClick(rowIndex, colIndex)}
                style={{ cursor: isCurrentPlayer ? 'pointer' : 'default' }}
              >
                {number === 0 ? 'FREE' : number}
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        .bingo-card {
          margin: 20px;
          padding: 15px;
          border: 2px solid #333;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .bingo-card h3 {
          margin: 0 0 10px 0;
          text-align: center;
        }
        .card-grid {
          display: inline-block;
        }
        .headers {
          display: grid;
          grid-template-columns: repeat(5, 50px);
          gap: 2px;
          margin-bottom: 2px;
        }
        .header-cell {
          width: 50px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          background: #333;
          color: white;
        }
        .cells {
          display: grid;
          grid-template-columns: repeat(5, 50px);
          gap: 2px;
        }
        .cell {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          background: white;
          font-weight: bold;
          user-select: none;
          transition: all 0.2s;
        }
        .cell:hover {
          background: #e0e0e0;
        }
        .cell.marked {
          background: #4caf50;
          color: white;
          font-weight: bold;
        }
        .cell.free {
          background: #ffc107;
          font-weight: bold;
        }
        .cell.free.marked {
          background: #4caf50;
        }
      `}</style>
    </div>
  );
};

export default BingoCard;