import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, RotateCcw, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const FlashcardModal = ({ flashcards, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [stats, setStats] = useState({ mastered: 0, total: flashcards?.length || 0 });

    if (!flashcards || flashcards.length === 0) return null;

    const currentCard = flashcards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        }, 150);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
        >
            <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
            
            <div className="w-full max-w-2xl relative">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <BrainCircuit className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Neural Recall</h2>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Module_Retention_Protocol</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Synchronization</p>
                        <p className="text-sm font-black text-accent">{currentIndex + 1} / {flashcards.length}</p>
                    </div>
                </div>

                {/* The Card Container */}
                <div className="relative w-full aspect-[4/3] perspective-1000 group">
                    <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ 
                            type: 'spring', 
                            stiffness: 260, 
                            damping: 20, 
                            mass: 1 
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="w-full h-full relative cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full backface-hidden bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl">
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
                                <Zap className="w-3 h-3 text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Input Phrase</span>
                            </div>
                            <h3 className="text-3xl font-bold leading-tight text-white/90">
                                {currentCard.front}
                            </h3>
                            <div className="absolute bottom-12 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Click to Reveal</span>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div 
                            className="absolute inset-0 w-full h-full backface-hidden bg-accent/10 border-2 border-accent/30 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-accent/50">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Neural Insight</span>
                            </div>
                            <p className="text-xl font-medium leading-relaxed text-white">
                                {currentCard.back}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-12 px-4">
                    <button 
                        onClick={prevCard}
                        className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button 
                        onClick={onClose}
                        className="px-12 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
                    >
                        Terminate Recall
                    </button>

                    <button 
                        onClick={nextCard}
                        className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Simple icon for consistency
const ShieldCheck = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default FlashcardModal;
