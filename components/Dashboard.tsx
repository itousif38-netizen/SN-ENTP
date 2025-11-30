import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, ProjectStatus } from '../types';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  // Calculated metrics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;

  const chartData = projects.map(p => ({
    name: p.name.split(' ')[0], 
    Budget: p.budget,
    Spent: p.spent || 0
  }));

  const currentDate = new Date();
  const fiscalYearStart = currentDate.getMonth() >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
  const periodString = `1-Apr-${fiscalYearStart} to 31-Mar-${fiscalYearStart + 1}`;
  const dateString = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const dayString = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });

  return (
    <div className="space-y-4">
      {/* Tally Style Period Header */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-4 bg-white border border-slate-300 shadow-sm">
         <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-slate-300">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current Period</div>
            <div className="font-bold text-slate-800">{periodString}</div>
         </div>
         <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-slate-300">
             <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current Date</div>
             <div className="font-bold text-slate-800">{dateString}</div>
             <div className="text-xs text-slate-400">{dayString}</div>
         </div>
         <div className="flex-1 p-3 bg-tally-yellow-light">
             <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Company</div>
             <div className="font-bold text-black uppercase">SN Enterprise</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Tally Style Tiles */}
         <div className="bg-white border border-slate-300 p-4 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-xs font-bold text-tally-teal uppercase mb-2 border-b pb-1">Total Budget Allocated</div>
             <div className="text-2xl font-bold text-slate-800 mt-2">₹{totalBudget.toLocaleString('en-IN')}</div>
             <div className="text-xs text-slate-500 mt-1">Across all projects</div>
         </div>

         <div className="bg-white border border-slate-300 p-4 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-xs font-bold text-tally-teal uppercase mb-2 border-b pb-1">Total Expenses</div>
             <div className="text-2xl font-bold text-slate-800 mt-2">₹{totalSpent.toLocaleString('en-IN')}</div>
             <div className="text-xs text-slate-500 mt-1">To Date</div>
         </div>

         <div className="bg-white border border-slate-300 p-4 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-xs font-bold text-tally-teal uppercase mb-2 border-b pb-1">Active Sites</div>
             <div className="text-2xl font-bold text-slate-800 mt-2">{activeProjects}</div>
             <div className="text-xs text-slate-500 mt-1">Sites In Progress</div>
         </div>

         <div className="bg-white border border-slate-300 p-4 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-xs font-bold text-tally-teal uppercase mb-2 border-b pb-1">Fund Utilization</div>
             <div className="text-2xl font-bold text-slate-800 mt-2">
                 {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
             </div>
             <div className="text-xs text-slate-500 mt-1">Budget Consumed</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white border border-slate-300 p-4 shadow-sm">
           <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
               <h3 className="font-bold text-tally-teal uppercase text-sm">Budget Vs Actuals</h3>
               <button className="text-xs text-blue-600 hover:underline">Change View</button>
           </div>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{border: '1px solid #cbd5e1', borderRadius: '0px'}}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="Budget" fill="#007692" radius={[0, 0, 0, 0]} barSize={30} />
                <Bar dataKey="Spent" fill="#fcc200" radius={[0, 0, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project List (Text Heavy) */}
        <div className="bg-white border border-slate-300 p-0 shadow-sm flex flex-col">
             <div className="p-3 border-b border-slate-200 bg-slate-50">
                 <h3 className="font-bold text-tally-teal uppercase text-sm">Site Status Summary</h3>
             </div>
             <div className="flex-1 overflow-y-auto">
                 <table className="w-full text-sm text-left">
                     <thead>
                         <tr>
                             <th className="px-3 py-2 bg-slate-100 border-b">Project Name</th>
                             <th className="px-3 py-2 bg-slate-100 border-b text-right">Status</th>
                         </tr>
                     </thead>
                     <tbody>
                         {projects.slice(0, 8).map(p => (
                             <tr key={p.id} className="border-b border-slate-100 hover:bg-tally-yellow-light cursor-pointer">
                                 <td className="px-3 py-2 font-medium text-slate-700 truncate max-w-[150px]">{p.name}</td>
                                 <td className="px-3 py-2 text-right">
                                     <span className={`text-xs font-bold px-2 py-0.5 border ${
                                         p.status === 'In Progress' ? 'border-blue-400 text-blue-700 bg-blue-50' :
                                         p.status === 'Completed' ? 'border-green-400 text-green-700 bg-green-50' :
                                         'border-orange-400 text-orange-700 bg-orange-50'
                                     }`}>
                                         {p.status}
                                     </span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             <div className="p-2 border-t border-slate-200 bg-slate-50 text-center">
                 <button className="text-xs text-blue-600 font-bold hover:underline uppercase">View All Projects</button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;