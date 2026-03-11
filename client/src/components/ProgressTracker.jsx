import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProgressTracker({ progress, stage, status, error }) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'processing':
      case 'generating':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
    }
  };

  return (
    <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dark-border">
      <div className="flex items-center gap-4 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">Course Generation</h3>
          <p className={`text-sm ${getStatusColor()}`}>
            {stage || 'Processing...'}
          </p>
        </div>
        <span className="text-2xl font-bold text-neon-red">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-dark-border rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-red to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Status Steps */}
      <div className="mt-4 space-y-2 text-xs text-gray-400">
        <div className={`flex items-center gap-2 ${progress >= 10 ? 'text-green-400' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${progress >= 10 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>Content Extraction</span>
        </div>
        <div className={`flex items-center gap-2 ${progress >= 30 ? 'text-green-400' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${progress >= 30 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>AI Analysis</span>
        </div>
        <div className={`flex items-center gap-2 ${progress >= 80 ? 'text-green-400' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>Saving Course</span>
        </div>
        <div className={`flex items-center gap-2 ${progress >= 100 ? 'text-green-400' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}


