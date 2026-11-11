import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Search, Filter, Plus, ScanLine, Edit, Trash2, X, Link2, ExternalLink, Download, QrCode, ArrowUpRight, MoreVertical } from 'lucide-react';

export default function SheepData({ sheepData, stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSheep, setSelectedSheep] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
    tag: '', type: 'Cross Texel', gender: 'Betina', weight: '', birthDate: '', block: 'Karantina', status: 'Penggemukan', health: 'Sehat', pricePerKg: '', parentMale: '', parentFemale: '', img: '', imgFile: null
  });

  const openAdd = () => { setIsEditMode(false); reset(); setIsModalOpen(true); };
  const openEdit = (s) => {
    setIsEditMode(true);
    setSelectedSheep(s);
    setData({
      tag: s.tag, type: s.type, gender: s.gender || 'Betina', weight: s.weight, status: s.status, block: s.block, 
      health: s.health, pricePerKg: s.pricePerKg, parentMale: s.parentMale || '', 
      parentFemale: s.parentFemale || '', birthDate: s.birthDate, img: s.img, imgFile: null
    });
    setIsModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (isEditMode) {
        post(route('admin.sheep.update', selectedSheep.id), {
            forceFormData: true,
            data: { ...data, _method: 'PATCH' },
            onSuccess: () => setIsModalOpen(false) 
        });
    } else {
        post(route('admin.sheep.store'), { 
            onSuccess: () => { setIsModalOpen(false); reset(); } 
        });
    }
  };

  const headerActions = (
    <button onClick={openAdd} className="bg-m3-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3">
        <Plus size={18} strokeWidth={3} /> Register Asset
    </button>
  );

  return (
    <AdminLayout currentTab="data" stats={stats} title="Inventory Domba" actions={headerActions}>
      <Head title="Inventory - Wisma Domba" />
      
      <div className="flex flex-col gap-8 animate-in fade-in duration-700">
        {/* SUB BAR - FILTER & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
             <button className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Active Stock</button>
             <button className="px-6 py-2 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">Sold Out</button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Cari Tag ID..." className="pl-12 pr-6 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold w-64 focus:w-80 focus:ring-4 focus:ring-m3-primary/5 transition-all duration-500 shadow-sm" />
          </div>
        </div>

        {errors.tag && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-black uppercase tracking-widest border border-rose-100">{errors.tag}</div>}

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(Array.isArray(sheepData) ? sheepData : (sheepData?.data || [])).map((s) => (
            <div key={s.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group flex flex-col">
              {/* Image Header */}
              <div className="h-56 relative overflow-hidden">
                <img src={s.img} onError={e => e.target.src="https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80"} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Float Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 text-white ${
                    s.status === 'Sakit' ? 'bg-rose-500/80' : 
                    s.status === 'Terjual' ? 'bg-slate-500/80' : 'bg-emerald-500/80'
                  }`}>
                    {s.status}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 text-white bg-slate-800/60">
                    {s.gender}
                  </span>
                </div>
                
                <button onClick={() => setQrPreview(s)} className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500">
                  <QrCode size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{s.type}</p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{s.tag}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Weight</p>
                    <p className="font-black text-slate-800 text-lg">{s.weight}<span className="text-[10px] ml-0.5 text-slate-300 italic">kg</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 my-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-[11px] font-bold text-slate-600 uppercase">{s.block}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Health</p>
                    <p className={`text-[11px] font-bold uppercase ${s.health === 'Sehat' ? 'text-emerald-500' : 'text-rose-500'}`}>{s.health}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4">
                  <button onClick={() => openEdit(s)} className="flex-1 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Edit size={12} /> Manage
                  </button>
                  <button onClick={() => confirm('Hapus Data?') && destroy(route('admin.sheep.destroy', s.id))} className="bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 p-3 rounded-xl transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FORM & QR PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[150] flex items-center justify-center p-0 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-none md:rounded-[3.5rem] shadow-2xl w-full max-w-4xl border border-white/20 animate-in zoom-in-95 duration-500 min-h-screen md:min-h-0 flex flex-col">
            <div className="p-6 md:p-12 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="bg-emerald-500 text-white p-3 md:p-5 rounded-2xl md:rounded-[2rem] shadow-2xl shadow-emerald-500/20"><Plus size={24} md:size={32} strokeWidth={3}/></div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{isEditMode ? 'Update Record' : 'New Asset'}</h3>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 md:mt-2 text-emerald-600">Blockchain Genetic Registry</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl text-slate-300 hover:text-rose-500 transition-all shadow-sm border border-slate-100"><X size={20} md:size={28}/></button>
            </div>
            
            <form onSubmit={submit} className="p-6 md:p-12 space-y-8 md:space-y-12 flex-1 md:max-h-[60vh] overflow-y-auto hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Barcode Identifier</label>
                  <input required disabled={isEditMode} value={data.tag} onChange={e => setData('tag', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-mono font-black transition-all" />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Breed / Ras</label>
                  <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all appearance-none">
                    <option>Cross Texel</option><option>F1 Texel</option><option>F2 Suffolk</option><option>Merino</option><option>Garut Tangkas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Gender</label>
                  <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all appearance-none">
                    <option value="Jantan">Jantan</option>
                    <option value="Betina">Betina</option>
                  </select>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Weight (kg)</label>
                  <input required type="number" step="0.1" value={data.weight} onChange={e => setData('weight', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all" />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Birth Date</label>
                  <input required type="date" value={data.birthDate} onChange={e => setData('birthDate', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Location Block</label>
                  <select value={data.block} onChange={e => setData('block', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all appearance-none">
                    <option>Karantina</option><option>Penggemukan</option><option>Ibu & Bayi</option><option>Blok Hamil</option>
                  </select>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Operational Status</label>
                  <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all appearance-none">
                    <option>Penggemukan</option><option>Siap Jual</option><option>Anakan</option><option>Sakit</option><option>Hamil</option><option>Laktasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Parent Male (Tag)</label>
                  <input value={data.parentMale} onChange={e => setData('parentMale', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all" placeholder="Misal: WD-001" />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Parent Female (Tag)</label>
                  <input value={data.parentFemale} onChange={e => setData('parentFemale', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all" placeholder="Misal: WD-002" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Price per Kg (Opsional)</label>
                  <input type="number" value={data.pricePerKg} onChange={e => setData('pricePerKg', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all" />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Upload Photo (Max 2MB)</label>
                  <input type="file" onChange={e => setData('imgFile', e.target.files[0])} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100" />
                </div>
              </div>

              <div className="space-y-2 md:space-y-4 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Atau Gunakan Image URL</label>
                <input value={data.img} onChange={e => setData('img', e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black transition-all" placeholder="https://..." />
              </div>
            </form>

            <div className="p-6 md:p-12 border-t border-slate-100 bg-slate-50/50 md:rounded-b-[4rem] flex flex-col md:flex-row justify-end gap-3 md:gap-6 text-right">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-slate-400 uppercase tracking-widest text-[10px] md:text-xs order-2 md:order-1">Discard Changes</button>
              <button onClick={submit} disabled={processing} className="px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black bg-m3-primary text-white hover:bg-emerald-700 shadow-2xl transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs order-1 md:order-2">
                {processing ? 'Syncing...' : 'Authorize Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR PREVIEW */}
      {qrPreview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-8" onClick={() => setQrPreview(null)}>
          <div className="bg-white rounded-[5rem] p-16 max-w-sm w-full text-center shadow-2xl border-[12px] border-slate-50 relative animate-in zoom-in-90 duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-emerald-500 text-white p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto -mt-28 mb-10 shadow-2xl border-[10px] border-white">
              <QrCode size={40} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">Cloud Identity</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">{qrPreview.tag} • WISMA DOMBA</p>
            <div className="p-8 bg-white rounded-[3rem] shadow-m3-soft mb-12 flex items-center justify-center border border-slate-100 group relative overflow-hidden">
              <img src={qrPreview.qrUrl} className="w-full aspect-square rounded-[2rem] relative z-10" alt="" />
              <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => {
                   const win = window.open('', '_blank');
                   win.document.write(`
                     <div style="text-align:center; padding: 40px; font-family: sans-serif;">
                        <h1 style="margin-bottom:0">${qrPreview.tag}</h1>
                        <p style="margin-top:0; font-size:12px; font-weight:bold; color:#2B5E41">WISMA DOMBA CLOUD IDENTITY</p>
                        <img src="${qrPreview.qrUrl}" style="width: 300px; height: 300px; margin: 20px 0;" />
                        <p style="font-size: 10px; color: #666;">Scan QR ini untuk melihat rekam medis dan histori silsilah.</p>
                     </div>
                     <script>window.onload = () => { window.print(); window.close(); }</script>
                   `);
                }} 
                className="flex items-center justify-center gap-4 p-5 bg-m3-primary text-white rounded-[2.5rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20"
              >
                <Download size={24} />
                <span className="text-[11px] font-black uppercase tracking-widest">Cetak Tag Telinga</span>
              </button>
              
              <a href={qrPreview.ktpLink} target="_blank" className="flex items-center justify-center gap-4 p-5 bg-slate-50 text-slate-500 rounded-[2.5rem] hover:bg-slate-100 transition-all border border-slate-100">
                <ExternalLink size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Buka Link KTP</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
