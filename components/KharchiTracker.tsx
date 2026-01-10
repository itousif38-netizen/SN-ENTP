
import React, { useState, useEffect } from 'react';
import { Project, Worker, KharchiEntry } from '../types.ts';
import { Save, IndianRupee, PieChart, Download, Building2 } from 'lucide-react';

interface KharchiTrackerProps {
  projects: Project[];
  workers: Worker[];
  kharchi: KharchiEntry[];
  onUpdateKharchi: (entries: KharchiEntry[]) => void;
}

const KharchiTracker: React.FC<KharchiTrackerProps> = ({ projects, workers, kharchi, onUpdateKharchi }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [sundays, setSundays] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      const sundaysList = [];
      while (date.getMonth() === month - 1) {
        if (date.getDay() === 0) { sundaysList.push(date.toISOString().split('T')[0]); }
        date.setDate(date.getDate() + 1);
      }
      setSundays(sundaysList);
    }
  }, [selectedMonth]);

  useEffect(() => {
    const values: Record<string, number> = {};
    kharchi.forEach(k => { values[`${k.workerId}-${k.date}`] = k.amount; });
    setInputValues(values);
  }, [kharchi]);

  const projectWorkers = workers.filter(w => w.projectId === selectedProjectId);
  const selectedProjectName = projects.find(p => p.id === selectedProjectId)?.name || '';

  const handleInputChange = (workerId: string, date: string, amount: string) => {
    setInputValues(prev => ({ ...prev, [`${workerId}-${date}`]: Number(amount) }));
  };

  const handleSave = () => {
    const newEntries: KharchiEntry[] = [];
    if (!selectedProjectId) return;
    projectWorkers.forEach(worker => {
        sundays.forEach(sunday => {
            const key = `${worker.id}-${sunday}`;
            const val = inputValues[key];
            if (val !== undefined) {
                 newEntries.push({ id: key, workerId: worker.id, projectId: selectedProjectId, date: sunday, amount: Number(val) });
            }
        });
    });
    onUpdateKharchi(newEntries);
    alert("Kharchi records updated successfully!");
  };

  const handleExportPDF = () => { window.print(); };

  const siteSummaries = projects.map(p => {
    const total = kharchi.filter(k => k.projectId === p.id && k.date.startsWith(selectedMonth)).reduce((sum, k) => sum + k.amount, 0);
    return { id: p.id, name: p.name, total };
  });

  const totalAllSites = siteSummaries.reduce((sum, item) => sum + item.total, 0);
  const getWorkerTotal = (workerId: string) => sundays.reduce((sum, sunday) => sum + (inputValues[`${workerId}-${sunday}`] || 0), 0);
  const getSundayTotal = (sunday: string) => projectWorkers.reduce((sum, w) => sum + (inputValues[`${w.id}-${sunday}`] || 0), 0);
  const getTableGrandTotal = () => projectWorkers.reduce((sum, w) => sum + getWorkerTotal(w.id), 0);
  const getFormattedMonth = (isoMonth: string) => {
      if(!isoMonth) return '';
      const [year, month] = isoMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return `${date.toLocaleString('default', { month: 'long' })}/${year.slice(2)}`;
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          body { visibility: hidden; background: white; overflow: visible; }
          #printable-area { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; color: black; font-size: 11px; }
          #printable-area * { visibility: visible; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black !important; padding: 4px; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="print:hidden space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Kharchi Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-orange-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2"><IndianRupee size={20}/> <span className="font-medium">Month Total</span></div>
                <div className="text-2xl font-bold">₹{totalAllSites.toLocaleString('en-IN')}</div>
            </div>
            <div className="lg:col-span-3 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><PieChart size={16} /> Site Breakdown</h3>
                <div className="flex gap-4 overflow-x-auto">
                    {siteSummaries.map(site => (
                        <div key={site.id} className="min-w-[140px] p-2 bg-slate-50 rounded border">{site.name}: ₹{site.total}</div>
                    ))}
                </div>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4">
          <select className="border p-2 rounded-lg" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}>
              <option value="">-- Choose Project --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="month" className="border p-2 rounded-lg" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
        </div>
        {selectedProjectId && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 border-r">Name</th>
                    {sundays.map(sunday => (
                      <th key={sunday} className="px-4 py-3 text-center border-r bg-orange-50">{sunday.split('-')[2]}</th>
                    ))}
                    <th className="px-4 py-3 text-right bg-slate-100">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {projectWorkers.map((worker) => (
                    <tr key={worker.id}>
                      <td className="px-4 py-2 border-r font-medium">{worker.name}</td>
                      {sundays.map(sunday => (
                        <td key={sunday} className="p-0 border-r text-center">
                          <input type="number" className="w-full h-full py-2 text-center" value={inputValues[`${worker.id}-${sunday}`] || ''} onChange={(e) => handleInputChange(worker.id, sunday, e.target.value)} />
                        </td>
                      ))}
                      <td className="px-4 py-2 text-right font-bold">₹{getWorkerTotal(worker.id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-slate-50">
                 <button onClick={handleExportPDF} className="bg-white border px-4 py-2 rounded flex items-center gap-2"><Download size={18} /> Export PDF</button>
                 <button onClick={handleSave} className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 shadow-sm"><Save size={18} /> Save</button>
            </div>
          </div>
        )}
      </div>
      <div id="printable-area" className="hidden">
        <div className="flex flex-col items-center mb-4">
           <div className="flex items-center gap-3 mb-2"><Building2 className="w-8 h-8" /><h1 className="text-5xl font-['Oswald'] font-black">SN ENTERPRISE</h1></div>
           <h2 className="text-xl font-medium">Weekly Kharchi Summary - Site: {selectedProjectName} - {getFormattedMonth(selectedMonth)}</h2>
        </div>
        <table className="w-full text-left border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-2">Worker Name</th>
              {sundays.map(sunday => <th key={sunday} className="border border-black px-2 py-2 text-center">{sunday.split('-')[2]}</th>)}
              <th className="border border-black px-2 py-2 text-center">Total</th>
              <th className="border border-black px-2 py-2 text-center">Signature</th>
            </tr>
          </thead>
          <tbody>
             {projectWorkers.map((worker) => (
                 <tr key={worker.id}>
                     <td className="border border-black px-2 py-2 font-medium">{worker.name}</td>
                     {sundays.map(sunday => <td key={sunday} className="border border-black px-2 py-2 text-center">{inputValues[`${worker.id}-${sunday}`] || ''}</td>)}
                     <td className="border border-black px-2 py-2 text-center font-bold">{getWorkerTotal(worker.id)}</td>
                     <td className="border border-black px-2 py-2"></td>
                 </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KharchiTracker;
