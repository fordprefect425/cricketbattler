import type { Card } from './types';
import { v4 as uuidv4 } from 'uuid';

export const BASE_SET: Omit<Card, 'id' | 'currentRuns' | 'currentPressure' | 'currentComposure' | 'isRevealed'>[] = [
    // Batters
    {
        templateId: 'opener',
        name: 'The Opener',
        cost: 1,
        runs: 2,
        pressure: 0,
        composure: 5,
        type: 'UNIT',
        description: 'On Reveal: +1 Runs if played in Lane 1 or 2.',
    },
    {
        templateId: 'finisher',
        name: 'The Finisher',
        cost: 5,
        runs: 10,
        pressure: 0,
        composure: 2,
        type: 'UNIT',
        description: 'On Reveal: Double Runs if played last this turn.',
    },
    {
        templateId: 'pinch_hitter',
        name: 'The Pinch Hitter',
        cost: 2,
        runs: 5,
        pressure: 0,
        composure: 1,
        type: 'UNIT',
        description: 'High runs for low cost, but very fragile.',
    },
    // Bowlers
    {
        templateId: 'speedster',
        name: 'The Speedster',
        cost: 3,
        runs: 0,
        pressure: 6,
        composure: 3,
        type: 'UNIT',
        description: '+2 Pressure on Green Top.',
    },
    {
        templateId: 'mystery_spinner',
        name: 'Mystery Spinner',
        cost: 2,
        runs: 0,
        pressure: 2,
        composure: 3,
        type: 'UNIT',
        description: 'On Reveal: -3 Runs to opposing card.',
    },
    {
        templateId: 'swing_king',
        name: 'The Swing King',
        cost: 3,
        runs: 0,
        pressure: 4,
        composure: 3,
        type: 'UNIT',
        description: 'Attacks the card in the Left lane.',
    },
    // All Rounders
    {
        templateId: 'captain',
        name: 'The Captain',
        cost: 4,
        runs: 4,
        pressure: 3,
        composure: 4,
        type: 'UNIT',
        description: 'Ongoing: +1 Composure to all other cards here.',
    },
    {
        templateId: 'electric_fielder',
        name: 'Electric Fielder',
        cost: 2,
        runs: 1,
        pressure: 1,
        composure: 4,
        type: 'UNIT',
        description: 'Reaction: Cancels opponent Tactics here.',
    },
    // Tactics
    {
        templateId: 'yorker',
        name: 'Yorker',
        cost: 4,
        runs: 0,
        pressure: 0,
        composure: 0,
        type: 'TACTIC',
        description: 'Destroy an opponent card with > 6 Runs.',
    },
    {
        templateId: 'helicopter',
        name: 'Helicopter Shot',
        cost: 2,
        runs: 0,
        pressure: 0,
        composure: 0,
        type: 'TACTIC',
        description: 'Give one of your cards +4 Runs.',
    },
];

export const createCard = (templateId: string): Card => {
    const template = BASE_SET.find(c => c.templateId === templateId);
    if (!template) throw new Error(`Card template ${templateId} not found`);

    return {
        ...template,
        id: uuidv4(),
        currentRuns: template.runs,
        currentPressure: template.pressure,
        currentComposure: template.composure,
        isRevealed: false,
    };
};

export const createDeck = (): Card[] => {
    const deck: Card[] = [];

    // High-cost cards
    const midHighPool = [
        'speedster', 'speedster',
        'finisher',
        'captain',
        'yorker',
        'swing_king',
        'mystery_spinner'
    ];

    // Low-cost / Essential cards
    const lowCostPool = [
        'opener', 'opener',
        'pinch_hitter', 'pinch_hitter',
        'electric_fielder',
        'helicopter'
    ];

    // Logic: Ensure at least one Opener is at the start (index 0)
    deck.push(createCard('opener'));

    // Add rest and shuffle
    const remainingIds = [...midHighPool, ...lowCostPool];
    // Remove one openers worth from pool roughly (abstracted) - actually we just added specific instance.
    // Let's just build the full random list but force specific start.

    const fullRandomDeck: Card[] = [];
    // 1 Opener (Already added?) No let's rebuild properly.

    // Correct Algorithm:
    // 1. Create list of all intended cards
    const allCardIds = [
        'opener', 'opener',
        'speedster', 'speedster',
        'finisher',
        'captain',
        'pinch_hitter', 'pinch_hitter',
        'yorker',
        'mystery_spinner',
        'swing_king',
        'electric_fielder'
    ];

    // 2. Shuffle names
    const shuffledIds = allCardIds.sort(() => Math.random() - 0.5);

    // 3. Ensure one 'opener' is in the first 5
    // Find index of first opener
    const openerIdx = shuffledIds.indexOf('opener');
    if (openerIdx > 4) {
        // Swap with index 0
        [shuffledIds[0], shuffledIds[openerIdx]] = [shuffledIds[openerIdx], shuffledIds[0]];
    }

    return shuffledIds.map(id => createCard(id));
};
