
import React, { useState } from 'react';
import { Project, MessEntry } from '../types.ts';
import { Plus, Trash2, Download, Building2 } from 'lucide-react';

interface MessManagerProps {
  projects: Project[];
  messEntries: MessEntry[];
  onAddMess: (entry: MessEntry) => void;
  onEditMess: (entry: MessEntry) => void;
  onDeleteMess: (id: string) => void;
}

const MessManager: React.FC<MessManagerProps> = ({ projects, messEntries, onAddMess, onDeleteMess }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MessEntry>>({ projectId: '', rate: 0, workerCount: 0 });

  const filtered = messEntries.filter(e => selectedProjectId === 'All' || e.projectId === selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) return;
    onAddMess({ ...formData, id: Date.now().toString(), totalAmount: (formData.rate||0) * (formData.workerCount||0), balance: 0, amountPaid: 0 } as MessEntry);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mess Management</h1>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 text-white px-4 py-2 rounded text-sm"><Plus size={18}/> New Bill</button>
      </div>
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border grid grid-cols-3 gap-4">
          <select className="border p-2 rounded" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} required>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="number" className="border p-2 rounded" placeholder="Worker Count" onChange={e => setFormData({...formData, workerCount: Number(e.target.value)})} />
          <input type="number" className="border p-2 rounded" placeholder="Rate" onChange={e => setFormData({...formData, rate: Number(e.target.value)})} />
          <button type="submit" className="bg-orange-600 text-white rounded">Save</button>
        </form>
      )}
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th>Project</th><th>Count</th><th>Total</th><th>Action</th></tr></thead>
          <tbody>{filtered.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{projects.find(p => p.id === e.projectId)?.name}</td>
              <td className="p-3 text-center">{e.workerCount}</td>
              <td className="p-3 text-right">₹{e.totalAmount}</td>
              <td className="p-3 text-right"><button onClick={() => onDeleteMess(e.id)} className="text-red-500"><Trash2 size={16}/></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default MessManager;
