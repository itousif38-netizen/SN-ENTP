
import React, { useState, useEffect } from 'react';
import { Project, Worker } from '../types.ts';
import { Search, Filter, UserPlus, Pencil, Trash2, ShieldCheck } from 'lucide-react';

interface WorkerManagerProps {
  workers: Worker[];
  projects: Project[];
  onAddWorker: (w: Worker) => void;
  onEditWorker: (w: Worker) => void;
  onDeleteWorker: (id: string) => void;
}

const WorkerManager: React.FC<WorkerManagerProps> = ({ workers, projects, onAddWorker, onEditWorker, onDeleteWorker }) => {
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Worker>>({
    serialNo: workers.length + 1,
    workerId: '',
    name: '',
    projectId: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const generateBusinessID = (project: Project, seq: number): string => {
    const name = project.name.trim();
    const words = name.split(/\s+/);
    const prefix = name.toUpperCase().startsWith('S') ? 'SN' : 'SNE';
    let key = '';
    const specialKey = words.find(w => /[A-Za-z]/.test(w) && /\d/.test(w));
    if (specialKey) {
        key = specialKey.toUpperCase();
    } else {
        const filtered = words.filter(w => !['ECO', 'CITY', 'LTD', 'CORP', 'PROJECT', 'SITE'].includes(w.toUpperCase()));
        key = filtered.length >= 2 
            ? (filtered[0][0] + filtered[1][0]) 
            : (filtered[0]?.substring(0, 2) || 'XX');
    }
    return `${prefix}/${key.toUpperCase()}/${seq.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    if (!editingId && formData.projectId) {
        const project = projects.find(p => p.id === formData.projectId);
        if (project) {
            const projectWorkerCount = workers.filter(w => w.projectId === formData.projectId).length;
            const newId = generateBusinessID(project, projectWorkerCount + 1);
            setFormData(prev => ({ ...prev, workerId: newId }));
        }
    }
  }, [formData.projectId, editingId, projects, workers]);

  const filteredWorkers = workers.filter(w => {
    const matchesProject = selectedProject === 'All' || w.projectId === selectedProject;
    return matchesProject && (w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.workerId.includes(searchTerm));
  });

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      serialNo: workers.length + 1,
      workerId: '', name: '', projectId: '', designation: '',
      joiningDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.projectId) return;
    if (editingId) {
      onEditWorker({ ...formData as Worker, id: editingId });
    } else {
      onAddWorker({ ...formData as Worker, id: Date.now().toString(), serialNo: Number(formData.serialNo) });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workforce Register</h1>
          <p className="text-slate-500 text-sm">Personnel deployment with automated business IDs.</p>
        </div>
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md"
        >
          <UserPlus size={16} />
          {isFormOpen ? 'Cancel' : 'Register Worker'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl animate-fade-in-up">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Site *</label>
                <select 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.projectId} 
                    onChange={e => setFormData({...formData, projectId: e.target.value})} 
                >
                  <option value="">Select Site</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated ID</label>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="font-mono font-bold text-blue-600">{formData.workerId || 'AUTO-GEN'}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Serial Number *</label>
                <input 
                    type="number" 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.serialNo} 
                    onChange={e => setFormData({...formData, serialNo: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Worker Full Name *</label>
                <input 
                    type="text" 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Designation</label>
                <input 
                    type="text" 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.designation} 
                    placeholder="e.g. Carpenter"
                    onChange={e => setFormData({...formData, designation: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Joined</label>
                <input 
                    type="date" 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.joiningDate} 
                    onChange={e => setFormData({...formData, joiningDate: e.target.value})} 
                />
              </div>
              <div className="md:col-span-3 flex justify-end mt-4">
                <button type="submit" className="bg-blue-600 text-white px-10 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200">
                    Finalize Registration
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 items-center">
                <Filter size={18} className="text-slate-400" />
                <select className="bg-slate-100 rounded-lg py-2 px-3 text-xs font-bold border-none" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="All">All Projects</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search workers..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredWorkers.length} Active Personnel</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">ID / Ref</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Current Site</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                       {worker.workerId}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{worker.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{projects.find(p => p.id === worker.projectId)?.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                      {worker.designation || 'Worker'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100">
                        <button onClick={() => { setEditingId(worker.id); setFormData(worker); setIsFormOpen(true); }} className="text-slate-400 hover:text-blue-600"><Pencil size={14}/></button>
                        <button onClick={() => onDeleteWorker(worker.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerManager;
