import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, ProjectStatus } from '../types';
import { TrendingUp, Users, Wallet, Activity, ArrowRight, IndianRupee, Clock } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  // Calculated metrics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;

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
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
           <p className="text-slate-500 text-sm mt-1">Real-time overview of construction performance and financials.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-xs font-medium text-slate-600">
          <Clock size={14} className="text-slate-400" />
          {currentDate}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Total Budget */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-md transition-all duration-300 group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <IndianRupee size={22} className="text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">+12%</span>
             </div>
             <div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Budget</div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">₹{(totalBudget/10000000).toFixed(2)} Cr</div>
             </div>
         </div>

         {/* Total Expenses */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-md transition-all duration-300 group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <Wallet size={22} className="text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">YTD</span>
             </div>
             <div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Expenses</div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">₹{(totalSpent/100000).toFixed(2)} L</div>
             </div>
         </div>

         {/* Active Projects */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-md transition-all duration-300 group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Activity size={22} className="text-purple-600" />
                </div>
             </div>
             <div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Active Sites</div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{activeProjects} <span className="text-sm text-slate-400 font-normal">/ {projects.length} Total</span></div>
             </div>
         </div>

         {/* Utilization */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-md transition-all duration-300 group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                    <TrendingUp size={22} className="text-teal-600" />
                </div>
             </div>
             <div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Budget Utilization</div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                     {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
                </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 text-lg">Financial Overview</h3>
               <div className="flex gap-2">
                   <span className="flex items-center gap-1 text-xs font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-800"></div> Budget</span>
                   <span className="flex items-center gap-1 text-xs font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Spent</span>
               </div>
           </div>
           <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} 
                    dy={10} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11}} 
                    tickFormatter={(value) => `₹${value/1000}k`} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px',
                      fontFamily: 'Inter, sans-serif'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '2px' }}
                  labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="Budget" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000} />
                <Bar dataKey="Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project List Compact */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 text-lg">Active Sites</h3>
                 <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">{activeProjects} Active</span>
             </div>
             <div className="flex-1 overflow-y-auto max-h-[350px]">
                 <div className="divide-y divide-slate-50">
                     {projects.slice(0, 5).map(p => (
                         <div key={p.id} className="p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                             <div className="flex justify-between items-center mb-1">
                                 <h4 className="font-semibold text-slate-800 text-sm truncate pr-2 group-hover:text-blue-600 transition-colors">{p.name}</h4>
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                     p.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                     p.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                     'bg-orange-50 text-orange-600 border-orange-100'
                                 }`}>
                                     {p.status === 'In Progress' ? 'Active' : p.status}
                                 </span>
                             </div>
                             <div className="flex justify-between items-center mt-2">
                                 <div className="text-xs text-slate-500 font-mono">
                                     ₹{p.spent?.toLocaleString('en-IN')} / ₹{p.budget.toLocaleString('en-IN')}
                                 </div>
                                 <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full" 
                                        style={{width: `${(p.completionPercentage || 0)}%`}}
                                    ></div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                 <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 w-full">
                     View All Projects <ArrowRight size={12} />
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;