import React from 'react';
import { AppView } from '../types';
import { X, ChevronRight } from 'lucide-react';

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
  showInstallButton,
  onInstallClick,
}) => {
  
  // Grouping menu items for Tally-like structure
  const menuGroups = [
    {
      title: 'Masters',
      items: [
        { id: AppView.DASHBOARD, label: 'Dashboard Overview' },
        { id: AppView.PROJECTS, label: 'Projects (Sites)' },
        { id: AppView.WORKERS, label: 'Worker Master' },
        { id: AppView.EXECUTION, label: 'Execution Stages' },
      ]
    },
    {
      title: 'Transactions',
      items: [
        { id: AppView.BILLING, label: 'Billing Vouchers' },
        { id: AppView.PURCHASE, label: 'Purchase Vouchers' },
        { id: AppView.WORKER_PAYMENT, label: 'Worker Payment' },
        { id: AppView.KHARCHI, label: 'Kharchi (Sundays)' },
        { id: AppView.ADVANCE, label: 'Advance Payment' },
        { id: AppView.MESS, label: 'Mess Management' },
      ]
    },
    {
      title: 'Reports',
      items: [
        { id: AppView.EXPENSES, label: 'Profit & Loss A/c' },
        { id: AppView.GST, label: 'GST Reports' },
      ]
    },
    {
      title: 'Utilities',
      items: [
        { id: AppView.ESTIMATOR, label: 'AI Cost Estimator' },
        { id: AppView.ASSISTANT, label: 'Site Assistant (AI)' },
        { id: AppView.BACKUP, label: 'Data Backup' },
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
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - Gateway of Tally Style */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white text-slate-800 transform transition-transform duration-300 ease-in-out border-r border-slate-300 shadow-xl
        lg:translate-x-0 lg:static lg:h-full lg:shadow-none flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Gateway Header */}
        <div className="h-12 bg-slate-100 border-b border-slate-300 flex items-center justify-between px-4 shrink-0">
           <h2 className="font-bold text-sm uppercase tracking-wide text-slate-700">Gateway of SN</h2>
           <button 
            className="lg:hidden text-slate-500 hover:text-red-500"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
            {menuGroups.map((group, groupIdx) => (
                <div key={group.title} className="mb-4">
                    <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {group.title}
                    </div>
                    <ul className="space-y-0.5">
                        {group.items.map((item) => {
                            const isActive = currentView === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleNavClick(item.id)}
                                        className={`
                                            w-full text-left px-6 py-1.5 text-sm font-medium transition-colors relative flex items-center justify-between group
                                            ${isActive 
                                                ? 'bg-tally-yellow-light text-black font-bold' 
                                                : 'text-slate-700 hover:bg-tally-yellow-light hover:text-black'}
                                        `}
                                    >
                                        {/* Yellow selection bar on left */}
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tally-yellow"></div>}
                                        
                                        <span>{item.label}</span>
                                        {isActive && <ChevronRight size={14} className="text-slate-400" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-slate-300 bg-slate-50">
           {showInstallButton && onInstallClick && (
            <button
              onClick={onInstallClick}
              className="w-full text-center py-2 bg-tally-teal text-white rounded text-xs font-bold hover:bg-tally-teal-dark uppercase"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;