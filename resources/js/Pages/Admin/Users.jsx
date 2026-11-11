import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { UserPlus, Shield, Mail, Lock, X, Plus, User as UserIcon } from 'lucide-react';

export default function Users({ users = { data: [] }, stats, fullScreen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.users.store'), {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      },
    });
  };

  const headerActions = (
    <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-m3-primary text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition flex items-center gap-3 shrink-0 text-xs uppercase tracking-widest"
    >
        <UserPlus size={18}/> Registrasi Admin
    </button>
  );

  return (
    <AdminLayout currentTab="users" stats={stats} title="Manajemen Tim" actions={headerActions}>
      <Head title="Manajemen User" />
      
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(users) ? users : (users?.data || [])).map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition">
              <div className={`p-4 rounded-2xl ${user.role === 'super-admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <Shield size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-800 leading-tight">{user.name}</h4>
                <p className="text-sm text-slate-500 font-bold mb-2">{user.email}</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'super-admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-lg flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Plus className="h-5 w-5 text-m3-primary"/> Registrasi Admin
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition"><X className="w-5 h-5 text-slate-500"/></button>
            </div>
            
            <form onSubmit={submit} className="p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-m3-primary outline-none transition font-bold" placeholder="Nama Admin" />
                </div>
                {errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-m3-primary outline-none transition font-bold" placeholder="email@wisdomplus.id" />
                </div>
                {errors.email && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Password Akses</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-m3-primary outline-none transition font-bold" placeholder="••••••••" />
                </div>
                {errors.password && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Role / Hak Akses</label>
                <select value={data.role} onChange={e => setData('role', e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-m3-primary font-bold text-sm outline-none cursor-pointer appearance-none">
                  <option value="admin">Operator Admin (Biasa)</option>
                  <option value="super-admin">Super Admin (Akses Penuh)</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={processing}
                  className="w-full bg-m3-primary text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  {processing ? 'Memproses...' : 'Simpan User Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
