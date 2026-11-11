import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, ShoppingCart, Trash2, QrCode, User, Calendar, 
    CreditCard, Tag, ChevronLeft, Search, CheckCircle, CameraOff, RefreshCw, MapPin
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';

export default function Form({ sheep, customers, fullScreen }) {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannerError, setScannerError] = useState(null);
    const scannerRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        sale_date: new Date().toISOString().split('T')[0],
        items: [],
        dp_amount: 0,
        payment_status: 'Lunas',
        notes: '',
    });

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num || 0);
    };

    const parseNumber = (str) => {
        return parseFloat(str.replace(/\./g, '').replace(/,/g, '.')) || 0;
    };

    const totalAmount = data.items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    const startScanner = () => {
        setIsScannerOpen(true);
        setScannerError(null);
        setTimeout(() => {
            const scanner = new Html5Qrcode("sale-reader");
            scannerRef.current = scanner;
            scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => handleScanSuccess(decodedText),
                () => {}
            ).catch(err => {
                console.error(err);
                setScannerError("Gagal mengakses kamera.");
            });
        }, 300);
    };

    const stopScanner = () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => setIsScannerOpen(false));
        } else {
            setIsScannerOpen(false);
        }
    };

    const handleScanSuccess = (decodedText) => {
        let tag = decodedText;
        if (decodedText.includes('/ktp/')) {
            tag = decodedText.split('/ktp/').pop();
        }
        const found = sheep.find(s => s.tag === tag);
        if (found) {
            addSheepToCart(found);
            stopScanner();
        } else {
            alert("Domba dengan tag " + tag + " tidak ditemukan atau sudah terjual.");
        }
    };

    const addSheepToCart = (s) => {
        if (data.items.find(item => item.sheep_id === s.id)) {
            alert("Domba ini sudah ada di keranjang.");
            return;
        }
        setData('items', [
            ...data.items,
            {
                sheep_id: s.id,
                tag: s.tag,
                type: s.type,
                weight: s.weight,
                price: s.price_per_kg > 0 ? s.price_per_kg * s.weight : 0
            }
        ]);
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItemPrice = (index, value) => {
        const numericValue = parseNumber(value);
        const newItems = [...data.items];
        newItems[index].price = numericValue;
        setData('items', newItems);
    };

    const handleDpChange = (value) => {
        setData('dp_amount', parseNumber(value));
    };

    const handleCustomerChange = (name) => {
        setData('customer_name', name);
        const existing = customers.find(c => c.name === name);
        if (existing) {
            setData({
                ...data,
                customer_name: name,
                customer_phone: existing.phone || '',
                customer_address: existing.address || ''
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.sales.store'));
    };

    return (
        <AdminLayout currentTab="sales" fullScreen={fullScreen}>
            <Head title="Pencatatan Penjualan Baru" />

            <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-m3-primary transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Transaksi Baru</h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gunakan QR Scanner untuk mempercepat input</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-m3-primary">
                                    <User size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Data Pelanggan</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Pembeli</label>
                                    <input 
                                        type="text" 
                                        list="customer-list"
                                        value={data.customer_name}
                                        onChange={e => handleCustomerChange(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                        placeholder="Masukkan nama pembeli..."
                                    />
                                    <datalist id="customer-list">
                                        {customers.map(c => <option key={c.id} value={c.name} />)}
                                    </datalist>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">No. WhatsApp</label>
                                    <input 
                                        type="text" 
                                        value={data.customer_phone}
                                        onChange={e => setData('customer_phone', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                        placeholder="0812..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Alamat Pelanggan</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-4 text-slate-300" size={18} />
                                    <textarea 
                                        value={data.customer_address}
                                        onChange={e => setData('customer_address', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-3xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10 transition-all min-h-[100px]"
                                        placeholder="Alamat lengkap untuk distribusi..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tanggal Transaksi</label>
                                    <input 
                                        type="date" 
                                        value={data.sale_date}
                                        onChange={e => setData('sale_date', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Catatan</label>
                                    <input 
                                        type="text" 
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                        placeholder="Catatan tambahan..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                        <Tag size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Daftar Domba</h3>
                                </div>
                                <button type="button" onClick={startScanner} className="bg-m3-primary text-white p-3 rounded-xl shadow-m3-glow hover:bg-emerald-700 transition-all flex items-center gap-2">
                                    <QrCode size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Scan QR</span>
                                </button>
                            </div>

                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tag ID / Ras</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Bobot</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Harga Deal</th>
                                            <th className="px-8 py-4 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {data.items.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-12 text-center text-sm font-bold text-slate-300 italic">Belum ada domba dipilih.</td>
                                            </tr>
                                        ) : (
                                            data.items.map((item, index) => (
                                                <tr key={item.sheep_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-slate-800 tracking-tight">{item.tag}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-black text-slate-800">
                                                        {item.weight} <span className="text-[10px] text-slate-300">kg</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right w-52">
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">RP</span>
                                                            <input 
                                                                type="text" 
                                                                value={formatNumber(item.price)}
                                                                onChange={e => updateItemPrice(index, e.target.value)}
                                                                className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-right font-black text-sm focus:ring-2 focus:ring-m3-primary/20"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <button type="button" onClick={() => removeItem(index)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-28">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <CreditCard size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Pembayaran</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Tagihan</p>
                                    <p className="text-3xl font-black text-m3-primary tracking-tighter">
                                        <span className="text-xs mr-1 opacity-40 italic">Rp</span>
                                        {formatNumber(totalAmount)}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Status Pembayaran</label>
                                    <div className="flex p-1 bg-slate-50 rounded-2xl gap-1">
                                        {['Lunas', 'DP', 'Belum Bayar'].map((s) => (
                                            <button 
                                                key={s} type="button" onClick={() => setData('payment_status', s)}
                                                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${data.payment_status === s ? 'bg-white shadow-sm text-m3-primary' : 'text-slate-400'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>

                                    {data.payment_status === 'DP' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Jumlah DP</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">RP</span>
                                                <input 
                                                    type="text" 
                                                    value={formatNumber(data.dp_amount)}
                                                    onChange={e => handleDpChange(e.target.value)}
                                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:ring-4 focus:ring-m3-primary/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={submit} disabled={processing || data.items.length === 0}
                                    className="w-full bg-m3-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-m3-glow hover:bg-emerald-700 disabled:opacity-50 transition-all mt-8 flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart size={18} strokeWidth={3} /> Simpan Transaksi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isScannerOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={stopScanner} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden relative shadow-2xl z-10">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Scan QR Domba</h3>
                                <button onClick={stopScanner} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                            </div>
                            <div className="aspect-square relative bg-black">
                                <div id="sale-reader" className="w-full h-full"></div>
                                {scannerError ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-900 text-white p-8 text-center gap-4">
                                        <CameraOff size={40} /><p className="font-bold text-sm">{scannerError}</p>
                                        <button onClick={startScanner} className="bg-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Coba Lagi</button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 p-12 pointer-events-none border-[12px] border-white/5 shadow-inner">
                                        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-m3-primary rounded-tl-2xl"></div>
                                        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-m3-primary rounded-tr-2xl"></div>
                                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-m3-primary rounded-bl-2xl"></div>
                                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-m3-primary rounded-br-2xl"></div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                #sale-reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
                #sale-reader__scan_region { background: transparent !important; }
                #sale-reader__dashboard { display: none !important; }
            `}} />
        </AdminLayout>
    );
}
