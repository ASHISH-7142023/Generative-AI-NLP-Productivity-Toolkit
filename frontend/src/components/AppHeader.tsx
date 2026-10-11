import React from 'react';
import { Sparkles, Server, AlertCircle, Menu } from 'lucide-react';
import { HealthResponse } from '../types/api';

interface AppHeaderProps {
  health: HealthResponse | null;
  healthError: boolean;
  onToggleMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  health,
  healthError,
  onToggleMobileMenu,
}) => {
  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                  NLP Productivity Toolkit
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 rounded-full border border-indigo-200/60 shadow-2xs">
                  <span>CAPSTONE</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Generative AI Workspace &bull; OpenAI NLP Automation
              </p>
            </div>
          </div>
        </div>

        {/* Server & Model Status */}
        <div className="flex items-center gap-3">
          {healthError ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span>Backend Offline</span>
            </div>
          ) : health ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-slate-700 border border-slate-200/80 shadow-2xs backdrop-blur-sm">
                <Server className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-mono text-[11px]">{health.model_configured}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>API Online</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
