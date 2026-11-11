import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, ShieldCheck, ScanLine, Activity, User, Link2, HeartPulse, Syringe, Phone, AlertCircle, CheckCircle, Venus, Mars, Weight, CalendarDays, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KTP({ sheep, salesWhatsapp }) {
  const handlePrint = () => {
    window.print();
  };

  const waNumber = salesWhatsapp;
  const waMessage = encodeURIComponent(`Halo Wisma Domba, saya tertarik dengan domba ${sheep.tag} (${sheep.type}). Apakah masih tersedia?`);
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PublicLayout currentRoute="ktp">
      <Head title={`KTP ${sheep.tag}`} />
      <div className="bg-m3-surface min-h-screen pt-0 pb-[37px] px-6 font-sans selection:bg-m3-primary-container selection:text-m3-on-primary-container">
        <div className="max-w-4xl mx-auto">
          {/* Action Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 print:hidden"
          >
            <Link 
              href="/catalog"
              className="bg-m3-secondary-container text-m3-on-secondary-container px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all font-bold flex items-center gap-3 border border-m3-outline/10 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/> Kembali ke Katalog
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="bg-m3-primary text-m3-on-primary px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all font-bold flex items-center gap-3"
            >
              <Printer className="w-5 h-5"/> Cetak Sertifikat
            </motion.button>
          </motion.div>

          {/* Certificate Card - Tonal Container */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-m3-surface rounded-[4rem] shadow-xl overflow-hidden border border-m3-outline/20 relative" 
            id="ktp-card"
          >
            {/* Header Header */}
            <div className="h-56 bg-m3-primary relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                transition={{ duration: 1.5 }}
                src={sheep.img} 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay blur-sm" 
                alt="BG" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-m3-primary via-m3-primary/80 to-transparent"></div>
              
              <div className="absolute inset-0 p-12 flex justify-between items-start">
                <div>
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 bg-m3-primary-container text-m3-on-primary-container px-4 py-1.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-4 border border-white/20"
                  >
                    <Award className="h-4 w-4" /> Sertifikat Cloud Resmi
                  </motion.div>
                  <h2 className="text-5xl md:text-6xl font-extrabold text-m3-on-primary tracking-tighter italic">KTP DOMBA</h2>
                </div>
                <motion.div 
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="bg-m3-primary-container/20 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-2xl hidden sm:block"
                >
                  <ScanLine className="h-14 w-14 text-m3-primary-container" />
                </motion.div>
              </div>
            </div>

            <div className="p-10 md:p-14 relative -mt-20">
              <div className="flex flex-col lg:flex-row gap-12 items-end mb-16">
                <motion.div 
                  variants={itemVariants}
                  className="relative group shrink-0"
                >
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-[3.5rem] overflow-hidden border-[10px] border-m3-surface shadow-2xl bg-m3-secondary-container relative z-10">
                    <img src={sheep.img} alt={sheep.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.8 }}
                    className="absolute -bottom-6 right-6 bg-m3-primary text-m3-on-primary px-6 py-2.5 rounded-full text-[11px] font-black border-4 border-m3-surface shadow-xl z-20 flex items-center gap-2 tracking-[0.15em] uppercase"
                  >
                    <CheckCircle className="h-4 w-4" /> VERIFIED
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex-1 w-full bg-m3-secondary-container p-8 md:p-10 rounded-[3.5rem] border border-m3-outline/10 shadow-inner"
                >
                  <div className="flex justify-between items-center mb-8 border-b border-m3-outline/10 pb-6">
                    <div>
                      <p className="text-[11px] text-m3-on-secondary-container/50 uppercase tracking-[0.2em] font-black mb-2">ID Tag Cloud Sistem</p>
                      <p className="text-4xl font-black text-m3-on-secondary-container font-mono tracking-widest italic">{sheep.tag}</p>
                    </div>
                    <div className={`p-4 rounded-[2rem] shadow-sm border ${sheep.gender === 'Jantan' ? 'bg-m3-primary-container/50 border-m3-primary/20 text-m3-primary' : 'bg-m3-tertiary-container/50 border-m3-on-tertiary-container/10 text-m3-on-tertiary-container'}`}>
                      {sheep.gender === 'Jantan' ? <Mars className="w-10 h-10"/> : <Venus className="w-10 h-10"/>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-8 gap-x-8">
                    <div>
                      <p className="text-[11px] text-m3-on-secondary-container/40 uppercase tracking-[0.2em] font-black mb-2">Ras Keturunan</p>
                      <p className="text-2xl font-extrabold text-m3-on-secondary-container leading-tight italic">{sheep.type}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-m3-on-secondary-container/40 uppercase tracking-[0.2em] font-black mb-2">Umur Aktual</p>
                      <p className="text-2xl font-extrabold text-m3-on-secondary-container leading-tight italic">{sheep.age}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-m3-on-secondary-container/40 uppercase tracking-[0.2em] font-black mb-2">Gender</p>
                      <p className="text-xl font-bold text-m3-on-secondary-container/70 uppercase tracking-[0.15em] italic">{sheep.gender}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-m3-primary uppercase tracking-[0.2em] font-black mb-2">Bobot Aktual</p>
                      <p className="text-3xl font-black text-m3-primary bg-m3-primary-container px-5 py-1.5 rounded-2xl inline-block border border-m3-primary/10 italic">{sheep.weight} <span className="text-sm">kg</span></p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Pedigree Section */}
              <motion.div variants={itemVariants} className="mb-16">
                <h4 className="font-extrabold text-m3-on-surface text-2xl mb-8 flex items-center gap-4 border-b border-m3-outline/10 pb-5">
                  <div className="bg-m3-primary-container p-2.5 rounded-2xl text-m3-primary shadow-sm"><Link2 className="h-6 w-6" /></div> 
                  Silsilah Genetik <span className="text-m3-primary/40 italic font-medium">(Pedigree Data)</span>
                </h4>
                <div className="bg-m3-secondary-container/30 p-10 rounded-[4rem] border border-m3-outline/10 relative overflow-hidden shadow-inner">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                    <div className="hidden md:block absolute top-1/2 left-[25%] right-[25%] h-1.5 bg-m3-outline/10 rounded-full -z-0"></div>
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-m3-surface p-8 rounded-[2.5rem] shadow-sm border border-m3-outline/10 flex-1 w-full text-center relative z-10 border-t-[10px] border-t-m3-primary">
                      <div className="w-16 h-16 bg-m3-primary-container/30 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-m3-primary/10"><User className="text-m3-primary w-8 h-8"/></div>
                      <p className="text-[11px] text-m3-on-surface/40 uppercase font-black tracking-[0.2em] mb-2">Bapak (Sire)</p>
                      <p className="font-black text-m3-on-surface text-xl leading-tight italic">{sheep.parentMale || 'Unknown'}</p>
                    </motion.div>
                    <div className="bg-m3-primary text-m3-on-primary w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl relative z-10 shadow-xl border-4 border-m3-surface shrink-0">
                      +
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-m3-surface p-8 rounded-[2.5rem] shadow-sm border border-m3-outline/10 flex-1 w-full text-center relative z-10 border-t-[10px] border-t-m3-tertiary-container">
                      <div className="w-16 h-16 bg-m3-tertiary-container/30 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-m3-on-tertiary-container/10"><User className="text-m3-on-tertiary-container w-8 h-8"/></div>
                      <p className="text-[11px] text-m3-on-surface/40 uppercase font-black tracking-[0.2em] mb-2">Ibu (Dam)</p>
                      <p className="font-black text-m3-on-surface text-xl leading-tight italic">{sheep.parentFemale || 'Unknown'}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Health Section */}
              <motion.div variants={itemVariants} className="mb-16">
                <h4 className="font-extrabold text-m3-on-surface text-2xl mb-8 flex items-center gap-4 border-b border-m3-outline/10 pb-5">
                  <div className="bg-m3-primary-container p-2.5 rounded-2xl text-m3-primary shadow-sm"><HeartPulse className="h-6 w-6" /></div> 
                  Log Rekam Medis & Nutrisi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-m3-secondary-container/20 border border-m3-outline/10 rounded-[3rem] p-8 flex items-start gap-6 shadow-sm group hover:border-m3-primary/30 transition-all">
                    <div className="bg-m3-primary-container p-4 rounded-2xl shrink-0 border border-m3-primary/10 shadow-sm group-hover:scale-110 transition-transform"><Activity className="h-10 w-10 text-m3-primary" /></div>
                    <div>
                      <p className="font-black text-m3-on-surface text-xl mb-2 tracking-tight">Nutrisi Presisi</p>
                      <p className="text-base text-m3-on-surface/60 font-medium leading-relaxed italic">Pakan silase jagung & konsentrat protein 18%. Pertumbuhan bobot terpantau optimal.</p>
                    </div>
                  </div>
                  <div className="bg-m3-secondary-container/20 border border-m3-outline/10 rounded-[3rem] p-8 flex items-start gap-6 shadow-sm group hover:border-m3-primary/30 transition-all">
                    <div className="bg-m3-tertiary-container p-4 rounded-2xl shrink-0 border border-m3-on-tertiary-container/10 shadow-sm group-hover:scale-110 transition-transform"><Syringe className="h-10 w-10 text-m3-on-tertiary-container" /></div>
                    <div>
                      <p className="font-black text-m3-on-surface text-xl mb-2 tracking-tight">Proteksi Kesehatan</p>
                      <p className="text-base text-m3-on-surface/60 font-medium leading-relaxed italic">Vaksinasi rutin & vitamin B-kompleks. Status kesehatan: <span className="font-bold text-m3-primary uppercase not-italic">{sheep.health}</span>.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Price & CTA Section - Light Refined */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-[4rem] p-10 md:p-14 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-m3-soft border border-slate-100 relative overflow-hidden print:hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-m3-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-m3-primary-container/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
                
                <div className="relative z-10 text-center lg:text-left">
                  <p className="text-m3-primary text-[12px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Estimasi Nilai Aktual Aset</p>
                  {sheep.status === 'Siap Jual' ? (
                    <motion.p 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter italic"
                    >
                      Rp {(sheep.weight * sheep.pricePerKg).toLocaleString('id-ID')}
                    </motion.p>
                  ) : (
                    <p className="text-4xl font-extrabold text-slate-800 italic">Domba Tidak Dijual</p>
                  )}
                  {sheep.pricePerKg > 0 && <p className="text-slate-400 text-sm mt-4 font-bold bg-slate-50 inline-block px-5 py-2 rounded-full border border-slate-100 italic tracking-wide">Bobot {sheep.weight}kg × Harga Ras Terkini</p>}
                </div>
                
                <div className="relative z-10 w-full lg:w-auto shrink-0">
                   {sheep.status === 'Siap Jual' ? (
                      <motion.a 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        href={waLink} 
                        target="_blank" 
                        className="w-full lg:w-auto bg-m3-primary text-white px-12 py-6 rounded-full font-black text-xl hover:shadow-[0_20px_60px_rgba(43,94,65,0.4)] transition-all flex items-center justify-center gap-4 group shadow-lg"
                      >
                        <Phone className="h-7 w-7 group-hover:rotate-12 transition-transform" /> Hubungi Sales (WA)
                      </motion.a>
                   ) : (
                      <div className="bg-slate-100 text-slate-400 px-10 py-5 rounded-[2rem] border border-slate-200 font-bold text-center flex items-center justify-center gap-3 text-lg italic">
                        <AlertCircle className="h-6 w-6" /> Status Sistem: {sheep.status}
                      </div>
                   )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
