import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, Flame, Sparkles, Zap, BrainCircuit, ChevronRight, Timer } from 'lucide-react';
import KnowledgeGraph from '../../components/dashboard/KnowledgeGraph';
import CourseCard from '../../components/dashboard/CourseCard';
import CourseCarousel from '../../components/dashboard/CourseCarousel';
import { useCourse } from '../../lib/CourseContext';

const StatCard = ({ label, value, icon, sub, trend }) => (
    <div className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 hover:border-primary/20 transition-all group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tighter">{value}</span>
                    <span className="text-[10px] font-bold text-primary italic">{sub}</span>
                </div>
            </div>
            {trend && (
                <div className="ml-auto px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-[8px] font-black text-emerald-500">+{trend}%</span>
                </div>
            )}
        </div>
    </div>
);

const Overview = () => {
    const { courses, globalMemory } = useCourse();

    const activeCourses = courses.length > 0 ? courses.map(c => ({ ...c, progress: 0 })) : [
        {
            id: 'mock-1',
            title: "Advanced Quantum Computing",
            level: "Mastery",
            progress: 0,
            duration: "18 Hours Content",
            modules: new Array(5).fill({})
        },
        {
            id: 'mock-2',
            title: "Neural Network Architectures",
            level: "Expert",
            progress: 0,
            duration: "24 Hours Content",
            modules: new Array(8).fill({})
        },
        {
            id: 'mock-3',
            title: "React Design Patterns",
            level: "Intermediate",
            progress: 0,
            duration: "10 Hours Content",
            modules: new Array(6).fill({})
        }
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
            {/* Top Bar: Welcome & Streak */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Online</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">
                            Welcome back, <span className="text-gradient">{globalMemory?.userName || 'Explorer'}</span>
                        </h1>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500/20 flex items-center justify-center relative">
                        <Flame className="w-8 h-8 text-orange-500 fill-orange-500/30 animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-[#050511]">
                            <Sparkles className="w-2 h-2 text-orange-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Current Streak</p>
                        <p className="text-4xl font-black tracking-tighter text-orange-500">12 Days</p>
                    </div>
                </motion.div>
            </div>

            {/* Knowledge Topology Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <KnowledgeGraph />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            icon={<BrainCircuit className="w-5 h-5" />}
                            label="Courses"
                            value={courses.length}
                            trend="+2 this week"
                            description="Total Courses"
                        />
                        <StatCard
                            icon={<Timer className="w-5 h-5" />}
                            label="Time Spent"
                            value="12.4h"
                            trend="+15%"
                            description="Completed Lessons"
                        />
                        <StatCard
                            icon={<Zap className="w-5 h-5" />}
                            label="Total Score"
                            value="2,450"
                            trend="+450"
                            description="Quiz Score"
                        />
                    </div>
                </div>

                {/* Right Column: Achievements & Activities */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">View History</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: "Course Started", time: "2h ago", icon: <Trophy className="w-4 h-4 text-emerald-500" />, type: "success" },
                                { title: "Lesson Done", time: "5h ago", icon: <Sparkles className="w-4 h-4 text-primary" />, type: "info" },
                                { title: "Quiz Done", time: "1d ago", icon: <BookOpen className="w-4 h-4 text-white/40" />, type: "neutral" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group/item cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold tracking-tight">{item.title}</p>
                                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{item.time}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/5 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Learning Matrix */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter">Your Courses</h2>
                        <p className="text-sm text-white/20 font-bold uppercase tracking-[0.2em] mt-1">Continue your learning journey</p>
                    </div>
                    <button className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                        View All Courses
                    </button>
                </div>

                <div className="w-full">
                    <CourseCarousel courses={activeCourses} />
                </div>
            </section>
        </div>
    );
};

export default Overview;
