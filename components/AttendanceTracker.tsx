
import React, { useState, useEffect } from 'react';
import { Project, Worker, AttendanceRecord } from '../types';
import { Calendar, UserCheck, UserX, Clock, Save, Filter, CheckCircle2 } from 'lucide-react';

interface AttendanceTrackerProps {
  projects: Project[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ projects, workers, attendance, onUpdateAttendance }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentRecords, setCurrentRecords] = useState<Record<string, 'Present' | 'Absent' | 'Half Day'>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Filter workers by project
  const projectWorkers = workers.filter(w => w.projectId === selectedProjectId);

  // Load existing records when date or project changes
  useEffect(() => {
    if (selectedProjectId && selectedDate) {
      const existing = attendance.filter(a => a.projectId === selectedProjectId && a.date === selectedDate);
      const recordMap: Record<string, 'Present' | 'Absent' | 'Half Day'> = {};
      
      // Default to absent or existing status
      projectWorkers.forEach(w => {
        const found = existing.find(e => e.workerId === w.id);
        recordMap[w.id] = found ? found.status : 'Absent';
      });
      
      setCurrentRecords(recordMap);
      setSaveStatus('idle');
    }
  }, [selectedProjectId, selectedDate, attendance, workers]);

  const handleStatusChange = (workerId: string, status: 'Present' | 'Absent' | 'Half Day') => {
    setCurrentRecords(prev => ({
      ...prev,
      [workerId]: status
    }));
    setSaveStatus('idle');
  };

  const markAll = (status: 'Present' | 'Absent') => {
    const newRecords = { ...currentRecords };
    projectWorkers.forEach(w => {
      newRecords[w.id] = status;
    });
    setCurrentRecords(newRecords);
    setSaveStatus('idle');
  };

  const handleSave = () => {
    if (!selectedProjectId) return;

    // Filter out previous records for this specific date/project to avoid duplicates
    const otherRecords = attendance.filter(a => !(a.projectId === selectedProjectId && a.date === selectedDate));
    
    // Create new records
    const newRecords: AttendanceRecord[] = projectWorkers.map(w => ({
      id: `${w.id}-${selectedDate}`,
      workerId: w.id,
      projectId: selectedProjectId,
      date: selectedDate,
      status: currentRecords[w.id] || 'Absent'
    }));

    onUpdateAttendance([...otherRecords, ...newRecords]);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  // Stats for the selected day
  const presentCount = Object.values(currentRecords).filter(s => s === 'Present').length;
  const absentCount = Object.values(currentRecords).filter(s => s === 'Absent').length;
  const halfDayCount = Object.values(currentRecords).filter(s => s === 'Half Day').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Attendance</h1>
          <p className="text-slate-500">Track worker presence on site.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-medium text-slate-500 mb-1">Select Project</label>
          <select 
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">-- Choose Project --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
          <input 
            type="date" 
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        
        {/* Quick Stats */}
        {selectedProjectId && (
          <div className="flex-1 flex gap-2 justify-end">
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-100 text-xs font-semibold flex flex-col items-center">
               <span className="text-lg leading-none">{presentCount}</span>
               <span>Present</span>
            </div>
            <div className="bg-red-50 text-red-700 px-3 py-1 rounded-lg border border-red-100 text-xs font-semibold flex flex-col items-center">
               <span className="text-lg leading-none">{absentCount}</span>
               <span>Absent</span>
            </div>
            <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg border border-yellow-100 text-xs font-semibold flex flex-col items-center">
               <span className="text-lg leading-none">{halfDayCount}</span>
               <span>Half Day</span>
            </div>
          </div>
        )}
      </div>

      {selectedProjectId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Calendar size={18} /> Register: {selectedDate}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => markAll('Present')} className="text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-100 text-slate-600">
                Mark All Present
              </button>
              <button onClick={() => markAll('Absent')} className="text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-100 text-slate-600">
                Mark All Absent
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold text-slate-700">Worker Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Designation</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projectWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-900">{worker.name}</div>
                      <div className="text-xs text-slate-500">{worker.workerId}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{worker.designation}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleStatusChange(worker.id, 'Present')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            currentRecords[worker.id] === 'Present'
                              ? 'bg-green-600 text-white border-green-600 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <UserCheck size={14} /> Present
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(worker.id, 'Half Day')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            currentRecords[worker.id] === 'Half Day'
                              ? 'bg-yellow-500 text-white border-yellow-500 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Clock size={14} /> Half Day
                        </button>

                        <button
                          onClick={() => handleStatusChange(worker.id, 'Absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            currentRecords[worker.id] === 'Absent'
                              ? 'bg-red-600 text-white border-red-600 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <UserX size={14} /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projectWorkers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">No workers found in this project.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
             <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-md ${
                    saveStatus === 'saved' ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'
                }`}
             >
                {saveStatus === 'saved' ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {saveStatus === 'saved' ? 'Saved Successfully' : 'Save Attendance'}
             </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500">
           Select a project to manage attendance.
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
