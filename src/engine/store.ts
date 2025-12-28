import { create } from 'zustand';
import type { GameState, Lane } from './types';
import { createDeck } from './cards';
import { resolveTurn } from './resolution';
import { v4 as uuidv4 } from 'uuid';

// Split Data from Actions to avoid overwriting methods with no-ops
type GameData = Omit<GameState, 'startGame' | 'playCard' | 'endTurn' | 'nextPhase'>;

interface GameStore extends GameState {
    // Actions are already in GameState, but we re-declare for clarity if needed
    // or just rely on GameState.
    initializeGame: () => void;
}

const INITIAL_DATA: GameData = {
    turn: 1,
    maxTurns: 6,
    lanes: [],
    phase: 'MENU',
    winner: null,
    player: {
        hand: [],
        deck: [],
        discardPile: [],
        energy: 1,
        maxEnergy: 1,
    },
    opponent: {
        hand: [],
        deck: [],
        discardPile: [],
        energy: 1,
        maxEnergy: 1,
    }
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Spread Initial Data
    ...INITIAL_DATA,

    // Define Actions (These will NOT be overwritten by initializeGame now)
    startGame: () => { }, // implementation below
    nextPhase: () => { }, // implementation below

    initializeGame: () => {
        // Create 3 Lanes
        const lanes: Lane[] = [
            { id: 'lane-1', name: 'Lane 1', type: 'GREEN_TOP', description: 'Pitch 1', cards: [], opponentCards: [], score: 0, opponentScore: 0 },
            { id: 'lane-2', name: 'Lane 2', type: 'DUST_BOWL', description: 'Pitch 2', cards: [], opponentCards: [], score: 0, opponentScore: 0 },
            { id: 'lane-3', name: 'Lane 3', type: 'FLAT_TRACK', description: 'Pitch 3', cards: [], opponentCards: [], score: 0, opponentScore: 0 },
        ];

        const deck = createDeck();
        const hand = deck.splice(0, 5); // Draw 5

        set({
            ...INITIAL_DATA, // Reset only data!
            phase: 'DEPLOY', // Start game!
            lanes,
            player: {
                ...INITIAL_DATA.player,
                deck,
                hand,
                energy: 1,
                maxEnergy: 1,
            },
            opponent: {
                ...INITIAL_DATA.opponent,
                deck: createDeck(),
                energy: 1,
            }
        });
        console.log("[Store] Game Initialized with Active Methods");
    },

    playCard: (cardId: string, laneId: string) => {
        const state = get();

        if (state.phase !== 'DEPLOY') return;

        const cardIndex = state.player.hand.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        const card = state.player.hand[cardIndex];
        if (card.cost > state.player.energy) return; // Not enough energy

        // Move card from hand to lane
        const newHand = [...state.player.hand];
        newHand.splice(cardIndex, 1);

        const newLanes = state.lanes.map(lane => {
            if (lane.id === laneId) {
                return { ...lane, cards: [...lane.cards, card] };
            }
            return lane;
        });

        set({
            player: {
                ...state.player,
                hand: newHand,
                energy: state.player.energy - card.cost,
            },
            lanes: newLanes,
        });
    },

    endTurn: () => {
        const state = get();
        console.log("[Store] Ending turn...", state.turn);

        // 1. Simulate Opponent Move
        const currentOpponentLanes = [...state.lanes];
        const randomLaneIdx = Math.floor(Math.random() * 3);
        const mockOppCard = createDeck()[0];
        mockOppCard.id = uuidv4();
        mockOppCard.isRevealed = false;

        currentOpponentLanes[randomLaneIdx] = {
            ...currentOpponentLanes[randomLaneIdx],
            opponentCards: [...currentOpponentLanes[randomLaneIdx].opponentCards, mockOppCard]
        };

        // 2. Resolve Turn
        const updates = resolveTurn({
            ...state,
            lanes: currentOpponentLanes,
        });

        // 3. Merge Updates
        set((prevState) => ({
            ...prevState,
            ...updates
        }));
        console.log("[Store] Turn Resolved.");
    },
}));
