import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, GraduationCap, ArrowRight, X, Clock } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

const CommandPalette = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const { courses, selectCourse } = useCourse();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
        }
    }, [isOpen]);

    const filteredCourses = query.trim() === ''
        ? courses.slice(0, 3)
        : courses.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

    const handleSelect = (course) => {
        selectCourse(course.id);
        navigate(`/player/${course.id}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#050511]/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative w-full max-w-2xl bg-[#0A0A1F] border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    <div className="flex items-center px-8 py-6 border-b border-white/5 gap-4">
                        <Search className="w-6 h-6 text-primary" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search forged paths, modules, or validation tests..."
                            className="flex-1 bg-transparent border-none outline-none text-lg text-white/80 placeholder:text-white/20 font-light"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-black text-white/20 border border-white/5">ESC</span>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-white/20" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">
                            {query ? 'Search Results' : 'Recent Synchronizations'}
                        </div>

                        <div className="space-y-1">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => handleSelect(course)}
                                        className="w-full text-left p-6 hover:bg-white/[0.03] rounded-2xl transition-all group flex items-center justify-between border border-transparent hover:border-white/5"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                                <BookOpen className="w-6 h-6 text-white/20 group-hover:text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white/80 group-hover:text-white">{course.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                    <span>{course.level || 'Mastery'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span>{course.progress || 0}% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                    </button>
                                ))
                            ) : (
                                <div className="p-12 text-center opacity-20">
                                    <Clock className="w-10 h-10 mb-4 mx-auto" />
                                    <p className="text-xs font-black uppercase tracking-widest">No neural matches found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/5 rounded-md border border-white/5"><Search className="w-3 h-3 text-white/40" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Navigate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/5 rounded-md border border-white/5"><ArrowRight className="w-3 h-3 text-white/40 rotate-90" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Select</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                            Neural Intelligence Active
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CommandPalette;
