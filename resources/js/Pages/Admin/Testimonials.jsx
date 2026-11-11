import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, X, Quote, User, Star } from 'lucide-react';

export default function Testimonials({ testimonials = [], stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
    name: '',
    role: '',
    text: '',
    is_active: true
  });

  const openAdd = () => {
    setEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEdit = (t) => {
    setEditMode(true);
    setSelectedTestimonial(t);
    setData({
      name: t.name,
      role: t.role || '',
      text: t.text,
      is_active: !!t.is_active
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (editMode) {
      patch(route('admin.testimonials.update', selectedTestimonial.id), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route('admin.testimonials.store'), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  return (
    <AdminLayout currentTab="testimonials" stats={stats} fullScreen={fullScreen}>
      <Head title="Manajemen Testimoni" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-m3-soft flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-m3-primary/10 p-5 rounded-3xl"><Quote className="w-10 h-10 text-m3-primary" /></div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Testimoni Pelanggan</h2>
              <p className="text-m3-primary/60 font-bold uppercase tracking-widest text-[10px]">Kelola ulasan dan feedback dari mitra & pembeli</p>
            </div>
          </div>
          <button onClick={openAdd} className="bg-m3-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3">
            <Plus size={18} strokeWidth={3} /> Tambah Testimoni
          </button>
        </div>

        {/* TESTIMONIALS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className={`bg-white rounded-[2.5rem] border ${t.is_active ? 'border-slate-100' : 'border-slate-200 opacity-60'} shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 relative`}>
              {!t.is_active && (
                <div className="absolute top-6 right-6 bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest z-10">Nonaktif</div>
              )}
              
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-m3-primary/5 rounded-2xl flex items-center justify-center text-m3-primary">
                        <User size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">{t.name}</h4>
                        <p className="text-[10px] font-bold text-m3-primary/60 uppercase tracking-widest">{t.role || 'Pelanggan'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="p-2 bg-slate-50 text-slate-400 hover:text-m3-primary hover:bg-m3-primary/5 rounded-xl transition-colors"><Edit size={16}/></button>
                    <button onClick={() => confirm('Hapus testimoni ini?') && destroy(route('admin.testimonials.destroy', t.id))} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-m3-primary/5 -z-0" />
                    <p className="text-sm text-slate-600 font-medium italic leading-relaxed relative z-10">"{t.text}"</p>
                </div>

                <div className="flex items-center gap-1 pt-4 border-t border-slate-50">
                   {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-m3-primary text-m3-primary" />)}
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
               <Quote size={48} strokeWidth={1} />
               <p className="font-bold text-sm uppercase tracking-widest">Belum ada testimoni</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            
            <form onSubmit={submit} className="p-12 space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-m3-primary/10 p-4 rounded-2xl"><Quote className="text-m3-primary" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editMode ? 'Edit Testimoni' : 'Testimoni Baru'}</h3>
                  <p className="text-[10px] font-black text-m3-primary uppercase tracking-widest">Feedback dari pelanggan setia WisDom+</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                        type="text" 
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                        placeholder="Contoh: H. Ahmad Subianto"
                    />
                    {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peran / Jabatan</label>
                    <input 
                        type="text" 
                        value={data.role} 
                        onChange={e => setData('role', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                        placeholder="Contoh: Peternak Indukan"
                    />
                    {errors.role && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.role}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Isi Testimoni</label>
                  <textarea 
                    value={data.text} 
                    onChange={e => setData('text', e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                    placeholder="Tulis ulasan pelanggan di sini..."
                  />
                  {errors.text && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.text}</p>}
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-m3-primary text-white flex items-center justify-center"><Star size={20}/></div>
                       <div>
                          <p className="text-xs font-black text-emerald-900">Aktifkan Testimoni?</p>
                          <p className="text-[10px] font-bold text-emerald-600/70">Jika aktif, akan muncul di halaman depan</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.is_active} 
                        onChange={e => setData('is_active', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-m3-primary"></div>
                    </label>
                </div>
              </div>

              <button type="submit" disabled={processing} className="w-full bg-m3-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-m3-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {processing ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Tambah Testimoni')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
