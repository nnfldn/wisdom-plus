import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    ChevronLeft, Printer, ShoppingBag, User, Calendar, Tag, 
    CreditCard, Truck, CheckCircle, Clock, Edit2, X, Save, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show({ sale, fullScreen }) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    const { data, setData, patch, processing } = useForm({
        payment_status: sale.payment_status,
        dp_amount: sale.dp_amount,
    });

    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus transaksi ${sale.invoice_no}? Stok domba akan dikembalikan ke status 'Siap Jual'.`)) {
            router.delete(route('admin.sales.destroy', sale.id));
        }
    };

    const updatePayment = (e) => {
        e.preventDefault();
        patch(route('admin.sales.update-payment', sale.id), {
            onSuccess: () => setIsPaymentModalOpen(false)
        });
    };

    return (
        <AdminLayout currentTab="sales" fullScreen={fullScreen}>
            <Head title={`Invoice ${sale.invoice_no}`} />

            <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20 print:p-0">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.sales.index')} className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-m3-primary transition-all">
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Detail Transaksi</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{sale.invoice_no}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleDelete}
                            className="bg-rose-50 text-rose-500 border border-rose-100 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-3"
                        >
                            <Trash2 size={18} /> Hapus Transaksi
                        </button>
                        <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-3"
                        >
                            <CreditCard size={18} /> Update Pembayaran
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center gap-3"
                        >
                            <Printer size={18} /> Cetak Invoice
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* INVOICE CONTENT */}
                    <div className="lg:col-span-2 space-y-8 print:col-span-3">
                        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm space-y-12 relative overflow-hidden">
                            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-slate-50 rounded-full opacity-50 pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-m3-primary text-white p-2 rounded-xl shadow-m3-glow">
                                            <ShoppingBag size={24} strokeWidth={3} />
                                        </div>
                                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Wisma<span className="text-m3-primary">Domba</span></h1>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{sale.invoice_no}</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(sale.sale_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm ${
                                        sale.payment_status === 'Lunas' ? 'bg-emerald-500 text-white' : 
                                        sale.payment_status === 'DP' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        {sale.payment_status}
                                    </span>
                                    <p className="mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status Pengiriman</p>
                                    <p className="text-xs font-bold text-m3-primary uppercase tracking-widest mt-1">
                                        {sale.distribution?.delivery_status || 'Persiapan'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Informasi Pembeli</h4>
                                    <div className="space-y-2">
                                        <p className="text-lg font-black text-slate-800 tracking-tight">{sale.customer?.name || 'Customer Umum'}</p>
                                        <p className="text-sm font-bold text-slate-500">{sale.customer?.phone || '-'}</p>
                                        <p className="text-sm text-slate-400 leading-relaxed mt-4 italic">{sale.customer?.address || 'Alamat tidak dicatat'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Informasi Pembayaran</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metode</span>
                                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Onsite / Cash</span>
                                        </div>
                                        {sale.dp_amount > 0 && (
                                            <div className="flex justify-between items-center bg-amber-50 p-4 rounded-2xl">
                                                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Jumlah Terbayar</span>
                                                <span className="text-xs font-black text-amber-600 tracking-widest">Rp {new Intl.NumberFormat('id-ID').format(sale.dp_amount)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12">
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Daftar Item Domba</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-slate-100">
                                            <tr>
                                                <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Deskripsi Aset</th>
                                                <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Bobot</th>
                                                <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Harga Satuan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {sale.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="py-6">
                                                        <p className="font-black text-slate-800 tracking-tight text-lg">{item.sheep?.tag || 'TAG HILANG'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sheep?.type || '-'}</p>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <p className="font-black text-slate-800">{item.sheep?.weight || item.weight || '-'} <span className="text-[10px] text-slate-300">kg</span></p>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <p className="font-black text-slate-800 tracking-tight text-lg">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-t-2 border-slate-900">
                                            <tr>
                                                <td colSpan="2" className="pt-8 pb-2 text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Tagihan</p>
                                                </td>
                                                <td className="pt-8 pb-2 text-right">
                                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                                                        <span className="text-xs mr-1 opacity-30 italic">Rp</span>
                                                        {new Intl.NumberFormat('id-ID').format(sale.total_amount)}
                                                    </p>
                                                </td>
                                            </tr>
                                            {(sale.payment_status === 'DP' || sale.payment_status === 'Belum Bayar') && (
                                                <tr>
                                                    <td colSpan="2" className="py-2 text-right">
                                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Sisa Pelunasan</p>
                                                    </td>
                                                    <td className="py-2 text-right">
                                                        <p className="text-xl font-black text-amber-600 tracking-tighter">
                                                            <span className="text-xs mr-1 opacity-50 italic">Rp</span>
                                                            {new Intl.NumberFormat('id-ID').format(sale.total_amount - sale.dp_amount)}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="pt-20 text-center space-y-2 opacity-60">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Terima Kasih Atas Kepercayaan Anda</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Dokumen ini sah dikeluarkan oleh sistem WisDom+ Cloud</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 print:hidden">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <Truck size={20} className="text-m3-primary" /> Distribusi
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sale.distribution ? 'bg-emerald-50 text-m3-primary' : 'bg-slate-50 text-slate-300'}`}>
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Pencatatan</p>
                                        <p className="text-[10px] font-bold text-slate-400">Selesai pada {new Date(sale.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative">
                                    <div className="absolute left-5 top-10 bottom-[-10px] w-0.5 bg-slate-100"></div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${['Di Jalan', 'Terkirim'].includes(sale.distribution?.delivery_status) ? 'bg-emerald-50 text-m3-primary' : 'bg-amber-50 text-amber-600 animate-pulse'}`}>
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Pengiriman</p>
                                        <p className="text-[10px] font-bold text-slate-400">{sale.distribution?.delivery_status || 'Dalam Persiapan'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sale.distribution?.delivery_status === 'Terkirim' ? 'bg-emerald-50 text-m3-primary' : 'bg-slate-50 text-slate-300'}`}>
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Konfirmasi</p>
                                        <p className="text-[10px] font-bold text-slate-400">{sale.distribution?.delivery_status === 'Terkirim' ? 'Selesai' : 'Menunggu Sampai'}</p>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href={route('admin.distributions.index')} 
                                className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Kelola Distribusi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT UPDATE MODAL */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden relative shadow-2xl z-10"
                        >
                            <form onSubmit={updatePayment} className="flex flex-col">
                                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Update Pembayaran</h3>
                                    <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-10 space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Status Baru</label>
                                        <div className="flex p-1 bg-slate-50 rounded-2xl gap-1">
                                            {['Lunas', 'DP', 'Belum Bayar'].map((s) => (
                                                <button 
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setData('payment_status', s)}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        data.payment_status === s ? 'bg-white shadow-sm text-m3-primary' : 'text-slate-400'
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {data.payment_status === 'DP' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Jumlah DP Terbayar</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">RP</span>
                                                <input 
                                                    type="number" 
                                                    value={data.dp_amount}
                                                    onChange={e => setData('dp_amount', e.target.value)}
                                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 ml-4 italic uppercase">Total Invoice: Rp {new Intl.NumberFormat('id-ID').format(sale.total_amount)}</p>
                                        </div>
                                    )}

                                    {data.payment_status === 'Lunas' && (
                                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                                            <CheckCircle className="text-m3-primary shrink-0" size={20} />
                                            <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                                                Memilih status Lunas akan otomatis mencatat pembayaran sebesar <span className="font-black underline">Rp {new Intl.NumberFormat('id-ID').format(sale.total_amount)}</span>.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 bg-slate-50 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsPaymentModalOpen(false)}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="flex-[2] bg-m3-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-m3-glow hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Simpan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
