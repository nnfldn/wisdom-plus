import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setIsInstalled(true);
        }

        // 2. iOS Detection
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        // 3. Android/Chrome Install Prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isInstalled) return null;

    return (
        <div className="w-full max-w-sm mt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* ANDROID / CHROME BUTTON */}
            {deferredPrompt && (
                <button 
                    onClick={handleInstallClick}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                    <Download size={16} /> Pasang Aplikasi WisDom+
                </button>
            )}

            {/* iOS INSTRUCTIONS BUTTON */}
            {isIOS && !deferredPrompt && (
                <div className="space-y-4">
                    <button 
                        onClick={() => setShowIOSInstructions(!showIOSInstructions)}
                        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
                    >
                        <PlusSquare size={16} /> Cara Instal di iPhone
                    </button>

                    <AnimatePresence>
                        {showIOSInstructions && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden"
                            >
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Info size={14} className="text-indigo-500" /> Langkah Instal:
                                </h4>
                                <ol className="space-y-3">
                                    <li className="flex items-start gap-3 text-[11px] font-bold text-slate-500">
                                        <span className="bg-slate-100 text-slate-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                                        <span>Klik ikon <Share size={14} className="inline mx-1 text-blue-500" /> **Share** di bar bawah Safari.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[11px] font-bold text-slate-500">
                                        <span className="bg-slate-100 text-slate-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                                        <span>Gulir ke bawah dan pilih **Add to Home Screen**.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[11px] font-bold text-slate-500">
                                        <span className="bg-slate-100 text-slate-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                                        <span>Klik **Add** di pojok kanan atas.</span>
                                    </li>
                                </ol>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            
            {/* FALLBACK (If neither prompt nor iOS detected, or already declined) */}
            {!deferredPrompt && !isIOS && (
                <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        Gunakan menu browser (titik tiga) untuk "Instal Aplikasi" agar pengalaman lebih maksimal.
                    </p>
                </div>
            )}
        </div>
    );
}
