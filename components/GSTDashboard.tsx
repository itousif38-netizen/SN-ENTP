
import React, { useState } from 'react';
import { Project, Bill } from '../types.ts';
import { Percent, Download, Building2 } from 'lucide-react';

interface GSTDashboardProps {
  projects: Project[];
  bills: Bill[];
}

const GSTDashboard: React.FC<GSTDashboardProps> = ({ projects, bills }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const filtered = bills.filter(b => selectedProjectId === 'All' || b.projectId === selectedProjectId);
  const totalGST = filtered.reduce((sum, b) => sum + (b.gstAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">GST Dashboard</h1>
        <button onClick={() => window.print()} className="bg-white border px-4 py-2 rounded flex items-center gap-2"><Download size={18} /> Export PDF</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-purple-600 p-6 rounded-xl text-white shadow-md">
             <div className="flex items-center gap-2 mb-1"><Percent size={18} /> <span className="text-sm font-medium">Total GST Liability</span></div>
             <div className="text-2xl font-bold">₹{totalGST.toLocaleString('en-IN')}</div>
         </div>
      </div>
      <div className="bg-white rounded border overflow-hidden">
          <div className="p-4 border-b"><select className="w-full border p-2 rounded" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}><option value="All">All Projects</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr><th>Bill No</th><th>Project</th><th className="text-right">GST Amount</th></tr></thead>
              <tbody className="divide-y">{filtered.map(b => (
                  <tr key={b.id}><td>{b.billNo}</td><td>{projects.find(p => p.id === b.projectId)?.name}</td><td className="text-right font-bold text-purple-700">₹{b.gstAmount}</td></tr>
              ))}</tbody>
          </table>
      </div>
    </div>
  );
};

export default GSTDashboard;
