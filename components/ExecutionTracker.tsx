
import React, { useState } from 'react';
import { Project, ExecutionLevel } from '../types.ts';
import { Plus, Trash2, Download, Building2 } from 'lucide-react';

interface ExecutionTrackerProps {
  projects: Project[];
  executionData: ExecutionLevel[];
  onAddExecution: (entry: ExecutionLevel) => void;
  onUpdateExecution: (entry: ExecutionLevel) => void;
  onDeleteExecution: (id: string) => void;
}

const ExecutionTracker: React.FC<ExecutionTrackerProps> = ({ projects, executionData, onAddExecution, onUpdateExecution, onDeleteExecution }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

  const filteredData = executionData.filter(e => e.projectId === selectedProjectId);

  const handleAddRow = () => {
    if (!selectedProjectId) return;
    onAddExecution({ id: Date.now().toString(), projectId: selectedProjectId, levelName: `Level ${filteredData.length + 1}`, pours: [] });
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print { @page { size: A4 landscape; } body { visibility: hidden; } #printable-execution { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; } }
      `}</style>
      <div className="print:hidden space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Site Execution</h1>
        <div className="flex gap-4">
          <select className="border p-2 rounded-lg w-1/3" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => window.print()} className="bg-white border px-4 py-2 rounded flex items-center gap-2"><Download size={18} /> Export</button>
        </div>
        <div className="bg-white rounded border overflow-hidden">
          <div className="p-3 bg-slate-50 border-b flex justify-between"><span className="font-bold">Schedule</span><button onClick={handleAddRow} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">+ Add Level</button></div>
          <table className="w-full text-sm">
            <thead><tr className="bg-blue-100"><th>Floor</th><th>Pour 1</th><th>Pour 2</th><th>Action</th></tr></thead>
            <tbody>{filteredData.map(row => (
              <tr key={row.id} className="border-t">
                <td className="p-3"><input className="w-full font-bold" value={row.levelName} onChange={e => onUpdateExecution({...row, levelName: e.target.value})} /></td>
                <td className="p-3 text-center">--</td><td className="p-3 text-center">--</td>
                <td className="p-3 text-center"><button onClick={() => onDeleteExecution(row.id)}><Trash2 size={14}/></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div id="printable-execution" className="hidden">
        <div className="text-center mb-4"><Building2 className="inline mr-2"/><h1 className="text-3xl font-bold inline">SN ENTERPRISE</h1></div>
        <h2 className="text-xl font-bold mb-4">Execution Report - {projects.find(p => p.id === selectedProjectId)?.name}</h2>
        <table className="w-full border-collapse border border-black">
          <thead><tr className="bg-gray-200"><th className="border border-black">Level</th><th className="border border-black">Pour 1</th><th className="border border-black">Pour 2</th></tr></thead>
          <tbody>{filteredData.map(row => (
            <tr key={row.id}><td className="border border-black p-2">{row.levelName}</td><td className="border border-black p-2"></td><td className="border border-black p-2"></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionTracker;
