"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ConciergeBell, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

type BookingResult = {
  success: boolean;
  reservation?: {
    name: string;
    date: string;
    time: string;
    party_size: number;
    special_requests?: string;
  };
  error?: string;
};

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const initialMessages: UIMessage[] = [
    {
      id: "initial",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Welcome to Redz! I'm Henry, your personal concierge. How can I assist you with reservations or menu questions today?"
        }
      ]
    }
  ];

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: initialMessages
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : 'flex'}`}>
        <motion.div
          className="absolute inset-0 bg-redz-accent rounded-full animate-ping opacity-20"
          style={{ animationDuration: "3s" }}
        />

        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-redz-accent text-redz-charcoal shadow-[0_0_20px_rgba(158,0,0,0.6)] flex items-center justify-center hover:bg-white transition-colors duration-300 group cursor-pointer"
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
            <header className="bg-redz-charcoal-light p-4 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center gap-2">
                <ConciergeBell className="text-redz-accent" size={20} />
                <h3 className="font-serif font-bold text-white">Henry <span className="text-redz-accent text-xs tracking-widest uppercase ml-1 opacity-80">AI</span></h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-redz-charcoal/50">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {msg.parts.map((part, partIndex) => {
                    if (part.type === "text" && part.text) {
                      return (
                        <div key={`${msg.id}-${partIndex}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-redz-accent text-redz-charcoal rounded-tr-sm font-medium'
                              : 'bg-redz-charcoal-light border border-gray-800 text-gray-200 rounded-tl-sm'
                          }`}>
                            {part.text}
                          </div>
                        </div>
                      );
                    }

                    if (part.type === "tool-book_reservation") {
                      const toolKey = `${msg.id}-${partIndex}`;

                      if (part.state === "input-streaming" || part.state === "input-available") {
                        return (
                          <div key={toolKey} className="flex justify-start my-2 w-full">
                            <div className="bg-redz-charcoal-light border border-gray-800 rounded-2xl p-4 flex items-center gap-3 max-w-[85%]">
                              <RefreshCw className="w-4 h-4 text-redz-accent animate-spin" />
                              <span className="text-xs text-gray-300">Henry is reserving your table...</span>
                            </div>
                          </div>
                        );
                      }

                      if (part.state === "output-available") {
                        const result = part.output as BookingResult;
                        if (result.success && result.reservation) {
                          const { reservation } = result;
                          return (
                            <div key={toolKey} className="flex justify-start my-2 w-full">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-950/30 border border-green-800/40 rounded-2xl p-4 max-w-[85%] shadow-lg w-full"
                              >
                                <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-3">
                                  <CheckCircle2 size={16} />
                                  <span>Reservation Request Received</span>
                                </div>
                                <div className="text-xs text-gray-300 space-y-1.5 border-t border-green-800/20 pt-2">
                                  <p><span className="text-gray-500">Guest:</span> <strong className="text-white">{reservation.name}</strong></p>
                                  <p><span className="text-gray-500">Date:</span> <strong className="text-white">{reservation.date}</strong></p>
                                  <p><span className="text-gray-500">Time:</span> <strong className="text-white">{reservation.time}</strong></p>
                                  <p><span className="text-gray-500">Party:</span> <strong className="text-white">{reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}</strong></p>
                                  {reservation.special_requests && (
                                    <p className="whitespace-normal bg-black/20 p-2 rounded mt-1 border border-white/5 text-gray-400">
                                      <span className="text-gray-500 block mb-0.5">Notes:</span>
                                      {reservation.special_requests}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            </div>
                          );
                        }

                        return (
                          <div key={toolKey} className="flex justify-start my-2">
                            <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-4 text-xs text-red-400 max-w-[85%]">
                              <p className="font-bold flex items-center gap-1.5 mb-1 text-red-300">
                                <AlertCircle size={14} />
                                <span>Booking Failed</span>
                              </p>
                              <p className="leading-relaxed">{result.error || "Unable to confirm table. Please call 856-380-6045."}</p>
                            </div>
                          </div>
                        );
                      }

                      if (part.state === "output-error") {
                        return (
                          <div key={toolKey} className="flex justify-start my-2">
                            <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-4 text-xs text-red-400 max-w-[85%]">
                              <p className="font-bold flex items-center gap-1.5 mb-1 text-red-300">
                                <AlertCircle size={14} />
                                <span>Booking Failed</span>
                              </p>
                              <p className="leading-relaxed">{part.errorText || "Unable to confirm table. Please call 856-380-6045."}</p>
                            </div>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-redz-charcoal-light border border-gray-800 rounded-tl-sm flex gap-1 items-center h-10">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center my-2">
                  <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-lg text-center max-w-[90%]">
                    Henry is currently offline. Please try again later or call 856-380-6045.
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-redz-charcoal border-t border-redz-charcoal-light">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Henry..."
                  className="w-full bg-redz-charcoal-light border border-gray-800 text-white text-sm rounded-full pl-4 pr-10 py-3 focus:outline-none focus:border-redz-accent focus:ring-1 focus:ring-redz-accent transition-all"
                />
                <button
                  type="submit"
                  disabled={!input?.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-redz-accent text-redz-charcoal rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
                >
                  <Send size={14} className="-ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
