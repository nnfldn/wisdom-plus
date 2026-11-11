import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, ShoppingBag, ChevronRight, User, Calendar, Tag, Trash2 } from 'lucide-react';

export default function Index({ sales, fullScreen }) {
    const handleDelete = (e, id, invoice) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Apakah Anda yakin ingin menghapus transaksi ${invoice}? Stok domba akan dikembalikan ke status 'Siap Jual'.`)) {
            router.delete(route('admin.sales.destroy', id));
        }
    };

    const headerActions = (
        <Link 
            href={route('admin.sales.create')} 
            className="bg-m3-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-m3-glow hover:bg-emerald-700 transition-all flex items-center gap-3"
        >
            <Plus size={18} strokeWidth={3} /> Transaksi Baru
        </Link>
    );

    return (
        <AdminLayout currentTab="sales" title="Manajemen Penjualan" actions={headerActions}>
            <Head title="Manajemen Penjualan" />
            
            <div className="flex flex-col gap-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 gap-4">
                    {sales.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-12 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                                <ShoppingBag size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Belum Ada Transaksi</h3>
                            <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">Mulai catat penjualan domba Anda dengan menekan tombol Transaksi Baru.</p>
                        </div>
                    ) : (
                        sales.map((sale) => (
                            <Link 
                                key={sale.id} 
                                href={route('admin.sales.show', sale.id)}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-m3-primary group-hover:bg-m3-primary group-hover:text-white transition-colors duration-500">
                                        <Tag size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 tracking-tight">{sale.invoice_no}</h4>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <User size={14} className="text-m3-primary" />
                                                <span className="uppercase tracking-widest">{sale.customer?.name || 'Customer Umum'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <Calendar size={14} className="text-m3-primary" />
                                                <span>{new Date(sale.sale_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 px-6 border-l border-slate-50 md:border-l-0 lg:border-l">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Nilai</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tighter">
                                            Rp {new Intl.NumberFormat('id-ID').format(sale.total_amount)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            sale.payment_status === 'Lunas' ? 'bg-emerald-500 text-white' : 
                                            sale.payment_status === 'DP' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                                        }`}>
                                            {sale.payment_status}
                                        </span>
                                        {sale.dp_amount > 0 && sale.payment_status !== 'Lunas' && (
                                            <p className="text-[9px] font-bold text-amber-600 mt-1 uppercase tracking-tighter">DP: Rp {new Intl.NumberFormat('id-ID').format(sale.dp_amount)}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-slate-300 group-hover:text-m3-primary group-hover:translate-x-1 transition-all">
                                            <ChevronRight size={24} />
                                        </div>
                                        <button 
                                            onClick={(e) => handleDelete(e, sale.id, sale.invoice_no)}
                                            className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Hapus Transaksi"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
