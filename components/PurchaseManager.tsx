
import React, { useState } from 'react';
import { Project, PurchaseEntry } from '../types.ts';
import { ShoppingCart, Plus, Pencil, Trash2, Download, Search } from 'lucide-react';

interface PurchaseManagerProps {
  projects: Project[];
  purchases: PurchaseEntry[];
  onAddPurchase: (purchase: PurchaseEntry) => void;
  onEditPurchase: (purchase: PurchaseEntry) => void;
  onDeletePurchase: (id: string) => void;
}

const PurchaseManager: React.FC<PurchaseManagerProps> = ({ projects, purchases, onAddPurchase, onDeletePurchase }) => {
  const [sel, setSel] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PurchaseEntry>>({ projectId: '', description: '', quantity: 0, rate: 0, date: new Date().toISOString().split('T')[0] });

  const filtered = purchases.filter(p => sel === 'All' || p.projectId === sel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || !formData.description) return;
    onAddPurchase({ ...formData, id: Date.now().toString(), totalAmount: (formData.quantity||0) * (formData.rate||0), serialNo: purchases.length + 1 } as PurchaseEntry);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Material Purchase</h1>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={18}/> Add Entry</button>
      </div>
      <div className="bg-white p-4 rounded border"><select className="w-full border p-2 rounded" value={sel} onChange={e => setSel(e.target.value)}><option value="All">All Projects</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border grid grid-cols-2 md:grid-cols-4 gap-4">
          <select className="border p-2 rounded" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} required><option value="">Select Site</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input className="border p-2 rounded" placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} />
          <input className="border p-2 rounded" type="number" placeholder="Qty" onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
          <input className="border p-2 rounded" type="number" placeholder="Rate" onChange={e => setFormData({...formData, rate: Number(e.target.value)})} />
          <button type="submit" className="bg-orange-600 text-white rounded">Save</button>
        </form>
      )}
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th>Date</th><th>Item</th><th className="text-right">Total</th><th>Action</th></tr></thead>
          <tbody>{filtered.map(p => (
            <tr key={p.id} className="border-t"><td className="p-3">{p.date}</td><td className="p-3">{p.description}</td><td className="p-3 text-right font-bold">₹{p.totalAmount}</td><td className="p-3 text-right"><button onClick={() => onDeletePurchase(p.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseManager;
