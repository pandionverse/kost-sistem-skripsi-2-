import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Rocket, Sparkles, Bot } from 'lucide-react';
import api from '../api/axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm KostBot AI. I know everything about kosts around Unklab. \n\nAsk me about price, location, or availability!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: input });
            const botMsg = { text: res.data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Connection error. Please try again.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group ring-4 ring-white/20"
                >
                    <Bot size={28} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[400px] overflow-hidden border border-gray-100 flex flex-col h-[600px] transition-all animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white shadow-md mr-3">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">KostBot AI</h3>
                                <p className="text-xs text-green-500 font-medium flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Gemini Pro Connected
                                </p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-5 overflow-y-auto bg-gray-50/50 space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex-shrink-0 flex items-center justify-center text-white mr-2 mt-1">
                                        <Bot size={14} />
                                    </div>
                                )}
                                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-black text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                    }`}>
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex-shrink-0 flex items-center justify-center text-white mr-2">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-gray-100 border-0 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-medium"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-black text-white p-3 rounded-full hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
