import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, ChevronLeft } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AdminLayout({ children, currentTab, stats, title, actions }) {
  const { auth, flash } = usePage().props;
  
  return (
    <div className="min-h-screen bg-m3-surface font-sans text-slate-900 selection:bg-m3-primary selection:text-white">
      {/* FLASH NOTIFICATION */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 items-end pointer-events-none">
        {flash?.error && (
          <div className="bg-rose-500 text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl animate-in slide-in-from-right duration-500 pointer-events-auto">
             ⚠️ {flash.error}
          </div>
        )}
        {flash?.success && (
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl animate-in slide-in-from-right duration-500 pointer-events-auto">
             ✅ {flash.success}
          </div>
        )}
      </div>

      {/* DYNAMIC HEADER BASED ON NEW UX WIREFRAME */}
      {currentTab !== 'app-drawer' && (
        <div className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:px-12 flex justify-between items-center bg-m3-surface/80 backdrop-blur-md border-b border-slate-50 shadow-sm">
            {/* LEFT: NAV BUTTON */}
            <Link 
              href="/admin/menu" 
              className="bg-white border border-slate-100 text-slate-400 p-3 rounded-2xl shadow-sm flex items-center gap-3 active:scale-95 transition-all group hover:text-m3-primary hover:border-m3-primary/20"
            >
              <ChevronLeft size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Kembali</span>
            </Link>

            {/* CENTER: TITLE (Optional, added for clarity) */}
            {title && (
                <div className="text-center hidden lg:block">
                    <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">{title}</h1>
                </div>
            )}

            {/* RIGHT: ACTION BUTTONS */}
            <div className="flex items-center gap-3">
                {actions}
            </div>
        </div>
      )}

      <main className={`w-full ${currentTab === 'app-drawer' ? 'pt-0' : 'pt-28'} px-4 md:px-12 pb-12`}>
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
