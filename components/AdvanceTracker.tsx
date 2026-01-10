
import React, { useState } from 'react';
import { Project, Worker, AdvanceEntry } from '../types.ts';
import { Plus, Pencil, Trash2, Download, Building2 } from 'lucide-react';

interface AdvanceTrackerProps {
  projects: Project[];
  workers: Worker[];
  advances: AdvanceEntry[];
  onAddAdvance: (entry: AdvanceEntry) => void;
  onEditAdvance: (entry: AdvanceEntry) => void;
  onDeleteAdvance: (id: string) => void;
}

const AdvanceTracker: React.FC<AdvanceTrackerProps> = ({ projects, workers, advances, onAddAdvance, onEditAdvance, onDeleteAdvance }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AdvanceEntry>>({
    workerId: '', amount: 0, paidBy: '', remarks: '',
    date: new Date().toISOString().split('T')[0], paymentMode: 'Cash'
  });

  const filteredAdvances = advances.filter(a => a.projectId === selectedProjectId);
  const projectWorkers = workers.filter(w => w.projectId === selectedProjectId);
  const selectedProjectName = projects.find(p => p.id === selectedProjectId)?.name || '';
  
  const totalProjectAdvance = filteredAdvances.reduce((sum, a) => sum + a.amount, 0);

  const handleEditClick = (adv: AdvanceEntry) => {
    setEditingId(adv.id);
    setFormData({ ...adv });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
      if(window.confirm('Are you sure you want to delete this advance entry?')) { onDeleteAdvance(id); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.workerId && formData.amount) {
      if (editingId) {
        onEditAdvance({ id: editingId, serialNo: advances.find(a => a.id === editingId)?.serialNo || 0, workerId: formData.workerId, projectId: selectedProjectId, amount: Number(formData.amount), paidBy: formData.paidBy || 'Admin', remarks: formData.remarks || '', date: formData.date || new Date().toISOString().split('T')[0], paymentMode: formData.paymentMode || 'Cash' } as AdvanceEntry);
      } else {
        onAddAdvance({ id: Date.now().toString(), serialNo: advances.length + 1, workerId: formData.workerId, projectId: selectedProjectId, amount: Number(formData.amount), paidBy: formData.paidBy || 'Admin', remarks: formData.remarks || '', date: formData.date || new Date().toISOString().split('T')[0], paymentMode: formData.paymentMode || 'Cash' } as AdvanceEntry);
      }
      setEditingId(null);
      setFormData({ workerId: '', amount: 0, paidBy: '', remarks: '', date: new Date().toISOString().split('T')[0], paymentMode: 'Cash' });
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { visibility: hidden; background: white; overflow: visible; }
          #printable-advance { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; color: black; font-size: 11px; }
          #printable-advance * { visibility: visible; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black !important; padding: 4px; }
        }
      `}</style>
      <div className="print:hidden space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Advance Management</h1>
        <select className="border p-2 rounded-lg w-full md:w-1/3" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}>
            <option value="">-- Choose Project --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {selectedProjectId && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border">
                <select className="border p-2 rounded" value={formData.workerId} onChange={e => setFormData({...formData, workerId: e.target.value})} required>
                    <option value="">Select Worker</option>
                    {projectWorkers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <input type="number" className="border p-2 rounded" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} required />
                <input type="date" className="border p-2 rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                <button type="submit" className="bg-slate-900 text-white p-2 rounded flex items-center justify-center gap-2"><Plus size={16}/> {editingId ? 'Update' : 'Add'}</button>
            </form>
        )}
        {selectedProjectId && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <span className="font-semibold">Total Advances: ₹{totalProjectAdvance.toLocaleString('en-IN')}</span>
                    <button onClick={() => window.print()} className="bg-white border px-3 py-1.5 rounded flex items-center gap-2"><Download size={16} /> Export PDF</button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead><tr className="bg-slate-100">
                        <th className="px-4 py-2">Date</th><th className="px-4 py-2">Worker</th><th className="px-4 py-2 text-right">Amount</th><th className="px-4 py-2 text-right">Action</th>
                    </tr></thead>
                    <tbody className="divide-y">
                        {filteredAdvances.map(adv => (
                            <tr key={adv.id}>
                                <td className="px-4 py-2">{adv.date}</td>
                                <td className="px-4 py-2 font-medium">{workers.find(w => w.id === adv.workerId)?.name}</td>
                                <td className="px-4 py-2 text-right font-semibold text-red-600">₹{adv.amount}</td>
                                <td className="px-4 py-2 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEditClick(adv)} className="text-slate-400"><Pencil size={14}/></button>
                                    <button onClick={() => handleDeleteClick(adv.id)} className="text-slate-400"><Trash2 size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
      <div id="printable-advance" className="hidden">
        <div className="flex flex-col items-center mb-6">
           <Building2 className="w-8 h-8" /><h1 className="text-5xl font-['Oswald'] font-black">SN ENTERPRISE</h1>
           <h2 className="text-xl font-medium mt-2">Worker Advance Sheet - Site: {selectedProjectName}</h2>
        </div>
        <table className="w-full text-sm border-collapse border border-black">
            <thead><tr className="bg-gray-200">
                <th className="border border-black px-2 py-1">Date</th><th className="border border-black px-2 py-1">Worker Name</th><th className="border border-black px-2 py-1 text-center">Amount</th><th className="border border-black px-2 py-1">Remarks</th>
            </tr></thead>
            <tbody>
                {filteredAdvances.map(adv => (
                    <tr key={adv.id}>
                        <td className="border border-black px-2 py-2">{adv.date}</td>
                        <td className="border border-black px-2 py-2">{workers.find(w => w.id === adv.workerId)?.name}</td>
                        <td className="border border-black px-2 py-2 text-center font-bold">{adv.amount}</td>
                        <td className="border border-black px-2 py-2">{adv.remarks}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvanceTracker;
