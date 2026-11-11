import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X, Heart, Calendar, Info, ChevronRight, Search } from 'lucide-react';

export default function Breeding({ records, males, females, stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    id: null,
    male_id: '',
    female_id: '',
    mating_date: new Date().toISOString().split('T')[0],
    status: 'Waiting',
    notes: ''
  });

  const [editMode, setEditMode] = useState(false);

  const openModal = (record = null) => {
    if (record) {
      setData({
        id: record.id,
        male_id: record.male_id,
        female_id: record.female_id,
        mating_date: record.mating_date,
        status: record.status,
        notes: record.notes || ''
      });
      setEditMode(true);
    } else {
      reset();
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (editMode) {
      put(route('admin.breeding.update', data.id), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route('admin.breeding.store'), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  const deleteRecord = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      destroy(route('admin.breeding.destroy', id));
    }
  };

  const headerActions = (
    <button onClick={() => openModal()} className="bg-rose-500 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center gap-3">
        <Heart size={18} fill="currentColor" /> Catat Pasangan
    </button>
  );

  return (
    <AdminLayout currentTab="breeding" stats={stats} title="Pemuliaan Genetik" actions={headerActions}>
      <Head title="Breeding System - Wisma Domba" />
      
      <div className="space-y-8 animate-in fade-in duration-700">
        {errors.gender && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest animate-bounce">
            ⚠️ {errors.gender}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-10 py-6">Pasangan (Pejantan x Indukan)</th>
                    <th className="px-10 py-6">Tanggal Kawin</th>
                    <th className="px-10 py-6">Status Reproduksi</th>
                    <th className="px-10 py-6">Prediksi Kelahiran</th>
                    <th className="px-10 py-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="flex -space-x-4">
                            <img src={r.male.img_url} className="w-12 h-12 rounded-2xl border-4 border-white shadow-md object-cover" />
                            <img src={r.female.img_url} className="w-12 h-12 rounded-2xl border-4 border-white shadow-md object-cover" />
                          </div>
                          <p className="font-black text-slate-800 uppercase tracking-tight">{r.male.tag} <span className="text-rose-500 mx-2">♥</span> {r.female.tag}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-500 text-sm uppercase tracking-widest">{r.mating_date}</td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          r.status === 'Pregnant' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          r.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          r.status === 'Failed' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-700">{r.est_birth_date || 'TBD'}</p>
                      </td>
                      <td className="px-10 py-6 text-right space-x-4">
                        <button onClick={() => openModal(r)} className="text-slate-400 hover:text-sky-500 transition-colors uppercase text-[10px] font-black tracking-widest">Update</button>
                        <button onClick={() => deleteRecord(r.id)} className="text-slate-400 hover:text-rose-500 transition-colors uppercase text-[10px] font-black tracking-widest">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FORM BREEDING */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[150] flex items-center justify-center p-8">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-3xl border border-white/20 animate-in zoom-in-95">
            <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
              <div className="flex items-center gap-6">
                <div className="bg-rose-500 text-white p-5 rounded-[2rem] shadow-2xl shadow-rose-500/20"><Heart size={32} fill="currentColor"/></div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{editMode ? 'Update Record' : 'Mating Record'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 text-rose-600">Pencatatan Reproduksi WD Cloud</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-4 rounded-full text-slate-300 hover:text-rose-500 transition-colors"><X size={28}/></button>
            </div>
            
            <form onSubmit={submit} className="p-12 space-y-10 max-h-[60vh] overflow-y-auto hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Pilih Pejantan (Male)</label>
                  <select required disabled={editMode} value={data.male_id} onChange={e => setData('male_id', e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 font-black transition-all appearance-none disabled:opacity-50">
                    <option value="">-- Pilih Jantan --</option>
                    {males.map(m => <option key={m.id} value={m.id}>{m.tag} ({m.type})</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Pilih Indukan (Female)</label>
                  <select required disabled={editMode} value={data.female_id} onChange={e => setData('female_id', e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 font-black transition-all appearance-none disabled:opacity-50">
                    <option value="">-- Pilih Betina --</option>
                    {females.map(f => <option key={f.id} value={f.id}>{f.tag} ({f.type})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Tanggal Perkawinan</label>
                  <input required type="date" value={data.mating_date} onChange={e => setData('mating_date', e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 font-black transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Status Reproduksi</label>
                  <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 font-black transition-all appearance-none">
                    <option value="Waiting">Waiting (Observasi)</option>
                    <option value="Pregnant">Pregnant (Terdeteksi Hamil)</option>
                    <option value="Success">Success (Berhasil Lahir)</option>
                    <option value="Failed">Failed (Gagal/Keguguran)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Catatan Tambahan (Opsional)</label>
                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 font-medium transition-all resize-none" rows="3" placeholder="Masukkan detail tambahan..."></textarea>
              </div>
            </form>

            <div className="p-12 border-t border-slate-100 bg-slate-50/50 rounded-b-[4rem] flex justify-end gap-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-12 py-5 rounded-[1.5rem] font-black text-slate-400 uppercase tracking-widest text-xs">Discard</button>
              <button onClick={submit} disabled={processing} className="px-16 py-5 rounded-[1.5rem] font-black bg-rose-500 text-white hover:bg-rose-600 shadow-2xl transition-all uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                {processing ? 'Saving...' : (editMode ? 'Update Changes' : 'Authorize Pairing')} <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
