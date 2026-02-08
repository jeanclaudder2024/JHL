import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { generateConciergeResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to JHL. I am your personal concierge. How may I assist you with our services today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    const responseText = await generateConciergeResponse(input, history);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 bg-jhl-black text-white p-4 shadow-2xl transition-all duration-300 hover:scale-105 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ borderRadius: '0' }} // Sharp edges for design
      >
        <Sparkles size={24} strokeWidth={1.5} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 border border-gray-100 flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-[120%]'}`}
        style={{ height: 'min(600px, 100vh)' }}
      >
        {/* Header */}
        <div className="bg-jhl-black text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} />
            <span className="font-serif tracking-wide text-sm">JHL CONCIERGE</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gray-200 text-black' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 text-xs text-gray-400 italic">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about our services..."
              className="flex-grow bg-transparent border-b border-gray-200 focus:border-black outline-none py-2 text-sm placeholder-gray-400"
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="text-black disabled:text-gray-300 hover:opacity-70"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
