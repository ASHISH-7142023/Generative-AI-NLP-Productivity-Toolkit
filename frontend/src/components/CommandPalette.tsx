import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Users,
  Moon,
  History,
  X,
  ExternalLink,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  onToggleDarkMode: () => void;
  onOpenHistory: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Navigation' | 'Actions';
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onToggleDarkMode,
  onOpenHistory,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'System landing page and architectural summary',
      icon: LayoutDashboard,
      category: 'Navigation',
      action: () => {
        onNavigate('dashboard');
        onClose();
      },
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis & EDA',
      description: 'Generate Pandas profiling and Matplotlib visualizations',
      icon: FileSpreadsheet,
      category: 'Navigation',
      action: () => {
        onNavigate('data-analysis');
        onClose();
      },
    },
    {
      id: 'resume',
      title: 'Resume & Career Generator',
      description: 'Transform raw career paragraphs into structured STAR resumes',
      icon: FileText,
      category: 'Navigation',
      action: () => {
        onNavigate('resume');
        onClose();
      },
    },
    {
      id: 'interview',
      title: 'Interview Question Generator',
      description: 'Calibrated technical programming questions across languages',
      icon: HelpCircle,
      category: 'Navigation',
      action: () => {
        onNavigate('interview');
        onClose();
      },
    },
    {
      id: 'meeting',
      title: 'Meeting Notes Summarizer',
      description: 'Synthesize multi-speaker transcripts into executive briefs',
      icon: Users,
      category: 'Navigation',
      action: () => {
        onNavigate('meeting');
        onClose();
      },
    },
    {
      id: 'theme',
      title: 'Toggle Dark / Light Mode',
      description: 'Switch between dark and light color tokens',
      icon: Moon,
      category: 'Actions',
      action: () => {
        onToggleDarkMode();
        onClose();
      },
    },
    {
      id: 'history',
      title: 'Open Generation History',
      description: 'Review and export past generation outputs',
      icon: History,
      category: 'Actions',
      action: () => {
        onOpenHistory();
        onClose();
      },
    },
    {
      id: 'github',
      title: 'View Project GitHub Repository',
      description: 'Source code, CI workflows, and documentation',
      icon: ExternalLink,
      category: 'Actions',
      action: () => {
        window.open('https://github.com/ASHISH-7142023/Generative-AI-NLP-Productivity-Toolkit', '_blank');
        onClose();
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-slate-900/60 backdrop-blur-sm flex justify-center items-start">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to feature... (Esc to close)"
            className="w-full py-4 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching commands or destinations found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{item.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">esc</kbd> Dismiss
            </span>
          </div>
          <span>ProTip: Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">Ctrl+K</kbd> anywhere</span>
        </div>
      </div>
    </div>
  );
};
