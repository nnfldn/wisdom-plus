import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, ShieldCheck, ScanLine, Target, Activity, Star, Users } from 'lucide-react';

const availableIcons = [
    { name: 'ScanLine', icon: <ScanLine size={16}/> },
    { name: 'ShieldCheck', icon: <ShieldCheck size={16}/> },
    { name: 'Target', icon: <Target size={16}/> },
    { name: 'Activity', icon: <Activity size={16}/> },
    { name: 'Star', icon: <Star size={16}/> },
    { name: 'Users', icon: <Users size={16}/> },
];

const IconRenderer = ({ name, size = 24 }) => {
    switch (name) {
        case 'ScanLine': return <ScanLine size={size} />;
        case 'ShieldCheck': return <ShieldCheck size={size} />;
        case 'Target': return <Target size={size} />;
        case 'Star': return <Star size={size} />;
        case 'Users': return <Users size={size} />;
        default: return <Activity size={size} />;
    }
};

export default function Features({ features_list = [], stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    icon: 'ScanLine',
    title: '',
    description: '',
    image_url: '',
    imageFile: null,
    is_active: true,
    order: 0
  });

  const openAdd = () => {
    setEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEdit = (f) => {
    setEditMode(true);
    setSelectedFeature(f);
    setData({
      icon: f.icon,
      title: f.title,
      description: f.description || '',
      image_url: f.image_url || '',
      imageFile: null,
      is_active: !!f.is_active,
      order: f.order || 0
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const url = editMode ? route('admin.features.update', selectedFeature.id) : route('admin.features.store');
    
    post(url, {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
    });
  };

  const headerActions = (
    <button onClick={openAdd} className="bg-m3-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3">
        <Plus size={18} strokeWidth={3} /> Tambah Fitur
    </button>
  );

  return (
    <AdminLayout currentTab="features" title="Standarisasi Farm" actions={headerActions}>
      <Head title="Manajemen Standarisasi" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features_list.map((f) => (
            <div key={f.id} className={`bg-white rounded-[2.5rem] border ${f.is_active ? 'border-slate-100' : 'border-slate-200 opacity-60'} shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 relative`}>
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img src={f.image_url} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-xl text-m3-primary shadow-lg">
                    <IconRenderer name={f.icon} size={18} />
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{f.title}</h4>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-2">{f.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(f)} className="p-2 bg-slate-50 text-slate-400 hover:text-m3-primary rounded-xl transition-colors"><Edit size={16}/></button>
                    <button onClick={() => { if (confirm('Hapus fitur ini?')) router.delete(route('admin.features.destroy', f.id)); }} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {features_list.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
               <ShieldCheck size={48} strokeWidth={1} />
               <p className="font-bold text-sm uppercase tracking-widest">Belum ada fitur standarisasi</p>
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
                <div className="bg-m3-primary/10 p-4 rounded-2xl"><IconRenderer name={data.icon} /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editMode ? 'Edit Fitur' : 'Fitur Baru'}</h3>
                  <p className="text-[10px] font-black text-m3-primary uppercase tracking-widest">Pilar Standarisasi WisDom+</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Ikon</label>
                    <div className="grid grid-cols-6 gap-2">
                        {availableIcons.map(item => (
                            <button 
                                key={item.name} 
                                type="button"
                                onClick={() => setData('icon', item.name)}
                                className={`p-3 rounded-xl border flex items-center justify-center transition-all ${data.icon === item.name ? 'bg-m3-primary text-white border-m3-primary shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Fitur</label>
                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm" placeholder="Contoh: Cloud Identity System" />
                    {errors.title && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm" placeholder="Jelaskan keunggulan fitur ini..." />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urutan</label>
                        <input type="number" value={data.order} onChange={e => setData('order', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm" />
                    </div>
                    <div className="flex items-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-6 h-6 rounded-lg border-slate-200 text-m3-primary focus:ring-m3-primary" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Aktifkan?</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Gambar Latar</label>
                    <input type="file" onChange={e => setData('imageFile', e.target.files[0])} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-m3-primary file:text-white" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Atau Image URL</label>
                    <input type="text" value={data.image_url} onChange={e => setData('image_url', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm" placeholder="https://..." />
                </div>
              </div>

              <button type="submit" disabled={processing} className="w-full bg-m3-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-m3-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {processing ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Tambah Fitur')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
