import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Generating with OpenAI...',
  submessage = 'Applying prompt engineering, guardrails, and structure normalization.',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-border-color p-8 text-center flex flex-col items-center justify-center shadow-subtle min-h-[220px]">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary-accent animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <Loader2 className="w-5 h-5 text-primary-accent animate-spin" />
        </div>
      </div>

      <h3 className="text-sm font-bold text-text-primary mb-1">
        {message}
      </h3>
      <p className="text-xs text-text-secondary max-w-sm">
        {submessage}
      </p>
    </div>
  );
};
