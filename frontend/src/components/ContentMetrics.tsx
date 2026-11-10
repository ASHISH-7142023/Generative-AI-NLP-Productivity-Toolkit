import React, { useMemo } from 'react';
import { BookOpen, FileText, AlignLeft, Hash } from 'lucide-react';

interface ContentMetricsProps {
  content: string;
  className?: string;
}

export const ContentMetrics: React.FC<ContentMetricsProps> = ({ content, className = '' }) => {
  const metrics = useMemo(() => {
    if (!content) {
      return { words: 0, characters: 0, lines: 0, readingTimeMinutes: 0 };
    }

    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = content.length;
    const lines = content.split('\n').length;
    // Standard reading speed: ~200 words per minute
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return { words, characters, lines, readingTimeMinutes };
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={`inline-flex items-center flex-wrap gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 font-medium ${className}`}
    >
      <span className="flex items-center gap-1" title="Word count">
        <AlignLeft className="w-3 h-3 text-indigo-500" />
        <span>{metrics.words.toLocaleString()} words</span>
      </span>

      <span className="text-slate-300 dark:text-slate-600">•</span>

      <span className="flex items-center gap-1" title="Character count">
        <Hash className="w-3 h-3 text-blue-500" />
        <span>{metrics.characters.toLocaleString()} chars</span>
      </span>

      <span className="text-slate-300 dark:text-slate-600">•</span>

      <span className="flex items-center gap-1" title="Line count">
        <FileText className="w-3 h-3 text-emerald-500" />
        <span>{metrics.lines} lines</span>
      </span>

      <span className="text-slate-300 dark:text-slate-600">•</span>

      <span className="flex items-center gap-1" title="Estimated reading time">
        <BookOpen className="w-3 h-3 text-amber-500" />
        <span>~{metrics.readingTimeMinutes} min read</span>
      </span>
    </div>
  );
};

