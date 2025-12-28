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
                    "w-32 h-44 bg-blue-900 rounded-lg border-2 border-blue-700 shadow-lg flex items-center justify-center",
                    className
                )}
            >
                <div className="text-blue-500 font-bold rotate-45">CRICKET</div>
            </div>
        );
    }

    // Stat Display Logic
    const getStatColor = (current: number | undefined, base: number, type: 'good' | 'bad' = 'good') => {
        const val = current ?? base;
        if (val === base) return "text-gray-700";
        if (val > base) return type === 'good' ? "text-green-600 font-extrabold" : "text-red-600 font-extrabold";
        return type === 'good' ? "text-red-600" : "text-green-600";
    };

    const runsColor = getStatColor(card.currentRuns, card.runs);
    const pressureColor = getStatColor(card.currentPressure, card.pressure); // Pressure is offensive (Good if high?) Actually Pressure attacks Composure. High is good for Bowler.
    const composureColor = getStatColor(card.currentComposure, card.composure);

    return (
        <div
            onClick={(e) => {
                if (isPlayable && onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
            className={clsx(
                "w-32 h-44 rounded-lg shadow-lg relative flex flex-col p-2 select-none transition-all duration-200 bg-white text-gray-900 border-2",
                // Styling based on state
                isPlayable ? "cursor-pointer hover:border-blue-400 hover:-translate-y-2" : "opacity-60 cursor-not-allowed",
                isSelected ? "border-yellow-400 ring-4 ring-yellow-400/50 -translate-y-4 shadow-2xl z-50" : "border-transparent",
                className
            )}
        >
            {/* Header: Cost & Name */}
            <div className="flex justify-between items-start mb-1">
                <div className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-1",
                    isSelected ? "bg-yellow-500 text-black ring-yellow-600" : "bg-blue-600 text-white ring-blue-400"
                )}>
                    {card.cost}
                </div>
            </div>

            {/* Image Placeholder */}
            <div className="flex-1 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden border border-gray-200 relative group">
                <span className="text-[10px] text-gray-400 text-center px-1 font-semibold uppercase tracking-wider">{card.type}</span>
                {/* Ability Tooltip Hint */}
                {(card.currentRuns !== undefined && card.currentRuns !== card.runs) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
            </div>

            <div className="font-bold text-sm text-center leading-tight mb-1 truncate">{card.name}</div>
            <div className="text-[10px] text-gray-600 text-center leading-snug mb-2 flex-grow overflow-hidden text-ellipsis">{card.description}</div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center mt-auto border-t pt-1 border-gray-200 bg-gray-50/50 -mx-2 px-2 pb-1 rounded-b-lg">
                {/* Runs */}
                <div className={clsx("flex flex-col items-center", runsColor)} title={`Base: ${card.runs}`}>
                    <Zap size={12} className="opacity-70" />
                    <span className="text-sm font-bold">{card.currentRuns ?? card.runs}</span>
                </div>

                {/* Pressure */}
                <div className={clsx("flex flex-col items-center", pressureColor)} title={`Base: ${card.pressure}`}>
                    <Shield size={12} className="opacity-70" />
                    <span className="text-sm font-bold">{card.currentPressure ?? card.pressure}</span>
                </div>

                {/* Composure */}
                <div className={clsx("flex flex-col items-center", composureColor)} title={`Base: ${card.composure}`}>
                    <CircleDashed size={12} className="opacity-70" />
                    <span className="text-sm font-bold">{card.currentComposure ?? card.composure}</span>
                </div>
            </div>
        </div>
    );
};
