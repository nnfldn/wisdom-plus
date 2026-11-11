import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, X, Activity, ShoppingBag, ShieldCheck, TrendingUp, Star, Users, MapPin, Hash } from 'lucide-react';

const availableIcons = [
    { name: 'ShoppingBag', icon: <ShoppingBag size={16}/> },
    { name: 'ShieldCheck', icon: <ShieldCheck size={16}/> },
    { name: 'Activity', icon: <Activity size={16}/> },
    { name: 'TrendingUp', icon: <TrendingUp size={16}/> },
    { name: 'Star', icon: <Star size={16}/> },
    { name: 'Users', icon: <Users size={16}/> },
    { name: 'MapPin', icon: <MapPin size={16}/> },
    { name: 'Hash', icon: <Hash size={16}/> },
];

const IconRenderer = ({ name, size = 24 }) => {
    switch (name) {
        case 'ShoppingBag': return <ShoppingBag size={size} />;
        case 'ShieldCheck': return <ShieldCheck size={size} />;
        case 'TrendingUp': return <TrendingUp size={size} />;
        case 'Star': return <Star size={size} />;
        case 'Users': return <Users size={size} />;
        case 'MapPin': return <MapPin size={size} />;
        case 'Hash': return <Hash size={size} />;
        default: return <Activity size={size} />;
    }
};

export default function StatsPage({ stats_list = [], stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
    icon: 'Activity',
    value: '',
    label: '',
    order: 0,
    is_active: true
  });

  const openAdd = () => {
    setEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditMode(true);
    setSelectedStat(s);
    setData({
      icon: s.icon,
      value: s.value,
      label: s.label,
      order: s.order || 0,
      is_active: !!s.is_active
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (editMode) {
      patch(route('admin.stats.update', selectedStat.id), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route('admin.stats.store'), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  const headerActions = (
    <button onClick={openAdd} className="bg-m3-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3">
        <Plus size={18} strokeWidth={3} /> Tambah Data
    </button>
  );

  return (
    <AdminLayout currentTab="stats" title="Statistik Web" actions={headerActions}>
      <Head title="Manajemen Statistik" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats_list.map((s) => (
            <div key={s.id} className={`bg-white rounded-[2rem] border ${s.is_active ? 'border-slate-100' : 'border-slate-200 opacity-60'} shadow-sm p-8 group hover:shadow-xl transition-all relative`}>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-m3-primary/5 p-4 rounded-2xl text-m3-primary group-hover:scale-110 transition-transform">
                    <IconRenderer name={s.icon} />
                </div>
                <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-2 text-slate-400 hover:text-m3-primary rounded-lg hover:bg-m3-primary/5"><Edit size={14}/></button>
                    <button onClick={() => confirm('Hapus data ini?') && destroy(route('admin.stats.destroy', s.id))} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"><Trash2 size={14}/></button>
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 leading-none mb-2">{s.value}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
              {!s.is_active && (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Hidden</div>
              )}
            </div>
          ))}

          {stats_list.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
               <TrendingUp size={48} strokeWidth={1} />
               <p className="font-bold text-sm uppercase tracking-widest">Belum ada data statistik</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            
            <form onSubmit={submit} className="p-12 space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-m3-primary/10 p-4 rounded-2xl"><IconRenderer name={data.icon} /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editMode ? 'Edit Statistik' : 'Tambah Statistik'}</h3>
                  <p className="text-[10px] font-black text-m3-primary uppercase tracking-widest">Atur angka pencapaian di web publik</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Ikon</label>
                    <div className="grid grid-cols-4 gap-2">
                        {availableIcons.map(item => (
                            <button 
                                key={item.name} 
                                type="button"
                                onClick={() => setData('icon', item.name)}
                                className={`p-3 rounded-xl border flex items-center justify-center transition-all ${data.icon === item.name ? 'bg-m3-primary text-white border-m3-primary shadow-lg scale-105' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-m3-primary/30'}`}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Angka/Nilai</label>
                        <input 
                            type="text" 
                            value={data.value} 
                            onChange={e => setData('value', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                            placeholder="Contoh: 1.5K+"
                        />
                        {errors.value && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.value}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                        <input 
                            type="text" 
                            value={data.label} 
                            onChange={e => setData('label', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                            placeholder="Contoh: Domba Terjual"
                        />
                        {errors.label && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.label}</p>}
                    </div>
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
              </div>

              <button type="submit" disabled={processing} className="w-full bg-m3-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-m3-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {processing ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Tambah Data')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
