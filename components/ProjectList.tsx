
import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types.ts';
import { MapPin, Search, Plus, Pencil, Trash2, Building2 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onAddProject: (p: Project) => void;
  onEditProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
}

type SortKey = 'name' | 'startDate' | 'completionDate' | 'budget' | 'completionPercentage';

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAddProject, onEditProject, onDeleteProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);

  const [sortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'startDate',
    direction: 'desc' 
  });

  const [formData, setFormData] = useState<Partial<Project>>({
    status: ProjectStatus.PLANNING,
    budget: 0,
    name: '',
    projectCode: '',
    address: '',
    startDate: '',
    completionDate: '',
    completionPercentage: 0
  });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setErrors({});
    setFormData({ ...project });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setErrors({});
    setFormData({ 
      status: ProjectStatus.PLANNING, budget: 0, name: '', projectCode: '', address: '', 
      startDate: '', completionDate: '', completionPercentage: 0 
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Project name is required.";
    else if (formData.name.length < 3) newErrors.name = "Name too short.";
    if (!formData.address?.trim()) newErrors.address = "Address is required.";
    if (!formData.startDate) newErrors.startDate = "Start date required.";
    if (formData.startDate && formData.completionDate) {
      if (new Date(formData.completionDate) < new Date(formData.startDate)) {
        newErrors.completionDate = "Completion cannot be before start.";
      }
    }
    if (formData.budget === undefined || formData.budget === null || String(formData.budget) === '') {
      newErrors.budget = "Budget required.";
    } else if (Number(formData.budget) < 0) {
      newErrors.budget = "Budget cannot be negative.";
    } else if (Number(formData.budget) === 0) {
      newErrors.budget = "Enter a valid budget amount.";
    }
    if (formData.completionPercentage !== undefined) {
      const val = Number(formData.completionPercentage);
      if (val < 0 || val > 100) newErrors.completionPercentage = "Range 0-100.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const projectPayload: Project = {
        id: editingId || Date.now().toString(),
        name: formData.name!.trim(),
        projectCode: formData.projectCode?.trim() || '',
        startDate: formData.startDate || '',
        completionDate: formData.completionDate || '',
        address: formData.address?.trim() || '',
        budget: Number(formData.budget),
        status: formData.status || ProjectStatus.PLANNING,
        completionPercentage: Number(formData.completionPercentage || 0),
        spent: editingId ? projects.find(p => p.id === editingId)?.spent : 0,
    };
    if (editingId) onEditProject(projectPayload);
    else onAddProject(projectPayload);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Sites</h1>
          <p className="text-slate-500 text-sm mt-1">Manage project timelines and financial ceilings.</p>
        </div>
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md"
        >
          <Plus size={16} className={isFormOpen ? "rotate-45" : ""} />
          {isFormOpen ? 'Close Form' : 'Add New Project'}
        </button>
      </div>

      {isFormOpen && (
        <form 
          onSubmit={handleSubmit} 
          className={`bg-white p-6 rounded-2xl shadow-xl border border-slate-200 animate-fade-in-up ${shake ? 'animate-shake' : ''}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Modify Project' : 'Project Registration'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Name *</label>
              <input 
                type="text"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm ${errors.name ? 'border-red-500 ring-red-50' : 'border-slate-200 focus:ring-blue-500'}`}
                value={formData.name}
                onChange={e => { setFormData({...formData, name: e.target.value}); setErrors({...errors, name: ''}); }}
                placeholder="e.g. Skyline Residency"
              />
              {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Code</label>
              <input 
                type="text"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="e.g. SN-01"
                value={formData.projectCode}
                onChange={e => setFormData({...formData, projectCode: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}
              >
                {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Site Address *</label>
              <input 
                type="text"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm ${errors.address ? 'border-red-500 ring-red-50' : 'border-slate-200 focus:ring-blue-500'}`}
                value={formData.address}
                onChange={e => { setFormData({...formData, address: e.target.value}); setErrors({...errors, address: ''}); }}
              />
              {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Start Date *</label>
              <input 
                type="date"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm ${errors.startDate ? 'border-red-500' : 'border-slate-200'}`}
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Completion</label>
              <input 
                type="date"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm ${errors.completionDate ? 'border-red-500' : 'border-slate-200'}`}
                value={formData.completionDate}
                onChange={e => setFormData({...formData, completionDate: e.target.value})}
              />
              {errors.completionDate && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.completionDate}</p>}
            </div>
             <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Budget (₹) *</label>
              <input 
                type="number"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm ${errors.budget ? 'border-red-500' : 'border-slate-200'}`}
                value={formData.budget || ''}
                onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                placeholder="0.00"
              />
              {errors.budget && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.budget}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-5 py-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-xl">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-black text-[10px] uppercase tracking-widest">
                  {editingId ? 'Save Update' : 'Initialize Site'}
              </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.projectCode || 'No Code'}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(project)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil size={14} />
                    </button>
                    <button onClick={() => onDeleteProject(project.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                   <MapPin size={14} className="shrink-0" />
                   <span className="line-clamp-1">{project.address}</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                    <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget</div>
                        <div className="font-bold text-slate-900">₹{(project.budget/100000).toFixed(1)}L</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{project.completionPercentage}% Complete</div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: `${project.completionPercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
