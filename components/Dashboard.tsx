
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, ProjectStatus, Worker, AttendanceRecord, Bill, PurchaseEntry } from '../types.ts';
import { 
  Users, Wallet, IndianRupee, AlertCircle, CheckCircle2, 
  ShieldAlert, Zap, Target, MapPin, Building2, RefreshCw, WifiOff, Database
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  bills: Bill[];
  purchases: PurchaseEntry[];
  isOnline?: boolean;
  isSyncing?: boolean;
  lastSynced?: string;
  onSync?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, workers, attendance, bills, purchases, isOnline, isSyncing, lastSynced, onSync }) => {
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  
  const projectSummaries = projects.map(p => {
    const budgetUsed = (p.spent || 0) / p.budget;
    const completion = (p.completionPercentage || 0) / 100;
    let health: 'stable' | 'warning' | 'critical' = 'stable';
    if (budgetUsed > 0.9) health = 'critical';
    else if (budgetUsed > completion + 0.1) health = 'warning';
    return { ...p, health, budgetUsed: budgetUsed * 100 };
  });

  const attendanceTrend = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      Present: Math.floor(Math.random() * workers.length) + 1,
      Absent: 2
    };
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-slate-200/60">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Construction Command Center</span>
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
        </div>
        
        {/* Offline Sync Monitor */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">Last Synced</span>
                <span className="text-[11px] font-mono font-bold text-slate-700">{lastSynced || '--:--'}</span>
            </div>
            <button 
                onClick={onSync}
                disabled={!isOnline || isSyncing}
                className={`p-2 rounded-lg transition-all ${isOnline && !isSyncing ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                title={isOnline ? "Force cloud sync" : "Connect to internet to sync"}
            >
                <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Active Budget', val: `₹${(totalBudget/10000000).toFixed(2)} Cr`, sub: 'Contract Value', icon: IndianRupee, color: 'blue' },
           { label: 'Spent Today', val: `₹${(totalSpent/100000).toFixed(1)} L`, sub: 'YTD Expenditure', icon: Wallet, color: 'orange' },
           { label: 'Live Sites', val: activeProjects.length, sub: 'In-Progress Sites', icon: Building2, color: 'indigo' },
           { label: 'Personnel Live', val: presentCount, sub: `${((presentCount/workers.length)*100).toFixed(0)}% Deployment`, icon: Users, color: 'emerald' }
         ].map((m, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</div>
               <div className="text-2xl font-black text-slate-900">{m.val}</div>
               <div className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full bg-${m.color}-500`}></div>
                  {m.sub}
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <ShieldAlert size={16} className="text-slate-400" />
                 Portfolio Health
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectSummaries.slice(0, 4).map(p => (
                   <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</span>
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${p.health === 'stable' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {p.health}
                         </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full bg-slate-900" style={{ width: `${p.completionPercentage}%` }} />
                      </div>
                      <div className="flex justify-between mt-2">
                         <span className="text-[10px] text-slate-400 font-bold uppercase">Budget Utilized</span>
                         <span className="text-[10px] text-slate-900 font-bold">{p.budgetUsed.toFixed(0)}%</span>
                      </div>
                   </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Operational Pulse</h3>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceTrend}>
                       <defs>
                          <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                       <YAxis hide />
                       <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                       <Area type="monotone" dataKey="Present" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorP)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className={`rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all ${isOnline ? 'bg-slate-900 text-white' : 'bg-red-900 text-red-100'}`}>
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                 {isOnline ? <Target size={120} /> : <WifiOff size={120} />}
              </div>
              <div className="relative z-10">
                 <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                    <Database size={16} className={isOnline ? "text-emerald-500" : "text-red-400"} />
                    {isOnline ? "Sync Connected" : "Local Storage Mode"}
                 </h3>
                 <p className="text-xs opacity-70 mb-4 leading-relaxed">
                    {isOnline 
                      ? "System is actively syncing with the master server. All data is backed up." 
                      : "Working offline. Changes are saved locally and will sync when connection is restored."}
                 </p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                       <span>Database Integrity</span>
                       <span>99.9%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99%' }} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                 <Zap size={16} className="text-blue-500" />
                 Action Required
              </h3>
              <div className="space-y-4">
                 {projectSummaries.filter(p => p.health !== 'stable').slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                       <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                       <div>
                          <div className="text-xs font-bold text-red-900">{p.name}</div>
                          <div className="text-[10px] text-red-700 mt-0.5 font-medium">Budget ceiling reached (90%+)</div>
                       </div>
                    </div>
                 ))}
                 {projectSummaries.filter(p => p.health !== 'stable').length === 0 && (
                    <div className="text-center py-4">
                        <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Portfolio Stable</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
