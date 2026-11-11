import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PWAInstall from '@/Components/PWAInstall';
import { Head, Link } from '@inertiajs/react';
import { 
  LayoutDashboard, List, HeartPulse, Scale, Activity, History, Users, 
  Search, ShoppingCart, Truck, Heart, Send, Quote, TrendingUp, ShieldCheck, Layout, QrCode, LogOut, User
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppDrawer({ auth, stats }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const operationalApps = [
        { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={28} />, href: '/admin/overview', color: 'bg-m3-primary' },
        { id: 'data', label: 'Inventory', icon: <List size={28} />, href: '/admin/sheep', color: 'bg-m3-primary' },
        { id: 'sales', label: 'Penjualan', icon: <ShoppingCart size={28} />, href: '/admin/sales', color: 'bg-m3-primary' },
        { id: 'distributions', label: 'Distribusi', icon: <Truck size={28} />, href: '/admin/distributions', color: 'bg-m3-primary' },
        { id: 'breeding', label: 'Breeding', icon: <Heart size={28} />, href: '/admin/breeding', color: 'bg-m3-primary' },
        { id: 'medical', label: 'Health', icon: <HeartPulse size={28} />, href: '/admin/medical', color: 'bg-m3-primary', badge: stats?.sakitCount },
        { id: 'feeding', label: 'Nutrition', icon: <Scale size={28} />, href: '/admin/feeding', color: 'bg-m3-primary' },
        { id: 'history', label: 'Audit Logs', icon: <History size={28} />, href: '/admin/history', color: 'bg-m3-primary' },
    ];

    if (auth.user.role === 'super-admin') {
        operationalApps.push({ id: 'users', label: 'Staff Team', icon: <Users size={28} />, href: '/admin/users', color: 'bg-m3-primary' });
    }

    const webApps = [
        { id: 'posts', label: 'Feed Update', icon: <Send size={24} />, href: '/admin/posts', color: 'bg-slate-500' },
        { id: 'testimonials', label: 'Testimonial', icon: <Quote size={24} />, href: '/admin/testimonials', color: 'bg-slate-500' },
        { id: 'stats', label: 'Trust Stats', icon: <TrendingUp size={24} />, href: '/admin/stats', color: 'bg-slate-500' },
        { id: 'features', label: 'Features', icon: <ShieldCheck size={24} />, href: '/admin/features', color: 'bg-slate-500' },
        { id: 'heroes', label: 'Hero Slider', icon: <LayoutDashboard size={24} />, href: '/admin/heroes', color: 'bg-slate-500' },
        { id: 'about', label: 'About Page', icon: <Layout size={24} />, href: '/admin/about', color: 'bg-slate-500' },
    ];

    const filterApps = (apps) => apps.filter(app => 
        app.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <AdminLayout currentTab="app-drawer">
            <Head title="Menu Utama - WisDom+" />
            
            <div className="min-h-screen bg-slate-50 flex flex-col px-6 pt-8 pb-12 select-none">
                {/* BRANDING AREA */}
                <div className="flex flex-col items-center mb-6">
                    <ApplicationLogo className="w-28 h-28 mb-3" />
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">WisDom<span className="text-m3-primary">+</span></h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Sistem Manajemen Peternakan</p>
                </div>

                {/* SEARCH */}
                <div className="relative mb-12 max-w-md mx-auto w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                        type="text" 
                        placeholder="Cari fitur..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-none rounded-3xl py-5 pl-16 pr-8 text-sm font-bold shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-m3-primary/10 transition-all"
                    />
                </div>

                <div className="space-y-12 max-w-2xl mx-auto w-full">
                    {/* SECTION A: OPERATIONS */}
                    <div>
                        <h2 className="text-[11px] font-black text-m3-primary uppercase tracking-[0.4em] mb-8 border-b border-m3-primary/10 pb-4 ml-2">OPERASIONAL & STAFF</h2>
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-3 sm:grid-cols-4 gap-y-10 gap-x-4"
                        >
                            {filterApps(operationalApps).map((app) => (
                                <AppIcon key={app.id} app={app} variants={item} />
                            ))}
                        </motion.div>
                    </div>

                    {/* SECTION B: WEB CONTENT */}
                    <div className="pb-10">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 border-b border-slate-200 pb-4 ml-2">PENGATURAN WEB PUBLIK</h2>
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-3 sm:grid-cols-4 gap-y-10 gap-x-4"
                        >
                            {filterApps(webApps).map((app) => (
                                <AppIcon key={app.id} app={app} variants={item} />
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center gap-8 pb-12">
                    {/* PROFILE & LOGOUT */}
                    <div className="w-full max-w-sm bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-6 items-center">
                        <div className="flex items-center gap-4 w-full px-2">
                            <div className="w-12 h-12 bg-m3-primary/10 text-m3-primary rounded-2xl flex items-center justify-center font-black">
                                {auth.user.name[0]}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-black text-slate-800 truncate">{auth.user.name}</p>
                                <p className="text-[10px] font-bold text-m3-primary uppercase tracking-widest">{auth.user.role}</p>
                            </div>
                        </div>
                        
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center justify-center gap-3"
                        >
                            <LogOut size={16} /> Keluar Sistem
                        </Link>
                    </div>

                    <PWAInstall />

                    <div className="flex flex-col items-center opacity-20">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">&copy; 2026 Capstone Project Kelompok Digitive</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                body { background-color: #f8fafc; }
                input::placeholder { color: #cbd5e1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
            `}} />
        </AdminLayout>
    );
}

function AppIcon({ app, variants }) {
    return (
        <motion.div variants={variants} className="flex flex-col items-center gap-3">
            <Link 
                href={app.href}
                className={`w-16 h-16 sm:w-20 sm:h-20 ${app.color} text-white rounded-[2rem] flex items-center justify-center shadow-lg active:scale-90 transition-transform relative group`}
            >
                <div className="group-hover:scale-110 transition-transform duration-300">
                    {app.icon}
                </div>
                {app.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                        {app.badge}
                    </span>
                )}
            </Link>
            <span className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-wider text-center leading-tight px-1">
                {app.label}
            </span>
        </motion.div>
    );
}
