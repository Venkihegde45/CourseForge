import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Zap, Sparkles, Award, Lightbulb, CheckCircle2, FlaskConical } from 'lucide-react';
import LabWorkshop from './LabWorkshop';
import { cn } from '../../lib/utils';

const ContentStage = ({ activeTopic, onStartQuiz }) => {
    const [mode, setMode] = useState('theory'); // 'theory' or 'workshop'
    const [level, setLevel] = useState('beginner'); // 'beginner', 'intermediate', 'expert'

    if (!activeTopic) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
             <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Synchronizing knowledge...</p>
        </div>
    );

    const contentKey = `${level}_content`;
    const textContent = activeTopic[contentKey] || activeTopic.beginner_content || 'Content not available for this level.';

    return (
        <div className="space-y-12 pb-24">
            {/* Mode & Difficulty Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
                    {[
                        { id: 'theory', label: 'Theory', icon: <Book className="w-3.5 h-3.5" /> },
                        { id: 'workshop', label: 'Workshop', icon: <FlaskConical className="w-3.5 h-3.5" /> }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                mode === m.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/30 hover:text-white/60"
                            )}
                        >
                            {m.icon}
                            {m.label}
                        </button>
                    ))}
                </div>

                {mode === 'theory' && (
                    <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
                        {['beginner', 'intermediate', 'expert'].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setLevel(lvl)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    level === lvl ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"
                                )}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {mode === 'theory' ? (
                    <motion.div
                        key="theory"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Core Content */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                            <div className="prose prose-invert max-w-none relative z-10">
                                <p className="text-xl md:text-2xl leading-relaxed font-medium text-white/90">
                                    {textContent}
                                </p>
                            </div>
                        </div>

                        {/* Examples & Analogies */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <Lightbulb className="w-5 h-5" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Practical Application</h4>
                                </div>
                                <div className="space-y-4">
                                    {activeTopic.examples?.map((ex, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-[10px] font-black text-primary">
                                                {i+1}
                                            </div>
                                            <p className="text-sm font-medium text-white/60">{ex}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                                <div className="flex items-center gap-3 text-accent">
                                    <Sparkles className="w-5 h-5" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Mental Models</h4>
                                </div>
                                <div className="space-y-4">
                                    {activeTopic.analogies?.map((an, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="bg-accent/20 w-1.5 h-1.5 rounded-full shrink-0" />
                                            <p className="text-sm font-medium text-white/60 italic">"{an}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary & Quiz Call */}
                        {activeTopic.summary && (
                            <div className="p-8 bg-gradient-to-br from-primary/5 to-transparent border border-white/5 rounded-[2.5rem] text-center">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-black mb-4">Core Synthesis</p>
                                <p className="text-sm text-white/40 leading-relaxed max-w-2xl mx-auto italic">
                                    "{activeTopic.summary}"
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">Mastery Assessment</p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Final Proof of Indexing</p>
                                </div>
                            </div>
                            <button 
                                onClick={onStartQuiz}
                                className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                START ASSESSMENT
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="workshop"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <LabWorkshop topicId={activeTopic.id} onComplete={onStartQuiz} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContentStage;
