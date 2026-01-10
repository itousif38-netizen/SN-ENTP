
import React, { useState } from 'react';
import { Project, PurchaseEntry, StockConsumption } from '../types.ts';
import { Package, MinusCircle, Trash2, ArrowRight } from 'lucide-react';

interface InventoryManagerProps {
  projects: Project[];
  purchases: PurchaseEntry[];
  consumption: StockConsumption[];
  onAddConsumption: (item: StockConsumption) => void;
  onDeleteConsumption: (id: string) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ 
  projects, purchases, consumption, onAddConsumption, onDeleteConsumption 
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<StockConsumption>>({
    projectId: '',
    materialName: '',
    quantity: 0,
    unit: '',
    activity: '',
    date: new Date().toISOString().split('T')[0]
  });

  const calculateStock = (projectId: string) => {
    const stockMap: Record<string, { purchased: number; consumed: number; unit: string }> = {};
    purchases.forEach(p => {
        if (projectId !== 'All' && p.projectId !== projectId) return;
        const key = p.description.trim().toLowerCase();
        if (!stockMap[key]) stockMap[key] = { purchased: 0, consumed: 0, unit: p.unit };
        stockMap[key].purchased += p.quantity;
        if(p.unit) stockMap[key].unit = p.unit;
    });
    consumption.forEach(c => {
        if (projectId !== 'All' && c.projectId !== projectId) return;
        const key = c.materialName.trim().toLowerCase();
        if (!stockMap[key]) stockMap[key] = { purchased: 0, consumed: 0, unit: c.unit };
        stockMap[key].consumed += c.quantity;
    });
    return Object.entries(stockMap).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        ...data,
        balance: data.purchased - data.consumed
    }));
  };

  const inventoryData = calculateStock(selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.projectId && formData.materialName && formData.quantity) {
          onAddConsumption({
              id: Date.now().toString(),
              projectId: formData.projectId,
              materialName: formData.materialName,
              quantity: Number(formData.quantity),
              unit: formData.unit || '',
              activity: formData.activity || '',
              date: formData.date || new Date().toISOString().split('T')[0]
          });
          setFormData({
            projectId: '', materialName: '', quantity: 0, unit: '', activity: '',
            date: new Date().toISOString().split('T')[0]
          });
          setIsFormOpen(false);
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory & Stock</h1>
            <p className="text-slate-500">Track material flow: Purchased vs Consumed.</p>
          </div>
          <button 
             onClick={() => setIsFormOpen(!isFormOpen)}
             className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 shadow-sm"
          >
             <MinusCircle size={18} /> Record Consumption
          </button>
       </div>

       <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Project Site</label>
            <select 
                className="w-full md:w-1/3 border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
            >
                <option value="All">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
       </div>

       {isFormOpen && (
           <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-in slide-in-from-top-2 border-l-4 border-l-orange-500">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <MinusCircle className="text-orange-500" size={20} /> Record Material Consumption
               </h3>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Project *</label>
                       <select className="w-full border p-2 rounded" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} required>
                           <option value="">Select Project</option>
                           {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                       </select>
                   </div>
                   <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Material Name *</label>
                       <input type="text" className="w-full border p-2 rounded" placeholder="e.g. Cement" value={formData.materialName} onChange={e => setFormData({...formData, materialName: e.target.value})} required />
                   </div>
                   <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Quantity Used *</label>
                       <input type="number" className="w-full border p-2 rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} required />
                   </div>
                   <div className="lg:col-span-3 flex justify-end gap-3 mt-2">
                       <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                       <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">Save Consumption</button>
                   </div>
               </form>
           </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50">
                   <h3 className="font-semibold text-slate-700 flex items-center gap-2"><Package size={18} /> Current Stock Levels</h3>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-slate-100 border-b border-slate-200">
                           <tr>
                               <th className="px-6 py-3 font-semibold text-slate-700">Material</th>
                               <th className="px-6 py-3 font-semibold text-slate-700 text-right">In</th>
                               <th className="px-6 py-3 font-semibold text-slate-700 text-right">Out</th>
                               <th className="px-6 py-3 font-semibold text-slate-700 text-right">Balance</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200">
                           {inventoryData.map((item, idx) => (
                               <tr key={idx} className="hover:bg-slate-50">
                                   <td className="px-6 py-4">
                                       <div className="font-medium text-slate-900">{item.name}</div>
                                       <div className="text-xs text-slate-400">{item.unit}</div>
                                   </td>
                                   <td className="px-6 py-4 text-right text-green-700">{item.purchased}</td>
                                   <td className="px-6 py-4 text-right text-orange-700">{item.consumed}</td>
                                   <td className="px-6 py-4 text-right font-bold">{item.balance}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50">
                   <h3 className="font-semibold text-slate-700">Consumption Log</h3>
               </div>
               <div className="max-h-[500px] overflow-y-auto">
                   {consumption.filter(c => selectedProjectId === 'All' || c.projectId === selectedProjectId).slice().reverse().map(c => (
                       <div key={c.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 group">
                           <div className="flex justify-between items-start mb-1">
                               <div className="font-medium text-slate-800">{c.materialName}</div>
                               <button onClick={() => onDeleteConsumption(c.id)} className="text-slate-300 hover:text-red-500 transition-opacity"><Trash2 size={14} /></button>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-orange-600 font-bold mb-1">
                               <ArrowRight size={14} /> {c.quantity} {c.unit}
                           </div>
                           <div className="flex justify-between items-center text-xs text-slate-500">
                               <span>{c.activity || 'General Usage'}</span>
                               <span>{c.date}</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </div>
  );
};

export default InventoryManager;
