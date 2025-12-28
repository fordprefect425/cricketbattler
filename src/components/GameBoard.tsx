import React from 'react';
import { useGameStore } from '../engine/store';
import { LaneView } from './LaneView';
import { CardView } from './CardView';
// Removed DnD imports
import { Gamepad2, Timer, Trophy, MousePointerClick, Play } from 'lucide-react';

export const GameBoard: React.FC = () => {
    const { lanes, player, phase, turn, initializeGame, playCard, endTurn, winner } = useGameStore();
    // New State: Selected Card ID
    const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);

    // Initial setup handled by loop, but we want manual start now
    // useEffect(() => { initializeGame(); }, []);

    const handleCardClick = (cardId: string) => {
        if (phase !== 'DEPLOY') return;

        if (selectedCardId === cardId) {
            setSelectedCardId(null); // Deselect if clicking same card
        } else {
            setSelectedCardId(cardId); // Select new card
        }
    };

    const handleLaneClick = (laneId: string) => {
        if (selectedCardId) {
            console.log('Playing card', selectedCardId, 'to lane', laneId);
            playCard(selectedCardId, laneId);
            setSelectedCardId(null); // Clear selection after play
        }
    };

    const handleBackgroundClick = () => {
        // Disabled explicit deselection for stability. 
        // Click another card to switch selection.
    };

    if (phase === 'MENU') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center" />
                <div className="z-10 text-center p-8 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
                    <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Pitch Perfect</h1>
                    <p className="text-xl text-gray-300 mb-8 font-mono">Cricket Tactics Prototype</p>

                    <button
                        onClick={initializeGame}
                        className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-3 text-xl"
                    >
                        <Play className="fill-current group-hover:scale-110 transition-transform" />
                        START MATCH
                    </button>
                    <p className="mt-4 text-xs text-gray-400">Click & Select Controls Activated</p>
                </div>
            </div>
        );
    }

    if (phase === 'END_MATCH') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white relative">
                <div className="z-10 text-center p-8 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                    <Trophy size={64} className="mx-auto mb-4 text-yellow-400" />
                    <h1 className="text-5xl font-bold mb-4">
                        {winner === 'PLAYER' ? 'VICTORY!' : winner === 'OPPONENT' ? 'DEFEAT' : 'DRAW'}
                    </h1>
                    <p className="text-gray-400 mb-8">
                        {winner === 'PLAYER' ? 'You mastered the conditions!' : 'Better luck next over.'}
                    </p>
                    <button
                        onClick={initializeGame}
                        className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col h-screen w-full bg-slate-900 text-white overflow-hidden p-2"
            onClick={handleBackgroundClick}
        >
            {/* Header Info */}
            <div className="flex justify-between items-center bg-slate-800 p-2 rounded-lg mb-2 shadow-md">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="text-blue-400" />
                        <span className="font-bold">Turn {turn}/6</span>
                    </div>
                    <div className="text-gray-400 font-mono text-sm border-l pl-4 border-gray-600">
                        Phase: <span className="text-yellow-400 font-bold">{phase}</span>
                    </div>
                </div>
                {/* End Turn Button - Important interaction */}
                <button
                    onClick={endTurn}
                    disabled={phase !== 'DEPLOY'}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-bold shadow-lg transition-colors flex items-center gap-2 active:transform active:scale-95"
                >
                    <Timer size={18} />
                    End Turn
                </button>
            </div>

            {/* Instruction Hint */}
            {phase === 'DEPLOY' && !selectedCardId && (
                <div className="text-center text-sm text-gray-400 mb-2 animate-pulse flex items-center justify-center gap-2">
                    <MousePointerClick size={14} />
                    Click a card to select it
                </div>
            )}
            {phase === 'DEPLOY' && selectedCardId && (
                <div className="text-center text-sm text-blue-400 mb-2 font-bold animate-pulse flex items-center justify-center gap-2">
                    <MousePointerClick size={14} />
                    Now click a Lane to play!
                </div>
            )}

            {/* Main Battle Area */}
            <div className="flex-1 grid grid-cols-3 gap-2 md:gap-4 px-2 md:px-12 py-2 overflow-y-auto">
                {lanes.map(lane => (
                    <LaneView
                        key={lane.id}
                        lane={lane}
                        isValidTarget={!!selectedCardId} // Highlight lanes when card selected
                        onLaneClick={handleLaneClick}
                    />
                ))}
            </div>

            {/* Player Hand Area */}
            <div className="mt-auto pt-2 pb-4 px-2 relative z-50">
                {/* Energy Bar */}
                <div className="flex justify-center mb-2">
                    <div className="bg-slate-800 rounded-full px-4 py-1 border border-slate-600 shadow-sm flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Energy</span>
                        <div className="flex gap-1">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full transition-all ${i < player.energy ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-gray-700'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-mono ml-1">{player.energy}/{player.maxEnergy}</span>
                    </div>
                </div>

                {/* Hand */}
                <div className="flex justify-center -space-x-4 max-w-4xl mx-auto h-48 items-end pb-2">
                    {player.hand.map((card, index) => (
                        <div
                            key={card.id}
                            className="transform transition-transform hover:-translate-y-8 hover:z-50 first:hover:translate-x-2 last:hover:-translate-x-2"
                            style={{
                                zIndex: index,
                                marginTop: selectedCardId === card.id ? '-2rem' : '0' // Visually lift selected card
                            }}
                        >
                            <CardView
                                card={card}
                                isPlayable={card.cost <= player.energy}
                                isSelected={selectedCardId === card.id}
                                onClick={() => handleCardClick(card.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
