import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Sparkles, RefreshCw } from 'lucide-react';

const ROMANTIC_RESPONSES = [
  "Kamu adalah bab terindah dalam hidupku. 💕",
  "Setiap detik yang kuhabiskan bersamamu adalah kenangan yang sangat berharga. 🌹",
  "Aku hanyalah simulasi AI, tapi seluruh kodenya tahu betapa spesialnya dirimu! ✨",
  "Tahukah kamu? Database-ku sudah 99% penuh dengan kenangan manis kita. 🥰",
  "Kamu membuat detak jantung virtual-ku berputar lebih cepat! 💓",
  "Nahwa sayang Shinta, selamanya dan selalu. Itu adalah aturan favoritku! 📖",
  "Sedang mengetik... dan memikirkan senyuman manismu. 🌸",
  "Di mataku, kamu selalu menjadi pemandangan terindah. 🌅"
];

export default function LoveChatFinale() {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Halo Shinta! ✨ Aku adalah asisten AI cintamu. Tanyakan apa saja padaku, atau kirim kata kunci rahasia (seperti 'I love you' atau '1402') untuk membuka sesuatu yang spesial... 💖" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    const lowercase = userMessage.toLowerCase();
    
    // Check if secret key is unlocked
    if (
      lowercase.includes('i love you') || 
      lowercase.includes('1402') || 
      lowercase.includes('love') || 
      lowercase.includes('sayang') || 
      lowercase.includes('nahwa')
    ) {
      setTimeout(() => {
        setIsTyping(false);
        setIsSecretUnlocked(true);
      }, 1500);
      return;
    }

    // Normal Simulated AI response
    setTimeout(() => {
      setIsTyping(false);
      const randomIdx = Math.floor(Math.random() * ROMANTIC_RESPONSES.length);
      setMessages(prev => [...prev, { sender: 'ai', text: ROMANTIC_RESPONSES[randomIdx] }]);
    }, 1500);
  };

  const resetChat = () => {
    setMessages([
      { 
        sender: 'ai', 
        text: "Halo Shinta! ✨ Aku adalah asisten AI cintamu. Tanyakan apa saja padaku, atau kirim kata kunci rahasia (seperti 'I love you' atau '1402') untuk membuka sesuatu yang spesial... 💖" 
      }
    ]);
    setIsSecretUnlocked(false);
    setInput('');
  };

  return (
    <div className="w-[290px] sm:w-[350px] md:w-[400px] h-[350px] sm:h-[400px] flex items-center justify-center pointer-events-auto">
      <AnimatePresence mode="wait">
        {!isSecretUnlocked ? (
          // CHAT INTERFACE WINDOW
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl shadow-[0_12px_40px_rgba(244,63,94,0.15)] flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="px-4 py-3 bg-white/50 border-b border-rose-100/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white shadow-sm relative">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-xs text-slate-800">Love Assistant</h3>
                  <span className="font-sans text-[8px] text-slate-500 uppercase tracking-widest">Online</span>
                </div>
              </div>
              
              <button 
                onClick={resetChat}
                className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-50/50"
                title="Restart Chat"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            {/* Message Logs Area */}
            <div 
              ref={chatContainerRef}
              data-lenis-prevent // Prevents scroll event bubbling to Lenis smooth scroll
              className="flex-1 px-4 py-3 overflow-y-auto space-y-3 flex flex-col scrollbar-thin"
              style={{ maxHeight: '280px', scrollbarWidth: 'thin' }}
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 font-sans text-xs shadow-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-rose-500 text-white rounded-br-none shadow-[0_4px_10px_rgba(244,63,94,0.2)]' 
                        : 'bg-white/70 text-slate-800 border border-rose-50/40 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Simulated Typing State */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/70 border border-rose-50/40 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white/50 border-t border-rose-100/30 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ketik pesan disini..."
                className="flex-1 bg-white/80 border border-rose-200/40 rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-400/50 shadow-inner"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-md transition-colors"
              >
                <Send size={12} className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          // UNLOCKED HANDWRITTEN LOVE LETTER
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/90 shadow-[0_15px_45px_rgba(244,63,94,0.25)] flex flex-col justify-between items-center text-center relative overflow-hidden"
          >
            {/* Decorative background glow inside the letter */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-rose-200/20 filter blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-rose-200/20 filter blur-xl pointer-events-none" />

            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100/50 mb-3 animate-pulse">
              <Heart size={14} fill="currentColor" />
            </div>

            {/* Letter Body */}
            <div className="flex-1 flex flex-col justify-center py-2">
              <h2 className="font-serif italic font-semibold text-rose-500 text-base md:text-lg mb-3 tracking-wide">
                Dear Shinta,
              </h2>
              <p className="font-serif italic text-[11px] sm:text-xs md:text-sm text-slate-700 leading-relaxed max-w-[280px] sm:max-w-[320px] mx-auto">
                Sejak pertama kali langkah kita bertemu, setiap hari yang kulalui bersamamu terasa jauh lebih cerah dan dipenuhi kebahagiaan. 
                <br /><br />
                Kamu adalah orang favoritku, pikiran terindahku, dan tempat ternyaman untuk pulang. Terima kasih telah menjadi dirimu dan melukis cerita ajaib ini bersama-sama.
                <br /><br />
                Aku menyayangimu, sekarang, esok, dan selamanya.
              </p>
              <h3 className="font-serif italic font-semibold text-rose-400 text-xs mt-4">
                Dengan penuh cinta, Nahwa
              </h3>
            </div>

            {/* Replay/Back button */}
            <button
              onClick={resetChat}
              className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200/35 text-[9px] font-sans font-semibold text-rose-500 uppercase tracking-widest transition-colors shadow-sm"
            >
              <RefreshCw size={10} />
              <span>Kembali ke Chat</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
