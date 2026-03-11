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
    Cpu
} from 'lucide-react';
import { useCourse } from '../lib/CourseContext';
import { cn } from '../lib/utils';
import Navbar from '../components/layout/Navbar';
import ContentStage from '../components/player/ContentStage';
import NovaChat from '../components/player/NovaChat';

const PlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentCourse, activeModuleIndex, updateProgress } = useCourse();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNovaOpen, setIsNovaOpen] = useState(true);
    const [difficulty, setDifficulty] = useState('starter'); // starter, intermediate, advanced

    useEffect(() => {
        if (!currentCourse) {
            // For development, we'll use fallback data if context is empty
        }
    }, [currentCourse, navigate]);

    // Mock data for initial development if context is empty
    const course = currentCourse || {
        title: "Quantum Computing: First Principles",
        modules: [
            {
                id: 'm1',
                title: 'The Quantum Worldview',
                type: 'theory',
                completed: true,
                content: { text: "# Quantum Worldview\nWelcome to the universe of probabilities. In this module, we explore how the subatomic world defies classical logic.\n\nKey Concepts:\n- Wave-particle duality\n- Probability vs Determinism" }
            },
            {
                id: 'm2',
                title: 'Superposition & Qubits',
                type: 'video',
                completed: false,
                content: { videoUrl: 'https://www.youtube.com/watch?v=lypnkNm0B4A' }
            },
            {
                id: 'm3',
                title: 'Quantum Gates Masterclass',
                type: 'interactive',
                completed: false,
                content: { diagram: 'graph LR\n  H[Hadamard] --> S[Superposition]\n  X[Pauli-X] --> F[Bit Flip]' }
            },
            {
                id: 'm4',
                title: 'Algorithm Synthesis',
                type: 'theory',
                completed: false,
                content: { text: "Once you master the gates, the algorithms follow. Shor's algorithm and Grover's search are the pillars of quantum speedup." }
            },
        ]
    };

    const activeModule = course.modules[activeModuleIndex] || course.modules[0];

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
                    <div className="h-4 w-[1px] bg-white/10" />
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div>
                        <h1 className="text-sm font-black tracking-tight uppercase">{course.title}</h1>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Module: {activeModule.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Difficulty Toggle */}
                    <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full p-1 self-center">
                        {['starter', 'intermediate', 'advanced'].map((lvl) => (
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
                    <div className="p-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6">Course Path</h3>
                        <div className="space-y-2">
                            {course.modules.map((mod, idx) => (
                                <button
                                    key={mod.id}
                                    onClick={() => updateProgress(idx)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group relative overflow-hidden",
                                        activeModuleIndex === idx
                                            ? "bg-primary/10 border border-primary/20 text-white"
                                            : "hover:bg-white/5 text-white/40 border border-transparent"
                                    )}
                                >
                                    {activeModuleIndex === idx && (
                                        <motion.div
                                            layoutId="active-module-indicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                                        />
                                    )}
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                        mod.completed ? "bg-emerald-500/20 text-emerald-400" :
                                            activeModuleIndex === idx ? "bg-primary/20 text-primary" : "bg-white/5 text-white/20"
                                    )}>
                                        {mod.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold leading-tight">{mod.title}</p>
                                        <p className="text-[9px] uppercase tracking-widest opacity-40 mt-1">{mod.type}</p>
                                    </div>
                                </button>
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
                                    key={activeModuleIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="mb-12">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                                                Module {activeModuleIndex + 1}
                                            </span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <h2 className="text-5xl font-black mb-8 tracking-tighter leading-none">{activeModule.title}</h2>
                                    </div>

                                    <ContentStage activeModule={activeModule} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Module Navigation Footer */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-between">
                        <button
                            onClick={() => activeModuleIndex > 0 && updateProgress(activeModuleIndex - 1)}
                            disabled={activeModuleIndex === 0}
                            className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-20"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous Module
                        </button>
                        <div className="flex gap-2">
                            {[...Array(course.modules.length)].map((_, i) => (
                                <div key={i} className={cn(
                                    "h-1 rounded-full transition-all",
                                    i === activeModuleIndex ? "w-8 bg-primary" : "w-2 bg-white/10"
                                )} />
                            ))}
                        </div>
                        <button
                            onClick={() => activeModuleIndex < course.modules.length - 1 && updateProgress(activeModuleIndex + 1)}
                            disabled={activeModuleIndex === course.modules.length - 1}
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
