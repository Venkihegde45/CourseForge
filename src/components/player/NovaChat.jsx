import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, User, Cpu } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import { cn } from '../../lib/utils';

const NovaChat = () => {
    const { messages, addMessage, currentCourse, activeModuleIndex, globalMemory, updateGlobalMemory } = useCourse();
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMsg = inputValue;
        setInputValue('');
        addMessage({ role: 'user', text: userMsg });

        setIsThinking(true);

        // Check for preference keywords to update memory
        if (userMsg.toLowerCase().includes('call me')) {
            const name = userMsg.split('call me')[1].trim();
            updateGlobalMemory({ userName: name });
        }

        if (userMsg.toLowerCase().includes('prefer')) {
            const pref = userMsg.split('prefer')[1].trim();
            updateGlobalMemory({ preferences: [...new Set([...globalMemory.preferences, pref])] });
        }

        setTimeout(() => {
            setIsThinking(false);
            const activeModule = currentCourse?.modules[activeModuleIndex];

            let greeting = globalMemory.userName ? `Agent ${globalMemory.userName}` : 'Agent';
            let context = globalMemory.preferences.length > 0
                ? ` I've tailored this synthesis considering your preference for ${globalMemory.preferences[0]}.`
                : '';

            addMessage({
                role: 'assistant',
                text: `Acknowledged, ${greeting}.${context} Regarding "${activeModule?.title}", here is the neural synthesis... [Gemini Integration Pending]`
            });
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full relative z-10">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "flex gap-3",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                            msg.role === 'assistant'
                                ? "bg-primary/20 border-primary/30 text-primary"
                                : "bg-white/5 border-white/10 text-white/40"
                        )}>
                            {msg.role === 'assistant' ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        <div className={cn(
                            "max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed",
                            msg.role === 'assistant'
                                ? "bg-white/5 border border-white/10 text-white/70 rounded-tl-none"
                                : "bg-primary/10 border border-primary/20 text-white rounded-tr-none"
                        )}>
                            {msg.text}
                            <div className="mt-2 text-[8px] font-black uppercase tracking-widest opacity-20">
                                {msg.time}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
                            <Cpu className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 flex gap-1">
                            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/20 transition-all rounded-2xl" />
                    <div className="relative flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 group-focus-within:border-primary/50 transition-all">
                        <input
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-3 placeholder:text-white/20"
                            placeholder="Ask Nova anything..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isThinking}
                            className={cn(
                                "p-3 bg-primary text-white rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100",
                                isThinking && "animate-pulse"
                            )}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 opacity-20">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Synapse Ready</span>
                </div>
            </div>
        </div>
    );
};

export default NovaChat;
