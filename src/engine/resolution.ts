import type { GameState, Lane, PlayerState } from './types';

// Helper to deep clone simple data structures manually if needed, 
// or just use structuredClone if environment supports (node 17+ or modern browser)
// But for safety in this mixed env, we'll do spread operators carefully.

export const resolveTurn = (state: GameState): Partial<GameState> => {
    // We only clone the DATA parts we intend to modify
    // 1. Lanes (Deep copy needed because we modify cards array inside)
    const newLanes: Lane[] = state.lanes.map(lane => ({
        ...lane,
        cards: lane.cards.map(c => ({ ...c })), // Shallow copy cards (sufficient unless we have nested objs in cards)
        opponentCards: lane.opponentCards.map(c => ({ ...c }))
    }));

    // 1. Reveal Phase
    newLanes.forEach(lane => {
        lane.cards.forEach(card => card.isRevealed = true);
        lane.opponentCards.forEach(card => card.isRevealed = true);
    });

    // 3. Lane Effects / 4. Combat
    newLanes.forEach(lane => {
        // Calculate Pressure
        const totalPlayerPressure = lane.cards.reduce((sum, c) => sum + (c.currentPressure || 0), 0);
        const totalOpponentPressure = lane.opponentCards.reduce((sum, c) => sum + (c.currentPressure || 0), 0);

        // Resolve Wickets (mutation on our newLanes arrays is safe)
        lane.cards = lane.cards.filter(card => {
            const defense = card.currentComposure || 0;
            // Avoid division by zero
            const spreadPressure = totalOpponentPressure / Math.max(1, lane.cards.length);
            return defense >= spreadPressure; // Keep if defense >= pressure
        });

        lane.opponentCards = lane.opponentCards.filter(card => {
            const defense = card.currentComposure || 0;
            const spreadPressure = totalPlayerPressure / Math.max(1, lane.opponentCards.length);
            return defense >= spreadPressure;
        });

        // Score
        lane.score = lane.cards.reduce((sum, c) => sum + (c.currentRuns || 0), 0);
        lane.opponentScore = lane.opponentCards.reduce((sum, c) => sum + (c.currentRuns || 0), 0);
    });

    // Prepare updates
    const updates: Partial<GameState> = {
        lanes: newLanes,
    };

    // 6. Turn Management
    if (state.turn < state.maxTurns) {
        updates.turn = state.turn + 1;
        updates.phase = 'DEPLOY';

        const nextEnergy = Math.min(6, updates.turn);

        // Update Player (Energy + Draw)
        // We need to clone player state to modify hand/deck
        const newPlayer: PlayerState = {
            ...state.player,
            hand: [...state.player.hand],
            deck: [...state.player.deck],
            energy: nextEnergy,
            maxEnergy: nextEnergy
        };

        if (newPlayer.deck.length > 0) {
            const drawnCard = newPlayer.deck.shift();
            if (drawnCard) newPlayer.hand.push(drawnCard);
        }
        updates.player = newPlayer;

        // Reset Opponent / Give Energy (Simplified)
        updates.opponent = {
            ...state.opponent,
            energy: nextEnergy // Simple reset
        };

    } else {
        updates.phase = 'END_MATCH';

        let playerWonLanes = 0;
        let opponentWonLanes = 0;
        newLanes.forEach(l => {
            if (l.score > l.opponentScore) playerWonLanes++;
            if (l.opponentScore > l.score) opponentWonLanes++;
        });

        if (playerWonLanes > opponentWonLanes) updates.winner = 'PLAYER';
        else if (opponentWonLanes > playerWonLanes) updates.winner = 'OPPONENT';
        else updates.winner = 'DRAW';
    }

    return updates;
};
