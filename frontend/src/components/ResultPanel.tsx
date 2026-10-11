import React, { useState } from 'react';
import { Copy, Check, Download, Printer, Trash2 } from 'lucide-react';

interface ResultPanelProps {
  title: string;
  subtitle?: string;
  content: string;
  downloadFilename: string;
  isCode?: boolean;
  allowPrint?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  title,
  subtitle,
  content,
  downloadFilename,
  allowPrint = false,
  onClear,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden printable-content">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-border-color flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 no-print">
        <div>
          <h2 className="text-sm font-bold text-text-primary tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {allowPrint && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-slate-200/60 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-50 text-success border border-emerald-200'
                : 'text-text-secondary hover:text-text-primary hover:bg-slate-200/60'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-primary-accent hover:bg-indigo-100 transition-colors border border-indigo-100"
            title={`Download ${downloadFilename}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-colors"
              title="Clear result"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {children ? (
          children
        ) : (
          <pre className="text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-wrap break-words leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[600px] overflow-y-auto">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};
