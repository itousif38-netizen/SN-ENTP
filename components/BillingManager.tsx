
import React, { useState } from 'react';
import { Project, Bill, ClientPayment } from '../types.ts';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

interface BillingManagerProps {
  projects: Project[];
  bills: Bill[];
  clientPayments?: ClientPayment[];
  onAddBill: (b: Bill) => void;
  onEditBill: (b: Bill) => void;
  onDeleteBill: (id: string) => void;
  onAddPayment?: (p: ClientPayment) => void;
  onEditPayment?: (p: ClientPayment) => void;
  onDeletePayment?: (id: string) => void;
}

const BillingManager: React.FC<BillingManagerProps> = ({ projects, bills, clientPayments = [], onAddBill, onEditBill, onDeleteBill, onAddPayment, onEditPayment, onDeletePayment }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [managingProjectId, setManagingProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Bill>>({ projectId: '', billNo: '', workNature: '', amount: 0, billingMonth: new Date().toISOString().slice(0, 7) });

  const filteredBills = bills.filter(b => b.billNo.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || !formData.amount) return;
    const bill = { ...formData, id: editingId || Date.now().toString(), serialNo: bills.length + 1 } as Bill;
    editingId ? onEditBill(bill) : onAddBill(bill);
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-slate-900">Billing & Client Payments</h1></div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={18} /> {isFormOpen ? 'Close' : 'Add Bill'}</button>
      </div>
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="border p-2 rounded" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} required>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="text" className="border p-2 rounded" placeholder="Bill No" value={formData.billNo} onChange={e => setFormData({...formData, billNo: e.target.value})} />
          <input type="number" className="border p-2 rounded" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
          <button type="submit" className="bg-slate-900 text-white rounded">Save Bill</button>
        </form>
      )}
      <div className="bg-white rounded border overflow-hidden">
        <div className="p-2 border-b"><input type="text" className="w-full p-2 border rounded" placeholder="Search bills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th>Bill No</th><th>Project</th><th className="text-right">Amount</th><th>Action</th></tr></thead>
          <tbody>{filteredBills.map(b => (
            <tr key={b.id} className="border-t">
              <td className="p-3">{b.billNo}</td>
              <td className="p-3">{projects.find(p => p.id === b.projectId)?.name}</td>
              <td className="p-3 text-right font-bold">₹{b.amount.toLocaleString()}</td>
              <td className="p-3 text-right">
                <button onClick={() => onDeleteBill(b.id)} className="text-red-500"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingManager;
