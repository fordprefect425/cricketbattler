import React from 'react';
import type { Lane } from '../engine/types';
import { CardView } from './CardView';
import { clsx } from 'clsx';
import { ArrowDownCircle, AlertCircle, Info } from 'lucide-react';

interface LaneViewProps {
    lane: Lane;
    onLaneClick?: (laneId: string) => void;
    isValidTarget?: boolean;
}

export const LaneView: React.FC<LaneViewProps> = ({ lane, onLaneClick, isValidTarget = false }) => {
    // Visual themes with CSS Patterns
    const getLaneStyles = (type: string) => {
        switch (type) {
            case 'GREEN_TOP':
                return "bg-[#2E7D32] border-green-600/50 bg-[radial-gradient(#4CAF50_1px,transparent_1px)] [background-size:16px_16px]";
            case 'DUST_BOWL':
                return "bg-[#8D6E63] border-amber-700/50 bg-[url('https://www.transparenttextures.com/patterns/dust.png')]";
            case 'FLAT_TRACK':
                return "bg-[#CFD8DC] border-slate-400/50 bg-[linear-gradient(45deg,#eceff1_25%,transparent_25%,transparent_75%,#eceff1_75%,#eceff1),linear-gradient(45deg,#eceff1_25%,transparent_25%,transparent_75%,#eceff1_75%,#eceff1)] [background-size:20px_20px] [background-position:0_0,10px_10px]";
            default:
                return "bg-slate-200 border-slate-300";
        }
    };

    const laneBg = getLaneStyles(lane.type);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isValidTarget && onLaneClick) {
            onLaneClick(lane.id);
        }
    };

    const isWinning = lane.score > lane.opponentScore;
    const isLosing = lane.score < lane.opponentScore;

    return (
        <div className="flex flex-col h-full w-full max-w-sm mx-auto relative group isolate">
            {/* Scoreboard Pill - Floating Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none w-full">
                <div className="flex items-center gap-0 bg-slate-900 text-white rounded-full shadow-2xl border-4 border-slate-800 overflow-hidden scale-110">
                    <div className={clsx("font-heading font-bold text-3xl px-4 py-1 flex items-center justify-center min-w-[3rem]", isLosing ? "bg-red-900/50 text-red-200" : "bg-slate-800 text-slate-400")}>
                        {lane.opponentScore}
                    </div>
                    <div className="bg-slate-700 h-full w-px" />
                    <div className={clsx("font-heading font-bold text-3xl px-4 py-1 flex items-center justify-center min-w-[3rem]", isWinning ? "bg-green-900/50 text-green-400" : "bg-slate-800 text-slate-400")}>
                        {lane.score}
                    </div>
                </div>

                {/* Lane Type Badge */}
                <div className="mt-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-slate-900 shadow-md border border-white/50 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${lane.type === 'GREEN_TOP' ? 'bg-green-600' :
                            lane.type === 'DUST_BOWL' ? 'bg-amber-700' : 'bg-slate-400'
                        }`} />
                    {lane.name}
                </div>
            </div>

            {/* Opponent Side (Top) */}
            <div className="h-48 bg-slate-800/90 rounded-t-2xl p-2 flex flex-col items-center justify-start pt-4 relative border-b-2 border-white/5 overflow-hidden shadow-inner">
                {/* Overlay Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

                <div className="flex flex-wrap gap-2 justify-center scale-75 origin-top transition-all w-full relative z-10">
                    {lane.opponentCards.map(c => (
                        <CardView key={c.id} card={c} isOpponent={true} />
                    ))}
                </div>
            </div>

            {/* Player Side (Interactive Zone) - Textured */}
            <div
                onClick={handleClick}
                className={clsx(
                    "flex-1 min-h-[18rem] rounded-b-2xl p-2 transition-all flex flex-col items-center justify-end pb-4 relative border-x-4 border-b-8 shadow-inner overflow-hidden",
                    laneBg,
                    // Hover/Active Effects
                    isValidTarget
                        ? "cursor-pointer ring-4 ring-yellow-400/80 hover:brightness-110 active:scale-[0.99]"
                        : "opacity-100" // Always show full opacity for texture visibility
                )}
            >
                {/* Texture Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Call to Action Overlay */}
                <div className={clsx(
                    "absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300",
                    isValidTarget ? "opacity-100" : "opacity-0"
                )}>
                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-heading font-bold text-2xl shadow-xl flex items-center gap-2 transform translate-y-12 animate-bounce border-2 border-white">
                        <ArrowDownCircle size={24} />
                        DEPLOY
                    </div>
                </div>

                {/* Lane Effect Info Icon */}
                <div className="absolute top-2 right-2 z-20 group/info">
                    <div className="w-6 h-6 bg-black/40 hover:bg-black/80 rounded-full flex items-center justify-center text-white cursor-help transition-colors backdrop-blur-sm">
                        <Info size={14} />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute right-0 top-8 w-48 bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 border border-white/20">
                        <div className="font-bold text-yellow-500 mb-1 border-b border-white/20 pb-1 flex items-center gap-1">
                            <AlertCircle size={10} /> Condition
                        </div>
                        {lane.description}
                    </div>
                </div>

                {/* Cards Area */}
                <div className="flex flex-wrap gap-2 justify-center w-full z-10 perspective-1000">
                    {lane.cards.map((c, i) => (
                        <div key={c.id}
                            className="transform transition-all hover:translate-y-[-40px] hover:z-50 hover:scale-110 hover:rotate-2 shadow-2xl"
                            style={{
                                zIndex: i,
                                marginRight: i < lane.cards.length - 1 ? '-40px' : '0' // Overlap cards
                            }}
                        >
                            <CardView card={c} isPlayable={false} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
