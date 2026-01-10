
import React, { useState } from 'react';
import { Project, PurchaseEntry, KharchiEntry, AdvanceEntry, ClientPayment, WorkerPayment, MessEntry, Bill } from '../types.ts';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ExpenseManagerProps {
  projects: Project[];
  purchases: PurchaseEntry[];
  kharchi: KharchiEntry[];
  advances: AdvanceEntry[];
  clientPayments: ClientPayment[];
  workerPayments: WorkerPayment[];
  messEntries: MessEntry[];
  bills: Bill[];
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ projects, purchases, kharchi, advances, clientPayments, workerPayments, messEntries, bills }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const filter = (item: { projectId: string }) => selectedProjectId === 'All' || item.projectId === selectedProjectId;

  const exp = purchases.filter(filter).reduce((s, p) => s + p.totalAmount, 0) + 
            kharchi.filter(filter).reduce((s, k) => s + k.amount, 0) + 
            advances.filter(filter).reduce((s, a) => s + a.amount, 0) + 
            workerPayments.filter(filter).reduce((s, w) => s + w.netPayable, 0);
  const inc = clientPayments.filter(filter).reduce((s, c) => s + c.amount, 0);

  const data = [
    { name: 'Income', amount: inc, fill: '#16a34a' },
    { name: 'Expense', amount: exp, fill: '#dc2626' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expense Manager (P&L)</h1>
      <select className="border p-2 rounded" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}><option value="All">All Projects</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-green-100 p-4 rounded"><span>Income</span><div className="text-xl font-bold">₹{inc.toLocaleString()}</div></div>
         <div className="bg-red-100 p-4 rounded"><span>Expense</span><div className="text-xl font-bold">₹{exp.toLocaleString()}</div></div>
      </div>
      <div className="h-64 bg-white p-4 rounded border">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#8884d8" /></BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseManager;
