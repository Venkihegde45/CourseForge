import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Download, X, Headphones, Sparkles } from 'lucide-react';
import { courseAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const ForgeCastPlayer = ({ isOpen, onClose, courseId, courseTitle }) => {
    const [podcast, setPodcast] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isOpen && courseId) {
            fetchPodcast();
        }
    }, [isOpen, courseId]);

    const fetchPodcast = async () => {
        try {
            setIsLoading(true);
            const data = await courseAPI.getPodcast(courseId);
            setPodcast(data);
        } catch (error) {
            console.error('Failed to fetch podcast:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setProgress(p);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="fixed bottom-0 left-0 right-0 z-[160] px-6 pb-6 pointer-events-none"
                >
                    <div className="max-w-4xl mx-auto bg-[#0A0A1F]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl pointer-events-auto overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                        
                        {isLoading ? (
                            <div className="flex items-center gap-6 py-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
                                    <Mic2 className="w-6 h-6 text-white/20" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-white/10 rounded-full animate-pulse" />
                                    <div className="h-3 w-32 bg-white/5 rounded-full animate-pulse" />
                                </div>
                                <X className="w-5 h-5 text-white/10 cursor-pointer" onClick={onClose} />
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <audio ref={audioRef} src={podcast.audio_url} onEnded={() => setIsPlaying(false)} />
                                
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    {/* Artwork / Icon */}
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-lg shadow-primary/20">
                                            <div className="w-full h-full bg-[#050511] rounded-2xl flex items-center justify-center">
                                                <Headphones className="w-8 h-8 text-primary" />
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary rounded-full text-[8px] font-black uppercase tracking-widest animate-bounce">AI Cast</div>
                                    </div>

                                    {/* Info & Controls */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-sm font-black tracking-tight text-white uppercase truncate pr-10">{courseTitle}</h4>
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">ForgeCast • Echo & Nova Dialogue</p>
                                            </div>
                                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                                                <X className="w-5 h-5 text-white/20" />
                                            </button>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-1 bg-white/5 rounded-full mb-6 relative group cursor-pointer overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Player Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button className="p-2 text-white/20 hover:text-white transition-all"><SkipBack className="w-5 h-5" /></button>
                                                <button 
                                                    onClick={togglePlay}
                                                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-white/10"
                                                >
                                                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-1" />}
                                                </button>
                                                <button className="p-2 text-white/20 hover:text-white transition-all"><SkipForward className="w-5 h-5" /></button>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:flex items-center gap-3 text-white/40">
                                                    <Volume2 className="w-4 h-4" />
                                                    <div className="w-20 h-1 bg-white/10 rounded-full" />
                                                </div>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Save Cast
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ForgeCastPlayer;
