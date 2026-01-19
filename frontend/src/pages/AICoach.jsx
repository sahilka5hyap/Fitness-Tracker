import React, { useState, useContext, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Activity, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AICoach = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: `Hello ${user?.name || 'Champ'}! 👋\nI am your **AI Coach**. I see your goal is **${user?.fitnessGoal || 'General Fitness'}**.\n\nHow can I help you train today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // --- 🎙️ SPEECH TO TEXT LOGIC ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript); // Automatically send when voice stops
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
  }

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  // --- 🔊 TEXT TO SPEECH LOGIC ---
  const speakResponse = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any current speaking
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '')); 
    utterance.rate = 2.1; // Slightly faster for natural feel
    window.speechSynthesis.speak(utterance);
  };

  // --- 📩 MESSAGE HANDLING ---
  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      const aiMsg = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMsg]);
      
      // AI Voice feedback
      speakResponse(data.response);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "⚠️ **Connection Error.** Please check your internet or API key." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- ✨ MARKDOWN FORMATTER ---
  const FormatMessage = ({ content }) => {
    return content.split('\n').map((line, i) => {
      const isListItem = line.trim().startsWith('1.') || line.trim().startsWith('-') || line.trim().startsWith('*');
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className={`mb-1 ${isListItem ? 'pl-4 border-l-2 border-[#D4FF33]/20 my-1' : ''}`}>
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="text-[#D4FF33] font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={index}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] bg-[#050505] text-white overflow-hidden relative">
      <div className="absolute top-[-5%] left-[-5%] w-[250px] h-[250px] bg-[#D4FF33] rounded-full filter blur-[100px] opacity-10 pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md bg-black/40 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D4FF33] rounded-lg">
            <Bot size={20} className="text-black" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-tighter">AI Coach</h1>
        </div>
        <button 
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={`p-2 rounded-full transition-all ${isVoiceEnabled ? 'bg-[#D4FF33] text-black' : 'bg-gray-800 text-gray-500'}`}
        >
          {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
            {msg.role === 'ai' && <Sparkles size={16} className="text-[#D4FF33] mt-2" />}
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-[#D4FF33] text-black font-bold' : 'bg-[#111] border border-white/10 text-gray-200'
            }`}>
              <FormatMessage content={msg.content} />
            </div>
          </div>
        ))}
        {loading && <div className="ml-8 text-[#D4FF33] text-xs animate-pulse">Coach is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT CONTROLS */}
      <div className="p-4 bg-black/80 border-t border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleListening}
            className={`p-4 rounded-xl transition-all ${isListening ? 'bg-red-600 animate-pulse text-white' : 'bg-[#181818] text-[#D4FF33]'}`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <input 
            type="text" 
            className="flex-1 bg-[#0F0F0F] border border-white/10 rounded-xl p-4 text-white focus:border-[#D4FF33] outline-none transition-all"
            placeholder={isListening ? "I'm listening..." : "Ask your coach anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() && !loading}
            className="p-4 bg-[#D4FF33] text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Send size={22} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AICoach;