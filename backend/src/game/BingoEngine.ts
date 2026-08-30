export class BingoEngine {
  private static readonly CARD_SIZE = 5;
  private static readonly MIN_NUMBER = 1;
  private static readonly MAX_NUMBER = 75;

  static generateCard(): number[][] {
    const card: number[][] = [];
    const usedNumbers = new Set<number>();

    for (let col = 0; col < this.CARD_SIZE; col++) {
      const column: number[] = [];
      const min = this.MIN_NUMBER + col * 15;
      const max = min + 14;

      while (column.length < this.CARD_SIZE) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!usedNumbers.has(num)) {
          column.push(num);
          usedNumbers.add(num);
        }
      }
      card.push(column);
    }

    card[2][2] = 0;
    return card;
  }

  static checkWin(marked: boolean[][]): boolean {
    const size = marked.length;

    for (let i = 0; i < size; i++) {
      if (marked[i].every(cell => cell)) return true;
    }

    for (let j = 0; j < size; j++) {
      if (marked.every(row => row[j])) return true;
    }

    if (marked.every((row, i) => row[i])) return true;
    if (marked.every((row, i) => row[size - 1 - i])) return true;

    return false;
  }

  static getNextNumber(calledNumbers: Set<number>): number {
    let num: number;
    do {
      num = Math.floor(Math.random() * (this.MAX_NUMBER - this.MIN_NUMBER + 1)) + this.MIN_NUMBER;
    } while (calledNumbers.has(num));
    return num;
  }

  static findNumberPosition(card: number[][], number: number): [number, number] | null {
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < card[i].length; j++) {
        if (card[i][j] === number) {
          return [i, j];
        }
      }
    }
    return null;
  }
}