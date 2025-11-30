
import React from 'react';
import { AppView } from '../types';
import { 
  LayoutDashboard, 
  HardHat, 
  Users, 
  FileText, 
  Calculator, 
  MessageSquare, 
  LogOut, 
  X, 
  Download, 
  Coins, 
  Wallet, 
  CreditCard,
  ShoppingCart,
  Layers,
  Utensils,
  BarChart4,
  Database,
  ChevronRight,
  ClipboardList,
  Package
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  showInstallButton?: boolean;
  onInstallClick?: () => void;
  isOnline?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isMobileOpen, 
  setIsMobileOpen, 
  onLogout, 
  showInstallButton,
  onInstallClick
}) => {
  
  const menuGroups = [
    {
      title: 'Operations',
      items: [
        { id: AppView.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
        { id: AppView.PROJECTS, label: 'Projects', icon: HardHat },
        { id: AppView.WORKERS, label: 'Workforce', icon: Users },
        { id: AppView.ATTENDANCE, label: 'Daily Attendance', icon: ClipboardList },
        { id: AppView.EXECUTION, label: 'Site Execution', icon: Layers },
      ]
    },
    {
      title: 'Logistics',
      items: [
        { id: AppView.PURCHASE, label: 'Purchase', icon: ShoppingCart },
        { id: AppView.INVENTORY, label: 'Inventory & Stock', icon: Package },
      ]
    },
    {
      title: 'Financials',
      items: [
        { id: AppView.BILLING, label: 'Billing & Payments', icon: FileText },
        { id: AppView.WORKER_PAYMENT, label: 'Payroll', icon: CreditCard },
        { id: AppView.KHARCHI, label: 'Kharchi / Petty Cash', icon: Coins },
        { id: AppView.ADVANCE, label: 'Advances', icon: Wallet },
        { id: AppView.MESS, label: 'Mess Management', icon: Utensils },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: AppView.EXPENSES, label: 'P&L Analysis', icon: BarChart4 },
        { id: AppView.GST, label: 'GST Reports', icon: FileText },
        { id: AppView.ESTIMATOR, label: 'AI Estimator', icon: Calculator },
        { id: AppView.ASSISTANT, label: 'Site Assistant', icon: MessageSquare },
        { id: AppView.BACKUP, label: 'System Backup', icon: Database },
      ]
    }
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
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-300 transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:translate-x-0 lg:static lg:h-full lg:shadow-none flex flex-col border-r border-slate-800
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex flex-col items-start justify-center h-20 px-6 border-b border-slate-800/50 bg-[#0f172a]">
           <div className="flex items-center gap-3 w-full">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                 SN
               </div>
               <div>
                  <h1 className="text-white font-bold text-base tracking-wide leading-tight">SN ENTERPRISE</h1>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Construction Suite</span>
               </div>
               <button 
                className="lg:hidden ml-auto text-slate-400"
                onClick={() => setIsMobileOpen(false)}
              >
                <X size={20} />
              </button>
           </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar space-y-8">
            {menuGroups.map((group) => (
                <div key={group.title}>
                    <div className="px-2 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        {group.title}
                    </div>
                    <ul className="space-y-1">
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleNavClick(item.id)}
                                        className={`
                                            group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                            ${isActive 
                                                ? 'bg-blue-600/10 text-blue-400' 
                                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                          <Icon size={18} className={`transition-colors ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                          <span>{item.label}</span>
                                        </div>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0f172a] space-y-2">
           {showInstallButton && onInstallClick && (
            <button
              onClick={onInstallClick}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              <Download size={14} /> Install Application
            </button>
          )}
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
