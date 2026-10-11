import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'data-analysis' | 'resume' | 'interview' | 'meeting';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'dashboard', label: 'Workspace Dashboard', icon: LayoutDashboard },
  { id: 'data-analysis', label: 'Data Analysis Assistant', icon: BarChart3, badge: 'EDA & Viz' },
  { id: 'resume', label: 'Resume Generator', icon: FileText },
  { id: 'interview', label: 'Interview Questions', icon: HelpCircle },
  { id: 'meeting', label: 'Meeting Summarizer', icon: MessageSquare },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full justify-between py-6 px-4">
      <div>
        <div className="flex items-center justify-between mb-6 px-2 md:hidden">
          <span className="text-sm font-semibold text-text-secondary">Navigation</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-2 mb-3">
          <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Modules & Tools
          </p>
        </div>

        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-accent text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-700/60 text-white' : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="mt-8 pt-6 border-t border-border-color px-2">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-primary-accent" />
            <span>Responsible AI Guard</span>
          </div>
          <p className="text-[11px] leading-relaxed text-text-secondary">
            Keys remain on server. Python code is rendered safely for review and never executed automatically.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-border-color min-h-[calc(100vh-4rem)] flex-shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
