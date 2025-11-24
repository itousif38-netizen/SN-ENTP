import React, { useRef, useState } from 'react';
import { Database, Download, Upload, AlertTriangle, CheckCircle2, FileJson, HardDrive, Printer, Building2 } from 'lucide-react';

interface DataBackupProps {
  currentData: any;
  onRestore: (data: any) => void;
}

const DataBackup: React.FC<DataBackupProps> = ({ currentData, onRestore }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(currentData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Create a timestamped filename
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      
      link.href = url;
      link.download = `SN_Enterprise_Backup_${dateStr}_${timeStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatus({ type: 'success', message: 'Backup file generated! Please select "Local Disk E:" in the save dialog.' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to create backup file.' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation: check if key arrays exist
        if (json.projects && Array.isArray(json.projects)) {
          onRestore(json);
          setStatus({ type: 'success', message: 'Data restored successfully!' });
        } else {
          setStatus({ type: 'error', message: 'Invalid backup file format.' });
        }
      } catch (error) {
        console.error(error);
        setStatus({ type: 'error', message: 'Failed to read backup file.' });
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handlePrintMaster = () => {
    window.print();
  };

  const getProjectName = (id: string) => {
    return currentData.projects?.find((p: any) => p.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            visibility: hidden;
            background: white;
            overflow: visible;
          }
          #printable-master {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
            font-size: 11px;
            display: block !important;
          }
          #printable-master * {
            visibility: visible;
          }
          .section-break { page-break-before: always; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid black !important; padding: 4px; text-align: left; }
          th { background-color: #f3f4f6 !important; font-weight: bold; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; }
          .no-print { display: none !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="print:hidden space-y-6">
        <div className="flex justify-between items-start">
            <div>
            <h1 className="text-2xl font-bold text-slate-900">Data Backup & Restore</h1>
            <p className="text-slate-500">Securely export, restore, or print your entire database.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Export Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center animate-fade-in-up">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Download size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Export Digital Backup</h2>
            <p className="text-slate-500 text-xs mb-4">
                Save a .json file to "Local Disk E:" for safe keeping.
            </p>
            
            <button 
                onClick={handleExport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 w-full justify-center text-sm"
            >
                <FileJson size={18} /> Download Backup
            </button>
            </div>

            {/* Import Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Upload size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Restore Data</h2>
            <p className="text-slate-500 text-xs mb-4">
                Upload your saved backup file to restore the app.
            </p>
            
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />

            <button 
                onClick={handleImportClick}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 w-full justify-center text-sm"
            >
                <Upload size={18} /> Upload File
            </button>
            </div>

            {/* Print Master Record */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4">
                <Printer size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Print Master Record</h2>
            <p className="text-slate-500 text-xs mb-4">
                Print a hard copy of ALL data (Projects, Workers, Bills, etc).
            </p>
            
            <button 
                onClick={handlePrintMaster}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 w-full justify-center text-sm"
            >
                <Printer size={18} /> Print All Data
            </button>
            </div>
        </div>

        {status.type && (
            <div className={`p-4 rounded-xl flex items-center gap-3 animate-scale-in border ${
                status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
                {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                <div>
                <p className="font-bold">{status.type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-sm">{status.message}</p>
                </div>
            </div>
        )}
      </div>

      {/* --- MASTER PRINTABLE LAYOUT --- */}
      <div id="printable-master" className="hidden">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
             <div className="flex items-center gap-3 mb-2">
               <div className="relative w-12 h-12 flex items-center justify-center bg-blue-600 rounded-xl overflow-hidden border border-black">
                  <Building2 className="text-white w-8 h-8 relative z-10" />
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-orange-500 rounded-full"></div>
              </div>
               <h1 className="text-5xl font-['Oswald'] font-black text-black uppercase tracking-wide">SN ENTERPRISE</h1>
             </div>
             <div className="h-0.5 bg-black w-full my-1"></div>
             <h2 className="text-xl font-bold uppercase">Master Data Record</h2>
             <p className="text-sm">Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
         </div>

         {/* 1. Projects */}
         <div className="mb-6">
             <h3 className="font-bold text-lg mb-2 border-b border-black">1. Active Projects List</h3>
             <table>
                 <thead>
                     <tr>
                         <th>Project Name</th>
                         <th>Address</th>
                         <th>Start Date</th>
                         <th>Budget</th>
                         <th>Status</th>
                     </tr>
                 </thead>
                 <tbody>
                     {currentData.projects?.map((p: any) => (
                         <tr key={p.id}>
                             <td>{p.name}</td>
                             <td>{p.address}</td>
                             <td>{p.startDate}</td>
                             <td>{p.budget.toLocaleString('en-IN')}</td>
                             <td>{p.status}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>

         {/* 2. Workers */}
         <div className="mb-6">
             <h3 className="font-bold text-lg mb-2 border-b border-black">2. Workers Register</h3>
             <table>
                 <thead>
                     <tr>
                         <th>ID</th>
                         <th>Name</th>
                         <th>Designation</th>
                         <th>Project Site</th>
                         <th>Joining Date</th>
                     </tr>
                 </thead>
                 <tbody>
                     {currentData.workers?.map((w: any) => (
                         <tr key={w.id}>
                             <td>{w.workerId}</td>
                             <td>{w.name}</td>
                             <td>{w.designation}</td>
                             <td>{getProjectName(w.projectId)}</td>
                             <td>{w.joiningDate}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>

         <div className="section-break"></div>

         {/* 3. Bills */}
         <div className="mb-6">
             <h3 className="font-bold text-lg mb-2 border-b border-black">3. Billing Register</h3>
             <table>
                 <thead>
                     <tr>
                         <th>Bill No</th>
                         <th>Date</th>
                         <th>Project</th>
                         <th>Work Nature</th>
                         <th>Amount</th>
                         <th>GST</th>
                         <th>Total</th>
                     </tr>
                 </thead>
                 <tbody>
                     {currentData.bills?.map((b: any) => (
                         <tr key={b.id}>
                             <td>{b.billNo}</td>
                             <td>{b.certifyDate}</td>
                             <td>{getProjectName(b.projectId)}</td>
                             <td>{b.workNature}</td>
                             <td>{b.amount.toLocaleString('en-IN')}</td>
                             <td>{b.gstAmount?.toLocaleString('en-IN')}</td>
                             <td>{(b.grandTotal || b.amount).toLocaleString('en-IN')}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>

         {/* 4. Purchases */}
         <div className="mb-6">
             <h3 className="font-bold text-lg mb-2 border-b border-black">4. Purchase Register</h3>
             <table>
                 <thead>
                     <tr>
                         <th>Date</th>
                         <th>Project</th>
                         <th>Item</th>
                         <th>Qty</th>
                         <th>Unit</th>
                         <th>Rate</th>
                         <th>Total</th>
                     </tr>
                 </thead>
                 <tbody>
                     {currentData.purchases?.map((p: any) => (
                         <tr key={p.id}>
                             <td>{p.date}</td>
                             <td>{getProjectName(p.projectId)}</td>
                             <td>{p.description}</td>
                             <td>{p.quantity}</td>
                             <td>{p.unit}</td>
                             <td>{p.rate.toLocaleString('en-IN')}</td>
                             <td>{p.totalAmount.toLocaleString('en-IN')}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>

         {/* 5. Client Payments */}
         <div className="mb-6">
             <h3 className="font-bold text-lg mb-2 border-b border-black">5. Client Payments Received</h3>
             <table>
                 <thead>
                     <tr>
                         <th>Date</th>
                         <th>Project</th>
                         <th>Remarks</th>
                         <th>Amount</th>
                     </tr>
                 </thead>
                 <tbody>
                     {currentData.clientPayments?.map((cp: any) => (
                         <tr key={cp.id}>
                             <td>{cp.date}</td>
                             <td>{getProjectName(cp.projectId)}</td>
                             <td>{cp.remarks}</td>
                             <td>{cp.amount.toLocaleString('en-IN')}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default DataBackup;