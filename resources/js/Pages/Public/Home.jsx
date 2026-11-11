import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { 
  ArrowRight, ScanLine, Quote, ShieldCheck, Target, Send, Clock, 
  ChevronLeft, ChevronRight, Activity, ShoppingBag, TrendingUp, Star, Users, MapPin, Hash 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IconRenderer = ({ name, size = 24, className = "" }) => {
    switch (name) {
        case 'ShoppingBag': return <ShoppingBag size={size} className={className} />;
        case 'ShieldCheck': return <ShieldCheck size={size} className={className} />;
        case 'TrendingUp': return <TrendingUp size={size} className={className} />;
        case 'Star': return <Star size={size} className={className} />;
        case 'Users': return <Users size={size} className={className} />;
        case 'MapPin': return <MapPin size={size} className={className} />;
        case 'Hash': return <Hash size={size} className={className} />;
        case 'ScanLine': return <ScanLine size={size} className={className} />;
        case 'Target': return <Target size={size} className={className} />;
        default: return <Activity size={size} className={className} />;
    }
};

const HeroStat = ({ icon, value, label }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-sm flex items-center gap-4 group transition-all hover:bg-white hover:shadow-md"
  >
    <div className="bg-m3-primary/10 p-3 rounded-xl text-m3-primary group-hover:bg-m3-primary group-hover:text-white transition-colors flex-shrink-0">
        <IconRenderer name={icon} size={20} />
    </div>
    <div className="flex flex-col min-w-0 text-left">
      <p className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1 truncate">{value}</p>
      <p className="text-slate-400 font-black text-[8px] uppercase tracking-widest truncate">{label}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc, img }) => (
  <div className="bg-m3-surface rounded-4xl overflow-hidden group border border-m3-outline/10 flex flex-col hover:shadow-m3-soft transition-all duration-smooth">
    <div className="h-64 overflow-hidden relative">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-smooth" 
      />
      <div className="absolute inset-0 bg-m3-on-primary-container/10 group-hover:bg-transparent transition-colors duration-smooth"></div>
      <div className="absolute bottom-6 left-6 bg-m3-primary text-m3-on-primary p-4 rounded-2xl shadow-m3-glow transition-all duration-smooth group-hover:scale-105">
        <IconRenderer name={icon} size={24} />
      </div>
    </div>
    <div className="p-10 pt-8 flex-1 flex flex-col">
      <h3 className="text-2xl font-black text-m3-on-surface mb-4 leading-tight group-hover:text-m3-primary transition-colors">{title}</h3>
      <p className="text-m3-on-surface/60 leading-relaxed font-medium text-base">{desc}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, text }) => (
  <div className="bg-m3-tertiary-container/30 p-10 rounded-4xl border border-m3-on-tertiary-container/5 relative overflow-hidden transition-all duration-smooth hover:shadow-m3-soft hover:bg-m3-tertiary-container/50">
    <Quote className="absolute -top-4 -right-4 w-24 h-24 text-m3-on-tertiary-container/5 rotate-12" />
    <div className="flex items-center gap-5 mb-8 relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-m3-on-tertiary-container/10 flex items-center justify-center text-m3-on-tertiary-container font-black text-2xl shadow-inner">
        {name ? name.charAt(0) : 'U'}
      </div>
      <div>
        <h4 className="font-black text-m3-on-tertiary-container text-lg leading-none mb-1">{name}</h4>
        <p className="text-[10px] font-black text-m3-on-tertiary-container/60 uppercase tracking-[0.2em]">{role}</p>
      </div>
    </div>
    <p className="text-m3-on-tertiary-container/80 font-medium text-lg leading-relaxed italic relative z-10">"{text}"</p>
  </div>
);

const PostCard = ({ post }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white rounded-4xl overflow-hidden border border-m3-outline/10 shadow-sm flex flex-col hover:shadow-m3-soft transition-all duration-smooth group"
  >
    <div className="h-56 relative overflow-hidden">
      <img 
        src={post.image_url || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80'} 
        alt={post.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-smooth" 
      />
      <div className="absolute top-6 left-6">
        <span className="bg-m3-primary text-m3-on-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          {post.category}
        </span>
      </div>
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-m3-primary uppercase tracking-[0.2em]">
        <Clock size={12}/> {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
      <h4 className="text-xl font-black text-m3-on-surface mb-4 leading-tight group-hover:text-m3-primary transition-colors">{post.title}</h4>
      <p className="text-m3-on-surface/60 leading-relaxed font-medium text-sm line-clamp-3 mb-6">{post.content}</p>
      <div className="mt-auto">
         <Link 
           href={route('news.show', post.id)}
           className="text-[11px] font-black text-m3-primary border-b-2 border-m3-primary/20 group-hover:border-m3-primary transition-all cursor-pointer uppercase"
         >
           BACA SELENGKAPNYA
         </Link>
      </div>
    </div>
  </motion.div>
);

export default function Home({ posts = [], testimonials = [], heroes = [], trust_stats = [], core_features = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isInteracted, setIsInteracted] = useState(false);
  const featuresRef = React.useRef(null);
  const postsRef = React.useRef(null);
  const testimonialsRef = React.useRef(null);

  // Auto-scroll helper
  const setupAutoScroll = (ref, interval = 5000, step = 350) => {
    useEffect(() => {
      const container = ref.current;
      if (!container) return;

      let hover = false;
      const onEnter = () => hover = true;
      const onLeave = () => hover = false;

      container.addEventListener('mouseenter', onEnter);
      container.addEventListener('mouseleave', onLeave);

      const timer = setInterval(() => {
        if (hover) return;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        if (scrollLeft + clientWidth >= scrollWidth - 50) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, interval);

      return () => {
        clearInterval(timer);
        container.removeEventListener('mouseenter', onEnter);
        container.removeEventListener('mouseleave', onLeave);
      };
    }, []);
  };

  setupAutoScroll(featuresRef, 6000, 380);
  setupAutoScroll(postsRef, 7000, 400);
  setupAutoScroll(testimonialsRef, 5500, 450);

  const defaultHeroes = [
    {
      id: 'default',
      title: "Evolusi Genetik.<br/><span class='text-m3-primary italic'>Presisi Nutrisi.</span>",
      subtitle: "Transformasi peternakan domba pedaging di Indramayu melalui ekosistem digital dan inovasi pakan organik.",
      image_url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
      button_text: "Buka Katalog",
      button_link: "/catalog",
      show_scanner: true
    }
  ];

  const defaultStats = [
    { id: 1, icon: 'ShoppingBag', value: '1.5K+', label: 'Domba Terjual' },
    { id: 2, icon: 'ShieldCheck', value: '100%', label: 'Rekam Medis' },
    { id: 3, icon: 'Activity', value: 'Zero', label: 'Virus & Wabah' },
    { id: 4, icon: 'TrendingUp', value: '2.5x', label: 'ADG Performa' },
  ];

  const defaultFeatures = [
    {
      id: 1, icon: 'ScanLine', title: "Cloud Identity System", 
      description: "Akses instan rekam medis dan histori pertumbuhan domba melalui sistem identifikasi berbasis cloud yang transparan.",
      image_url: "https://images.unsplash.com/photo-1626243265882-628dceba727a?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2, icon: 'ShieldCheck', title: "Pedigree Certification", 
      description: "Jaminan silsilah genetik untuk menjaga kualitas dan integritas bibit unggul bagi para peternak mitra.",
      image_url: "https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3, icon: 'Target', title: "Organic Bio-Fermented", 
      description: "Akselerasi bobot alami melalui formula pakan fermentasi organik yang mengedepankan kesehatan jangka panjang.",
      image_url: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const displayHeroes = heroes.length > 0 ? heroes : defaultHeroes;
  const displayStats = trust_stats.length > 0 ? trust_stats : defaultStats;
  const displayFeatures = core_features.length > 0 ? core_features : defaultFeatures;

  const nextSlide = (manual = false) => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % displayHeroes.length);
    if (manual) setIsInteracted(true);
  };

  const prevSlide = (manual = false) => {
    setDirection(-1);
    setCurrentSlide(prev => (prev === 0 ? displayHeroes.length - 1 : prev - 1));
    if (manual) setIsInteracted(true);
  };

  useEffect(() => {
    if (displayHeroes.length <= 1) return;
    
    // Gunakan 10 detik jika ada interaksi manual, jika tidak 6 detik
    const delay = isInteracted ? 10000 : 6000;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % displayHeroes.length);
      setIsInteracted(false); // Reset status interaksi setelah slide berpindah otomatis
    }, delay);

    return () => clearInterval(timer);
  }, [displayHeroes, currentSlide, isInteracted]);

  // Preload hero images to prevent flash on slide change
  useEffect(() => {
    displayHeroes.forEach(hero => {
      if (hero.image_url) {
        const img = new Image();
        img.src = hero.image_url;
      }
    });
  }, [displayHeroes]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction >= 0 ? 120 : -120,
      scale: 0.92,
      rotateY: direction >= 0 ? 6 : -6,
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
      zIndex: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: (direction) => ({
      x: direction >= 0 ? -80 : 80,
      scale: 0.95,
      rotateY: direction >= 0 ? -4 : 4,
      opacity: 0,
      zIndex: 2,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }
    })
  };

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      name: "H. Ahmad Subianto", role: "Peternak Indukan", 
      text: "Silsilah domba dari WisDom+ sangat jelas. Indukan F2 Suffolk yang saya beli bulan lalu sudah beranak dengan sehat. Transparansi datanya luar biasa!"
    },
    {
      name: "Dian Restoran Aqiqah", role: "Usaha Aqiqah", 
      text: "Daging dombanya lebih padat dan tidak prengus, mungkin karena pakannya pakai limbah buah fermentasi. Klien aqiqah saya pada puas semua."
    },
    {
      name: "Investor Jabar", role: "Mitra Bisnis", 
      text: "Sistem Cloud Identity mempermudah audit aset. Kami bisa scan di kandang dan langsung tahu umur serta estimasi nilainya secara akurat."
    }
  ];

  return (
    <PublicLayout currentRoute="home">
      <Head title="Beranda - Wisma Domba Farm" />
      
      <div className="space-y-0 selection:bg-m3-primary selection:text-white">
        
        {/* HERO SLIDER SECTION */}
        <section className="relative min-h-[450px] md:min-h-[700px] flex flex-col justify-center pt-0 pb-[37px] px-4 md:px-6 bg-m3-surface overflow-hidden border-b border-m3-outline/5">
          <div className="max-w-[1600px] mx-auto w-full relative" style={{ perspective: '1200px' }}>
            
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div 
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -80) {
                    nextSlide(true);
                  } else if (offset.x > 80) {
                    prevSlide(true);
                  }
                }}
                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
                className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-m3-soft relative overflow-hidden flex flex-col lg:flex-row items-center min-h-[380px] md:min-h-[550px] cursor-grab active:cursor-grabbing"
              >
                {/* Image Layer */}
                <div className="absolute top-0 right-0 w-full lg:w-[70%] h-48 md:h-64 lg:h-full opacity-100 pointer-events-none lg:block select-none z-0">
                    <img 
                        src={displayHeroes[currentSlide].image_url} 
                        alt="Hero Banner" 
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover lg:rounded-l-[10rem]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white via-[15%] to-transparent hidden lg:block"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden"></div>
                </div>

                <div className="p-6 md:p-16 relative z-10 w-full lg:max-w-4xl mt-48 md:mt-64 lg:mt-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-m3-primary/10 text-m3-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-8 border border-m3-primary/5">
                        <ShieldCheck size={12} /> Berlisensi & Bersertifikat
                    </div>

                    <h1 
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] mb-4 md:mb-6 tracking-tighter"
                        dangerouslySetInnerHTML={{ __html: displayHeroes[currentSlide].title }}
                    />
                    
                    <p className="text-sm md:text-xl text-slate-500 max-w-xl mb-6 md:mb-8 leading-relaxed font-medium">
                        {displayHeroes[currentSlide].subtitle}
                    </p>

                    <div className="flex flex-row gap-3 md:gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom duration-500">
                        {displayHeroes[currentSlide].button_text && displayHeroes[currentSlide].button_link && (
                            <Link href={displayHeroes[currentSlide].button_link} className="flex-1 sm:flex-none bg-m3-primary text-white px-4 md:px-10 py-2.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-lg font-black hover:bg-emerald-700 transition-all duration-smooth shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group">
                                {displayHeroes[currentSlide].button_text} <ArrowRight size={14} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                        <Link href="/scanner" className={`flex-1 sm:flex-none bg-slate-50 text-slate-600 border border-slate-200 px-4 md:px-10 py-2.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-lg font-black hover:bg-slate-100 transition-all duration-smooth flex items-center justify-center gap-2 ${!displayHeroes[currentSlide].show_scanner && 'hidden'}`}>
                            <ScanLine size={20} className="text-m3-primary" /> Scan KTP
                        </Link>
                    </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots - Hidden */}

            {/* Stats section - Optimized for mobile visibility */}            <div className="mt-8 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl mx-auto animate-in fade-in duration-1000 delay-500">
                {displayStats.map((s, idx) => (
                    <HeroStat key={s.id || idx} icon={s.icon} value={s.value} label={s.label} />
                ))}
            </div>
          </div>
        </section>

        {/* CORE FEATURES - HORIZONTAL SLIDER */}
        <section className="pt-0 pb-[37px] px-6 bg-m3-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-m3-primary tracking-[0.4em] uppercase mb-3">penjaminan mutu dan kualitas</h2>
                <h3 className="text-4xl md:text-5xl font-black text-m3-on-surface mb-3 tracking-tight leading-none">Standarisasi Peternakan Kami</h3>
                <p className="text-m3-on-surface/50 text-lg leading-relaxed font-medium">Integrasi peternakan pintar dan pakan sehat.</p>
              </div>
            </div>
            
            <div className="relative group">
              <div ref={featuresRef} className="flex gap-8 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                {displayFeatures.map((f) => (
                    <div key={f.id} className="min-w-[300px] md:min-w-[380px] snap-center">
                        <FeatureCard 
                            icon={f.icon} 
                            title={f.title} 
                            desc={f.description}
                            img={f.image_url}
                        />
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FARM UPDATES - HORIZONTAL SLIDER */}
        {posts.length > 0 && (
          <section className="pt-0 pb-[37px] bg-m3-surface relative overflow-hidden border-t border-m3-outline/5 px-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-m3-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-[10px] font-black text-m3-primary tracking-[0.4em] uppercase mb-3">Farm Updates</h2>
                  <h3 className="text-4xl md:text-5xl font-black text-m3-on-surface tracking-tighter leading-tight italic">Kabar Wisma Domba Farm</h3>
                  <p className="text-m3-on-surface/50 font-medium mt-3 max-w-lg leading-relaxed">
                    Ikuti perjalanan harian kami dalam memajukan standar peternakan domba di Indonesia.
                  </p>
                </div>
                <div className="hidden md:block">
                   <Link href="/news" className="group flex items-center gap-2 text-[11px] font-black text-m3-primary uppercase tracking-widest transition-all">
                      <span className="border-b-2 border-m3-primary/20 group-hover:border-m3-primary transition-all">Lihat Semua Kabar</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>

              <div className="relative group">
                <div ref={postsRef} className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                    {posts.map((post) => (
                        <div key={post.id} className="min-w-[300px] md:min-w-[400px] snap-center">
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIALS - HORIZONTAL SLIDER */}
        <section className="pt-0 pb-[37px] bg-m3-secondary-container/20 border-y border-m3-primary/5 overflow-hidden px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-m3-primary tracking-[0.4em] uppercase mb-3">Kemitraan Strategis</h2>
                <h3 className="text-4xl md:text-5xl font-black text-m3-on-surface tracking-tighter leading-tight">Kepercayaan di Lapangan.</h3>
                <p className="text-m3-on-surface/50 font-medium mt-3 leading-relaxed">Kolaborasi nyata bersama peternak dan mitra bisnis kami.</p>
              </div>
              <Link href="/contact" className="group flex items-center gap-2 text-[11px] font-black text-m3-primary uppercase tracking-widest transition-all">
                <span className="border-b-2 border-m3-primary/20 group-hover:border-m3-primary transition-all">Konsultasi Ternak</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative group">
                <div ref={testimonialsRef} className="flex gap-8 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                    {displayTestimonials.map((t, i) => (
                        <div key={t.id || i} className="min-w-[320px] md:min-w-[450px] snap-center">
                            <TestimonialCard 
                                name={t.name} 
                                role={t.role} 
                                text={t.text}
                            />
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
