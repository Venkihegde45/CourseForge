import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileUp, Camera, CheckCircle2, AlertCircle, BrainCircuit } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlassCard from '../ui/GlassCard';

const InputMethods = ({ activeTab, setActiveTab, level, setLevel, onForge }) => {
    const tabs = [
        { id: 'search', label: 'Topic Search', icon: <Search className="w-5 h-5" />, desc: 'Simple text input' },
        { id: 'pdf', label: 'PDF Upload', icon: <FileUp className="w-5 h-5" />, desc: 'Deep-scan docs' },
        { id: 'url', label: 'Link / YouTube', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Analyze web content' }
    ];

    const levels = [
        { id: 'starter', label: 'Starter', desc: 'Analogies & Basics' },
        { id: 'intermediate', label: 'Intermediate', desc: 'Practical Application' },
        { id: 'advanced', label: 'Advanced', desc: 'Technical Rigor' }
    ];

    const [topic, setTopic] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [file, setFile] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleForge = () => {
        if (activeTab === 'search') onForge({ type: 'text', value: topic });
        else if (activeTab === 'pdf') onForge({ type: 'file', value: file });
        else if (activeTab === 'url') onForge({ type: 'url', value: url });
    };

    return (
        <div className="space-y-8">
            {/* Tab Selection */}
            <div className="flex flex-wrap gap-4 justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300",
                            activeTab === tab.id
                                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                        )}
                    >
                        {tab.icon}
                        <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter a topic (e.g., Quantum Physics, Baking sourdough...)"
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10 font-medium"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="h-8 w-[1px] bg-white/10 mr-2" />
                                    <button
                                        onClick={handleForge}
                                        className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary transition-all hover:text-white"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'pdf' && (
                        <motion.div
                            key="pdf"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-2xl relative">
                                <FileUp className="w-8 h-8 text-primary" />
                                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <div className="text-center relative z-10">
                                <p className="text-xl font-black tracking-tighter mb-1">
                                    {file ? file.name : 'Drag & Drop PDF'}
                                </p>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Deep-scanning for technical documents'}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'url' && (
                        <motion.div
                            key="url"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube link or Doc URL (e.g., https://...)"
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10 font-medium"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="h-8 w-[1px] bg-white/10 mr-2" />
                                    <button
                                        onClick={handleForge}
                                        className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary transition-all hover:text-white"
                                    >
                                        <BrainCircuit className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Neural Connector Bridge */}
                <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 w-[1px] h-10 bg-gradient-to-b from-primary/50 to-primary/0 hidden md:block">
                    <motion.div
                        className="w-2 h-2 rounded-full bg-primary blur-[4px] absolute top-0 -left-[3.5px]"
                        animate={{ top: ['0%', '100%'], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>

            {/* Level Selection */}
            <div className="space-y-4 pt-10 border-t border-white/5 relative">
                <div className="flex flex-col items-center gap-1 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Computation Phase II</p>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20">Learning Intensity Engine</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map((lvl) => (
                        <button
                            key={lvl.id}
                            onClick={() => setLevel(lvl.id)}
                            className={cn(
                                "p-5 rounded-2xl border text-left transition-all duration-500 relative group overflow-hidden",
                                level === lvl.id
                                    ? "bg-primary/10 border-primary shadow-[0_10px_30px_rgba(124,58,237,0.15)] scale-[1.02]"
                                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white/40"
                            )}
                        >
                            {level === lvl.id && (
                                <motion.div
                                    layoutId="level-glow"
                                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"
                                />
                            )}
                            <div className="flex items-center justify-between mb-2 relative z-10">
                                <span className={cn(
                                    "font-black text-[10px] uppercase tracking-widest",
                                    level === lvl.id ? "text-white" : "text-white/40"
                                )}>
                                    {lvl.label}
                                </span>
                                {level === lvl.id ? (
                                    <CheckCircle2 className="w-3 h-3 text-primary animate-pulse" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full border border-white/20" />
                                )}
                            </div>
                            <p className={cn(
                                "text-xs font-medium relative z-10 transition-colors",
                                level === lvl.id ? "text-white/60" : "text-white/10"
                            )}>
                                {lvl.desc}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleForge}
                disabled={(activeTab === 'pdf' && !file) || (activeTab === 'url' && !url) || (activeTab === 'search' && !topic)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <BrainCircuit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Forge Knowledge Path
            </button>
        </div>
    );
};

export default InputMethods;
