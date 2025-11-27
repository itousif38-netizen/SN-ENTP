
import React, { useState } from 'react';
import { Project, Worker } from '../types';
import { Users, Search, Filter, Plus, UserPlus, Pencil, Trash2 } from 'lucide-react';

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
    joiningDate: new Date().toISOString().split('T')[0],
    exitDate: ''
  });

  const filteredWorkers = workers.filter(w => {
    const matchesProject = selectedProject === 'All' || w.projectId === selectedProject;
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.workerId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const workerCounts = projects.reduce((acc, project) => {
    acc[project.id] = workers.filter(w => w.projectId === project.id).length;
    return acc;
  }, {} as Record<string, number>);

  const handleEditClick = (worker: Worker) => {
    setEditingId(worker.id);
    setFormData({ ...worker, exitDate: worker.exitDate || '' });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
      if(window.confirm('Are you sure you want to remove this worker?')) {
          onDeleteWorker(id);
      }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      serialNo: workers.length + 1,
      workerId: '',
      name: '',
      projectId: '',
      designation: '',
      joiningDate: new Date().toISOString().split('T')[0],
      exitDate: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.projectId) {
      if (editingId) {
        // Update
        const updatedWorker: Worker = {
            id: editingId,
            workerId: formData.workerId || '',
            name: formData.name || '',
            projectId: formData.projectId || '',
            designation: formData.designation || '',
            joiningDate: formData.joiningDate || '',
            exitDate: formData.exitDate || '',
            serialNo: Number(formData.serialNo)
        };
        onEditWorker(updatedWorker);
      } else {
        // Create
        onAddWorker({
          id: Date.now().toString(),
          workerId: formData.workerId || `W-${workers.length + 101}`,
          name: formData.name || '',
          projectId: formData.projectId || '',
          designation: formData.designation || 'Worker',
          joiningDate: formData.joiningDate || '',
          exitDate: formData.exitDate || '',
          serialNo: Number(formData.serialNo)
        });
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workers Management</h1>
          <p className="text-slate-500">2. Workers: Record details and track headcount per site.</p>
        </div>
        <button 
          onClick={() => {
            if(isFormOpen) resetForm();
            else setIsFormOpen(true);
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <UserPlus size={16} />
          {isFormOpen ? 'Cancel' : 'Add Worker'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in slide-in-from-top-2">
           <h3 className="font-semibold mb-4">{editingId ? 'Edit Worker Details' : 'Register New Worker'}</h3>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">SR No</label>
                <input type="number" className="w-full border p-2 rounded" value={formData.serialNo} onChange={e => setFormData({...formData, serialNo: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Worker ID</label>
                <input type="text" className="w-full border p-2 rounded" value={formData.workerId} onChange={e => setFormData({...formData, workerId: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Project Site</label>
                <select className="w-full border p-2 rounded" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} required>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Designation</label>
                <select 
                  className="w-full border p-2 rounded" 
                  value={formData.designation} 
                  onChange={e => setFormData({...formData, designation: e.target.value})} 
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Sr. Carpenter">Sr. Carpenter</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Helper">Helper</option>
                  <option value="Fitter">Fitter</option>
                  <option value="Rigger">Rigger</option>
                  <option value="Mason">Mason</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Joining Date</label>
                <input type="date" className="w-full border p-2 rounded" value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Exit Date (Optional)</label>
                <input type="date" className="w-full border p-2 rounded" value={formData.exitDate} onChange={e => setFormData({...formData, exitDate: e.target.value})} />
              </div>
              <div className="md:col-span-3 flex justify-end mt-2">
                <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
                    {editingId ? 'Update Worker' : 'Save Worker'}
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-500" />
                <select 
                className="border-none bg-slate-100 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-orange-500 min-w-[200px]"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                >
                <option value="All">All Sites ({workers.length})</option>
                {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({workerCounts[p.id] || 0})</option>
                ))}
                </select>
            </div>

            <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by Name or ID..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          
          <div className="text-sm text-slate-500 whitespace-nowrap">
             Showing {filteredWorkers.length} workers
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">SR No</th>
                <th className="px-6 py-4 font-semibold text-slate-700">ID No</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Project</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Designation</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Joining Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Exit Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">{worker.serialNo}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{worker.workerId}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{worker.name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {projects.find(p => p.id === worker.projectId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                      {worker.designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{worker.joiningDate}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {worker.exitDate ? (
                        <span className="text-red-600 font-medium">{worker.exitDate}</span>
                    ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                        onClick={() => handleEditClick(worker)}
                        className="text-slate-400 hover:text-blue-600"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button 
                        onClick={() => handleDeleteClick(worker.id)}
                        className="text-slate-400 hover:text-red-600"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWorkers.length === 0 && (
                  <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                          No workers found matching your search.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerManager;
