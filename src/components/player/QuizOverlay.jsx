import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const QuizOverlay = ({ quizzes, onComplete, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    if (!quizzes || quizzes.length === 0) return null;

    const currentQuiz = quizzes[currentIndex];

    const handleAnswer = (optionIndex) => {
        if (showExplanation) return;
        setSelectedOption(optionIndex);
        setShowExplanation(true);
        if (optionIndex === currentQuiz.correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < quizzes.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl text-center max-w-2xl w-full"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black mb-4">Assessment Complete</h2>
                <p className="text-white/40 mb-8 font-light">
                    Protocol validation successful. Your neural synchronization is processing.
                </p>
                <div className="flex items-center justify-center gap-12 mb-12">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Accuracy</p>
                        <p className="text-4xl font-black text-primary">{Math.round((score / quizzes.length) * 100)}%</p>
                    </div>
                    <div className="w-px h-12 bg-white/5" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">XP Earned</p>
                        <p className="text-4xl font-black text-emerald-500">+{score * 20}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onComplete(score)}
                    className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-primary hover:text-white transition-all"
                >
                    Finalize Synchronization
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white">Neural Assessment</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30"> protocolo_mastery_v0.5</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-8 mb-12">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Question {currentIndex + 1} of {quizzes.length}</p>
                    <h3 className="text-xl font-bold leading-relaxed mb-8">
                        {currentQuiz.question}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {currentQuiz.options.map((opt, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleAnswer(i)}
                                disabled={showExplanation}
                                className={cn(
                                    "p-6 border rounded-xl text-left transition-all text-sm flex items-center justify-between group",
                                    showExplanation 
                                        ? i === currentQuiz.correct_answer 
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                            : selectedOption === i 
                                                ? "bg-red-500/10 border-red-500/50 text-red-400"
                                                : "bg-white/[0.02] border-white/5 opacity-40"
                                        : "bg-white/[0.02] border-white/5 hover:bg-primary/10 hover:border-primary/30"
                                )}
                            >
                                <span>{opt}</span>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                    showExplanation && i === currentQuiz.correct_answer ? "border-emerald-500 bg-emerald-500" : "border-white/10 group-hover:border-primary"
                                )}>
                                    {showExplanation && i === currentQuiz.correct_answer && <ShieldCheck className="w-3 h-3 text-white" />}
                                </div>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-8 pt-8 border-t border-white/5"
                            >
                                <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Nova Insight</p>
                                    <p className="text-sm text-white/70 leading-relaxed italic">
                                        "{currentQuiz.explanation}"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        {quizzes.map((_, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-500", 
                                    i === currentIndex ? "bg-primary w-6 shadow-[0_0_15px_rgba(124,58,237,0.8)]" : 
                                    i < currentIndex ? "bg-emerald-500" : "bg-white/10"
                                )} 
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Progression</span>
                </div>
                <button 
                    onClick={handleNext}
                    disabled={!showExplanation}
                    className="px-10 py-5 bg-primary text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-20 disabled:scale-100"
                >
                    {currentIndex < quizzes.length - 1 ? 'Next Question' : 'Finish Mastery'} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

export default QuizOverlay;
