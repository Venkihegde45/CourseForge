import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    BookOpen,
    CheckCircle2,
    PlayCircle,
    MessageSquare,
    Settings,
    Layout,
    ArrowRight,
    Sparkles,
    Menu,
    X,
    Cpu,
    ChevronRight, // Added
    Clock, // Added
    Award, // Added
    Star, // Added
    Search, // Added
    Play, // Added
    Book, // Added
    BrainCircuit,
    Plus,
    FlaskConical,
    Mic2
} from 'lucide-react';
import { useCourse } from '../lib/CourseContext';
import { cn } from '../lib/utils';
import Navbar from '../components/layout/Navbar';
import ContentStage from '../components/player/ContentStage';
import NovaChat from '../components/player/NovaChat';
import QuizOverlay from '../components/player/QuizOverlay';
import FlashcardModal from '../components/player/FlashcardModal';
import MentorSidebar from '../components/player/MentorSidebar';
import ForgeCastPlayer from '../components/player/ForgeCastPlayer';
import { courseAPI } from '../lib/api';
import GlassCard from '../components/ui/GlassCard';

const PlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        currentCourse, 
        activeModuleIndex, 
        activeTopicIndex, 
        updateProgress, 
        fetchTopicContent,
        completeTopic
    } = useCourse();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNovaOpen, setIsNovaOpen] = useState(true);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
    const [isMentorOpen, setIsMentorOpen] = useState(false);
    const [isPodcastOpen, setIsPodcastOpen] = useState(false);
    const [difficulty, setDifficulty] = useState('beginner');
    const [isLoading, setIsLoading] = useState(false);

    const modules = currentCourse?.modules?.map(m => ({ ...m, topics: m.topics || m.lessons || [] })) || [];
    const activeModule = modules[activeModuleIndex] || { topics: [] };
    const activeTopic = activeModule.topics?.[activeTopicIndex];

    useEffect(() => {
        if (activeTopic && !activeTopic.beginner_content && !isLoading) {
            const loadContent = async () => {
                setIsLoading(true);
                try {
                    await fetchTopicContent(activeTopic.id);
                } finally {
                    setIsLoading(false);
                }
            };
            loadContent();
        }
    }, [activeTopic, fetchTopicContent]);

    if (!currentCourse) return <div className="h-screen flex items-center justify-center">Loading Course...</div>;

    return (
        <div className="h-screen bg-[#050511] text-white flex flex-col font-display overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => setIsFlashcardsOpen(true)}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Flashcards
                    </button>
                    <button 
                        onClick={() => setIsPodcastOpen(true)}
                        className="px-3 py-1.5 bg-primary/20 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                    >
                        <Mic2 className="w-3 h-3" />
                        ForgeCast
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div>
                        <h1 className="text-sm font-black tracking-tight uppercase">{currentCourse.title}</h1>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Topic: {activeTopic?.title || 'Loading...'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Difficulty Toggle */}
                    <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full p-1 self-center">
                        {['beginner', 'intermediate', 'expert'].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setDifficulty(lvl)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    difficulty === lvl
                                        ? "bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                                        : "text-white/30 hover:text-white/60"
                                )}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050511] bg-primary/20 flex items-center justify-center overflow-hidden">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Council Active</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar: Course Navigation */}
                <motion.aside
                    initial={false}
                    animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                    className="border-r border-white/5 bg-white/[0.01] flex flex-col overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 font-mono">Curriculum_Map.v2</h3>
                        <div className="space-y-4">
                            {modules.map((mod, mIdx) => (
                                <div key={mod.id || `mod-${mIdx}`} className="space-y-2">
                                    <div className="px-2 py-1 flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Module {mIdx + 1}</p>
                                        <div className="h-px w-full bg-white/5 ml-4" />
                                    </div>
                                    <h4 className="px-2 text-xs font-black text-white/60 mb-2">{mod.title}</h4>
                                    <div className="space-y-1">
                                        {(mod.topics || []).map((topic, tIdx) => (
                                            <button
                                                key={topic.id || `topic-${mIdx}-${tIdx}`}
                                                onClick={() => updateProgress(mIdx, tIdx)}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all group",
                                                    activeModuleIndex === mIdx && activeTopicIndex === tIdx
                                                        ? "bg-primary/20 border border-primary/20 text-white"
                                                        : "hover:bg-white/5 text-white/30 border border-transparent"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black",
                                                    topic.completed ? "bg-emerald-500/20 text-emerald-400" :
                                                        (activeModuleIndex === mIdx && activeTopicIndex === tIdx) ? "bg-primary text-white" : "bg-white/5"
                                                )}>
                                                    {topic.completed ? <CheckCircle2 className="w-3 h-3" /> : tIdx + 1}
                                                </div>
                                                <span className="text-[11px] font-bold text-left leading-tight">{topic.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content Stage */}
                <main className="flex-1 flex flex-col relative overflow-hidden bg-black/20">
                    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />

                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        <div className="max-w-4xl mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeModuleIndex}-${activeTopicIndex}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Synthesizing topic content...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-12 text-center md:text-left">
                                                <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                                                        Module {activeModuleIndex + 1}: Topic {activeTopicIndex + 1}
                                                    </span>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                </div>
                                                <h2 className="text-5xl font-black mb-8 tracking-tighter leading-tight">{activeTopic?.title}</h2>
                                            </div>

                                            <ContentStage 
                                                activeTopic={activeTopic} 
                                                onStartQuiz={() => setIsQuizOpen(true)}
                                            />
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isQuizOpen && (
                            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                                    onClick={() => setIsQuizOpen(false)}
                                />
                                <QuizOverlay 
                                    quizzes={activeTopic?.quizzes || []}
                                    onComplete={async (score) => {
                                        await completeTopic(activeTopic.id);
                                        setIsQuizOpen(false);
                                    }}
                                    onClose={() => setIsQuizOpen(false)}
                                />
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Module Navigation Footer */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-between">
                        <button
                            onClick={() => {
                                if (activeTopicIndex > 0) {
                                    updateProgress(activeModuleIndex, activeTopicIndex - 1);
                                } else if (activeModuleIndex > 0) {
                                    const prevMod = currentCourse.modules[activeModuleIndex - 1];
                                    updateProgress(activeModuleIndex - 1, prevMod.topics.length - 1);
                                }
                            }}
                            disabled={activeModuleIndex === 0 && activeTopicIndex === 0}
                            className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-20"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <div className="flex gap-2"> {/* Modified: Added a div for the two buttons */}
                            <button 
                                onClick={() => setIsMentorOpen(true)}
                                className="flex-1 py-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary transition-all group"
                            >
                                <MessageSquare className="w-5 h-5 text-primary group-hover:text-white" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">AI Mentor</span>
                            </button>
                            <button
                                onClick={() => setIsFlashcardsOpen(true)} // Changed from setShowFlashcards to setIsFlashcardsOpen
                                className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                            >
                                <BrainCircuit className="w-6 h-6 text-white/40" />
                            </button>
                        </div>
                        <button
                            onClick={async () => {
                                if (activeTopic && !activeTopic.completed) {
                                    await completeTopic(activeTopic.id);
                                }

                                if (activeTopicIndex < (activeModule.topics || []).length - 1) {
                                    updateProgress(activeModuleIndex, activeTopicIndex + 1);
                                } else if (activeModuleIndex < modules.length - 1) {
                                    updateProgress(activeModuleIndex + 1, 0);
                                }
                            }}
                            disabled={activeModuleIndex === modules.length - 1 && activeTopicIndex === (activeModule.topics || []).length - 1}
                            className="px-6 py-3 bg-white text-black font-black rounded-xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all text-xs uppercase tracking-widest disabled:opacity-20"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </main>

                {/* Right Sidebar: Nova AI Tutor */}
                <motion.aside
                    initial={false}
                    animate={{ width: isNovaOpen ? 400 : 0, opacity: isNovaOpen ? 1 : 0 }}
                    className="border-l border-white/5 bg-white/[0.01] flex flex-col overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

                    <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center relative">
                                <Cpu className="w-5 h-5 text-primary" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050511] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black tracking-tight uppercase">Nova Tutor</h3>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">Ready to Assist</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <Settings className="w-4 h-4 text-white/20" />
                        </button>
                    </div>

                    <NovaChat />
                </motion.aside>

                {/* Floating Layout Controls */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-[#050511] border border-white/10 rounded-full p-2 shadow-2xl backdrop-blur-xl scale-90 md:scale-100">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={cn(
                            "p-3 rounded-full transition-all",
                            isSidebarOpen ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                        )}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button className="p-3 text-white/30 hover:text-white transition-all">
                        <Layout className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button
                        onClick={() => setIsNovaOpen(!isNovaOpen)}
                        className={cn(
                            "p-3 rounded-full transition-all",
                            isNovaOpen ? "bg-primary/20 text-primary" : "text-white/30 hover:text-white"
                        )}
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
