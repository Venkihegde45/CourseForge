import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ChatBot({ course, selectedModule, selectedTopic, analysisLevel, isIntegrated = false, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage = selectedTopic 
        ? `Hello! I'm your AI tutor. I can help you understand "${selectedTopic.topicTitle}" or answer any questions about this topic. What would you like to know?`
        : selectedModule
        ? `Hello! I'm your AI tutor for "${selectedModule.moduleTitle}". Ask me anything about this module or related concepts.`
        : `Hello! I'm your AI tutor for "${course?.title}". I can help explain concepts, clarify doubts, and provide detailed explanations. What would you like to know?`;
      
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
    }
  }, [selectedTopic, selectedModule, course]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      // Build comprehensive context
      let context = `Course: ${course?.title}\n`;
      
      if (selectedModule) {
        context += `Current Module: ${selectedModule.title}\n`;
        if (selectedModule.description) {
          context += `Module Description: ${selectedModule.description}\n`;
        }
      }
      

      if (selectedTopic) {
        context += `Current Topic: ${selectedTopic.topicTitle}\n`;
        // Include topic content based on current analysis level
        const topicContent = selectedTopic[analysisLevel] || selectedTopic.beginner || '';
        if (topicContent) {
          context += `Topic Content (${analysisLevel} level): ${topicContent.substring(0, 1500)}...\n`;
        }
        if (selectedTopic.examples?.length > 0) {
          context += `Topic Examples: ${selectedTopic.examples.join('; ')}\n`;
        }
        if (selectedTopic.analogies?.length > 0) {
          context += `Topic Analogies: ${selectedTopic.analogies.join('; ')}\n`;
        }
        if (selectedTopic.summary) {
          context += `Topic Summary: ${selectedTopic.summary}\n`;
        }
      }

      context += `Current Analysis Level: ${analysisLevel}\n`;

      // Generate AI response
      const response = await generateAIResponse(userMessage, context);

      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (userMessage, context) => {
    try {
      // Try to use OpenAI API if available via backend
      const response = await axios.post(`${API_URL}/api/tutor/chat`, {
        courseId: course._id,
        message: userMessage,
        context: context,
        currentLevel: analysisLevel
      });
      return response.data.response;
    } catch (error) {
      console.log('AI API not available, using enhanced fallback');
    }

    // Enhanced context-aware responses
    const lowerMessage = userMessage.toLowerCase();
    const currentContent = selectedTopic;
    const content = currentContent?.[analysisLevel] || currentContent?.beginner || '';

    // Extract topic name for personalized responses
    const topicName = selectedTopic?.topicTitle || selectedModule?.moduleTitle || 'this topic';

    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does') || lowerMessage.includes('tell me about')) {
      if (currentContent && content) {
        // Extract relevant part based on question
        let explanation = content;
        
        // If asking about specific term, try to find it in content
        const words = userMessage.split(/\s+/);
        const keyTerms = words.filter(w => w.length > 4 && !['what', 'is', 'the', 'this', 'that', 'explain', 'tell', 'about', 'how', 'does'].includes(w.toLowerCase()));
        
        if (keyTerms.length > 0 && content.includes(keyTerms[0])) {
          // Find relevant section
          const termIndex = content.toLowerCase().indexOf(keyTerms[0].toLowerCase());
          if (termIndex > -1) {
            const start = Math.max(0, termIndex - 200);
            const end = Math.min(content.length, termIndex + 500);
            explanation = content.substring(start, end);
          }
        }

        return `Based on the ${analysisLevel} level explanation of "${topicName}":\n\n${explanation.substring(0, 800)}${explanation.length > 800 ? '...' : ''}\n\n${selectedTopic?.examples?.length > 0 ? `\nHere's a practical example:\n${selectedTopic.examples[0]}` : ''}\n\nWould you like me to:\n• Explain any specific part in more detail?\n• Provide more examples?\n• Clarify any confusing concepts?`;
      }
      return `I can help explain "${topicName}"! ${selectedTopic || selectedLesson ? 'Based on the current content, ' : ''}I can provide detailed explanations. What specific aspect would you like me to explain?`;
    }

    if (lowerMessage.includes('example') || lowerMessage.includes('show me') || lowerMessage.includes('demonstrate')) {
      const examples = selectedTopic?.examples || selectedLesson?.examples || [];
      if (examples.length > 0) {
        return `Here are practical examples related to "${topicName}":\n\n${examples.map((ex, i) => `📌 Example ${i + 1}:\n${ex}\n`).join('\n')}\n\nWould you like me to explain any of these examples in more detail, or provide additional examples?`;
      }
      return `I can provide examples for "${topicName}". ${content ? `Based on the content, here's a practical scenario:\n\n[Example based on the concept]` : 'Please select a topic or lesson first to get specific examples.'}`;
    }

    if (lowerMessage.includes('analogy') || lowerMessage.includes('like') || lowerMessage.includes('similar to')) {
      const analogies = selectedTopic?.analogies || selectedLesson?.analogies || [];
      if (analogies.length > 0) {
        return `Here are helpful analogies to understand "${topicName}":\n\n${analogies.map((an, i) => `💡 Analogy ${i + 1}:\n${an}\n`).join('\n')}\n\nThese analogies help make complex concepts easier to understand. Would you like another analogy or clarification?`;
      }
      return `I can provide analogies to help you understand "${topicName}" better. ${content ? 'Think of it like... [analogy based on content]' : 'Please select a topic first.'}`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('key points') || lowerMessage.includes('main points')) {
      const summary = selectedTopic?.summary || selectedLesson?.summary || '';
      if (summary) {
        return `📝 Summary of "${topicName}":\n\n${summary}\n\n${selectedTopic ? 'These are the key takeaways from this topic.' : 'These are the main points from this lesson.'}\n\nWould you like me to expand on any of these points?`;
      }
      if (content) {
        // Generate a summary from content
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const keyPoints = sentences.slice(0, 3).join('. ') + '.';
        return `📝 Key Points:\n\n${keyPoints}\n\nThese are the main concepts covered. Would you like more details on any specific point?`;
      }
      return `I can provide a summary. Please select a topic or lesson first.`;
    }

    if (lowerMessage.includes('difference') || lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('versus')) {
      return `I can help you compare and understand differences! ${currentContent ? `In the context of "${topicName}", ` : ''}Could you specify which concepts or topics you'd like me to compare? For example:\n• "What's the difference between X and Y?"\n• "Compare beginner vs expert approach"\n• "How does this differ from [concept]?"`;
    }

    if (lowerMessage.includes('when') || lowerMessage.includes('use case') || lowerMessage.includes('application') || lowerMessage.includes('where')) {
      return `Great question about real-world applications! ${currentContent ? `Regarding "${topicName}", ` : ''}This concept is commonly used in:\n\n• [Real-world scenario 1]\n• [Real-world scenario 2]\n• [Real-world scenario 3]\n\n${content ? `Based on the content, here's a practical use case:\n${content.substring(0, 300)}...` : ''}\n\nWould you like me to explain specific use cases in more detail?`;
    }

    if (lowerMessage.includes('why') || lowerMessage.includes('reason')) {
      return `Great question! ${currentContent ? `Regarding "${topicName}", ` : ''}Here's why this is important:\n\n${content ? content.substring(0, 400) + '...' : 'This concept is important because...'}\n\nWould you like me to explain the reasoning in more detail?`;
    }

    if (lowerMessage.includes('how to') || lowerMessage.includes('steps') || lowerMessage.includes('process')) {
      return `I can guide you through the process! ${currentContent ? `For "${topicName}", ` : ''}Here's how:\n\n${content ? `1. [Step based on content]\n2. [Step based on content]\n3. [Step based on content]` : '1. [Step 1]\n2. [Step 2]\n3. [Step 3]'}\n\nWould you like detailed explanation of any step?`;
    }

    // Context-aware general response
    if (currentContent && content) {
      return `I understand you're asking about "${userMessage}". ${selectedTopic ? `Based on "${topicName}" (${analysisLevel} level), ` : `Based on the current lesson, `}let me help clarify:\n\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}\n\nIs there a specific aspect you'd like me to explain in more detail? I can also:\n• Provide examples\n• Give analogies\n• Explain the summary\n• Compare with other concepts`;
    }

    // Default helpful response
    return `I'm here to help you understand "${userMessage}"! ${currentContent ? `Based on "${topicName}", ` : ''}I can:\n\n• Explain concepts in detail\n• Provide examples and analogies\n• Summarize key points\n• Answer specific questions\n• Compare different concepts\n• Explain use cases and applications\n\nWhat would you like to know more about?`;
  };

  if (isIntegrated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/80 backdrop-blur-sm rounded-2xl border-2 border-dark-border overflow-hidden"
      >
        {/* Header */}
        <div
          className="p-4 bg-gradient-to-r from-neon-red/20 to-pink-500/20 border-b border-dark-border cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-red rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Tutor</h3>
                <p className="text-xs text-gray-400">Ask questions about {selectedTopic?.topicTitle || selectedModule?.moduleTitle || 'the course'}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronUp className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-dark-bg/50">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white'
                          : 'bg-dark-border text-gray-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-dark-border rounded-2xl p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-neon-red" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-dark-border bg-dark-card/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${selectedTopic?.topicTitle || selectedModule?.moduleTitle || 'the course'}...`}
                    className="flex-1 px-4 py-3 rounded-lg bg-dark-border border border-dark-border focus:border-neon-red focus:outline-none text-white placeholder-gray-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-3 bg-gradient-to-r from-neon-red to-pink-500 rounded-lg hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 Ask questions, request examples, or get clarifications
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Original sidebar version (for backward compatibility)
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-0 top-0 h-screen w-96 bg-dark-card border-l border-dark-border flex flex-col shadow-2xl z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-border bg-gradient-to-r from-neon-red/20 to-pink-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-red rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Tutor</h3>
              <p className="text-xs text-gray-400">Ask me anything</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-border rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white'
                  : 'bg-dark-border text-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-border rounded-2xl p-4">
              <Loader2 className="w-5 h-5 animate-spin text-neon-red" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-dark-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 rounded-lg bg-dark-border border border-dark-border focus:border-neon-red focus:outline-none text-white placeholder-gray-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-gradient-to-r from-neon-red to-pink-500 rounded-lg hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Ask about concepts, examples, or get clarifications
        </p>
      </form>
    </motion.div>
  );
}

export default ChatBot;
