import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Send, Clock, Hash } from 'lucide-react';

export default function Posts({ posts = [], stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
    title: '',
    content: '',
    category: 'Update Farm',
    image_url: '',
    imageFile: null,
    is_published: true
  });

  const openAdd = () => {
    setEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditMode(true);
    setSelectedPost(p);
    setData({
      title: p.title,
      content: p.content,
      category: p.category,
      image_url: p.image_url || '',
      imageFile: null,
      is_published: p.is_published
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (editMode) {
      post(route('admin.posts.update', selectedPost.id), {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route('admin.posts.store'), {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  const headerActions = (
    <button onClick={openAdd} className="bg-m3-primary text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3">
        <Plus size={18} strokeWidth={3} /> Buat Postingan
    </button>
  );

  return (
    <AdminLayout currentTab="posts" title="Kabar Farm (Feed)" actions={headerActions}>
      <Head title="Manajemen Konten" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Array.isArray(posts) ? posts : (posts?.data || [])).map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="h-48 relative overflow-hidden bg-slate-100">
                {p.image_url ? (
                  <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-m3-primary border border-white/20">
                    {p.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-xl font-black text-slate-900 leading-tight">{p.title}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 bg-slate-50 text-slate-400 hover:text-m3-primary hover:bg-m3-primary/5 rounded-xl transition-colors"><Edit size={16}/></button>
                    <button onClick={() => confirm('Hapus postingan ini?') && destroy(route('admin.posts.destroy', p.id))} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">{p.content}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <Clock size={12}/> {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            
            <form onSubmit={submit} className="p-12 space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-m3-primary/10 p-4 rounded-2xl"><Send className="text-m3-primary" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editMode ? 'Edit Postingan' : 'Postingan Baru'}</h3>
                  <p className="text-[10px] font-black text-m3-primary uppercase tracking-widest">Publikasikan Kabar Terbaru Farm</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Postingan</label>
                  <input 
                    type="text" 
                    value={data.title} 
                    onChange={e => setData('title', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                    placeholder="Contoh: Panen Raya Domba Cross Texel"
                  />
                  {errors.title && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                    <select 
                      value={data.category} 
                      onChange={e => setData('category', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all appearance-none"
                    >
                      <option>Update Farm</option>
                      <option>Edukasi</option>
                      <option>Kemitraan</option>
                      <option>Penawaran</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gambar Utama</label>
                    <input 
                      type="file" 
                      onChange={e => setData('imageFile', e.target.files[0])}
                      className="w-full bg-slate-50 border-none rounded-2xl p-3.5 font-bold text-[10px] focus:ring-4 focus:ring-m3-primary/10 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-m3-primary file:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konten / Caption</label>
                  <textarea 
                    value={data.content} 
                    onChange={e => setData('content', e.target.value)}
                    rows={6}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                    placeholder="Tulis detail postingan di sini..."
                  />
                  {errors.content && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.content}</p>}
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Atau URL Gambar (Opsional)</label>
                   <input 
                     type="text" 
                     value={data.image_url} 
                     onChange={e => setData('image_url', e.target.value)}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                     placeholder="https://..."
                   />
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-m3-primary text-white flex items-center justify-center"><Send size={20}/></div>
                       <div>
                          <p className="text-xs font-black text-emerald-900">Publikasikan Postingan?</p>
                          <p className="text-[10px] font-bold text-emerald-600/70">Jika aktif, akan muncul di halaman depan</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.is_published} 
                        onChange={e => setData('is_published', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-m3-primary"></div>
                    </label>
                </div>
              </div>

              <button type="submit" disabled={processing} className="w-full bg-m3-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-m3-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {processing ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Terbitkan Sekarang')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
