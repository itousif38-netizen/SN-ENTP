import React from 'react';
import { LayoutDashboard, Users, FileText, CreditCard, Coins, Wallet, Calculator, Bot, X, HardHat, HandCoins, Building2, ShoppingCart, Layers, TrendingUp, Utensils, Percent, Database, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isMobileOpen, setIsMobileOpen, onLogout }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.PROJECTS, label: 'Projects', icon: HardHat },
    { id: AppView.EXECUTION, label: 'Execution', icon: Layers },
    { id: AppView.PURCHASE, label: 'Purchase', icon: ShoppingCart },
    { id: AppView.WORKERS, label: 'Workers Mgmt', icon: Users },
    { id: AppView.MESS, label: 'Mess Mgmt', icon: Utensils },
    { id: AppView.BILLING, label: 'Billing & Client Pay', icon: FileText },
    { id: AppView.GST, label: 'GST Dashboard', icon: Percent },
    { id: AppView.KHARCHI, label: 'Kharchi (Sundays)', icon: Coins },
    { id: AppView.ADVANCE, label: 'Worker Advances', icon: Wallet },
    { id: AppView.WORKER_PAYMENT, label: 'Worker Payment', icon: HandCoins },
    { id: AppView.EXPENSES, label: 'Expense Manager', icon: TrendingUp },
    { id: AppView.ESTIMATOR, label: 'AI Estimator', icon: Calculator },
    { id: AppView.ASSISTANT, label: 'Site Assistant', icon: Bot },
    { id: AppView.BACKUP, label: 'Data Backup', icon: Database },
  ];

  const handleNavClick = (view: AppView) => {
    onChangeView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-24 px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="relative w-12 h-12 flex-shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 180 V 60 L 70 40 V 180" fill="#0ea5e9" />
                  <path d="M75 180 V 20 L 125 10 V 180" fill="#0284c7" />
                  <path d="M130 180 V 50 L 160 70 V 180" fill="#0ea5e9" />
                  <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="8" fill="none" />
                  <text x="100" y="125" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="70" fill="white">SN</text>
                  <path d="M 20 160 Q 100 220 180 140" stroke="#f97316" strokeWidth="10" fill="none" strokeLinecap="round" />
                </svg>
            </div>
            <div className="leading-none">
                <span className="block font-['Oswald'] font-bold text-2xl tracking-wide text-white">SN</span>
                <span className="block font-['Oswald'] text-sm font-bold text-orange-500 tracking-widest">ENTERPRISE</span>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm
                  ${isActive 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-orange-500 font-bold border border-slate-600 font-['Oswald']">
                SN
              </div>
              <div>
                <p className="text-sm font-medium text-white">SN Admin</p>
                <p className="text-xs text-slate-500">Manager</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;