import React, { useState, useContext, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Utensils, Dumbbell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AICoach = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: `Hey ${user?.name || 'there'}! I'm your AI fitness coach. I can help you with personalized workout plans and nutrition advice based on your goal of "${user?.fitnessGoal || 'fitness'}". What would you like to work on today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 2. Call Backend API
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();

      // 3. Add AI Response
      const aiMsg = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format newlines as <br>
  const FormatMessage = ({ content }) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24 text-white flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg text-black">
            <Zap size={24} />
          </div>
          AI Coach
        </h1>
        <p className="text-gray-400 mt-1">Your personal fitness & nutrition advisor</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => handleSend("Generate a workout plan for today")}
          className="flex items-center gap-2 bg-[#121212] border border-gray-700 px-4 py-2 rounded-full text-sm hover:border-primary hover:text-primary transition whitespace-nowrap"
        >
          <Dumbbell size={16} /> Generate Workout Plan
        </button>
        <button 
          onClick={() => handleSend("Suggest a meal plan for today")}
          className="flex items-center gap-2 bg-[#121212] border border-gray-700 px-4 py-2 rounded-full text-sm hover:border-primary hover:text-primary transition whitespace-nowrap"
        >
          <Utensils size={16} /> Generate Meal Plan
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-card border border-gray-800 rounded-2xl p-4 overflow-y-auto mb-4 custom-scrollbar" style={{ maxHeight: '60vh' }}>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                   <Bot size={16} className="text-black" />
                </div>
              )}

              <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-black font-medium rounded-tr-none' 
                  : 'bg-[#1e1e1e] text-gray-200 rounded-tl-none border border-gray-700'
              }`}>
                <FormatMessage content={msg.content} />
              </div>

              {msg.role === 'user' && (
                 <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                 </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                   <Bot size={16} className="text-black" />
               </div>
               <div className="bg-[#1e1e1e] p-4 rounded-2xl rounded-tl-none border border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <input 
          type="text" 
          className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 pr-12 text-white focus:border-primary focus:outline-none"
          placeholder="Ask me anything about fitness..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="absolute right-3 top-3 p-2 bg-primary rounded-lg text-black hover:opacity-90 disabled:opacity-50 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AICoach;