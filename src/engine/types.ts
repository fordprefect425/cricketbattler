export type CardType = 'UNIT' | 'TACTIC';

export interface Card {
    id: string;
    templateId: string; // ID from the base set
    name: string;
    cost: number;
    runs: number; // Attack
    pressure: number; // Defense/Attack
    composure: number; // Health
    type: CardType;
    description: string;
    image?: string;
    // Dynamic state
    currentRuns?: number;
    currentPressure?: number;
    currentComposure?: number;
    isRevealed?: boolean;
}

export type LaneType = 'GREEN_TOP' | 'DUST_BOWL' | 'FLAT_TRACK' | 'NORMAL';

export interface Lane {
    id: string;
    name: string;
    type: LaneType;
    description: string;
    cards: Card[]; // Cards played by the player in this lane
    opponentCards: Card[]; // Cards played by opponent (simulated or real)
    score: number;
    opponentScore: number;
}

export interface PlayerState {
    hand: Card[];
    deck: Card[];
    discardPile: Card[];
    energy: number;
    maxEnergy: number;
}

export interface GameState {
    turn: number;
    maxTurns: number;
    lanes: Lane[];
    player: PlayerState;
    opponent: PlayerState; // Simplified for now
    phase: 'MENU' | 'DRAW' | 'DEPLOY' | 'REVEAL' | 'RESOLUTION' | 'END_MATCH';
    winner: 'PLAYER' | 'OPPONENT' | 'DRAW' | null;

    // Actions
    startGame: () => void;
    playCard: (cardId: string, laneId: string) => void;
    endTurn: () => void;
    nextPhase: () => void;
}
