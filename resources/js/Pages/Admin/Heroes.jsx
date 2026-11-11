import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Layout, Move, ChevronRight } from 'lucide-react';

export default function Heroes({ heroes = [], stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    title_main: '',
    title_accent: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    image_url: '',
    imageFile: null,
    is_active: true,
    show_scanner: true,
    order: 0
  });

  const openAdd = () => {
    setEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEdit = (h) => {
    setEditMode(true);
    setSelectedHero(h);
    
    // Logic to extract main and accent from HTML string
    let main = h.title;
    let accent = '';
    if (h.title.includes('<br/>')) {
        const parts = h.title.split('<br/>');
        main = parts[0];
        if (parts[1] && parts[1].includes("'>")) {
            accent = parts[1].split("'>")[1].split('</span>')[0];
        }
    } else if (h.title.includes("'>")) {
         accent = h.title.split("'>")[1].split('</span>')[0];
         main = h.title.split('<span')[0];
    }

    setData({
      title_main: main,
      title_accent: accent,
      subtitle: h.subtitle || '',
      button_text: h.button_text || '',
      button_link: h.button_link || '',
      image_url: h.image_url || '',
      imageFile: null,
      is_active: !!h.is_active,
      show_scanner: h.hasOwnProperty('show_scanner') ? !!h.show_scanner : true,
      order: h.order || 0
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const url = editMode ? route('admin.heroes.update', selectedHero.id) : route('admin.heroes.store');
    
    const submitData = { ...data };
    if (editMode) submitData._method = 'POST'; 

    post(url, {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
    });
  };

  const headerActions = (
    <button onClick={openAdd} className="bg-m3-primary text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3">
        <Plus size={18} strokeWidth={3} /> Tambah Slide
    </button>
  );

  return (
    <AdminLayout currentTab="heroes" title="Hero Slider" actions={headerActions}>
      <Head title="Manajemen Hero Slider" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {heroes.map((h) => (
            <div key={h.id} className={`bg-white rounded-[2.5rem] border ${h.is_active ? 'border-slate-100' : 'border-slate-200 opacity-60'} shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 relative`}>
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img src={h.image_url} alt={h.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Move size={12}/> Order: {h.order}
                </div>
                {!h.is_active && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Nonaktif</span>
                    </div>
                )}
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{h.title}</h4>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-1">{h.subtitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(h)} className="p-2 bg-slate-50 text-slate-400 hover:text-m3-primary hover:bg-m3-primary/5 rounded-xl transition-colors"><Edit size={16}/></button>
                    <button onClick={() => { if (confirm('Hapus slide ini?')) router.delete(route('admin.heroes.destroy', h.id)); }} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                    {h.button_text && (
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                            {h.button_text} <ChevronRight size={12}/>
                        </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          {heroes.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
               <Layout size={48} strokeWidth={1} />
               <p className="font-bold text-sm uppercase tracking-widest">Belum ada slide hero</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            
            <form onSubmit={submit} className="p-12 space-y-8 max-h-[85vh] overflow-y-auto hide-scrollbar">
              <div className="flex items-center gap-6">
                <div className="bg-m3-primary/10 p-4 rounded-2xl"><ImageIcon className="text-m3-primary" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editMode ? 'Edit Slide' : 'Slide Baru'}</h3>
                  <p className="text-[10px] font-black text-m3-primary uppercase tracking-widest">Banner utama halaman depan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Utama</label>
                        <input 
                            type="text" 
                            value={data.title_main} 
                            onChange={e => setData('title_main', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                            placeholder="Contoh: Evolusi Genetik."
                        />
                        {errors.title_main && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.title_main}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teks Aksen (Warna Hijau)</label>
                        <input 
                            type="text" 
                            value={data.title_accent} 
                            onChange={e => setData('title_accent', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                            placeholder="Contoh: Presisi Nutrisi."
                        />
                        {errors.title_accent && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.title_accent}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-judul / Deskripsi</label>
                    <textarea 
                        value={data.subtitle} 
                        onChange={e => setData('subtitle', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                        placeholder="Deskripsi singkat..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teks Tombol</label>
                        <input type="text" value={data.button_text} onChange={e => setData('button_text', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all" placeholder="Contoh: Buka Katalog (Kosongkan jika tidak mau ada tombol)" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Halaman Tujuan (Link)</label>
                        <select 
                            value={data.button_link} 
                            onChange={e => setData('button_link', e.target.value)} 
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                        >
                            <option value="">-- Tanpa Link --</option>
                            <option value="/">Beranda</option>
                            <option value="/catalog">Katalog Domba</option>
                            <option value="/scanner">Scanner QR KTP</option>
                            <option value="/contact">Halaman Kontak</option>
                            <option value="/news">Kabar Farm</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urutan (Order)</label>
                        <input type="number" value={data.order} onChange={e => setData('order', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm" />
                    </div>
                    <div className="flex flex-col gap-2 justify-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-6 h-6 rounded-lg border-slate-200 text-m3-primary focus:ring-m3-primary" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Tampilkan di Web?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={data.show_scanner} onChange={e => setData('show_scanner', e.target.checked)} className="w-6 h-6 rounded-lg border-slate-200 text-m3-primary focus:ring-m3-primary" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Tampilkan Tombol Scan KTP?</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Background (Max 2MB)</label>
                    <input type="file" onChange={e => setData('imageFile', e.target.files[0])} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-m3-primary file:text-white" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Atau Image URL</label>
                    <input type="text" value={data.image_url} onChange={e => setData('image_url', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm" placeholder="https://..." />
                </div>
              </div>

              <button type="submit" disabled={processing} className="w-full bg-m3-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-m3-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {processing ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Tambah Slide')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
