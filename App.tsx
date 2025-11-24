import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import WorkerManager from './components/WorkerManager';
import BillingManager from './components/BillingManager';
import KharchiTracker from './components/KharchiTracker';
import AdvanceTracker from './components/AdvanceTracker';
import WorkerPayment from './components/WorkerPayment';
import ExpenseManager from './components/ExpenseManager';
import ResourceTracker from './components/ResourceTracker';
import PurchaseManager from './components/PurchaseManager';
import ExecutionTracker from './components/ExecutionTracker';
import MessManager from './components/MessManager';
import GSTDashboard from './components/GSTDashboard';
import AIEstimator from './components/AIEstimator';
import AIChat from './components/AIChat';
import Login from './components/Login';
import DataBackup from './components/DataBackup';
import { AppView, Project, Worker, Bill, KharchiEntry, AdvanceEntry, ClientPayment, PurchaseEntry, ExecutionLevel, WorkerPayment as WorkerPaymentType, MessEntry } from './types';
import { MOCK_PROJECTS, MOCK_RESOURCES, MOCK_WORKERS, MOCK_BILLS, MOCK_KHARCHI, MOCK_ADVANCES, MOCK_CLIENT_PAYMENTS, MOCK_PURCHASES, MOCK_EXECUTION, MOCK_MESS_ENTRIES } from './constants';

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

function App() {
  // Auth State (Session based, resets on refresh which is fine for security)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for data management - NOW PERSISTENT
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

  // --- Add Handlers ---
  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleAddWorker = (newWorker: Worker) => {
    setWorkers(prev => [...prev, newWorker]);
  };

  const handleAddBill = (newBill: Bill) => {
    setBills(prev => [...prev, newBill]);
  };

  const handleAddClientPayment = (newPayment: ClientPayment) => {
    setClientPayments(prev => [...prev, newPayment]);
  };

  const handleAddAdvance = (newAdvance: AdvanceEntry) => {
    setAdvances(prev => [...prev, newAdvance]);
  };

  const handleAddPurchase = (newPurchase: PurchaseEntry) => {
    setPurchases(prev => [...prev, newPurchase]);
  };
  
  const handleAddExecution = (newExecution: ExecutionLevel) => {
    setExecutionData(prev => [...prev, newExecution]);
  };

  const handleAddMess = (newMess: MessEntry) => {
    setMessEntries(prev => [...prev, newMess]);
  };

  // --- Edit Handlers ---
  const handleEditProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleEditWorker = (updatedWorker: Worker) => {
    setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? updatedWorker : w));
  };

  const handleEditBill = (updatedBill: Bill) => {
    setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b));
  };

  const handleEditClientPayment = (updatedPayment: ClientPayment) => {
    setClientPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  };

  const handleEditAdvance = (updatedAdvance: AdvanceEntry) => {
    setAdvances(prev => prev.map(a => a.id === updatedAdvance.id ? updatedAdvance : a));
  };

  const handleEditPurchase = (updatedPurchase: PurchaseEntry) => {
    setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p));
  };
  
  const handleUpdateExecution = (updatedEntry: ExecutionLevel) => {
    setExecutionData(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const handleEditMess = (updatedMess: MessEntry) => {
    setMessEntries(prev => prev.map(m => m.id === updatedMess.id ? updatedMess : m));
  };

  // --- Delete Handlers ---
  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handleDeleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteClientPayment = (id: string) => {
    setClientPayments(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteAdvance = (id: string) => {
    setAdvances(prev => prev.filter(a => a.id !== id));
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };
  
  const handleDeleteExecution = (id: string) => {
    setExecutionData(prev => prev.filter(e => e.id !== id));
  };

  const handleDeleteMess = (id: string) => {
    setMessEntries(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateKharchi = (entries