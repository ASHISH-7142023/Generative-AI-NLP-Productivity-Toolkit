import React, { useState, useEffect } from 'react';
import { History, X, Trash2, Clock, Copy, Check } from 'lucide-react';

export interface HistoryItem {
  id: string;
  feature: string;
  title: string;
  timestamp: number;
  preview: string;
  content: string;
}

const STORAGE_KEY = 'nlp_toolkit_generation_history';

export const saveToHistory = (feature: string, title: string, content: string) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: HistoryItem[] = raw ? JSON.parse(raw) : [];
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      feature,
      title: title || `${feature.toUpperCase()} Output`,
      timestamp: Date.now(),
      preview: content.slice(0, 120).replace(/\n/g, ' ') + (content.length > 120 ? '...' : ''),
      content,
    };
    // Keep last 30 items
    const updated = [newItem, ...history].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('history_updated'));
  } catch (err) {
    console.error('Failed to save to local history', err);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [copied, setCopied] = useState(false);

  const loadItems = () => {
    setItems(getHistory());
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('history_updated', handleUpdate);
    return () => window.removeEventListener('history_updated', handleUpdate);
  }, []);

  const handleClear = () => {
    if (window.confirm('Clear all generation history?')) {
      localStorage.removeItem(STORAGE_KEY);
      setItems([]);
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setItems(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Generation History</h2>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                {items.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {items.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No recent generations recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">Generated outputs will be saved here automatically.</p>
              </div>
            ) : selectedItem ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>&larr; Back to list</span>
                </button>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                      {selectedItem.feature}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedItem.content)}
                      className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Copy content"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">{selectedItem.title}</h3>
                  <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                    {selectedItem.content}
                  </pre>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    if (onSelect) onSelect(item);
                  }}
                  className="group relative p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {item.feature}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.preview}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
