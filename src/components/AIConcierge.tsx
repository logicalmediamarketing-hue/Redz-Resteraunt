"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Phone, Volume2, VolumeX, ConciergeBell } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import dynamic from "next/dynamic";
const VoiceMode = dynamic(() => import("./VoiceMode"), { ssr: false });

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  
  // @ts-expect-error - ignore typing issues for AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    streamProtocol: 'text',
    initialMessages: [
      { id: "initial", role: "assistant", content: "Welcome to Redz! I'm Henry, your personal concierge. How can I assist you with reservations or menu questions today?" }
    ]
  } as any);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : 'flex'}`}>
        {/* Glowing ring animation - Slow and subtle */}
        <motion.div 
          className="absolute inset-0 bg-redz-accent rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-redz-accent text-redz-charcoal shadow-[0_0_20px_rgba(158,0,0,0.6)] flex items-center justify-center hover:bg-white transition-colors duration-300 group"
          aria-label="Open Henry AI Concierge"
        >
          <ConciergeBell size={28} className="group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-redz-charcoal border border-redz-charcoal-light rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {isVoiceModeActive ? (
              <VoiceMode 
                agentId={process.env.NEXT_PUBLIC_RETELL_AGENT_ID || ""} 
                onClose={() => setIsVoiceModeActive(false)} 
              />
            ) : (
              <>
                <header className="bg-redz-charcoal-light p-4 flex justify-between items-center border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <ConciergeBell className="text-redz-accent" size={20} />
                    <h3 className="font-serif font-bold text-white">Henry <span className="text-redz-accent text-xs tracking-widest uppercase ml-1 opacity-80">AI</span></h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-redz-charcoal/50">
                  {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-redz-accent text-redz-charcoal rounded-tr-sm' : 'bg-redz-charcoal-light border border-gray-800 text-gray-200 rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-2xl bg-redz-charcoal-light border border-gray-800 rounded-tl-sm flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex justify-center my-2">
                      <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-lg text-center max-w-[90%]">
                        Henry is currently offline. Please configure your OpenAI API keys to reconnect.
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-redz-charcoal border-t border-redz-charcoal-light">
                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVoiceModeActive(true)}
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-redz-charcoal-light border border-gray-800 text-gray-400 hover:text-redz-accent hover:border-redz-accent group"
                      aria-label="Call Henry"
                    >
                      <Phone size={18} className="group-hover:animate-pulse" />
                    </button>
                    
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask Henry..."
                        className="w-full bg-redz-charcoal-light border border-gray-800 text-white text-sm rounded-full pl-4 pr-10 py-3 focus:outline-none focus:border-redz-accent focus:ring-1 focus:ring-redz-accent transition-all"
                      />
                      <button 
                        type="submit"
                        disabled={!input?.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-redz-accent text-redz-charcoal rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                      >
                        <Send size={14} className="-ml-0.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
