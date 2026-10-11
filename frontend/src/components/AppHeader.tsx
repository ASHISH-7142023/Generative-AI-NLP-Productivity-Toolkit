import React from 'react';
import { Sparkles, Server, CheckCircle2, AlertCircle, Menu } from 'lucide-react';
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
    <header className="bg-white border-b border-border-color sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-accent to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-text-primary tracking-tight">
                  NLP Productivity Toolkit
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-50 text-primary-accent rounded-full border border-indigo-100">
                  Capstone
                </span>
              </div>
              <p className="text-xs text-text-secondary hidden sm:block">
                Generative AI Workspace &bull; OpenAI NLP Automation
              </p>
            </div>
          </div>
        </div>

        {/* Server & Model Status */}
        <div className="flex items-center gap-3">
          {healthError ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-danger border border-red-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Backend Offline</span>
            </div>
          ) : health ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span>Model: {health.model_configured}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-success border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>API Online</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span>Checking...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
