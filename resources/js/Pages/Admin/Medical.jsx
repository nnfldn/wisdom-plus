import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Syringe, CheckCircle, Loader2, Plus, History, ClipboardList, X } from 'lucide-react';

export default function Medical({ sickSheep = [], allSheep = [], stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSheep, setSelectedSheep] = useState(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    sheep_id: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    handled_at: new Date().toISOString().split('T')[0],
    is_recovered: false
  });

  const openMedicalForm = (sheep) => {
    setSelectedSheep(sheep);
    setData({
      sheep_id: sheep.id,
      diagnosis: sheep.health || '',
      treatment: '',
      notes: '',
      handled_at: new Date().toISOString().split('T')[0],
      is_recovered: false
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.medical.store'), {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const sickSheepList = Array.isArray(sickSheep) ? sickSheep : (sickSheep?.data || []);

  const headerActions = (
    <div className="flex gap-4">
        <div className="bg-white border border-slate-100 px-6 py-2.5 rounded-xl shadow-sm hidden md:flex items-center gap-3">
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Karantina Aktif</p>
            <p className="text-xl font-black text-slate-800">{stats.sakitCount}</p>
        </div>
    </div>
  );

  return (
    <AdminLayout currentTab="medis" stats={stats} title="Rekam Medis" actions={headerActions}>
      <Head title="Manajemen Rekam Medis" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* SICK SHEEP LIST */}
        <div className="grid grid-cols-1 gap-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 px-2">
            <ClipboardList className="text-m3-primary" /> Daftar Domba Karantina
          </h3>
          
          {sickSheepList.length > 0 ? (
            sickSheepList.map((sick) => (
              <div key={sick.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className="flex flex-col lg:flex-row p-8 gap-8 items-center lg:items-start">
                  <div className="relative shrink-0">
                    <img src={sick.img} className="w-40 h-40 rounded-[2rem] object-cover shadow-lg border-4 border-slate-50" alt="" />
                    <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-xl shadow-lg"><Syringe size={16}/></div>
                  </div>
                  
                  <div className="flex-1 space-y-4 text-center lg:text-left">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">{sick.tag} <span className="text-slate-300 font-bold text-lg">- {sick.type}</span></h4>
                      <p className="text-sm font-black text-rose-600 bg-rose-50 inline-block px-4 py-1.5 rounded-xl mt-2 uppercase tracking-widest">Status: {sick.status}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gejala Terakhir</p>
                        <p className="text-sm font-bold text-slate-700">{sick.health}</p>
                      </div>
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Penanganan Terakhir</p>
                        <p className="text-sm font-bold text-slate-700">
                          {sick.medical_history?.[0]?.treatment || 'Belum ada rekam medis'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0 w-full lg:w-auto">
                    <button 
                      onClick={() => openMedicalForm(sick)}
                      className="bg-[#0A1A14] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                      <Plus size={18} strokeWidth={3}/> Update Rekam Medis
                    </button>
                    {sick.medical_history?.length > 0 && (
                      <button className="bg-slate-50 text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center justify-center gap-3">
                        <History size={18}/> Lihat Riwayat
                      </button>
                    )}
                  </div>
                </div>

                {/* HISTORICAL LOGS - MINI VIEW */}
                {sick.medical_history?.length > 0 && (
                  <div className="bg-slate-50/50 border-t border-slate-100 p-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><History size={12}/> Riwayat Penanganan Terbaru</p>
                     <div className="space-y-4">
                        {sick.medical_history.slice(0, 2).map((log, idx) => (
                           <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="text-emerald-500 font-black text-xs bg-emerald-50 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">{sick.medical_history.length - idx}</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 mb-1">{log.diagnosis}</p>
                                   <p className="text-xs font-medium text-slate-500 leading-relaxed">{log.treatment}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[10px] font-black text-slate-300 uppercase">{new Date(log.handled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 p-20 rounded-[3rem] text-center">
               <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200/50"><CheckCircle className="text-emerald-500 w-10 h-10"/></div>
               <h4 className="text-2xl font-black text-emerald-900 mb-2">Seluruh Domba Sehat!</h4>
               <p className="text-emerald-600/70 font-medium">Kandang karantina kosong. Tidak ada domba yang membutuhkan penanganan medis saat ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* MEDICAL RECORD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A1A14]/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
              
              <form onSubmit={submit} className="p-12 space-y-8">
                 <div className="flex items-center gap-6 mb-4">
                    <img src={selectedSheep.img} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Rekam Medis: {selectedSheep.tag}</h3>
                      <p className="text-[10px] font-black text-m3-primary uppercase tracking-[0.2em]">Pencatatan Penanganan Kesehatan</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis / Gejala</label>
                       <input 
                         type="text" 
                         value={data.diagnosis} 
                         onChange={e => setData('diagnosis', e.target.value)}
                         className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                         placeholder="Misal: Demam, Nafsu Makan Turun"
                       />
                       {errors.diagnosis && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.diagnosis}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Penanganan</label>
                       <input 
                         type="date" 
                         value={data.handled_at} 
                         onChange={e => setData('handled_at', e.target.value)}
                         className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Penanganan / Obat yang Diberikan</label>
                    <textarea 
                      value={data.treatment} 
                      onChange={e => setData('treatment', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                      placeholder="Contoh: Injeksi Vitamin B-Kompleks 2ml, Pemberian Antipiretik"
                    />
                    {errors.treatment && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.treatment}</p>}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan Tambahan (Opsional)</label>
                    <textarea 
                      value={data.notes} 
                      onChange={e => setData('notes', e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-m3-primary/10 transition-all"
                    />
                 </div>

                 <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><CheckCircle size={20}/></div>
                       <div>
                          <p className="text-xs font-black text-emerald-900">Nyatakan Sembuh?</p>
                          <p className="text-[10px] font-bold text-emerald-600/70">Domba akan keluar dari daftar karantina</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.is_recovered} 
                        onChange={e => setData('is_recovered', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={processing} className="flex-1 bg-m3-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-m3-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                       {processing ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20}/>} Simpan Rekam Medis
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}
