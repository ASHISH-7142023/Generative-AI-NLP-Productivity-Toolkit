import React, { useState } from 'react';
import { Copy, Check, Download, ShieldAlert, Terminal } from 'lucide-react';

interface CodeResultProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeResult: React.FC<CodeResultProps> = ({
  code,
  language = 'python',
  filename = 'generated_script.py',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] text-slate-100 overflow-hidden shadow-floating">
      {/* Code Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-xs font-mono text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-primary-accent" />
            <span>{filename}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-indigo-400 border border-slate-700">
            {language}
          </span>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              copied
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-accent hover:bg-primary-hover text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save .py</span>
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-5 overflow-x-auto max-h-[600px] overflow-y-auto">
        <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre font-normal selection:bg-indigo-600/40">
          <code>{code}</code>
        </pre>
      </div>

      {/* Safety Notice Footer */}
      <div className="px-5 py-2.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          Safety Notice: Generated code is not executed automatically. Inspect and test against your dataset in your local Python environment.
        </span>
      </div>
    </div>
  );
};
