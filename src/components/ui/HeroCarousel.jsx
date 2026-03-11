import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Sparkles, Clock, BrainCircuit } from 'lucide-react';

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const slides = [
        {
            title: 'Quantum Computing 101',
            cat: 'Physics · Beginner',
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            color: "from-blue-500 to-cyan-400"
        },
        {
            title: 'Machine Learning A–Z',
            cat: 'AI · Intermediate',
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            color: "from-violet-500 to-fuchsia-500"
        },
        {
            title: 'React Design Patterns',
            cat: 'Dev · Advanced',
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
            color: "from-orange-400 to-rose-500"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative perspective-1000 w-full"
            style={{ perspective: '1200px' }}
        >
            {/* Background Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, Math.random() * -40 - 20, 0],
                            x: [0, (Math.random() - 0.5) * 40, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 rounded-full bg-primary/40 blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative h-[340px] rounded-[2.5rem] overflow-hidden bg-[#0A0A1F] border border-white/10 shadow-2xl transition-all duration-200 ease-out"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                    >
                        {/* Background Image */}
                        <img
                            src={slides[currentIndex].image}
                            alt={slides[currentIndex].title}
                            className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030309] via-[#030309]/60 to-transparent" />

                        {/* Content */}
                        <div
                            style={{ transform: "translateZ(80px)" }}
                            className="absolute inset-0 p-10 flex flex-col justify-end pointer-events-none"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 mb-4"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                    {slides[currentIndex].cat}
                                </span>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-black tracking-tighter mb-6 leading-tight"
                            >
                                {slides[currentIndex].title}
                            </motion.h3>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-8 mb-4 pointer-events-auto"
                            >
                                <div className="flex-1 max-w-[200px]">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">
                                        <span>Progress</span>
                                        <span className="text-primary">0%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                                        <div className={`h-full bg-gradient-to-r ${slides[currentIndex].color}`} style={{ width: '0%' }} />
                                    </div>
                                </div>
                                <button className="group/btn relative h-12 px-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all">
                                    Start <Play className="w-4 h-4 fill-current transition-transform group-hover/btn:scale-110" />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Floating Meta Details (Depth Effect) */}
                <div style={{ transform: "translateZ(120px)" }} className="absolute top-10 right-10 pointer-events-none">
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
                        <BrainCircuit className="w-4 h-4 text-violet-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Multi-Agent AI</span>
                    </div>
                </div>

                {/* Pagination (Depth Effect) */}
                <div style={{ transform: "translateZ(100px)" }} className="absolute bottom-10 right-10 flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default HeroCarousel;
