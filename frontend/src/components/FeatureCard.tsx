import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  badge?: string;
  onOpen: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  category,
  icon: Icon,
  badge,
  onOpen,
}) => {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group relative bg-white rounded-2xl border border-border-color p-6 transition-all duration-200 hover:shadow-card hover:border-indigo-200 hover:-translate-y-0.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary-accent"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-primary-accent group-hover:bg-primary-accent group-hover:text-white transition-colors duration-200">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-full">
              {badge}
            </span>
          )}
          <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-primary-accent group-hover:bg-indigo-50 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-xs font-medium text-primary-accent">{category}</span>
        <h3 className="text-base font-bold text-text-primary group-hover:text-primary-accent transition-colors">
          {title}
        </h3>
      </div>

      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-accent">
        <span>Launch workflow</span>
        <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
      </div>
    </div>
  );
};
