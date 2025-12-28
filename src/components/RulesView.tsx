import React from 'react';
import { X, Trophy, Swords, Zap, Shield } from 'lucide-react';

interface RulesViewProps {
    onClose: () => void;
}

export const RulesView: React.FC<RulesViewProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border border-white/10 flex flex-col relative overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-700 bg-slate-800 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Trophy className="text-yellow-400" />
                        How to Play
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-8 text-gray-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">

                    {/* Section 1: Objective */}
                    <section>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">The Objective</h3>
                        <p className="text-lg">
                            Manage your cricket team across 3 unique Lanes (Pitches). To win, you must have a higher
                            <span className="text-yellow-400 font-bold mx-1">Score</span>
                            than your opponent in at least <span className="text-white font-bold">2 out of 3 Lanes</span> after 6 Turns.
                        </p>
                    </section>

                    {/* Section 2: Turn Structure */}
                    <section className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                            <Swords size={20} /> Match Structure (6 Turns)
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-sm h-fit">1</span>
                                <div>
                                    <strong className="text-white">Draw & Energy:</strong> You start with 1 Energy. Energy increases by +1 each turn (Max 6).
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-sm h-fit">2</span>
                                <div>
                                    <strong className="text-white">Deploy:</strong> Select a card (Click) and play it to a Lane (Click).
                                    Cards cost Energy to play.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-sm h-fit">3</span>
                                <div>
                                    <strong className="text-white">Resolve:</strong> Click "End Turn". The opponent moves, cards reveal, and stats update.
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3: Card Stats */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Zap className="text-yellow-400" size={18} /> Runs (Attack)
                            </h4>
                            <p className="text-sm">
                                Adds to your total Lane Score. High Runs win the lane.
                            </p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Shield className="text-blue-400" size={18} /> Composure (Health)
                            </h4>
                            <p className="text-sm">
                                If an opponent's Pressure (Attack) exceeds your Composure, your card is
                                <span className="text-red-400 font-bold mx-1">Dismissed (Destroyed)</span>.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Lanes */}
                    <section>
                        <h3 className="text-xl font-bold text-purple-400 mb-2">Pitch Conditions</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <li className="border border-green-500/30 bg-green-500/10 p-3 rounded text-sm">
                                <strong className="text-green-300 block mb-1">Green Top</strong>
                                Pacers gain extra Pressure.
                            </li>
                            <li className="border border-amber-500/30 bg-amber-500/10 p-3 rounded text-sm">
                                <strong className="text-amber-300 block mb-1">Dust Bowl</strong>
                                Spinners are more effective here.
                            </li>
                            <li className="border border-gray-500/30 bg-gray-500/10 p-3 rounded text-sm">
                                <strong className="text-gray-300 block mb-1">Flat Track</strong>
                                Batters' paradise (High Scores).
                            </li>
                        </ul>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 bg-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors"
                    >
                        Start Playing
                    </button>
                </div>

            </div>
        </div>
    );
};
