import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Truck, MapPin, User, Calendar, CheckCircle, Package, Edit, X, Camera, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ distributions, defaultDate, fullScreen }) {
    const [selectedDist, setSelectedDist] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        delivery_date: '',
        driver_name: '',
        vehicle_plate: '',
        delivery_status: 'Persiapan',
        proof_image: null,
        _method: 'PATCH'
    });

    const openEdit = (dist) => {
        setSelectedDist(dist);
        setData({
            delivery_date: dist.delivery_date || defaultDate || '',
            driver_name: dist.driver_name || '',
            vehicle_plate: dist.vehicle_plate || '',
            delivery_status: dist.delivery_status || 'Persiapan',
            proof_image: null,
            _method: 'PATCH'
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Manual form data creation to ensure file upload works correctly with PATCH override
        post(route('admin.distributions.update', selectedDist.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const headerActions = (
        <div className="bg-white border border-slate-100 px-6 py-2.5 rounded-xl shadow-sm hidden md:flex items-center gap-3">
            <Truck size={16} className="text-m3-primary" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Pengiriman: <span className="text-slate-800">{distributions.length}</span></p>
        </div>
    );

    return (
        <AdminLayout currentTab="distributions" title="Logistik & Distribusi" actions={headerActions}>
            <Head title="Manajemen Distribusi" />
            
            <div className="flex flex-col gap-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {distributions.map((dist) => (
                        <div key={dist.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
                            <div className="p-8 space-y-6 flex-1">
                                <div className="flex justify-between items-start">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                        dist.delivery_status === 'Terkirim' ? 'bg-emerald-50 text-m3-primary' : 
                                        dist.delivery_status === 'Di Jalan' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                                    }`}>
                                        <Truck size={24} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                        dist.delivery_status === 'Terkirim' ? 'bg-emerald-500 text-white' : 
                                        dist.delivery_status === 'Di Jalan' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        {dist.delivery_status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">No. Invoice</p>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{dist.sale?.invoice_no}</h4>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <User size={16} className="text-m3-primary" />
                                        <p className="text-sm font-bold text-slate-600">{dist.sale?.customer?.name || 'Customer'}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={16} className="text-m3-primary shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{dist.sale?.customer?.address || 'Alamat tidak tersedia'}</p>
                                    </div>
                                </div>

                                {dist.driver_name && (
                                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sopir</p>
                                            <p className="text-xs font-black text-slate-700">{dist.driver_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Plat Nomor</p>
                                            <p className="text-xs font-black text-slate-700">{dist.vehicle_plate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 flex gap-2">
                                <button 
                                    onClick={() => openEdit(dist)}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-m3-primary hover:text-white hover:border-m3-primary transition-all shadow-sm"
                                >
                                    <Edit size={14} /> Perbarui Status
                                </button>
                                {dist.proof_image_url && (
                                    <button 
                                        onClick={() => setPreviewImage(dist.proof_image_url)}
                                        className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-m3-primary hover:bg-m3-primary hover:text-white transition-all shadow-sm"
                                        title="Lihat Bukti"
                                    >
                                        <Camera size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden relative shadow-2xl z-10"
                        >
                            <form onSubmit={submit} className="flex flex-col">
                                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Update Distribusi</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{selectedDist?.sale?.invoice_no}</p>
                                    </div>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-10 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tanggal Kirim</label>
                                            <input 
                                                type="date" 
                                                value={data.delivery_date}
                                                onChange={e => setData('delivery_date', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Status Pengiriman</label>
                                            <select 
                                                value={data.delivery_status}
                                                onChange={e => setData('delivery_status', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10"
                                            >
                                                <option value="Persiapan">Persiapan</option>
                                                <option value="Di Jalan">Di Jalan</option>
                                                <option value="Terkirim">Terkirim</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Sopir</label>
                                            <input 
                                                type="text" 
                                                value={data.driver_name}
                                                onChange={e => setData('driver_name', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10"
                                                placeholder="Nama sopir..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Plat Nomor</label>
                                            <input 
                                                type="text" 
                                                value={data.vehicle_plate}
                                                onChange={e => setData('vehicle_plate', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10"
                                                placeholder="B 1234 XXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Bukti Pengiriman (Foto)</label>
                                        <div className="relative group cursor-pointer">
                                            <input 
                                                type="file" 
                                                onChange={e => setData('proof_image', e.target.files[0])}
                                                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                            />
                                            <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 group-hover:bg-slate-100 transition-all">
                                                <Camera size={32} className="text-slate-300" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {data.proof_image ? data.proof_image.name : 'Klik atau seret foto ke sini'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="flex-[2] bg-m3-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-m3-glow hover:bg-emerald-700 transition-all disabled:opacity-50"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* IMAGE PREVIEW MODAL */}
            <AnimatePresence>
                {previewImage && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewImage(null)}
                            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center z-10"
                        >
                            <button 
                                onClick={() => setPreviewImage(null)}
                                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                <X size={24} /> Tutup
                            </button>
                            
                            <div className="w-full h-full bg-black/20 rounded-[3rem] overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
                                <img 
                                    src={previewImage} 
                                    alt="Bukti Pengiriman" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
