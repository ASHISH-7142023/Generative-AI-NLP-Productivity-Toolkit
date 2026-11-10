import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileCode } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ExportDropdownProps {
  content: string;
  baseFilename: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ content, baseFilename }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const cleanBaseName = baseFilename.replace(/\.[^/.]+$/, '');
  const sizeKb = (new Blob([content]).size / 1024).toFixed(1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = (format: 'md' | 'txt' | 'py') => {
    let mimeType = 'text/plain;charset=utf-8';
    if (format === 'md') mimeType = 'text/markdown;charset=utf-8';
    if (format === 'py') mimeType = 'text/x-python;charset=utf-8';

    const filename = `${cleanBaseName}.${format}`;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${filename} (${sizeKb} KB)`);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-2xs"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-1.5 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Export Formats ({sizeKb} KB)
            </span>
          </div>

          <button
            onClick={() => handleDownload('md')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">Markdown</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">.md</span>
          </button>

          <button
            onClick={() => handleDownload('txt')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Plain Text</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">.txt</span>
          </button>

          <button
            onClick={() => handleDownload('py')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">Python Script</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">.py</span>
          </button>
        </div>
      )}
    </div>
  );
};
