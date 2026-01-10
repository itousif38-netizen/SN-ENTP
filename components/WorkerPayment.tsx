
import React, { useState } from 'react';
import { Project, Worker, KharchiEntry, AdvanceEntry, WorkerPayment as WorkerPaymentType } from '../types.ts';
import { Download, Building2, Save, FileText } from 'lucide-react';

interface WorkerPaymentProps {
  projects: Project[];
  workers: Worker[];
  kharchi: KharchiEntry[];
  advances: AdvanceEntry[];
  onSavePaymentRecord?: (records: WorkerPaymentType[]) => void;
}

const WorkerPayment: React.FC<WorkerPaymentProps> = ({ projects, workers, kharchi, advances, onSavePaymentRecord }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [printMode, setPrintMode] = useState<'sheet' | 'slips'>('sheet');
  const [workAmounts, setWorkAmounts] = useState<Record<string, number>>({});
  const [messDeductions, setMessDeductions] = useState<Record<string, number>>({});

  const projectWorkers = workers.filter(w => w.projectId === selectedProjectId);
  const selectedProjectName = projects.find(p => p.id === selectedProjectId)?.name || '';

  const getDeductions = (workerId: string) => {
    const totalKharchi = kharchi.filter(k => k.workerId === workerId && k.date.startsWith(selectedMonth)).reduce((sum, k) => sum + k.amount, 0);
    const totalAdvance = advances.filter(a => a.workerId === workerId && a.date.startsWith(selectedMonth)).reduce((sum, a) => sum + a.amount, 0);
    return { totalKharchi, totalAdvance };
  };

  const handlePrint = (mode: 'sheet' | 'slips') => {
    setPrintMode(mode);
    setTimeout(() => { window.print(); }, 100);
  };

  const handleSave = () => {
      if (!onSavePaymentRecord || !selectedProjectId) return;
      const records = projectWorkers.map(worker => {
          const { totalKharchi, totalAdvance } = getDeductions(worker.id);
          const workVal = workAmounts[worker.id] || 0;
          const messVal = messDeductions[worker.id] || 0;
          return {
              id: `${worker.id}-${selectedMonth}`, serialNo: worker.serialNo, workerId: worker.id, projectId: selectedProjectId,
              month: selectedMonth, workAmount: workVal, messDeduction: messVal, kharchiDeduction: totalKharchi,
              advanceDeduction: totalAdvance, netPayable: workVal - messVal - totalKharchi - totalAdvance,
              isPaid: true, date: new Date().toISOString()
          } as WorkerPaymentType;
      });
      onSavePaymentRecord(records);
      alert(`Saved ${records.length} records.`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { visibility: hidden; background: white; overflow: visible; }
          #printable-payment { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; display: block !important; }
          #printable-payment * { visibility: visible; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black !important; padding: 4px; }
        }
      `}</style>
      <div className="print:hidden space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Worker Payroll</h1>
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">
          <select className="border p-2 rounded-lg flex-1" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}>
            <option value="">-- Choose Project --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="month" className="border p-2 rounded-lg flex-1" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
          <div className="flex gap-2">
              <button onClick={() => handlePrint('sheet')} className="bg-white border p-2 rounded"><Download size={18} /></button>
              <button onClick={() => handlePrint('slips')} className="bg-slate-800 text-white p-2 rounded"><FileText size={18} /></button>
              <button onClick={handleSave} className="bg-orange-600 text-white px-4 py-2 rounded shadow-sm"><Save size={18} /></button>
          </div>
        </div>
        {selectedProjectId && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b">
                <tr><th>Worker</th><th>Work Amt</th><th>Mess (-)</th><th>Kharchi (-)</th><th>Advance (-)</th><th className="text-right">Net</th></tr>
              </thead>
              <tbody className="divide-y">
                {projectWorkers.map((worker) => {
                  const { totalKharchi, totalAdvance } = getDeductions(worker.id);
                  const net = (workAmounts[worker.id] || 0) - (messDeductions[worker.id] || 0) - totalKharchi - totalAdvance;
                  return (
                    <tr key={worker.id}>
                      <td className="px-4 py-3 font-bold">{worker.name}</td>
                      <td className="px-4 py-3"><input type="number" className="w-24 border p-1" value={workAmounts[worker.id] || ''} onChange={e => setWorkAmounts({...workAmounts, [worker.id]: Number(e.target.value)})} /></td>
                      <td className="px-4 py-3"><input type="number" className="w-24 border p-1" value={messDeductions[worker.id] || ''} onChange={e => setMessDeductions({...messDeductions, [worker.id]: Number(e.target.value)})} /></td>
                      <td className="px-4 py-3 text-red-600">{totalKharchi}</td>
                      <td className="px-4 py-3 text-red-600">{totalAdvance}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{net.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div id="printable-payment" className="hidden">
        <div className="flex flex-col items-center mb-6">
           <Building2 className="w-8 h-8" /><h1 className="text-5xl font-['Oswald'] font-black">SN ENTERPRISE</h1>
           <h2 className="text-lg font-bold border border-black p-1 w-full text-center mt-2">Salary Sheet - {selectedProjectName} - {selectedMonth}</h2>
        </div>
        <table className="w-full text-sm border-collapse border border-black">
          <thead><tr><th>SR</th><th>Name</th><th>Total</th><th>Kharchi</th><th>Mess</th><th>Adv</th><th>Net</th><th>Sign</th></tr></thead>
          <tbody>{projectWorkers.map((w, idx) => {
              const { totalKharchi, totalAdvance } = getDeductions(w.id);
              const net = (workAmounts[w.id] || 0) - (messDeductions[w.id] || 0) - totalKharchi - totalAdvance;
              return <tr key={w.id} className="h-10"><td>{idx+1}</td><td>{w.name}</td><td>{workAmounts[w.id]}</td><td>{totalKharchi}</td><td>{messDeductions[w.id]}</td><td>{totalAdvance}</td><td className="font-bold">{net}</td><td></td></tr>
          })}</tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerPayment;
