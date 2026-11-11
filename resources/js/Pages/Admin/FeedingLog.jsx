import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Scale } from 'lucide-react';

export default function FeedingLog({ sheepData = { data: [] }, stats, fullScreen }) {
  const sheepList = Array.isArray(sheepData) ? sheepData : (sheepData?.data || []);
  const feedingSheep = sheepList.filter(s => s.block === 'Penggemukan');

  return (
    <AdminLayout currentTab="penggemukan" stats={stats} fullScreen={fullScreen}>
      <Head title="Log Penggemukan" />
      <div className="space-y-6 animate-in fade-in duration-300">
         <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-m3-soft relative overflow-hidden text-center md:text-left">
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm shrink-0 z-10"><Scale className="h-10 w-10 text-blue-500" /></div>
            <div className="z-10">
              <h3 className="text-3xl font-black text-slate-800 mb-2">Monitor Log Penggemukan</h3>
              <p className="text-slate-500 font-medium text-lg max-w-2xl">Lakukan pembaruan bobot rutin (mingguan) untuk melacak Average Daily Gain (ADG) dan memprediksi waktu panen ideal domba pedaging.</p>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="p-6">ID & Ras Domba</th>
                  <th className="p-6">Bobot Aktual</th>
                  <th className="p-6">Target Panen Ideal</th>
                  <th className="p-6 text-center">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedingSheep.map(s => {
                  const target = 50; 
                  const progress = Math.min((s.weight / target) * 100, 100);
                  
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">{s.tag}</div>
                          <span className="font-black text-slate-800">{s.type}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-black text-3xl text-emerald-600">{s.weight}</span> <span className="text-sm font-black text-emerald-600/50">kg</span>
                      </td>
                      <td className="p-6 w-1/3">
                        <div className="flex justify-between text-xs font-black mb-2">
                          <span className="text-slate-500">Progres Panen</span>
                          <span className="text-indigo-600">{Math.round(progress)}% (Target: {target}kg)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                          <div className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <button onClick={() => alert('Simulasi: Update timbangan berhasil.')} className="bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2 mx-auto w-full md:w-auto">
                          <Scale className="w-4 h-4" /> Update Timbangan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
