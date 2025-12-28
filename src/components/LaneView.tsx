import React from 'react';
import type { Lane } from '../engine/types';
import { CardView } from './CardView';
import { clsx } from 'clsx';
import { Trophy, ArrowDownCircle, AlertCircle } from 'lucide-react';

interface LaneViewProps {
    lane: Lane;
    onLaneClick?: (laneId: string) => void;
    isValidTarget?: boolean;
}

export const LaneView: React.FC<LaneViewProps> = ({ lane, onLaneClick, isValidTarget = false }) => {
    // Visual themes
    const bgClass = {
        'GREEN_TOP': 'bg-gradient-to-b from-green-100 to-green-200 border-green-400',
        'DUST_BOWL': 'bg-gradient-to-b from-amber-100 to-amber-200 border-amber-400',
        'FLAT_TRACK': 'bg-gradient-to-b from-gray-100 to-gray-200 border-gray-400',
        'NORMAL': 'bg-white border-gray-200'
    }[lane.type];

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isValidTarget && onLaneClick) {
            onLaneClick(lane.id);
        }
    };

    const isWinning = lane.score > lane.opponentScore;
    const isLosing = lane.score < lane.opponentScore;

    return (
        <div className="flex flex-col h-full w-full max-w-xs mx-auto relative group">
            {/* Scoreboard Header */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                <div className="flex items-center gap-2 bg-slate-900/90 text-white px-4 py-1.5 rounded-full shadow-xl border-2 border-slate-700 backdrop-blur-sm">
                    <div className={clsx("font-mono font-bold text-lg", isLosing ? "text-red-400" : "text-gray-300")}>
                        {lane.opponentScore}
                    </div>
                    <div className="text-xs font-bold text-gray-500">VS</div>
                    <div className={clsx("font-mono font-bold text-lg", isWinning ? "text-green-400" : "text-gray-300")}>
                        {lane.score}
                    </div>
                </div>
                {/* Lane Type Badge */}
                <div className="mt-1 bg-white/80 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm border border-slate-200">
                    {lane.name}
                </div>
            </div>

            {/* Opponent Side */}
            <div className="h-48 bg-slate-800/80 rounded-t-xl p-2 flex flex-col items-center justify-start pt-4 relative border-b-2 border-dashed border-white/10 overflow-hidden">
                <div className="flex flex-wrap gap-1 justify-center scale-75 origin-top transition-all w-full">
                    {lane.opponentCards.map(c => (
                        <CardView key={c.id} card={c} isOpponent={true} />
                    ))}
                </div>
                {lane.opponentCards.length === 0 && (
                    <div className="mt-8 text-slate-600 text-sm font-mono flex items-center gap-2">
                        <div className="w-8 h-12 border-2 border-dashed border-slate-600 rounded opacity-50" />
                        Empty
                    </div>
                )}
            </div>

            {/* Player Side (Interactive Zone) */}
            <div
                onClick={handleClick}
                className={clsx(
                    "flex-1 min-h-[16rem] rounded-b-xl p-2 transition-all flex flex-col items-center justify-end pb-4 relative border-x-2 border-b-4",
                    bgClass,
                    // Hover/Active Effects
                    isValidTarget
                        ? "cursor-pointer ring-4 ring-blue-500/50 hover:brightness-105 hover:scale-[1.02]"
                        : "opacity-95"
                )}
            >
                {/* Call to Action Overlay */}
                {isValidTarget && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none bg-blue-500/10 backdrop-blur-[1px] rounded-b-xl animate-pulse">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 transform translate-y-8">
                            <ArrowDownCircle className="animate-bounce" />
                            PLAY HERE
                        </div>
                    </div>
                )}

                {/* Lane Effect Description (Tooltip) */}
                <div className="absolute top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs p-2 rounded max-w-[80%] text-center z-10 pointer-events-none">
                    <AlertCircle size={12} className="inline mr-1 mb-0.5" />
                    {lane.description}
                </div>

                <div className="flex flex-wrap gap-1 justify-center w-full z-10">
                    {lane.cards.map(c => (
                        <div key={c.id} className="transform transition-all hover:translate-y-[-20px] hover:z-20 hover:scale-105">
                            <CardView card={c} isPlayable={false} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
