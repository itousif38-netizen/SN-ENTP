
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Project, ProjectStatus, Worker, AttendanceRecord, Bill, PurchaseEntry } from '../types';
import { TrendingUp, Users, Wallet, Activity, ArrowRight, IndianRupee, Clock, AlertCircle, CheckCircle2, ListFilter, UserPlus } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  bills: Bill[];
  purchases: PurchaseEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, workers, attendance, bills, purchases }) => {
  // 1. Calculated Core Metrics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;

  // 2. Status Distribution
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = [
    { name: 'Planning', value: statusCounts[ProjectStatus.PLANNING] || 0, color: '#a855f7' },
    { name: 'In Progress', value: statusCounts[ProjectStatus.IN_PROGRESS] || 0, color: '#3b82f6' },
    { name: 'Completed', value: statusCounts[ProjectStatus.COMPLETED] || 0, color: '#22c55e' },
    { name: 'On Hold', value: statusCounts[ProjectStatus.ON_HOLD] || 0, color: '#f97316' },
  ];

  // 3. Workforce Snapshot (Today)
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const workforceTotal = workers.length;

  // 4. Financial Health (Top 5 Projects with Highest Spending Ratio)
  const financialData = projects
    .slice()
    .sort((a, b) => ((b.spent || 0) / b.budget) - ((a.spent || 0) / a.budget))
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
      Usage: Number(((p.spent || 0) / p.budget * 100).toFixed(1)),
      fullName: p.name
    }));

  const chartData = projects.slice(0, 8).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name, 
    Budget: p.budget,
    Spent: p.spent || 0
  }));

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-slate-200/60">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Overview</h1>
           <p className="text-slate-500 text-sm mt-1">Unified summary of operations, financials, and workforce deployment.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Clock size={14} className="text-slate-400" />
            {currentDate}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Total Financial Commitment */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <IndianRupee size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase">Valuation</span>
                </div>
             </div>
             <div className="relative z-10">
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Total Active Budget</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">₹{(totalBudget/10000000).toFixed(2)} <span className="text-sm font-semibold text-slate-400">Cr</span></div>
             </div>
         </div>

         {/* Total Expenditure */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <Wallet size={20} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase">Cash Flow</span>
                </div>
             </div>
             <div className="relative z-10">
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Total Spent YTD</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">₹{(totalSpent/100000).toFixed(2)} <span className="text-sm font-semibold text-slate-400">L</span></div>
             </div>
         </div>

         {/* Operational Capacity */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Activity size={20} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase">Operational</span>
                </div>
             </div>
             <div className="relative z-10">
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Active Sites</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{activeProjectsCount} <span className="text-sm font-semibold text-slate-400">Sites</span></div>
             </div>
         </div>

         {/* Workforce Utilization */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                    <Users size={20} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 uppercase">Workforce</span>
                </div>
             </div>
             <div className="relative z-10">
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Team Deployment</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{presentCount} <span className="text-sm font-semibold text-slate-400">On-site Today</span></div>
             </div>
         </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Project Status Summary (New Detailed Feature) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <ListFilter size={18} className="text-slate-400" />
                    Site Portfolio Status
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{projects.length} Total</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
                {statusData.map((status) => {
                    const percentage = (status.value / projects.length) * 100;
                    return (
                        <div key={status.name} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></div>
                                    {status.name}
                                </span>
                                <span className="text-slate-400 font-medium">{status.value} Sites ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${percentage}%`, backgroundColor: status.color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                 <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                            <Users size={18} />
                         </div>
                         <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Headcount</div>
                             <div className="text-sm font-bold text-slate-800">{workforceTotal} Active Personnel</div>
                         </div>
                     </div>
                     <UserPlus size={16} className="text-slate-300" />
                 </div>
            </div>
        </div>

        {/* Main Financial Chart (Enhanced) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
               <div>
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                       <TrendingUp size={18} className="text-blue-500" />
                       Financial Performance Index
                   </h3>
                   <p className="text-xs text-slate-400 font-medium mt-0.5">Budget Allocation vs Actual Spend per Site</p>
               </div>
               <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                       <div className="w-2.5 h-2.5 rounded bg-slate-800"></div>
                       Budget
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                       <div className="w-2.5 h-2.5 rounded bg-blue-500"></div>
                       Spent
                   </div>
               </div>
           </div>
           
           <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                    dy={12} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                    tickFormatter={(value) => `₹${value/1000}k`} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      padding: '16px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(4px)'
                  }}
                  itemStyle={{ fontSize: '11px', fontWeight: 700, paddingBottom: '4px' }}
                  labelStyle={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="Budget" fill="#0f172a" radius={[3, 3, 0, 0]} barSize={22} animationDuration={1200} />
                <Bar dataKey="Spent" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={22} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Project Health / Spending Ratio (Detailed Analytics) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                Budget Consumption Index
            </h3>
            <div className="space-y-6">
                {financialData.map((p, idx) => (
                    <div key={idx} className="group cursor-default">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold text-slate-700">{p.fullName}</span>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${p.Usage > 85 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                                {p.Usage}% CONSUMED
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${p.Usage > 90 ? 'bg-red-500' : p.Usage > 70 ? 'bg-orange-500' : 'bg-blue-500'}`}
                                style={{ width: `${p.Usage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Compact List Overlay */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <CheckCircle2 size={120} className="text-white" />
             </div>
             <div className="relative z-10">
                <h3 className="font-bold text-white text-lg mb-2">Portfolio Completion</h3>
                <p className="text-slate-400 text-sm mb-6">Aggregate progress of all active enterprise sites.</p>
                
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {Math.round(projects.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) / projects.length)}%
                    </span>
                    <span className="text-slate-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Avg Completion</span>
                </div>
                
                <div className="space-y-4 mt-8">
                     <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                         <span className="text-xs text-slate-300 font-medium">{projects.filter(p => p.status === ProjectStatus.COMPLETED).length} Handed over successfully</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                         <span className="text-xs text-slate-300 font-medium">{activeProjectsCount} Projects in active execution</span>
                     </div>
                </div>
             </div>

             <div className="relative z-10 mt-8">
                 <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group">
                     Explore Site Inventory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
