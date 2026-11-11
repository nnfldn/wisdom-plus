import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Filter, CheckCircle, Star, ScanLine, ArrowRight, Weight, CalendarDays, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterBtn = ({ label, active, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`whitespace-nowrap px-8 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${active ? 'bg-m3-primary text-m3-on-primary shadow-md' : 'bg-m3-secondary-container text-m3-on-secondary-container border border-m3-outline/10 hover:bg-m3-primary-container'}`}
  >
    {label}
  </motion.button>
);

export default function Catalog({ sheepData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Semua');

  const filteredData = sheepData.filter(sheep => {
    const matchesSearch = sheep.type.toLowerCase().includes(searchTerm.toLowerCase()) || sheep.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'Semua' ? true : 
                          filterType === 'Siap Kurban' ? (sheep.weight >= 40 && sheep.status === 'Siap Jual') :
                          filterType === 'Bibit/Anakan' ? sheep.status === 'Anakan' : true;
    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <PublicLayout currentRoute="catalog">
      <Head title="Katalog Domba" />
      <div className="bg-m3-surface pt-0 pb-[37px] min-h-screen font-sans selection:bg-m3-primary-container selection:text-m3-on-primary-container">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-m3-on-surface mb-4 tracking-tight italic">
              Katalog Ternak <span className="text-m3-primary">Premium</span>
            </h2>
            <p className="text-m3-on-surface/60 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
              Transparansi penuh. Lihat foto asli, bobot aktual dari timbangan Cloud, dan silsilah genetik sebelum membeli.
            </p>
          </motion.div>

          {/* MODERN TOOLBAR - Tonal Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-m3-secondary-container/50 backdrop-blur-md p-3 rounded-[2.5rem] border border-m3-outline/10 flex flex-col lg:flex-row gap-4 mb-10 items-center justify-between sticky top-20 z-30 shadow-sm"
          >
            <div className="relative w-full lg:w-[450px] flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-m3-primary/50 h-6 w-6" />
              <input 
                type="text" 
                placeholder="Cari ras (Texel) atau Tag ID..." 
                className="w-full pl-16 pr-8 py-4 rounded-[2rem] bg-m3-surface border-m3-outline/10 focus:ring-4 focus:ring-m3-primary/10 focus:border-m3-primary transition-all text-lg font-bold text-m3-on-surface placeholder:text-m3-on-surface/30 shadow-inner outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar px-2">
              <FilterBtn label="Semua Stok" active={filterType === 'Semua'} onClick={() => setFilterType('Semua')} />
              <FilterBtn label="Siap Kurban (>40kg)" active={filterType === 'Siap Kurban'} onClick={() => setFilterType('Siap Kurban')} />
              <FilterBtn label="Bibit / Anakan" active={filterType === 'Bibit/Anakan'} onClick={() => setFilterType('Bibit/Anakan')} />
            </div>
          </motion.div>

          {/* CATALOG GRID */}
          <AnimatePresence mode="wait">
            {filteredData.length > 0 ? (
              <motion.div 
                key={filterType + searchTerm}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredData.map(sheep => (
                  <motion.div 
                    key={sheep.id} 
                    variants={cardVariants}
                    layout
                    whileHover={{ y: -8 }}
                    className="bg-m3-surface rounded-[3rem] border border-m3-outline/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col relative"
                  >
                    {/* IMAGE AREA */}
                    <div className="h-72 relative overflow-hidden bg-m3-secondary-container">
                      <img src={sheep.img} alt={sheep.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-m3-on-surface/80 via-transparent to-transparent"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-5 left-5 flex flex-col gap-2.5">
                        {sheep.status === 'Siap Jual' && (
                          <motion.span 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-m3-primary text-m3-on-primary px-4 py-2 rounded-full text-[11px] font-black tracking-[0.15em] shadow-lg flex items-center gap-2 backdrop-blur-md uppercase border border-white/10"
                          >
                            <CheckCircle className="h-4 w-4" /> Ready
                          </motion.span>
                        )}
                        <span className="bg-m3-tertiary-container text-m3-on-tertiary-container px-4 py-2 rounded-full text-[11px] font-black tracking-[0.15em] shadow-lg flex items-center gap-2 uppercase border border-m3-outline/10">
                          <Star className="w-4 h-4 text-m3-on-tertiary-container fill-m3-on-tertiary-container"/> Grade A
                        </span>
                      </div>
                      
                      <div className="absolute top-5 right-5 bg-m3-surface/90 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-black text-m3-on-surface shadow-lg font-mono tracking-widest border border-m3-outline/20">
                        <ScanLine className="h-4 w-4 inline mr-2 text-m3-primary" /> {sheep.tag}
                      </div>

                      <div className="absolute bottom-6 left-8 right-8">
                        <h3 className="text-3xl font-extrabold text-m3-surface leading-tight tracking-tight">{sheep.type}</h3>
                        <p className="text-m3-primary-container text-xs font-bold mt-1 uppercase tracking-widest bg-m3-primary/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">Lahir: {sheep.birthDate}</p>
                      </div>
                    </div>
                    
                    {/* CARD CONTENT */}
                    <div className="p-8 flex flex-col flex-1 bg-m3-secondary-container/20">
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-m3-surface rounded-[2rem] p-5 border border-m3-outline/10 flex flex-col items-center justify-center text-center shadow-sm">
                          <Weight className="w-5 h-5 text-m3-primary/40 mb-2"/>
                          <p className="text-[10px] text-m3-on-surface/40 uppercase font-black tracking-widest mb-1">Bobot Aktual</p>
                          <p className="text-3xl font-black text-m3-primary">{sheep.weight}<span className="text-sm ml-1">kg</span></p>
                        </div>
                        <div className="bg-m3-surface rounded-[2rem] p-5 border border-m3-outline/10 flex flex-col items-center justify-center text-center shadow-sm">
                          <CalendarDays className="w-5 h-5 text-m3-primary/40 mb-2"/>
                          <p className="text-[10px] text-m3-on-surface/40 uppercase font-black tracking-widest mb-1">Usia Ternak</p>
                          <p className="text-2xl font-black text-m3-on-surface">{sheep.age}</p>
                        </div>
                      </div>

                      <div className="mb-8 flex-1">
                        <div className="flex justify-between items-center bg-m3-primary-container/40 text-m3-on-primary-container px-5 py-4 rounded-[1.5rem] border border-m3-outline/10 mb-6">
                          <span className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider"><Activity className="w-4 h-4 text-m3-primary"/> Kesehatan</span>
                          <span className="text-sm font-black italic">{sheep.health}</span>
                        </div>
                        
                        <div className="px-2">
                          {sheep.pricePerKg > 0 ? (
                             <div className="mt-2">
                               <p className="text-[11px] text-m3-on-surface/40 font-black uppercase tracking-[0.2em] mb-2">Estimasi Harga Jual</p>
                               <p className="text-4xl font-extrabold text-m3-on-surface tracking-tighter italic">Rp {(sheep.weight * sheep.pricePerKg).toLocaleString('id-ID')}</p>
                             </div>
                          ) : (
                             <div className="mt-2">
                               <p className="text-[11px] text-m3-on-surface/40 font-black uppercase tracking-[0.2em] mb-2">Estimasi Harga</p>
                               <p className="text-3xl font-extrabold text-m3-on-surface/30 italic">Hubungi Admin</p>
                             </div>
                          )}
                        </div>
                      </div>

                      <Link 
                        href={route('ktp', sheep.tag)}
                        className="group w-full bg-m3-primary text-m3-on-primary py-5 rounded-[1.5rem] font-bold text-lg hover:shadow-xl hover:bg-m3-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg mt-auto"
                      >
                        <ScanLine className="h-6 w-6 text-m3-primary-container group-hover:rotate-90 transition-transform duration-500" /> 
                        Lihat KTP Digital
                        <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-40 bg-m3-secondary-container/30 rounded-[4rem] border border-m3-outline/10 shadow-inner max-w-3xl mx-auto"
              >
                <div className="bg-m3-surface w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 border border-m3-outline/10 shadow-sm">
                  <Search className="h-12 w-12 text-m3-primary/30" />
                </div>
                <h3 className="text-3xl font-extrabold text-m3-on-surface mb-3 tracking-tight">Ternak Tidak Ditemukan</h3>
                <p className="text-m3-on-surface/60 font-medium text-lg px-8">Maaf, kami tidak menemukan domba dengan kriteria tersebut. Coba ubah kata kunci atau filter pencarian Anda.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PublicLayout>
  );
}
