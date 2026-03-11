import React from 'react';
import TheoryRenderer from './TheoryRenderer';
import VideoRenderer from './VideoRenderer';
import DiagramRenderer from './DiagramRenderer';
import LabRenderer from './LabRenderer';
import { motion, AnimatePresence } from 'framer-motion';

const ContentStage = ({ activeModule }) => {
    if (!activeModule) return null;

    const renderContent = () => {
        switch (activeModule.type) {
            case 'theory':
                return <TheoryRenderer content={activeModule.content || { text: 'No content available.' }} />;
            case 'video':
                return <VideoRenderer content={activeModule.content || { videoUrl: '' }} />;
            case 'interactive':
                return <LabRenderer content={activeModule} />;
            case 'diagram':
                return <DiagramRenderer content={activeModule.content || { diagram: '' }} />;
            default:
                return (
                    <div className="p-12 text-center text-white/40 border border-dashed border-white/10 rounded-3xl">
                        Unsupported content type: {activeModule.type}
                    </div>
                );
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    );
};

export default ContentStage;
