import React from 'react';
import type { Card } from '../engine/types';
import { clsx } from 'clsx';
import { Shield, Zap, CircleDashed } from 'lucide-react';

interface CardViewProps {
    card: Card;
    isPlayable?: boolean;
    isSelected?: boolean;
    className?: string;
    isOpponent?: boolean;
    onClick?: () => void;
}

export const CardView: React.FC<CardViewProps> = ({
    card,
    isPlayable = true,
    isSelected = false,
    className,
    isOpponent = false,
    onClick
}) => {
    if (isOpponent && !card.isRevealed) {
        return (
            <div
                className={clsx(
                    "w-36 h-52 bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl border-2 border-blue-500/50 shadow-2xl flex items-center justify-center relative overflow-hidden",
                    className
                )}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="text-blue-500/50 font-heading font-bold text-2xl rotate-45 tracking-widest">CRICKET</div>
            </div>
        );
    }

    // Stat Display Logic
    const getStatColor = (current: number | undefined, base: number, type: 'good' | 'bad' = 'good') => {
        const val = current ?? base;
        if (val === base) return "text-gray-600";
        if (val > base) return type === 'good' ? "text-green-600 font-extrabold" : "text-red-600 font-extrabold";
        return type === 'good' ? "text-red-600" : "text-green-600";
    };

    const runsColor = getStatColor(card.currentRuns, card.runs);
    const pressureColor = getStatColor(card.currentPressure, card.pressure);
    const composureColor = getStatColor(card.currentComposure, card.composure);

    // Design Logic
    const isRare = card.cost >= 4; // Rarity logic
    const isUnit = card.type === 'UNIT';

    return (
        <div
            onClick={(e) => {
                if (isPlayable && onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
            className={clsx(
                "w-36 h-52 rounded-xl shadow-lg relative flex flex-col p-1.5 select-none transition-all duration-300 border-2 overflow-hidden bg-white",
                // Holographic Effect for Rare Cards
                isRare && "holo-sheen ring-2 ring-purple-400/30",
                // Styling based on state
                isPlayable
                    ? "cursor-pointer hover:border-blue-500 hover:shadow-blue-500/30 hover:-translate-y-2 hover:scale-105"
                    : "opacity-60 grayscale-[0.5] cursor-not-allowed border-gray-300",
                isSelected
                    ? "border-yellow-400 ring-4 ring-yellow-400/60 -translate-y-6 shadow-2xl z-50 scale-110"
                    : "border-gray-200",
                className
            )}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-slate-50 opacity-[0.03] pointer-events-none" />

            {/* Header: Cost & Name */}
            <div className="flex justify-between items-center mb-1 relative z-10 px-1">
                <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xl shadow-md border-2",
                    isSelected ? "bg-yellow-500 text-black border-yellow-300" : "bg-blue-700 text-white border-blue-500"
                )}>
                    {card.cost}
                </div>
                <div className="flex-1 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.type}</span>
                </div>
            </div>

            {/* Image / Art Area */}
            <div className="h-20 bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-slate-300 relative group shadow-inner mx-1">
                {/* Abstract Art Placeholder */}
                <div className="opacity-10 text-6xl font-heading text-slate-400 select-none">
                    {isUnit ? '🏏' : '⚡'}
                </div>

                {(card.currentRuns !== undefined && card.currentRuns !== card.runs) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-green-500/50 shadow-lg" />
                )}
            </div>

            <div className="font-heading font-bold text-lg text-center leading-none mb-1 text-slate-800 tracking-wide px-1 truncate">
                {card.name}
            </div>

            <div className="text-[10px] font-body text-slate-600 text-center leading-snug mb-auto px-1 flex-grow overflow-hidden line-clamp-3">
                {card.description}
            </div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center mt-auto border-t border-slate-200 bg-slate-50 mx-[-6px] px-3 py-2 rounded-b-lg">
                {/* Runs */}
                <div className="flex flex-col items-center gap-0.5" title={`Runs (Attack): ${card.runs}`}>
                    <span className={clsx("font-heading text-xl leading-none", runsColor)}>{card.currentRuns ?? card.runs}</span>
                    <div className="flex items-center gap-0.5 text-[8px] font-bold uppercase text-slate-400 tracking-wider">
                        <Zap size={8} /> Runs
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200" />

                {/* Pressure */}
                <div className="flex flex-col items-center gap-0.5" title={`Pressure (Attack): ${card.pressure}`}>
                    <span className={clsx("font-heading text-xl leading-none", pressureColor)}>{card.currentPressure ?? card.pressure}</span>
                    <div className="flex items-center gap-0.5 text-[8px] font-bold uppercase text-slate-400 tracking-wider">
                        <Shield size={8} /> Press
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200" />

                {/* Composure */}
                <div className="flex flex-col items-center gap-0.5" title={`Composure (HP): ${card.composure}`}>
                    <span className={clsx("font-heading text-xl leading-none", composureColor)}>{card.currentComposure ?? card.composure}</span>
                    <div className="flex items-center gap-0.5 text-[8px] font-bold uppercase text-slate-400 tracking-wider">
                        <CircleDashed size={8} /> Comp
                    </div>
                </div>
            </div>
        </div>
    );
};
