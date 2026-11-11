import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
  Edit3, Save, X, Image as ImageIcon, Eye, Layout, 
  ChevronRight, Plus, Trash2, Layers, CheckCircle, Award, Target, ShieldCheck, Activity, Users, Star, TrendingUp, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IconRenderer = ({ name, size = 24, className = "" }) => {
    switch (name) {
        case 'Award': return <Award size={size} className={className} />;
        case 'Target': return <Target size={size} className={className} />;
        case 'ShieldCheck': return <ShieldCheck size={size} className={className} />;
        case 'Activity': return <Activity size={size} className={className} />;
        case 'Users': return <Users size={size} className={className} />;
        case 'Star': return <Star size={size} className={className} />;
        case 'TrendingUp': return <TrendingUp size={size} className={className} />;
        default: return <Star size={size} className={className} />;
    }
};

// Helper to convert HTML span to [text] for the editor
const htmlToBrackets = (html) => {
    if (!html) return '';
    return html.replace(/<span class="text-m3-primary">(.*?)<\/span>/g, '[$1]');
};

// Helper to convert [text] back to HTML span for saving
const bracketsToHtml = (text) => {
    if (!text) return '';
    return text.replace(/\[(.*?)\]/g, '<span class="text-m3-primary">$1</span>');
};

const SectionPreview = ({ section, onEdit }) => {
  const isHero = section.key === 'hero';
  const isStory = section.key === 'story';
  const isValues = section.key === 'values';

  return (
    <div className="relative group/canvas mb-20 last:mb-0">
      {/* Overlay Edit Button */}
      <div className="absolute inset-0 z-30 opacity-0 group-hover/canvas:opacity-100 transition-all duration-300 flex items-center justify-center bg-slate-900/5 backdrop-blur-[2px] rounded-[3rem] pointer-events-none">
          <button 
            onClick={() => onEdit(section)}
            className="pointer-events-auto bg-white text-slate-800 px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            <Edit3 size={20} className="text-m3-primary" /> Edit Modul {section.key.toUpperCase()}
          </button>
      </div>

      <div className={`transition-opacity duration-500 ${!section.is_active ? 'opacity-40 grayscale-[0.5]' : ''}`}>
          {isHero && (
            <div className="bg-white py-20 px-6 rounded-[3rem] border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#2B5E41 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <h1 
                    className="text-5xl font-black text-slate-800 mb-6 tracking-tighter uppercase italic relative z-10"
                    dangerouslySetInnerHTML={{ __html: section.title }}
                />
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed relative z-10">
                    {section.subtitle}
                </p>
                {!section.is_active && <div className="absolute top-4 right-10 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">DRAFT / HIDDEN</div>}
            </div>
          )}

          {isStory && (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
                <div className="relative h-[400px]">
                    <img src={section.image_url} className="w-full h-full object-cover rounded-[2rem] border border-slate-50" />
                    {section.content?.stats?.[0] && (
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex items-center gap-4">
                            <div className="bg-m3-primary/10 p-2 rounded-xl text-m3-primary"><Award size={24} /></div>
                            <div>
                                <p className="font-black text-slate-800 leading-none">{section.content.stats[0].value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.content.stats[0].label}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    <span className="inline-block px-3 py-1 bg-m3-primary/10 text-m3-primary text-[10px] font-black uppercase tracking-widest rounded-full">Kisah Kami</span>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{section.title}</h2>
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-4">{section.content?.description}</p>
                </div>
                {!section.is_active && <div className="absolute top-4 right-10 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">DRAFT / HIDDEN</div>}
            </div>
          )}

          {isValues && (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 relative">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{section.title}</h2>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {section.content?.map((v, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <IconRenderer name={v.icon} size={20} className="text-m3-primary mb-4" />
                            <h4 className="font-black text-slate-800 text-sm mb-2">{v.title}</h4>
                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2">{v.desc}</p>
                        </div>
                    ))}
                </div>
                {!section.is_active && <div className="absolute top-4 right-10 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">DRAFT / HIDDEN</div>}
            </div>
          )}
      </div>
    </div>
  );
};

export default function AboutManagement({ sections = [], stats, fullScreen }) {
    const [editingSection, setEditingSection] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        subtitle: '',
        content: null,
        is_active: true,
        imageFile: null,
        _method: 'POST'
    });

    const startEdit = (section) => {
        setEditingSection(section);
        setData({
            title: htmlToBrackets(section.title || ''),
            subtitle: section.subtitle || '',
            content: section.content || null,
            is_active: section.is_active,
            imageFile: null,
            _method: 'POST'
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            title: bracketsToHtml(data.title)
        };

        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            if (key === 'content') {
                formData.append(key, JSON.stringify(payload[key]));
            } else if (key === 'imageFile' && payload[key]) {
                formData.append(key, payload[key]);
            } else {
                formData.append(key, payload[key]);
            }
        });

        post(route('admin.about.update', editingSection.id), {
            forceFormData: true,
            onSuccess: () => {
                setEditingSection(null);
                reset();
            }
        });
    };

    return (
        <AdminLayout currentTab="about" stats={stats} fullScreen={fullScreen}>
            <Head title="Live Canvas Editor" />

            <div className="p-8 max-w-[1200px] mx-auto">
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-6">
                        <div className="bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-xl">
                            <Monitor size={28} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Live <span className="text-m3-primary">Canvas</span></h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Gunakan pratinjau langsung untuk mengedit konten publik</p>
                        </div>
                    </div>
                    
                    <a 
                        href="/about" 
                        target="_blank"
                        className="flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-m3-primary hover:border-m3-primary transition-all shadow-sm"
                    >
                        <Eye size={16} /> Pratinjau Publik
                    </a>
                </div>

                {/* THE CANVAS */}
                <div className="bg-slate-50 p-12 rounded-[5rem] border border-slate-100 shadow-inner min-h-screen">
                    {sections.map((section) => (
                        <SectionPreview 
                            key={section.id} 
                            section={section} 
                            onEdit={startEdit} 
                        />
                    ))}
                    
                    <div className="mt-20 text-center pb-20">
                        <div className="inline-flex flex-col items-center gap-4 text-slate-300">
                            <CheckCircle size={48} strokeWidth={1} />
                            <p className="font-black uppercase tracking-[0.4em] text-[10px]">Akhir Halaman Publik</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {editingSection && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingSection(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col border border-white/20"
                        >
                            <div className="flex flex-1 overflow-hidden">
                                {/* Left Side: Editor Form */}
                                <div className="w-full md:w-1/2 p-10 overflow-y-auto hide-scrollbar border-r border-slate-50">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-3 bg-m3-primary/10 text-m3-primary rounded-2xl">
                                            <Edit3 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Edit Modul</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{editingSection.key} Settings</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdate} className="space-y-10">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-primary">Judul Utama</label>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const input = document.getElementById('titleInput');
                                                                const start = input.selectionStart;
                                                                const end = input.selectionEnd;
                                                                const text = input.value;
                                                                if (start !== end) {
                                                                    const selected = text.substring(start, end);
                                                                    const before = text.substring(0, start);
                                                                    const after = text.substring(end);
                                                                    setData('title', `${before}[${selected}]${after}`);
                                                                }
                                                            }}
                                                            className="bg-emerald-50 text-m3-primary border border-emerald-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-m3-primary hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <Star size={12} /> Beri Warna Brand
                                                        </button>
                                                    </div>
                                                </div>
                                                <input 
                                                    id="titleInput"
                                                    type="text"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    placeholder="Contoh: Tentang [WisDom+]"
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg text-slate-800 focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                                />
                                                <p className="text-[9px] text-slate-400 font-medium italic">Sorot teks lalu klik tombol di atas untuk memberi warna hijau khas WisDom+.</p>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-primary">Sub-Judul</label>
                                                <textarea 
                                                    value={data.subtitle}
                                                    onChange={e => setData('subtitle', e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-medium text-slate-600 focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                                />
                                            </div>

                                            {editingSection.key === 'story' && (
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-primary">Detail Narasi</label>
                                                    <textarea 
                                                        value={data.content?.description || ''}
                                                        onChange={e => setData('content', { ...data.content, description: e.target.value })}
                                                        rows={6}
                                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 font-medium text-slate-600 focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                                    />
                                                </div>
                                            )}

                                            {editingSection.key === 'values' && (
                                                <div className="space-y-6">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-primary">Daftar Nilai Inti</label>
                                                    <div className="space-y-4">
                                                        {data.content?.map((val, idx) => (
                                                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                                                <input 
                                                                    type="text"
                                                                    value={val.title}
                                                                    onChange={e => {
                                                                        const newContent = [...data.content];
                                                                        newContent[idx].title = e.target.value;
                                                                        setData('content', newContent);
                                                                    }}
                                                                    className="w-full bg-white border-none rounded-xl px-4 py-2 font-black text-slate-800 text-sm"
                                                                />
                                                                <textarea 
                                                                    value={val.desc}
                                                                    onChange={e => {
                                                                        const newContent = [...data.content];
                                                                        newContent[idx].desc = e.target.value;
                                                                        setData('content', newContent);
                                                                    }}
                                                                    className="w-full bg-white border-none rounded-xl p-4 text-xs font-medium text-slate-500"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image Helper */}
                                        {(editingSection.key === 'story' || editingSection.key === 'hero') && (
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-primary">Media Visual</label>
                                                <input 
                                                    type="file" 
                                                    id="imgUpload"
                                                    className="hidden"
                                                    onChange={e => setData('imageFile', e.target.files[0])}
                                                />
                                                <label 
                                                    htmlFor="imgUpload"
                                                    className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-m3-primary hover:bg-m3-primary/5 transition-all cursor-pointer group"
                                                >
                                                    <div className="bg-white p-4 rounded-2xl shadow-sm text-slate-400 group-hover:text-m3-primary">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-black text-slate-800">Ganti Gambar</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maks. 2MB (JPG/PNG)</p>
                                                    </div>
                                                </label>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">Status Publikasi</p>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{data.is_active ? 'Terlihat di Publik' : 'Disembunyikan'}</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setData('is_active', !data.is_active)}
                                                className={`w-14 h-8 rounded-full transition-all relative ${data.is_active ? 'bg-m3-primary' : 'bg-slate-300'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${data.is_active ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Right Side: Live Visual Preview */}
                                <div className="hidden md:flex flex-1 bg-slate-900/5 items-center justify-center p-12 overflow-y-auto">
                                    <div className="w-full space-y-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Visual Preview</p>
                                        </div>
                                        
                                        <div className="scale-90 origin-top transform transition-all duration-500">
                                            <SectionPreview 
                                                section={{
                                                    ...editingSection,
                                                    title: bracketsToHtml(data.title),
                                                    subtitle: data.subtitle,
                                                    content: data.content,
                                                    is_active: data.is_active,
                                                    image_url: data.imageFile ? URL.createObjectURL(data.imageFile) : editingSection.image_url
                                                }}
                                                onEdit={() => {}} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div className="p-8 bg-white border-t border-slate-100 flex justify-end items-center gap-4">
                                <button 
                                    onClick={() => setEditingSection(null)}
                                    className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest hover:text-slate-800 transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleUpdate}
                                    disabled={processing}
                                    className="bg-m3-primary text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-emerald-900/30 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    <Save size={20} /> {processing ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}