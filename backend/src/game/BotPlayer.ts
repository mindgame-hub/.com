// AI Bot Player Logic - Plays like a real human, indistinguishable from actual players
// Expert level bots with professional skill

import { BingoEngine } from './BingoEngine';

export class BotPlayer {
  skillLevel: 'expert' = 'expert'; // Always expert level
  private markingAccuracy: number = 0.98; // 98% accuracy
  private reactionTimeMs: number; // 200-600ms realistic response
  private mistakeProbability: number = 0.02; // Only 2% chance of missing
  private botName: string;

  constructor() {
    this.botName = this.generateHumanLikeName();
    this.reactionTimeMs = 200 + Math.random() * 400; // 200-600ms
  }

  /**
   * Generate realistic human-like names for bots
   */
  private generateHumanLikeName(): string {
    const firstNames = [
      'Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Blake', 'Drew',
      'Jamie', 'Skyler', 'Quinn', 'Phoenix', 'Dakota', 'River', 'Sage', 'Ocean',
      'Chris', 'Sam', 'Parker', 'Cameron', 'Avery', 'Bailey', 'Reese', 'Finley',
      'Rowan', 'Peyton', 'Justice', 'Kyrie', 'Tatum', 'Spencer'
    ];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
      'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
      'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
    ];

    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
  }

  /**
   * Determine if bot should mark a number - with expert-level accuracy
   */
  shouldMarkNumber(card: number[][], calledNumber: number): boolean {
    // Check if number exists in card
    const exists = card.some(row => row.includes(calledNumber));
    
    if (!exists) return false;

    // Expert level: 98% accuracy
    if (Math.random() > this.markingAccuracy) {
      return false; // Rare miss
    }

    // Only 2% chance to make a mistake even with expert level
    if (Math.random() < this.mistakeProbability) {
      return false;
    }

    return true;
  }

  /**
   * Get realistic reaction time (200-600ms for expert)
   */
  getReactionDelay(): number {
    // Add slight variation to make it less predictable
    const variation = (Math.random() - 0.5) * this.reactionTimeMs * 0.3;
    return Math.max(100, this.reactionTimeMs + variation);
  }

  /**
   * Get the bot's display name (indistinguishable from real player names)
   */
  getName(): string {
    return this.botName;
  }

  /**
   * Simulate natural game pauses (humans get distracted)
   */
  shouldTakePause(): boolean {
    // Very small chance for expert level to pause
    return Math.random() < 0.01;
  }
}
