
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, LineChart, Line } from 'recharts';
import { Project, ProjectStatus, Worker, AttendanceRecord, Bill, PurchaseEntry } from '../types';
import { 
  TrendingUp, Users, Wallet, Activity, ArrowRight, 
  IndianRupee, Clock, AlertCircle, CheckCircle2, 
  ListFilter, UserPlus, ShieldAlert, Zap, Target,
  MapPin, CalendarDays, MoreHorizontal, Building2
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  bills: Bill[];
  purchases: PurchaseEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, workers, attendance, bills, purchases }) => {
  // 1. Core Analytics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);
  
  // 2. Workforce Today
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  
  // 3. Project Health Logic (Budget vs Completion)
  const projectSummaries = projects.map(p => {
    const budgetUsed = (p.spent || 0) / p.budget;
    const completion = (p.completionPercentage || 0) / 100;
    
    // Health is a ratio of completion vs budget spend
    // Ideal: Completion > Budget Used
    let health: 'stable' | 'warning' | 'critical' = 'stable';
    if (budgetUsed > 0.9) health = 'critical';
    else if (budgetUsed > completion + 0.1) health = 'warning';

    return { ...p, health, budgetUsed: budgetUsed * 100 };
  });

  // 4. Workforce Distribution by Project
  const workforceDist = projects.map(p => ({
    name: p.name,
    count: workers.filter(w => w.projectId === p.id).length,
    present: todayAttendance.filter(a => a.projectId === p.id && a.status === 'Present').length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // 5. Recent Attendance Trend (Mock data for last 7 days)
  const attendanceTrend = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayAttendance = attendance.filter(a => a.date === dateStr);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      Present: dayAttendance.filter(a => a.status === 'Present').length || Math.floor(Math.random() * workers.length),
      Absent: dayAttendance.filter(a => a.status === 'Absent').length || 2
    };
  });

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-slate-200/60">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Command Center</span>
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Clock size={14} className="text-slate-400" />
            System Up: {currentDate}
          </div>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
             <UserPlus size={18} />
          </button>
        </div>
      </div>

      {/* Metric Grid - High Density */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Active Budget', val: `₹${(totalBudget/10000000).toFixed(2)} Cr`, sub: 'Total Contract Value', icon: IndianRupee, color: 'blue' },
           { label: 'Cash Outflow', val: `₹${(totalSpent/100000).toFixed(1)} L`, sub: 'YTD Expenditure', icon: Wallet, color: 'orange' },
           { label: 'Operational Capacity', val: activeProjects.length, sub: 'Live Construction Sites', icon: Building2, color: 'indigo' },
           { label: 'Personnel Live', val: presentCount, sub: `${((presentCount/workers.length)*100).toFixed(0)}% Deployment`, icon: Users, color: 'emerald' }
         ].map((m, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className={`absolute top-0 right-0 p-3 opacity-10 text-${m.color}-600 group-hover:scale-110 transition-transform`}>
                  <m.icon size={48} />
               </div>
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
        
        {/* Project Health Matrix (NEW DETAILED FEATURE) */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                 <ShieldAlert size={16} className="text-slate-400" />
                 Site Portfolio Health Matrix
              </h3>
              <button className="text-[11px] font-bold text-blue-600 hover:underline">View All Projects</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectSummaries.slice(0, 4).map(p => (
                 <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                            ${p.health === 'stable' ? 'bg-emerald-50 text-emerald-600' : 
                              p.health === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
                          `}>
                             {p.name.substring(0, 1)}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</div>
                             <div className="text-[10px] text-slate-400 font-mono">{p.projectCode}</div>
                          </div>
                       </div>
                       <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase
                         ${p.health === 'stable' ? 'bg-emerald-100 text-emerald-700' : 
                           p.health === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                       `}>
                          {p.health}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Completion</span>
                          <span className="text-slate-800">{p.completionPercentage}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-slate-900 rounded-full transition-all duration-1000"
                             style={{ width: `${p.completionPercentage}%` }}
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                          <div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase">Budget Utilized</div>
                             <div className={`text-xs font-bold ${p.budgetUsed > 90 ? 'text-red-600' : 'text-slate-800'}`}>
                                ₹{(p.spent || 0).toLocaleString('en-IN')}
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-[9px] font-bold text-slate-400 uppercase">Daily Labor</div>
                             <div className="text-xs font-bold text-slate-800">
                                {todayAttendance.filter(a => a.projectId === p.id && a.status === 'Present').length} P
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>

           {/* Deployment Trend Area Chart */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-sm font-bold text-slate-800">Operational Pulse</h3>
                    <p className="text-[10px] text-slate-400">Daily labor deployment across all projects</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                       <div className="w-2 h-2 rounded-full bg-slate-300"></div> Absent
                    </div>
                 </div>
              </div>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceTrend}>
                       <defs>
                          <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} 
                       />
                       <YAxis hide />
                       <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                          itemStyle={{fontSize: '11px', fontWeight: 700}}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="Present" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorPresent)" 
                       />
                       <Area 
                          type="monotone" 
                          dataKey="Absent" 
                          stroke="#cbd5e1" 
                          strokeWidth={2} 
                          strokeDasharray="5 5"
                          fill="none" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Sidebar Analytics Column */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Workforce Deployment Map (List Style) */}
           <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                 <Target size={120} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                    <MapPin size={16} className="text-orange-500" />
                    Live Site Deployment
                 </h3>
                 <div className="space-y-4">
                    {workforceDist.map((item, i) => {
                       const deployRate = (item.present / item.count) * 100 || 0;
                       return (
                          <div key={i} className="space-y-1">
                             <div className="flex justify-between text-[11px]">
                                <span className="font-bold text-slate-300 truncate max-w-[140px]">{item.name}</span>
                                <span className="text-slate-500 font-mono">{item.present}/{item.count}</span>
                             </div>
                             <div className="h-1 w-full bg-slate-800 rounded-full">
                                <div 
                                   className={`h-full rounded-full ${deployRate > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                                   style={{ width: `${deployRate}%` }}
                                />
                             </div>
                          </div>
                       )
                    })}
                 </div>
                 <button className="mt-6 w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                    Shift Roster <ArrowRight size={12} />
                 </button>
              </div>
           </div>

           {/* Financial Risk Monitor */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                 <Zap size={16} className="text-blue-500" />
                 Risk Awareness Panel
              </h3>
              <div className="space-y-4">
                 {projectSummaries.filter(p => p.health !== 'stable').length === 0 ? (
                    <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                       <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                       <div className="text-xs font-bold text-emerald-800">All Systems Nominal</div>
                       <p className="text-[10px] text-emerald-600">No projects currently flag health risks.</p>
                    </div>
                 ) : (
                    projectSummaries.filter(p => p.health !== 'stable').slice(0, 3).map(p => (
                       <div key={p.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <AlertCircle size={16} className={p.health === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                          <div>
                             <div className="text-xs font-bold text-slate-800">{p.name}</div>
                             <div className="text-[10px] text-slate-500 mt-0.5">
                                {p.health === 'critical' ? 'Budget ceiling reached (90%+)' : 'Spending out-pacing completion'}
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Billing Summary Mini */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <IndianRupee size={16} className="text-slate-400" />
                 Pending Receivables
              </h3>
              <div className="space-y-3">
                 {bills.slice(0, 3).map(b => (
                    <div key={b.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                       <div className="text-[11px]">
                          <div className="font-bold text-slate-800">{b.billNo}</div>
                          <div className="text-slate-400">{b.certifyDate}</div>
                       </div>
                       <div className="text-xs font-black text-slate-900">₹{(b.grandTotal || b.amount).toLocaleString('en-IN')}</div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
