"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { PhoneOff, MicOff, Mic } from "lucide-react";
import { RetellWebClient } from "retell-client-js-sdk";
import Image from "next/image";

interface VoiceModeProps {
  onClose: () => void;
}

export default function VoiceMode({ onClose }: VoiceModeProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const retellWebClientRef = useRef<RetellWebClient | null>(null);
  const isMountedRef = useRef(true);

  const startCall = async () => {
    try {
      // Get token from our secure backend (agent is configured server-side)
      const response = await fetch("/api/retell", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const data = await response.json();

      // The user may have closed the panel while the token fetch was in flight —
      // never open the microphone after unmount
      if (!isMountedRef.current) return;

      // Start WebRTC connection
      if (retellWebClientRef.current) {
        await retellWebClientRef.current.startCall({
          accessToken: data.accessToken,
        });
        if (!isMountedRef.current) {
          retellWebClientRef.current.stopCall();
        }
      }
    } catch (err) {
      console.error("Failed to start call:", err);
      if (isMountedRef.current) {
        setError("Voice calling is temporarily unavailable. Please use the chat instead, or call 856-380-6045.");
      }
    }
  };

  useEffect(() => {
    retellWebClientRef.current = new RetellWebClient();
    
    // Register event listeners
    retellWebClientRef.current.on("call_started", () => {
      setIsCalling(true);
      setError(null);
    });

    retellWebClientRef.current.on("call_ended", () => {
      setIsCalling(false);
      setIsAgentSpeaking(false);
      onClose();
    });

    retellWebClientRef.current.on("agent_start_talking", () => {
      setIsAgentSpeaking(true);
    });

    retellWebClientRef.current.on("agent_stop_talking", () => {
      setIsAgentSpeaking(false);
    });

    retellWebClientRef.current.on("error", (err: unknown) => {
      console.error("Retell error:", err);
      setError("An error occurred during the call.");
      setIsCalling(false);
    });

    // Start the call automatically when the component mounts
     
    startCall();

    return () => {
      isMountedRef.current = false;
      if (retellWebClientRef.current) {
        retellWebClientRef.current.stopCall();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endCall = () => {
    if (retellWebClientRef.current) {
      retellWebClientRef.current.stopCall();
    }
    onClose();
  };

  const toggleMute = () => {
    const client = retellWebClientRef.current;
    if (!client) return;
    if (isMuted) {
      client.unmute();
    } else {
      client.mute();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="absolute inset-0 bg-redz-charcoal z-50 flex flex-col items-center justify-between py-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Henry</h2>
        <p className="text-sm text-redz-accent uppercase tracking-widest">
          {error ? "Connection Failed" : isCalling ? "Connected" : "Connecting..."}
        </p>
      </div>

      {/* Animated Digital Avatar */}
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Audio Reactive Pulsing Rings */}
        {isCalling && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-redz-accent/30"
              animate={{ 
                scale: isAgentSpeaking ? [1, 1.4, 1] : [1, 1.1, 1],
                opacity: isAgentSpeaking ? [0.2, 0.5, 0.2] : [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: isAgentSpeaking ? 1 : 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-redz-accent/40"
              animate={{ 
                scale: isAgentSpeaking ? [1, 1.3, 1] : [1, 1.05, 1],
                opacity: isAgentSpeaking ? [0.3, 0.6, 0.3] : [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: isAgentSpeaking ? 0.8 : 2.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </>
        )}

        {/* Center Avatar */}
        <motion.div 
          className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-redz-charcoal shadow-[0_0_30px_rgba(158,0,0,0.4)] z-10"
          animate={{
            boxShadow: isAgentSpeaking 
              ? "0 0 50px rgba(158,0,0,0.8)" 
              : "0 0 20px rgba(158,0,0,0.3)"
          }}
          transition={{ duration: 0.5 }}
        >
          <Image 
            src="/images/original/henry_avatar.png" 
            alt="Henry Voice Avatar" 
            fill 
            className="object-cover"
          />
          {/* Subtle overlay gradient to make it feel digital */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-redz-accent/20 mix-blend-overlay"></div>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-8 mb-4">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? "bg-white text-redz-charcoal" : "bg-redz-charcoal-light border border-gray-700 text-white hover:bg-gray-800"
          }`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          aria-label="End Call"
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
}
