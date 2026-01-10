
import React, { useState, useEffect, useCallback } from 'react';
import { Menu, WifiOff, RefreshCw, Bell, ChevronDown, CheckCircle2 } from 'lucide-react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import ProjectList from './components/ProjectList.tsx';
import WorkerManager from './components/WorkerManager.tsx';
import BillingManager from './components/BillingManager.tsx';
import KharchiTracker from './components/KharchiTracker.tsx';
import AdvanceTracker from './components/AdvanceTracker.tsx';
import WorkerPayment from './components/WorkerPayment.tsx';
import ExpenseManager from './components/ExpenseManager.tsx';
import PurchaseManager from './components/PurchaseManager.tsx';
import ExecutionTracker from './components/ExecutionTracker.tsx';
import MessManager from './components/MessManager.tsx';
import GSTDashboard from './components/GSTDashboard.tsx';
import AIEstimator from './components/AIEstimator.tsx';
import AIChat from './components/AIChat.tsx';
import Login from './components/Login.tsx';
import DataBackup from './components/DataBackup.tsx';
import AttendanceTracker from './components/AttendanceTracker.tsx';
import InventoryManager from './components/InventoryManager.tsx';
import { AppView, Project, Worker, Bill, KharchiEntry, AdvanceEntry, ClientPayment, PurchaseEntry, ExecutionLevel, WorkerPayment as WorkerPaymentType, MessEntry, AttendanceRecord, StockConsumption } from './types.ts';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_BILLS, MOCK_KHARCHI, MOCK_ADVANCES, MOCK_CLIENT_PAYMENTS, MOCK_PURCHASES, MOCK_EXECUTION, MOCK_MESS_ENTRIES, MOCK_ATTENDANCE, MOCK_STOCK_CONSUMPTION } from './constants.ts';

// Custom Hook for Local Storage Persistence with Error Handling
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}

function App() {
  // Persistent Auth State
  const [isAuthenticated, setIsAuthenticated] = usePersistentState<boolean>('sn_auth', false);
  const [logoutNotification, setLogoutNotification] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = usePersistentState<string>('sn_last_sync', new Date().toLocaleTimeString());

  // Simulated Background Sync Capability
  const triggerSync = useCallback(() => {
    if (isOnline && !isSyncing) {
      setIsSyncing(true);
      // Mock network latency for sync
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced(new Date().toLocaleTimeString());
      }, 1500);
    }
  }, [isOnline, isSyncing]);

  useEffect(() => {
    if (isOnline) triggerSync();
  }, [isOnline, triggerSync]);

  // Data State - PERSISTENT
  const [projects, setProjects] = usePersistentState<Project[]>('sn_projects', MOCK_PROJECTS);
  const [workers, setWorkers] = usePersistentState<Worker[]>('sn_workers', MOCK_WORKERS);
  const [bills, setBills] = usePersistentState<Bill[]>('sn_bills', MOCK_BILLS);
  const [clientPayments, setClientPayments] = usePersistentState<ClientPayment[]>('sn_client_payments', MOCK_CLIENT_PAYMENTS);
  const [kharchi, setKharchi] = usePersistentState<KharchiEntry[]>('sn_kharchi', MOCK_KHARCHI);
  const [advances, setAdvances] = usePersistentState<AdvanceEntry[]>('sn_advances', MOCK_ADVANCES);
  const [purchases, setPurchases] = usePersistentState<PurchaseEntry[]>('sn_purchases', MOCK_PURCHASES);
  const [executionData, setExecutionData] = usePersistentState<ExecutionLevel[]>('sn_execution', MOCK_EXECUTION);
  const [messEntries, setMessEntries] = usePersistentState<MessEntry[]>('sn_mess', MOCK_MESS_ENTRIES);
  const [workerPayments, setWorkerPayments] = usePersistentState<WorkerPaymentType[]>('sn_worker_payments', []);
  const [attendance, setAttendance] = usePersistentState<AttendanceRecord[]>('sn_attendance', MOCK_ATTENDANCE);
  const [consumption, setConsumption] = usePersistentState<StockConsumption[]>('sn_consumption', MOCK_STOCK_CONSUMPTION);

  // --- Handlers (Trigger sync on data change if online) ---
  const wrapWithSync = (handler: Function) => (...args: any[]) => {
    handler(...args);
    if (isOnline) triggerSync();
  };

  const handleAddProject = wrapWithSync((newProject: Project) => setProjects(prev => [...prev, newProject]));
  const handleAddWorker = wrapWithSync((newWorker: Worker) => setWorkers(prev => [...prev, newWorker]));
  const handleAddBill = wrapWithSync((newBill: Bill) => setBills(prev => [...prev, newBill]));
  const handleAddClientPayment = wrapWithSync((newPayment: ClientPayment) => setClientPayments(prev => [...prev, newPayment]));
  const handleAddAdvance = wrapWithSync((newAdvance: AdvanceEntry) => setAdvances(prev => [...prev, newAdvance]));
  const handleAddPurchase = wrapWithSync((newPurchase: PurchaseEntry) => setPurchases(prev => [...prev, newPurchase]));
  const handleAddExecution = wrapWithSync((newExecution: ExecutionLevel) => setExecutionData(prev => [...prev, newExecution]));
  const handleAddMess = wrapWithSync((newMess: MessEntry) => setMessEntries(prev => [...prev, newMess]));
  const handleAddConsumption = wrapWithSync((newConsumption: StockConsumption) => setConsumption(prev => [...prev, newConsumption]));

  const handleEditProject = wrapWithSync((updatedProject: Project) => setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p)));
  const handleEditWorker = wrapWithSync((updatedWorker: Worker) => setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? updatedWorker : w)));
  const handleEditBill = wrapWithSync((updatedBill: Bill) => setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b)));
  const handleEditClientPayment = wrapWithSync((updatedPayment: ClientPayment) => setClientPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p)));
  const handleEditAdvance = wrapWithSync((updatedAdvance: AdvanceEntry) => setAdvances(prev => prev.map(a => a.id === updatedAdvance.id ? updatedAdvance : a)));
  const handleEditPurchase = wrapWithSync((updatedPurchase: PurchaseEntry) => setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p)));
  const handleUpdateExecution = wrapWithSync((updatedEntry: ExecutionLevel) => setExecutionData(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e)));
  const handleEditMess = wrapWithSync((updatedMess: MessEntry) => setMessEntries(prev => prev.map(m => m.id === updatedMess.id ? updatedMess : m)));

  const handleDeleteProject = wrapWithSync((id: string) => setProjects(prev => prev.filter(p => p.id !== id)));
  const handleDeleteWorker = wrapWithSync((id: string) => setWorkers(prev => prev.filter(w => w.id !== id)));
  const handleDeleteBill = wrapWithSync((id: string) => setBills(prev => prev.filter(b => b.id !== id)));
  const handleDeleteClientPayment = wrapWithSync((id: string) => setClientPayments(prev => prev.filter(p => p.id !== id)));
  const handleDeleteAdvance = wrapWithSync((id: string) => setAdvances(prev => prev.filter(a => a.id !== id)));
  const handleDeletePurchase = wrapWithSync((id: string) => setPurchases(prev => prev.filter(p => p.id !== id)));
  const handleDeleteExecution = wrapWithSync((id: string) => setExecutionData(prev => prev.filter(e => e.id !== id)));
  const handleDeleteMess = wrapWithSync((id: string) => setMessEntries(prev => prev.filter(m => m.id !== id)));
  const handleDeleteConsumption = wrapWithSync((id: string) => setConsumption(prev => prev.filter(c => c.id !== id)));

  const handleUpdateKharchi = wrapWithSync((entries: KharchiEntry[]) => {
    setKharchi(prev => {
        const otherEntries = prev.filter(p => !entries.some(e => e.id === p.id));
        return [...otherEntries, ...entries];
    });
  });

  const handleUpdateAttendance = wrapWithSync((entries: AttendanceRecord[]) => {
    setAttendance(entries);
  });

  const handleSaveWorkerPayments = wrapWithSync((records: WorkerPaymentType[]) => {
    setWorkerPayments(prev => {
        const filtered = prev.filter(p => !records.some(r => r.workerId === p.workerId && r.month === p.month));
        return [...filtered, ...records];
    });
  });

  const handleRestoreData = (data: any) => {
    if (data.projects) setProjects(data.projects);
    if (data.workers) setWorkers(data.workers);
    if (data.bills) setBills(data.bills);
    if (data.clientPayments) setClientPayments(data.clientPayments);
    if (data.kharchi) setKharchi(data.kharchi);
    if (data.advances) setAdvances(data.advances);
    if (data.purchases) setPurchases(data.purchases);
    if (data.executionData) setExecutionData(data.executionData);
    if (data.messEntries) setMessEntries(data.messEntries);
    if (data.workerPayments) setWorkerPayments(data.workerPayments);
    if (data.attendance) setAttendance(data.attendance);
    if (data.consumption) setConsumption(data.consumption);
    triggerSync();
  };

  const handleLogin = (success: boolean) => {
    if (success) setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(AppView.DASHBOARD);
    setLogoutNotification("Logged out successfully");
    setTimeout(() => setLogoutNotification(null), 3000);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} notification={logoutNotification} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return (
        <Dashboard 
          projects={projects} 
          workers={workers} 
          attendance={attendance} 
          bills={bills} 
          purchases={purchases} 
          isOnline={isOnline}
          isSyncing={isSyncing}
          lastSynced={lastSynced}
          onSync={triggerSync}
        />
      );
      case AppView.PROJECTS: return <ProjectList projects={projects} onAddProject={handleAddProject} onEditProject={handleEditProject} onDeleteProject={handleDeleteProject} />;
      case AppView.WORKERS: return <WorkerManager workers={workers} projects={projects} onAddWorker={handleAddWorker} onEditWorker={handleEditWorker} onDeleteWorker={handleDeleteWorker} />;
      case AppView.ATTENDANCE: return <AttendanceTracker projects={projects} workers={workers} attendance={attendance} onUpdateAttendance={handleUpdateAttendance} />;
      case AppView.BILLING: return <BillingManager projects={projects} bills={bills} clientPayments={clientPayments} onAddBill={handleAddBill} onEditBill={handleEditBill} onDeleteBill={handleDeleteBill} onAddPayment={handleAddClientPayment} onEditPayment={handleEditClientPayment} onDeletePayment={handleDeleteClientPayment} />;
      case AppView.KHARCHI: return <KharchiTracker projects={projects} workers={workers} kharchi={kharchi} onUpdateKharchi={handleUpdateKharchi} />;
      case AppView.ADVANCE: return <AdvanceTracker projects={projects} workers={workers} advances={advances} onAddAdvance={handleAddAdvance} onEditAdvance={handleEditAdvance} onDeleteAdvance={handleDeleteAdvance} />;
      case AppView.WORKER_PAYMENT: return <WorkerPayment projects={projects} workers={workers} kharchi={kharchi} advances={advances} onSavePaymentRecord={handleSaveWorkerPayments} />;
      case AppView.EXPENSES: return <ExpenseManager projects={projects} purchases={purchases} kharchi={kharchi} advances={advances} clientPayments={clientPayments} workerPayments={workerPayments} messEntries={messEntries} bills={bills} />;
      case AppView.PURCHASE: return <PurchaseManager projects={projects} purchases={purchases} onAddPurchase={handleAddPurchase} onEditPurchase={handleEditPurchase} onDeletePurchase={handleDeletePurchase} />;
      case AppView.INVENTORY: return <InventoryManager projects={projects} purchases={purchases} consumption={consumption} onAddConsumption={handleAddConsumption} onDeleteConsumption={handleDeleteConsumption} />;
      case AppView.EXECUTION: return <ExecutionTracker projects={projects} executionData={executionData} onAddExecution={handleAddExecution} onUpdateExecution={handleUpdateExecution} onDeleteExecution={handleDeleteExecution} />;
      case AppView.MESS: return <MessManager projects={projects} messEntries={messEntries} onAddMess={handleAddMess} onEditMess={handleEditMess} onDeleteMess={handleDeleteMess} />;
      case AppView.GST: return <GSTDashboard projects={projects} bills={bills} />;
      case AppView.ESTIMATOR: return <AIEstimator />;
      case AppView.ASSISTANT: return <AIChat />;
      case AppView.BACKUP: return <DataBackup currentData={{ projects, workers, bills, clientPayments, kharchi, advances, purchases, executionData, messEntries, workerPayments, attendance, consumption }} onRestore={handleRestoreData} />;
      default: return <Dashboard projects={projects} workers={workers} attendance={attendance} bills={bills} purchases={purchases} isOnline={isOnline} isSyncing={isSyncing} lastSynced={lastSynced} onSync={triggerSync} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-['Inter'] overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onLogout={handleLogout}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20">
             <div className="flex items-center gap-4">
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                   <Menu size={20} />
                 </button>
                 <div className="hidden md:flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">SN Enterprise</span>
                    <div className="flex items-center gap-2">
                       <h2 className="text-sm font-black text-slate-800 tracking-tight">{currentView}</h2>
                    </div>
                 </div>
             </div>

             <div className="flex items-center gap-3">
                {!isOnline ? (
                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 border border-red-100 animate-pulse">
                      <WifiOff size={12} /> OFFLINE
                    </div>
                ) : (
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 border ${isSyncing ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      {isSyncing ? 'SYNCING...' : 'LIVE'}
                    </div>
                )}

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                <button className="relative text-slate-400 hover:text-slate-600 p-2 rounded-xl">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 pl-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">AD</div>
                    <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </div>
             </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-[#f8fafc]">
           <div className="max-w-[1600px] mx-auto">
              {renderView()}
           </div>
        </main>
      </div>
    </div>
  );
}

export default App;
