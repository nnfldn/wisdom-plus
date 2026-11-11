import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Activity, ShoppingBag, HeartPulse, TrendingUp, 
  Users, ChevronRight, Target
} from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-m3-glow border border-white/10">
        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-m3-primary">{label}</p>
        <p className="text-sm font-black">{payload[0].value} <span className="opacity-50 text-[10px]">Units</span></p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ sheepData = [], recentBreedings = [], populationTrend = [], weightTrend = [], stats = {}, fullScreen }) {
  return (
    <AdminLayout currentTab="dashboard" stats={stats} fullScreen={fullScreen}>
      <Head title="Control Center - Wisma Domba" />
      
      <div className="space-y-8 animate-in fade-in duration-smooth pb-10">
        
        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users/>} label="Total Populasi" value={stats.total} trend="+12%" color="bg-m3-primary" />
          <StatCard icon={<ShoppingBag/>} label="Ready to Sell" value={stats.siapJual} trend="+5%" color="bg-slate-800" />
          <StatCard icon={<HeartPulse/>} label="Dalam Kandungan" value={stats.hamil} trend="Active" color="bg-amber-500" />
          <StatCard icon={<Activity/>} label="Kondisi Sakit" value={stats.sakit} trend="Warning" color="bg-rose-500" />
        </div>

        {/* MAIN CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* POPULATION GROWTH CHART */}
          <div className="lg:col-span-2 bg-white rounded-3xl md:rounded-4xl p-6 md:p-10 md:shadow-m3-soft md:border md:border-slate-100 shadow-sm border border-slate-50 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Tren Pertumbuhan Populasi</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Laporan 6 Bulan Terakhir</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-m3-primary"></div>
                  <span className="text-[10px] font-black uppercase text-slate-500">Actual</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={populationTrend}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2B5E41" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2B5E41" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#2B5E41" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BREEDING DISTRIBUTION - LIGHT THEME */}
          <div className="bg-white rounded-4xl p-10 text-slate-800 relative overflow-hidden flex flex-col justify-between shadow-m3-soft border border-slate-100">
            <div className="absolute top-0 right-0 w-40 h-40 bg-m3-primary/5 rounded-full blur-3xl"></div>
            <div>
              <h3 className="text-xl font-black tracking-tight mb-2 text-slate-800">Gender Ratio</h3>
              <p className="text-[10px] font-bold text-m3-primary uppercase tracking-[0.2em] mb-10">Productivity Balance</p>
              
              <div className="space-y-8">
                <RatioBar label="Pejantan (Males)" value={stats.jantan} total={stats.total} color="bg-m3-primary/30" />
                <RatioBar label="Indukan (Females)" value={stats.betina} total={stats.total} color="bg-m3-primary" />
              </div>
            </div>

            <div className="mt-10 bg-slate-50 border border-slate-100 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-m3-primary/10 rounded-2xl text-m3-primary"><Target size={20}/></div>
                <p className="text-xs font-black uppercase tracking-widest text-m3-primary">Target 2026</p>
              </div>
              <p className="text-2xl font-black text-slate-800">{populationTrend[populationTrend.length-1]?.target || 0} <span className="text-xs opacity-40 font-medium">Head of Sheep</span></p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-m3-primary h-full transition-all duration-1000 ease-smooth" 
                  style={{ width: `${Math.min((stats.total / (populationTrend[populationTrend.length-1]?.target || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT MATING LOGS */}
          <div className="bg-white rounded-4xl border border-slate-100 p-8 shadow-m3-soft group">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <HeartPulse className="text-rose-500" size={20} /> Latest Mating
              </h3>
              <a href="/admin/breeding" className="bg-m3-surface p-2 rounded-xl text-slate-400 hover:text-m3-primary transition-all duration-smooth"><ChevronRight size={16}/></a>
            </div>
            <div className="space-y-4">
              {(recentBreedings || []).map((b, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-m3-surface/50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:shadow-m3-soft transition-all duration-smooth cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover/item:border-m3-primary/20 transition-colors">
                      {b.male?.tag?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{b.male?.tag || 'Unknown'} x {b.female?.tag || 'Unknown'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{b.mating_date}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${b.status === 'Pregnant' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* WEIGHT PERFORMANCE */}
          <div className="lg:col-span-2 bg-white rounded-4xl border border-slate-100 p-8 shadow-m3-soft">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <TrendingUp className="text-m3-primary" size={20} /> Average Weight by Breed
              </h3>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kg per Sheep Type</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weightTrend}>
                  <XAxis 
                    dataKey="name" 
                    hide={false}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 'bold'}}
                  />
                  <Bar dataKey="weight" radius={[6, 6, 0, 0]} animationBegin={500}>
                    {weightTrend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2B5E41' : '#2B5E41/40'} />
                    ))}
                  </Bar>
                  <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 border-t border-slate-50 pt-6">
               <div className="text-center flex-1 border-r border-slate-50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Weight</p>
                 <p className="text-xl font-black text-slate-800">
                   {weightTrend.length > 0 ? (weightTrend.reduce((acc, curr) => acc + curr.weight, 0) / weightTrend.length).toFixed(1) : 0}
                   <span className="text-[10px] ml-0.5 opacity-30">kg</span>
                 </p>
               </div>
               <div className="text-center flex-1">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Asset Value</p>
                 <p className="text-xl font-black text-m3-primary">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.estimasiAset || 0)}
                 </p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-4xl border border-slate-100 shadow-sm md:shadow-m3-soft group hover:shadow-m3-glow transition-all duration-smooth">
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className={`p-3 md:p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-105 transition-all duration-smooth`}>
          {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black ${trend === 'Warning' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {trend}
        </div>
      </div>
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">{label}</p>
      <h4 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{value}</h4>
    </div>
  );
}

function RatioBar({ label, value, total, color }) {
  const p = Math.round((value / total) * 100);
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-lg font-black text-slate-800">{value} <span className="text-[10px] opacity-30 uppercase">Ekor</span></span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-smooth`} style={{ width: `${p}%` }}></div>
      </div>
    </div>
  );
}
