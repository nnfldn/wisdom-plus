import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { X, Maximize, CheckCircle, Search, CameraOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ sheepData }) {
  const [scanResult, setScanResult] = useState(null);
  const [manualTag, setManualTag] = useState('');
  const [error, setError] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    scanner.start(
      { facingMode: "environment" }, // Prioritize back camera
      config,
      (decodedText) => {
        // Handle Success
        handleScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Silent error for scanning process
      }
    ).then(() => {
      setIsCameraStarted(true);
    }).catch(err => {
      console.error(err);
      setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Error stopping scanner", err));
      }
    };
  }, []);

  const handleScanSuccess = (decodedText) => {
    // Stop scanning after success
    if (scannerRef.current) {
        scannerRef.current.stop();
        setIsCameraStarted(false);
    }

    setScanResult(decodedText);

    // Analyze URL or Text
    // Expected format: http://127.0.0.1:8000/ktp/QR-XXX or just QR-XXX
    let tag = decodedText;
    if (decodedText.includes('/ktp/')) {
        tag = decodedText.split('/ktp/').pop();
    }

    // Small delay for success animation
    setTimeout(() => {
        router.get(route('ktp', tag), {}, {
            onError: () => {
                alert("Tag domba tidak ditemukan dalam database.");
                window.location.reload();
            }
        });
    }, 1000);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualTag) return;
    router.get(route('ktp', manualTag.toUpperCase()));
  };

  return (
    <PublicLayout currentRoute="scanner">
      <Head title="Scan QR ID Domba" />
      <div className="min-h-screen bg-m3-surface pt-0 pb-[37px] px-6 flex flex-col items-center relative overflow-hidden font-sans">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-m3-primary/10 to-transparent"></div>
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #2B5E41 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center mt-10"
        >
          <div className="text-center mb-10">
            <motion.h2 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-extrabold text-m3-on-surface mb-3 tracking-tight"
            >
              Scan QR KTP Domba
            </motion.h2>
            <p className="text-m3-primary font-bold text-base bg-m3-primary-container/50 px-4 py-1.5 rounded-full inline-block">
              {scanResult ? 'Berhasil Memindai!' : 'Arahkan kamera ke Tag Telinga atau Barcode'}
            </p>
          </div>

          <div className="relative w-full aspect-square max-w-[340px] mb-12 group">
            {/* Scanner Container */}
            <div className="absolute inset-0 bg-black rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl relative">
               <div id="reader" className="w-full h-full overflow-hidden scale-110"></div>
               
               {/* Loading / Error States */}
               {!isCameraStarted && !scanResult && !error && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
                       <RefreshCw className="w-10 h-10 animate-spin text-m3-primary" />
                       <p className="font-bold text-xs uppercase tracking-widest opacity-60">Menyiapkan Kamera...</p>
                   </div>
               )}

               {error && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-900 text-white p-10 text-center gap-4">
                       <CameraOff className="w-12 h-12 mb-2" />
                       <p className="font-bold text-sm">{error}</p>
                       <button onClick={() => window.location.reload()} className="bg-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Coba Lagi</button>
                   </div>
               )}
            </div>
            
            {/* Decorative Corners */}
            {!scanResult && isCameraStarted && (
                <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 p-4 pointer-events-none z-10"
                >
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-[6px] border-l-[6px] border-m3-primary rounded-tl-[2.5rem]"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-[6px] border-r-[6px] border-m3-primary rounded-tr-[2.5rem]"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[6px] border-l-[6px] border-m3-primary rounded-bl-[2.5rem]"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[6px] border-r-[6px] border-m3-primary rounded-br-[2.5rem]"></div>
                </motion.div>
            )}

            <AnimatePresence>
              {isCameraStarted && !scanResult && (
                <motion.div 
                  key="scanner-line"
                  initial={{ top: '15%', opacity: 0 }}
                  animate={{ top: '80%', opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    ease: "easeInOut" 
                  }}
                  className="absolute left-[15%] right-[15%] h-1 bg-m3-primary rounded-full shadow-[0_0_20px_rgba(43,94,65,0.8)] z-20 pointer-events-none"
                />
              )}

              {scanResult && (
                <motion.div 
                  key="success-overlay"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-m3-primary/30 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center z-30 border-4 border-white"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <CheckCircle className="w-24 h-24 text-m3-primary fill-white" />
                  </motion.div>
                  <p className="mt-4 text-white font-black tracking-widest uppercase text-lg">Terdeteksi!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Manual Input Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-[2.5rem] w-full border border-slate-100 shadow-m3-soft"
          >
             <p className="text-slate-500 text-sm font-bold mb-5 text-center leading-relaxed uppercase tracking-widest">
               ID Cloud Tag Manual
             </p>
             <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-3">
               <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-m3-primary/50" />
                 <input 
                   type="text" 
                   value={manualTag}
                   onChange={e => setManualTag(e.target.value)}
                   placeholder="QR-XXX..." 
                   className="w-full bg-slate-50 border-none text-slate-900 pl-12 pr-4 py-4 rounded-2xl text-lg font-mono focus:ring-4 focus:ring-m3-primary/10 outline-none transition-all placeholder:text-slate-300" 
                 />
               </div>
               <motion.button 
                 type="submit"
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="bg-m3-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-m3-primary/20 hover:bg-emerald-700 transition-all"
               >
                 Cari
               </motion.button>
             </form>
          </motion.div>

          <Link href="/" className="mt-10 group">
            <motion.div 
              whileHover={{ x: -5 }}
              className="text-slate-400 hover:text-rose-500 font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"/> 
              Batalkan Pemindaian
            </motion.div>
          </Link>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        #reader video {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 2.5rem !important;
        }
        #reader__scan_region {
            background: transparent !important;
        }
        #reader__dashboard {
            display: none !important;
        }
      `}} />
    </PublicLayout>
  );
}
