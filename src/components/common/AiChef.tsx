import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, ChefHat } from 'lucide-react';
// import { getMenuRecommendation } from '../../services/geminiService';
import { ChatMessage } from '../../types';

const AiChef: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Bingung mau makan apa hari ini? Saya bisa bantu rekomendasikan menu yang cocok untuk Anda! 😊' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // const responseText = await getMenuRecommendation(userText);
      const responseText = "Maaf, fitur Chef Assistant sedang dalam perbaikan.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Maaf, ada masalah koneksi. Coba lagi nanti ya." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end font-sans">

      {/* Chat Window */}
      <div className={`
        bg-white rounded-2xl shadow-2xl w-[320px] sm:w-[380px] overflow-hidden transition-all duration-300 origin-bottom-right mb-4 border border-gray-200
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0 mb-0'}
      `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-red to-red-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <ChefHat className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Chef Virtual</h3>
              <p className="text-red-100 text-xs">Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-brand-red text-white rounded-tr-none'
                  : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-xs flex items-center gap-2">
                <Sparkles size={14} className="animate-spin text-brand-yellow" />
                Sedang berpikir...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Lagi pengen makan apa?..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/50 text-gray-700"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-brand-red text-white p-2 rounded-full hover:bg-red-800 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          bg-brand-yellow text-brand-dark font-bold rounded-full p-4 shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group
          ${isOpen ? 'rotate-90 opacity-0 pointer-events-none absolute' : 'rotate-0 opacity-100'}
        `}
      >
        <span className="bg-white text-xs font-bold px-2 py-1 rounded-lg absolute -top-2 right-0 shadow-sm w-max group-hover:-translate-y-1 transition-transform">Tanya Chef!</span>
        <MessageSquare size={28} />
      </button>
    </div>
  );
};

export default AiChef;
