import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Share2, MessageSquare, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewsDetail({ post }) {
  return (
    <PublicLayout currentRoute="news">
      <Head title={`${post.title} - Kabar WisDom+`} />
      
      <div className="bg-m3-surface min-h-screen pt-0 pb-[37px] font-sans selection:bg-m3-primary/10">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* NAVIGATION & META */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between mb-10"
          >
            <Link 
              href="/"
              className="group flex items-center gap-3 text-slate-400 hover:text-m3-primary transition-colors font-bold text-sm uppercase tracking-widest"
            >
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={18} />
              </div>
              Kembali ke Beranda
            </Link>
            
            <div className="flex gap-4">
              <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-m3-primary transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </motion.div>

          {/* ARTICLE CONTENT */}
          <article className="bg-white rounded-[4rem] shadow-m3-soft border border-slate-100 overflow-hidden">
            {/* Header Image */}
            <div className="h-[450px] relative overflow-hidden">
              <img 
                src={post.image_url || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80'} 
                className="w-full h-full object-cover" 
                alt={post.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-8 left-8">
                 <span className="bg-m3-primary text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">
                   {post.category}
                 </span>
              </div>
            </div>

            <div className="p-10 md:p-16 -mt-16 relative z-10 bg-white rounded-t-[4rem]">
              <div className="flex items-center gap-6 mb-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-8">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-m3-primary" />
                  {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-m3-primary" />
                  Admin WisDom+
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-[1.1] mb-10 tracking-tighter italic">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* FOOTER ARTICLE */}
              <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-m3-primary/10 flex items-center justify-center text-m3-primary">
                    <Tag size={20} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori: <span className="text-slate-800">{post.category}</span></p>
                </div>
                
                <Link 
                   href="/contact"
                   className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-m3-primary transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3"
                >
                  <MessageSquare size={18} /> Hubungi Kami
                </Link>
              </div>
            </div>
          </article>

          {/* MORE POSTS SECTION - SUGGESTION */}
          <div className="mt-20 text-center">
             <p className="text-[10px] font-black text-m3-primary uppercase tracking-[0.4em] mb-10">Ingin tahu lebih banyak?</p>
             <Link 
               href="/catalog"
               className="inline-flex items-center gap-4 text-2xl font-black text-slate-800 hover:text-m3-primary transition-colors group"
             >
               Lihat Katalog Domba Kami <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
