import React from 'react';
import { AlertTriangle, Key, RefreshCw, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  code?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  code,
  onDismiss,
  onRetry,
}) => {
  const isMissingKey = code === 'MISSING_API_KEY';

  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-left shadow-sm transition-all animate-in fade-in duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-red-100 text-danger flex-shrink-0 mt-0.5">
          {isMissingKey ? <Key className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-red-900">
              {isMissingKey ? 'OpenAI API Key Required' : 'Generation Failed'}
            </h4>
            {code && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase bg-red-200/70 text-red-800 rounded-full">
                {code}
              </span>
            )}
          </div>

          <p className="text-xs text-red-800 leading-relaxed mb-3">
            {message}
          </p>

          {isMissingKey && (
            <div className="rounded-xl bg-white border border-red-200 p-3 mb-3 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">Setup Instructions:</p>
              <p>1. Open or create <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700">backend/.env</code></p>
              <p>2. Add your key: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">OPENAI_API_KEY=sk-...</code></p>
              <p>3. Restart the FastAPI server to reload the configuration.</p>
            </div>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-danger text-white hover:bg-red-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-100 transition-colors"
            aria-label="Dismiss error banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
