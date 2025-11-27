
import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { MapPin, Calendar, IndianRupee, Search, Plus, Flag, Pencil, Trash2, Percent, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'startDate',
    direction: 'desc' // Default to newest projects first
  });

  const [formData, setFormData] = useState<Partial<Project>>({
    status: ProjectStatus.PLANNING,
    budget: 0,
    name: '',
    address: '',
    startDate: '',
    completionDate: '',
    completionPercentage: 0
  });

  // 1. Filter
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sort
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle null/undefined for completionDate
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      address: project.address,
      startDate: project.startDate,
      completionDate: project.completionDate,
      budget: project.budget,
      status: project.status,
      client: project.client,
      completionPercentage: project.completionPercentage || 0
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDeleteProject(id);
    }
  };

  const handleExportCSV = () => {
    // Define headers
    const headers = ['Project Name', 'Address', 'Start Date', 'Completion Date', 'Budget (INR)', 'Status', 'Completion %'];
    
    // Map data
    const csvContent = [
      headers.join(','),
      ...sortedProjects.map(p => [
        `"${p.name}"`, // Quote strings to handle commas inside content
        `"${p.address}"`,
        p.startDate,
        p.completionDate || '',
        p.budget,
        p.status,
        p.completionPercentage || 0
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SN_Projects_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ 
      status: ProjectStatus.PLANNING, 
      budget: 0, 
      name: '', 
      address: '', 
      startDate: '', 
      completionDate: '',
      completionPercentage: 0 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.budget) {
      if (editingId) {
        // Update existing
        const updatedProject: Project = {
            id: editingId,
            name: formData.name!,
            startDate: formData.startDate || '',
            completionDate: formData.completionDate || '',
            address: formData.address || '',
            budget: Number(formData.budget),
            status: formData.status || ProjectStatus.IN_PROGRESS,
            client: formData.client || '',
            completionPercentage: Number(formData.completionPercentage || 0),
            // Preserve existing fields we don't edit here
            spent: projects.find(p => p.id === editingId)?.spent,
        };
        onEditProject(updatedProject);
      } else {
        // Create new
        onAddProject({
          id: Date.now().toString(),
          name: formData.name || '',
          startDate: formData.startDate || new Date().toISOString().split('T')[0],
          completionDate: formData.completionDate || '',
          address: formData.address || '',
          budget: Number(formData.budget),
          status: ProjectStatus.IN_PROGRESS,
          client: '',
          completionPercentage: Number(formData.completionPercentage || 0),
          spent: 0
        });
      }
      resetForm();
    }
  };

  const toggleSortDirection = () => {
    setSortConfig(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500">1. Projects: Manage active sites, budgets and completion status.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
                title="Download as Excel/CSV"
            >
                <FileSpreadsheet size={18} />
                <span className="hidden md:inline">Export CSV</span>
            </button>
            <button 
            onClick={() => {
                if(isFormOpen) {
                    resetForm();
                } else {
                    setIsFormOpen(true);
                    setEditingId(null);
                    setFormData({ status: ProjectStatus.PLANNING, budget: 0, name: '', address: '', startDate: '', completionDate: '', completionPercentage: 0 });
                }
            }}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
            >
            <Plus size={18} className={`transition-transform duration-300 ${isFormOpen ? "rotate-45" : ""}`} />
            {isFormOpen ? 'Cancel' : 'New Project'}
            </button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <input 
                required
                type="text"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea 
                required
                className="w-full p-2 border border-slate-300 rounded-lg resize-y focus:ring-2 focus:ring-orange-500 transition-all"
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                required
                type="date"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
              <input 
                type="date"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.completionDate}
                onChange={e => setFormData({...formData, completionDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Completion Percentage (%)</label>
              <input 
                type="number"
                min="0"
                max="100"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.completionPercentage}
                onChange={e => setFormData({...formData, completionPercentage: Number(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Budget (₹)</label>
              <input 
                required
                type="number"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                {editingId ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      )}

      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <span className="text-sm text-slate-500 whitespace-nowrap hidden md:inline">Sort by:</span>
            <select 
              className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
              value={sortConfig.key}
              onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value as SortKey }))}
            >
              <option value="name">Name</option>
              <option value="startDate">Start Date</option>
              <option value="completionDate">Completion Date</option>
              <option value="budget">Budget</option>
              <option value="completionPercentage">Progress</option>
            </select>
            <button 
              onClick={toggleSortDirection}
              className="ml-1 p-1 hover:bg-slate-200 rounded transition-colors text-slate-600"
              title={sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProjects.map((project, index) => (
          <div 
            key={project.id} 
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {project.status}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleEditClick(project)}
                        className="text-slate-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                        title="Edit Project"
                    >
                        <Pencil size={16} />
                    </button>
                    <button 
                        onClick={() => handleDeleteClick(project.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors transform hover:scale-110"
                        title="Delete Project"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{project.name}</h3>
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                <MapPin size={14} />
                {project.address}
              </p>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center text-sm text-slate-600 justify-between">
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-400" /> Start Date</span>
                  <span className="font-medium">{project.startDate}</span>
                </div>
                {project.completionDate && (
                  <div className="flex items-center text-sm text-slate-600 justify-between">
                    <span className="flex items-center gap-2"><Flag size={16} className="text-slate-400" /> Completion</span>
                    <span className="font-medium">{project.completionDate}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-slate-600 justify-between">
                  <span className="flex items-center gap-2"><IndianRupee size={16} className="text-slate-400" /> Budget</span>
                  <span className="font-medium text-slate-900">₹{project.budget.toLocaleString('en-IN')}</span>
                </div>
                
                {/* Completion Progress Bar */}
                <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-2 text-slate-600"><Percent size={14} className="text-slate-400"/> Work Complete</span>
                        <span className="font-bold text-slate-900">{project.completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                (project.completionPercentage || 0) === 100 ? 'bg-green-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, project.completionPercentage || 0))}%` }}
                        ></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {sortedProjects.length === 0 && (
          <div className="col-span-full text-center py-12 animate-fade-in-up">
            <p className="text-slate-500">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
