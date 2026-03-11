import { useCallback, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';

function UploadBox({ file, onFileSelect, isDragging, setIsDragging, fileInputRef }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [7.5, -7.5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7.5, 7.5]);

  const handleMouseMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / (rect.width / 2));
    y.set((event.clientY - centerY) / (rect.height / 2));
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect, setIsDragging]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect, fileInputRef]);

  return (
    <motion.div
      className="relative"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-12 md:p-16 bg-dark-card backdrop-blur-sm transition-all duration-300 ${
          isDragging ? 'border-neon-red bg-opacity-80' : 'border-dark-border'
        } ${file ? 'border-neon-red' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
        animate={{
          boxShadow: isDragging || file
            ? '0 0 30px rgba(255, 0, 110, 0.4)'
            : '0 0 0px rgba(255, 0, 110, 0)'
        }}
      >
        {file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <File className="w-16 h-16 text-neon-red" />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-red flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-white font-medium text-lg">{file.name}</p>
            <p className="text-gray-400 text-sm">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2 text-sm text-neon-red border border-neon-red rounded-lg hover:bg-neon-red hover:text-white transition-colors"
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Upload className="w-16 h-16 text-gray-400" />
            </motion.div>
            <div className="text-center">
              <p className="text-white text-xl font-semibold mb-2">
                Drag & Drop your file here
              </p>
              <p className="text-gray-400 text-sm mb-4">or</p>
              <p className="text-neon-red font-medium">Click to browse</p>
              <p className="text-gray-500 text-xs mt-4">
                Supports: PDF, Images (JPEG, PNG), Word docs, Text files, Audio, Video
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
        />
      </motion.div>

      {/* Glow effect */}
      {(isDragging || file) && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-neon-red opacity-20 blur-3xl -z-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}

export default UploadBox;

