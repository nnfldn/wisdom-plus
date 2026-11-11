import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Clock, User as UserIcon, Tag, Info } from 'lucide-react';

export default function History({ logs, stats, fullScreen }) {
  return (
    <AdminLayout currentTab="history" stats={stats} fullScreen={fullScreen}>
      <Head title="History Aktivitas" />
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-in fade-in duration-300">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <Clock className="h-6 w-6 text-indigo-500" /> Log Audit Sistem
          </h3>
          <p className="text-sm text-slate-500 font-bold mt-1">Menampilkan seluruh jejak perubahan data yang dilakukan oleh tim admin.</p>
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                <th className="p-6">Waktu</th>
                <th className="p-6">Admin</th>
                <th className="p-6">Aksi</th>
                <th className="p-6">Entitas</th>
                <th className="p-6">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(logs?.data || []).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-6 whitespace-nowrap">
                    <p className="font-black text-slate-700 text-sm">
                      {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 p-1.5 rounded-lg"><UserIcon size={14} className="text-slate-500"/></div>
                      <span className="font-bold text-slate-700 text-sm">{log.user?.name || 'System'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      log.action === 'create' ? 'bg-emerald-50 text-emerald-600' :
                      log.action === 'update' ? 'bg-blue-50 text-blue-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg inline-flex">
                      <Tag size={12}/> {log.entity} #{log.entity_id}
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-md">{log.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        {logs?.links?.length > 3 && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-2">
             {logs.links.map((link, i) => (
               <button 
                 key={i}
                 dangerouslySetInnerHTML={{ __html: link.label }}
                 disabled={!link.url}
                 className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                   link.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                 }`}
               />
             ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
