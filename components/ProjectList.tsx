import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { MapPin, Calendar, IndianRupee, Search, Plus, Flag, Pencil, Trash2, Percent, FileSpreadsheet, ArrowUp, ArrowDown, Building2 } from 'lucide-react';

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

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
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

  // Helper for Status Styling (Refined)
  const getStatusStyles = (status: ProjectStatus | string) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-green-100 text-green-700 border border-green-200';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case ProjectStatus.PLANNING:
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case ProjectStatus.ON_HOLD:
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  // 1. Filter
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sort
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

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDeleteProject(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Project Name', 'Project Code', 'Address', 'Start Date', 'Completion Date', 'Budget (INR)', 'Status', 'Completion %'];
    const csvContent = [
      headers.join(','),
      ...sortedProjects.map(p => [
        `"${p.name}"`, 
        `"${p.projectCode || ''}"`,
        `"${p.address}"`,
        p.startDate,
        p.completionDate || '',
        p.budget,
        p.status,
        p.completionPercentage || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Projects_List_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setErrors({});
    setFormData({ 
      status: ProjectStatus.PLANNING, 
      budget: 0, 
      name: '', 
      projectCode: '',
      address: '', 
      startDate: '', 
      completionDate: '',
      completionPercentage: 0 
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Project Name is required.";
    if (!formData.address?.trim()) newErrors.address = "Address is required.";
    if (!formData.startDate) newErrors.startDate = "Start Date is required.";
    if (!formData.budget || Number(formData.budget) <= 0) newErrors.budget = "Valid budget required.";
    
    // Check for Duplicate Name
    const duplicateName = projects.some(p => p.name.trim().toLowerCase() === formData.name?.trim().toLowerCase() && p.id !== editingId);
    if (duplicateName) newErrors.name = "Project name already exists.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.name && formData.budget) {
      const projectPayload: Project = {
          id: editingId || Date.now().toString(),
          name: formData.name!,
          projectCode: formData.projectCode || '',
          startDate: formData.startDate || '',
          completionDate: formData.completionDate || '',
          address: formData.address || '',
          budget: Number(formData.budget),
          status: formData.status || ProjectStatus.PLANNING,
          client: formData.client || '',
          completionPercentage: Number(formData.completionPercentage || 0),
          spent: editingId ? projects.find(p => p.id === editingId)?.spent : 0,
      };

      if (editingId) onEditProject(projectPayload);
      else onAddProject(projectPayload);
      
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage construction sites and track progress.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
                <FileSpreadsheet size={16} />
                <span className="hidden md:inline">Export</span>
            </button>
            <button 
            onClick={() => {
                if(isFormOpen) resetForm();
                else { setIsFormOpen(true); setEditingId(null); setFormData({ status: ProjectStatus.PLANNING, budget: 0, name: '', startDate: '', completionPercentage: 0 }); }
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
            <Plus size={16} className={`transition-transform duration-300 ${isFormOpen ? "rotate-45" : ""}`} />
            {isFormOpen ? 'Cancel' : 'New Project'}
            </button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Project Details' : 'Create New Project'}</h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm">Close</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Project Name</label>
              <input 
                type="text"
                className={`w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Skyline Towers"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Project Code</label>
              <input 
                type="text"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                placeholder="e.g. SNE-001"
                value={formData.projectCode}
                onChange={e => setFormData({...formData, projectCode: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Status</label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}
              >
                <option value={ProjectStatus.PLANNING}>Planning</option>
                <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                <option value={ProjectStatus.ON_HOLD}>On Hold</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Site Address</label>
              <input 
                type="text"
                className={`w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Full street address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Date</label>
              <input 
                type="date"
                className={`w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm ${errors.startDate ? 'border-red-500' : 'border-slate-300'}`}
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Est. Completion</label>
              <input 
                type="date"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                value={formData.completionDate}
                onChange={e => setFormData({...formData, completionDate: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Budget (₹)</label>
              <input 
                type="number"
                className={`w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm ${errors.budget ? 'border-red-500' : 'border-slate-300'}`}
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 text-sm font-medium">
                    {editingId ? 'Save Changes' : 'Create Project'}
                </button>
            </div>
          </div>
        </form>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="text-xs font-medium text-slate-500 uppercase">Sort</span>
            <select 
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer border-none p-0"
              value={sortConfig.key}
              onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value as SortKey }))}
            >
              <option value="name">Name</option>
              <option value="startDate">Start Date</option>
              <option value="budget">Budget</option>
              <option value="completionPercentage">Progress</option>
            </select>
            <button 
              onClick={() => setSortConfig(prev => ({...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc'}))}
              className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-600"
            >
              {sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProjects.map((project, index) => {
          const statusClass = getStatusStyles(project.status);
          const percent = project.completionPercentage || 0;
          return (
            <div 
              key={project.id} 
              className="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col animate-fade-in-up group overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header */}
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 border border-slate-100">
                           <Building2 size={20} />
                       </div>
                       <div>
                           <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{project.name}</h3>
                           <div className="text-xs text-slate-500 font-mono mt-0.5">{project.projectCode || 'NO-CODE'}</div>
                       </div>
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(project)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDeleteClick(project.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                      </button>
                   </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-500 mb-4 min-h-[32px]">
                   <MapPin size={14} className="mt-0.5 shrink-0" />
                   <span className="line-clamp-2">{project.address}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-dashed border-slate-200">
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Budget</div>
                        <div className="font-bold text-slate-900 text-sm">₹{(project.budget/100000).toFixed(2)} L</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Timeline</div>
                        <div className="font-medium text-slate-700 text-xs">{project.startDate}</div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-2">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusClass}`}>
                           {project.status}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                           className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                           style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedProjects.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;