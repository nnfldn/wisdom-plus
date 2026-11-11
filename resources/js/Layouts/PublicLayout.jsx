import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, QrCode, Phone, MessageSquare, Bot, X, Send, Mail, Award, Maximize2, Minimize2
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { motion, AnimatePresence } from 'framer-motion';

const MarkdownText = ({ text }) => {
  if (!text) return null;
  
  // Robust Markdown Parser for Chatbot
  const formattedHtml = text
    // 1. Process Bold (High priority)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-m3-primary">$1</strong>')
    
    // 2. Process Italics
    .replace(/\*(.*?)\*/g, '<em class="italic opacity-80">$1</em>')
    
    // 3. Process Headers (anywhere in line, handles common AI leading spaces)
    .replace(/^\s*###\s+(.*$)/gm, '<h3 class="font-black text-sm md:text-base mt-6 mb-2 uppercase tracking-tight text-slate-800 border-l-4 border-m3-primary pl-3 bg-slate-50 py-2 rounded-r-lg">$1</h3>')
    .replace(/^\s*##\s+(.*$)/gm, '<h2 class="font-black text-base md:text-lg mt-8 mb-4 uppercase tracking-tighter border-b-2 border-m3-primary/20 pb-2 text-slate-900">$2</h2>')
    
    // 4. Process Bullet Points
    .replace(/^\s*[\*\-]\s+(.*$)/gm, '<div class="flex gap-2 mb-2 ml-2"><span class="text-m3-primary">●</span><span class="text-slate-600 font-medium">$1</span></div>')
    
    // 5. Process Numbered Lists
    .replace(/^\s*(\d+)\.\s+(.*$)/gm, '<div class="flex gap-2 mb-2 ml-2"><span class="font-black text-m3-primary">$1.</span><span class="text-slate-600 font-medium">$2</span></div>')
    
    // 6. Fix line breaks
    .replace(/\n/g, '<br />');

  return <div className="markdown-content leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
};

export default function PublicLayout({ children, currentRoute }) {
  const { props: pageProps } = usePage();
  const chatbotEndpoint = pageProps?.public?.chatbotProxy || '/api/chat/ask';
  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current =
      (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
      `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Selamat datang! 🌾\n\nSaya asisten digital Wisma Domba Farm. Apa yang ingin Anda ketahui hari ini?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollTicking = useRef(false);

  // Optimized scroll handler with requestAnimationFrame throttle
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        scrollTicking.current = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          scrollTicking.current = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickActions = [
    { label: '🏢 Profil Farm', query: 'Jelaskan profil lengkap Wisma Domba Farm dan keunggulannya' },
    { label: '🐑 Katalog Domba', query: 'Tampilkan stok domba WD-Garut yang tersedia saat ini' },
    { label: '📈 Investasi', query: 'Bagaimana perhitungan bagi hasil investasi fattening?' },
    { label: '🩺 Cek Kesehatan', query: 'Tampilkan rekam medis domba dengan tag WD-001' },
    { label: '🌾 Stok Pakan', query: 'Berapa sisa stok pakan konsentrat saat ini?' },
    { label: '🏆 Komparasi Ras', query: 'Ceritakan keunggulan ras Dorper dibandingkan Merino' },
  ];

  const clearChat = () => {
    setMessages([
        { role: 'bot', text: 'Selamat datang! 🌾\n\nSaya asisten digital Wisma Domba Farm. Apa yang ingin Anda ketahui hari ini?' }
    ]);
  };

  const handleSendMessage = async (e, customQuery = null) => {
    if (e) e.preventDefault();
    const query = customQuery || userInput;
    if (!query.trim() || isTyping) return;

    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsTyping(true);

    try {
      const response = await fetch(chatbotEndpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ question: query, session_id: sessionIdRef.current })
      });

      const data = await response.json().catch(() => ({}));
      if (response.status === 429) {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer || 'Anda terlalu cepat mengirim pertanyaan. Coba lagi sebentar lagi.' }]);
      } else if (!response.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer || 'Maaf, saya sedang mengalami kendala teknis.' }]);
      } else if (data.status === 'success') {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer || 'Maaf, saya tidak menerima jawaban.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Koneksi ke otak AI terputus. Silakan coba lagi nanti.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const navItems = [
    { label: 'Beranda', href: '/', icon: <Home size={20} />, id: 'home' },
    { label: 'Katalog', href: '/catalog', icon: <Search size={20} />, id: 'catalog' },
    { label: 'Tentang Kami', href: '/about', icon: <Award size={20} />, id: 'about', desktopOnly: true },
    { label: 'Scan QR', href: '/scanner', icon: <QrCode size={20} />, id: 'scanner' },
    { label: 'Kontak', href: '/contact', icon: <Phone size={20} />, id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-m3-surface flex flex-col font-sans text-m3-on-surface selection:bg-m3-primary selection:text-m3-on-primary">
      
      {/* DYNAMIC DETACHING HEADER - GPU-OPTIMIZED */}
      <div className="fixed top-0 left-0 w-full z-40 flex justify-center pointer-events-none">
        <header
          className={`pointer-events-auto flex items-center justify-center backdrop-blur-xl border-slate-100 
            transition-[transform,opacity,border-radius,box-shadow,padding,max-width,margin,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isScrolled 
              ? 'border py-2.5 shadow-xl mt-4 rounded-full px-6 max-w-fit bg-white/95' 
              : 'border-b py-4 w-full max-w-full px-8 bg-white/80'
            }`}
          style={{ willChange: 'transform' }}
        >
          {/* BRAND LOGO AREA */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
                <ApplicationLogo 
                  className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`} 
                />
                <div className="flex flex-col items-start">
                  <span className={`font-black tracking-tighter text-slate-800 uppercase leading-none transition-[font-size] duration-500 ${isScrolled ? 'text-xs' : 'text-lg'}`}>
                    Wisma Domba Farm
                  </span>
                  {!isScrolled && <span className="text-[8px] font-black text-m3-primary uppercase tracking-[0.3em] mt-1">Berkah Jaya</span>}
                </div>
            </Link>
          </div>
          
          {/* NAV LINKS AREA */}
          <nav className={`hidden md:flex items-center gap-1 transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isScrolled ? 'ml-6' : 'ml-8'}`}>
            <div className={`w-[1px] h-5 bg-slate-200 mr-3 transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={item.href} 
                className={`px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] transition-colors duration-200 ${
                  currentRoute === item.id 
                    ? 'bg-m3-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-m3-primary hover:bg-m3-primary/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
      </div>

      {/* MOBILE BOTTOM NAVIGATION - LIGHTWEIGHT */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full p-1.5 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-m3-glow">
        <div className="flex justify-center items-center gap-1 px-1 py-0.5">
          {navItems.filter(item => !item.desktopOnly).map((item) => (
            <Link 
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 py-3 px-4 rounded-full transition-all duration-200 ease-out active:scale-90 ${
                currentRoute === item.id 
                  ? 'bg-m3-primary text-white shadow-[0_4px_15px_rgba(43,94,65,0.2)]' 
                  : 'text-slate-400'
              }`}
            >
              {React.cloneElement(item.icon, { 
                size: 20, 
                strokeWidth: currentRoute === item.id ? 3 : 2,
              })}
              
              {currentRoute === item.id && (
                <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-1 pt-[80px] pb-24 md:pb-0">
        <motion.div
          key={currentRoute}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* FOOTER - CLEANER & TONAL */}
      <footer className="bg-m3-secondary-container text-m3-on-secondary-container py-16 px-6 border-t border-m3-outline/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ApplicationLogo className="w-16 h-16 bg-white p-2 rounded-2xl shadow-sm" />
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-black tracking-tighter uppercase leading-none text-slate-800">Wisma Domba Farm</h2>
                <span className="text-[10px] font-black text-m3-primary uppercase tracking-[0.4em] mt-1">Berkah Jaya</span>
              </div>
            </div>
            <p className="text-base font-medium opacity-80 leading-relaxed">Sistem manajemen peternakan domba modern dengan pendekatan genetika dan nutrisi berbasis limbah organik.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Tautan</h3>
              <ul className="space-y-3 text-sm font-bold">
                <li><Link href="/" className="hover:text-m3-primary transition">Beranda</Link></li>
                <li><Link href="/catalog" className="hover:text-m3-primary transition">Katalog</Link></li>
                <li><Link href="/about" className="hover:text-m3-primary transition">Tentang Kami</Link></li>
                <li><Link href="/contact" className="hover:text-m3-primary transition">Kontak</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Layanan</h3>
              <ul className="space-y-3 text-sm font-bold opacity-80">
                <li>Kurban & Aqiqah</li>
                <li>Bibit Indukan</li>
                <li>Pakan Organik</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Lokasi</h3>
             <p className="text-sm font-bold leading-relaxed">Ciharashas, Kec. Cilaku,<br/>Kabupaten Cianjur, Jawa Barat 43285</p>
             <div className="pt-4 flex gap-4">
               <div className="p-3 bg-m3-primary-container rounded-2xl text-m3-primary"><Mail size={20}/></div>
               <div className="p-3 bg-m3-primary-container rounded-2xl text-m3-primary"><Phone size={20}/></div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-m3-on-secondary-container/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">&copy; 2026 Capstone Project Kelompok Digitive</p>
        </div>
      </footer>

      {/* CHATBOT FAB & WINDOW */}
      <div className={`fixed z-50 flex flex-col items-end gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isChatFullscreen && isChatbotOpen 
          ? 'inset-0 p-0' 
          : 'bottom-24 md:bottom-8 right-6'
      }`}>
        <AnimatePresence>
          {isChatbotOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-white shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isChatFullscreen 
                  ? 'w-full h-full rounded-none' 
                  : 'w-[90vw] md:w-[400px] h-[500px] rounded-[2.5rem] mb-2'
              }`}
            >
              {/* Header */}
              <div className="bg-m3-primary p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">WisDom+ AI</h3>
                    <p className="text-[10px] opacity-80 font-bold">Sistem Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={clearChat}
                        className="text-[9px] font-black uppercase tracking-tighter bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-all"
                    >
                        Hapus Riwayat
                    </button>
                    <button 
                        onClick={() => setIsChatFullscreen(!isChatFullscreen)} 
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                        title={isChatFullscreen ? 'Perkecil' : 'Perbesar'}
                    >
                        {isChatFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button onClick={() => { setIsChatbotOpen(false); setIsChatFullscreen(false); }} className="hover:rotate-90 transition-transform">
                        <X size={20} />
                    </button>
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${isChatFullscreen ? 'max-w-3xl mx-auto' : ''} ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-m3-primary text-white' : 'bg-m3-primary/10 text-m3-primary'}`}>
                      {msg.role === 'user' ? <MessageSquare size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === 'user' ? 'bg-m3-primary text-white rounded-tr-none border-m3-primary' : 'bg-white text-slate-700 rounded-tl-none border-slate-100'}`}>
                      {msg.role === 'bot' ? (
                        <MarkdownText text={msg.text} />
                      ) : (
                        <p className={`font-medium leading-relaxed whitespace-pre-wrap ${isChatFullscreen ? 'text-sm' : 'text-xs'}`}>
                          {msg.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {messages.length === 1 && !isTyping && (
                    <div className={`mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${isChatFullscreen ? 'max-w-3xl mx-auto' : ''}`}>
                        <div className="bg-slate-200/50 h-[1px] w-full mb-6"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">Pilih Menu Informasi</p>
                        <div className={`grid gap-2 ${isChatFullscreen ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            {quickActions.map((action, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSendMessage(null, action.query)}
                                    className="text-left p-3 rounded-xl bg-white border border-slate-100 text-[11px] font-bold text-slate-600 hover:border-m3-primary hover:text-m3-primary hover:bg-m3-primary/5 transition-all shadow-sm"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isTyping && (
                  <div className={`flex gap-3 ${isChatFullscreen ? 'max-w-3xl mx-auto' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-m3-primary/10 flex items-center justify-center text-m3-primary flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className={`relative flex items-center ${isChatFullscreen ? 'max-w-3xl mx-auto' : ''}`}>
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={isTyping ? "Sedang berpikir..." : "Tanya sesuatu..."}
                    disabled={isTyping}
                    className={`w-full bg-slate-50 border-none rounded-2xl pl-4 pr-12 font-bold focus:ring-2 focus:ring-m3-primary/20 transition-all ${isChatFullscreen ? 'py-5 text-base' : 'py-4 text-sm'}`}
                  />
                  <button 
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="absolute right-2 p-2 bg-m3-primary text-white rounded-xl disabled:opacity-50 disabled:bg-m3-primary/10 disabled:text-m3-primary transition-all"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isChatFullscreen && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            className={`p-4 rounded-2xl shadow-xl transition-all ${isChatbotOpen ? 'bg-m3-on-surface text-m3-surface' : 'bg-m3-primary text-m3-on-primary'}`}
          >
            {isChatbotOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </motion.button>
        )}
      </div>
    </div>
  );
}
