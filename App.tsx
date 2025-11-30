import React, { useState, useEffect } from 'react';
import { Menu, WifiOff, RefreshCw, X, User, Settings, HelpCircle, LayoutGrid, Power } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import WorkerManager from './components/WorkerManager';
import BillingManager from './components/BillingManager';
import KharchiTracker from './components/KharchiTracker';
import AdvanceTracker from './components/AdvanceTracker';
import WorkerPayment from './components/WorkerPayment';
import ExpenseManager from './components/ExpenseManager';
import PurchaseManager from './components/PurchaseManager';
import ExecutionTracker from './components/ExecutionTracker';
import MessManager from './components/MessManager';
import GSTDashboard from './components/GSTDashboard';
import AIEstimator from './components/AIEstimator';
import AIChat from './components/AIChat';
import Login from './components/Login';
import DataBackup from './components/DataBackup';
import { AppView, Project, Worker, Bill, KharchiEntry, AdvanceEntry, ClientPayment, PurchaseEntry, ExecutionLevel, WorkerPayment as WorkerPaymentType, MessEntry } from './types';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_BILLS, MOCK_KHARCHI, MOCK_ADVANCES, MOCK_CLIENT_PAYMENTS, MOCK_PURCHASES, MOCK_EXECUTION, MOCK_MESS_ENTRIES } from './constants';

// Custom Hook for Local Storage Persistence
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

// Hook for Online Status
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
  // Auth State (Session based, resets on refresh which is fine for security)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutNotification, setLogoutNotification] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync effect when coming back online
  useEffect(() => {
    if (isOnline) {
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // State for data management - PERSISTENT
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

  // --- Handlers (CRUD operations remain same) ---
  const handleAddProject = (newProject: Project) => setProjects(prev => [...prev, newProject]);
  const handleAddWorker = (newWorker: Worker) => setWorkers(prev => [...prev, newWorker]);
  const handleAddBill = (newBill: Bill) => setBills(prev => [...prev, newBill]);
  const handleAddClientPayment = (newPayment: ClientPayment) => setClientPayments(prev => [...prev, newPayment]);
  const handleAddAdvance = (newAdvance: AdvanceEntry) => setAdvances(prev => [...prev, newAdvance]);
  const handleAddPurchase = (newPurchase: PurchaseEntry) => setPurchases(prev => [...prev, newPurchase]);
  const handleAddExecution = (newExecution: ExecutionLevel) => setExecutionData(prev => [...prev, newExecution]);
  const handleAddMess = (newMess: MessEntry) => setMessEntries(prev => [...prev, newMess]);

  const handleEditProject = (updatedProject: Project) => setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  const handleEditWorker = (updatedWorker: Worker) => setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? updatedWorker : w));
  const handleEditBill = (updatedBill: Bill) => setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b));
  const handleEditClientPayment = (updatedPayment: ClientPayment) => setClientPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  const handleEditAdvance = (updatedAdvance: AdvanceEntry) => setAdvances(prev => prev.map(a => a.id === updatedAdvance.id ? updatedAdvance : a));
  const handleEditPurchase = (updatedPurchase: PurchaseEntry) => setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p));
  const handleUpdateExecution = (updatedEntry: ExecutionLevel) => setExecutionData(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  const handleEditMess = (updatedMess: MessEntry) => setMessEntries(prev => prev.map(m => m.id === updatedMess.id ? updatedMess : m));

  const handleDeleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));
  const handleDeleteWorker = (id: string) => setWorkers(prev => prev.filter(w => w.id !== id));
  const handleDeleteBill = (id: string) => setBills(prev => prev.filter(b => b.id !== id));
  const handleDeleteClientPayment = (id: string) => setClientPayments(prev => prev.filter(p => p.id !== id));
  const handleDeleteAdvance = (id: string) => setAdvances(prev => prev.filter(a => a.id !== id));
  const handleDeletePurchase = (id: string) => setPurchases(prev => prev.filter(p => p.id !== id));
  const handleDeleteExecution = (id: string) => setExecutionData(prev => prev.filter(e => e.id !== id));
  const handleDeleteMess = (id: string) => setMessEntries(prev => prev.filter(m => m.id !== id));

  const handleUpdateKharchi = (entries: KharchiEntry[]) => {
    setKharchi(prev => {
        const otherEntries = prev.filter(p => !entries.some(e => e.id === p.id));
        return [...otherEntries, ...entries];
    });
  };

  const handleSaveWorkerPayments = (records: WorkerPaymentType[]) => {
    setWorkerPayments(prev => {
        const filtered = prev.filter(p => !records.some(r => r.workerId === p.workerId && r.month === p.month));
        return [...filtered, ...records];
    });
  };

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
      case AppView.DASHBOARD: return <Dashboard projects={projects} />;
      case AppView.PROJECTS: return <ProjectList projects={projects} onAddProject={handleAddProject} onEditProject={handleEditProject} onDeleteProject={handleDeleteProject} />;
      case AppView.WORKERS: return <WorkerManager workers={workers} projects={projects} onAddWorker={handleAddWorker} onEditWorker={handleEditWorker} onDeleteWorker={handleDeleteWorker} />;
      case AppView.BILLING: return <BillingManager projects={projects} bills={bills} clientPayments={clientPayments} onAddBill={handleAddBill} onEditBill={handleEditBill} onDeleteBill={handleDeleteBill} onAddPayment={handleAddClientPayment} onEditPayment={handleEditClientPayment} onDeletePayment={handleDeleteClientPayment} />;
      case AppView.KHARCHI: return <KharchiTracker projects={projects} workers={workers} kharchi={kharchi} onUpdateKharchi={handleUpdateKharchi} />;
      case AppView.ADVANCE: return <AdvanceTracker projects={projects} workers={workers} advances={advances} onAddAdvance={handleAddAdvance} onEditAdvance={handleEditAdvance} onDeleteAdvance={handleDeleteAdvance} />;
      case AppView.WORKER_PAYMENT: return <WorkerPayment projects={projects} workers={workers} kharchi={kharchi} advances={advances} onSavePaymentRecord={handleSaveWorkerPayments} />;
      case AppView.EXPENSES: return <ExpenseManager projects={projects} purchases={purchases} kharchi={kharchi} advances={advances} clientPayments={clientPayments} workerPayments={workerPayments} messEntries={messEntries} bills={bills} />;
      case AppView.PURCHASE: return <PurchaseManager projects={projects} purchases={purchases} onAddPurchase={handleAddPurchase} onEditPurchase={handleEditPurchase} onDeletePurchase={handleDeletePurchase} />;
      case AppView.EXECUTION: return <ExecutionTracker projects={projects} executionData={executionData} onAddExecution={handleAddExecution} onUpdateExecution={handleUpdateExecution} onDeleteExecution={handleDeleteExecution} />;
      case AppView.MESS: return <MessManager projects={projects} messEntries={messEntries} onAddMess={handleAddMess} onEditMess={handleEditMess} onDeleteMess={handleDeleteMess} />;
      case AppView.GST: return <GSTDashboard projects={projects} bills={bills} />;
      case AppView.ESTIMATOR: return <AIEstimator />;
      case AppView.ASSISTANT: return <AIChat />;
      case AppView.BACKUP: return <DataBackup currentData={{ projects, workers, bills, clientPayments, kharchi, advances, purchases, executionData, messEntries, workerPayments }} onRestore={handleRestoreData} />;
      default: return <Dashboard projects={projects} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f2f3f5] font-['Roboto'] overflow-hidden">
      {/* Tally Prime Style Top Bar */}
      <div className="h-12 bg-tally-teal flex items-center justify-between px-4 shadow-md z-50 text-white shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:bg-white/10 p-1 rounded"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="font-bold text-lg tracking-wide border-r border-white/30 pr-4">SN ENTERPRISE</div>
             <div className="hidden md:flex text-sm text-white/90 gap-4">
                 <span className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded">K: Company</span>
                 <span className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded">Y: Data</span>
                 <span className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded">Z: Exchange</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {!isOnline && (
              <div className="bg-red-600 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                <WifiOff size={12} /> Offline
              </div>
           )}
           {isOnline && isSyncing && (
              <div className="bg-blue-600 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 animate-pulse">
                <RefreshCw size={12} className="animate-spin" /> Syncing
              </div>
           )}
           
           <div className="h-6 w-px bg-white/30 mx-1"></div>
           
           <button title="Settings" className="p-1.5 hover:bg-white/10 rounded"><Settings size={18} /></button>
           <button title="Help" className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
           <button 
            onClick={handleLogout}
            title="Quit" 
            className="p-1.5 hover:bg-red-600 rounded flex items-center gap-1 text-xs uppercase font-bold"
           >
             <Power size={16} /> <span className="hidden sm:inline">Quit</span>
           </button>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          onLogout={handleLogout}
          showInstallButton={!!deferredPrompt}
          onInstallClick={handleInstallClick}
          isOnline={isOnline}
        />

        {/* Content Wrapper */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {/* Yellow Line below header (Tally Accent) */}
          <div className="h-1 bg-tally-yellow w-full shrink-0"></div>
          
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#f2f3f5]">
            <div className="max-w-[1600px] mx-auto min-h-full">
              {renderView()}
            </div>
          </div>
          
          {/* Tally Bottom Status Bar */}
          <div className="h-6 bg-tally-teal-dark text-white text-[10px] flex items-center px-2 justify-between shrink-0">
             <div>SN Enterprise Construction Manager v2.0</div>
             <div className="flex gap-4">
                <span>ODBC Server: Running</span>
                <span>Port: 9000</span>
                <span>Ctrl+M: Email</span>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;