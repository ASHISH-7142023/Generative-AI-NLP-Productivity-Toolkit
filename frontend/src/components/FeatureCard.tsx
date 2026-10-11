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
      className="group relative glass-card glass-card-hover rounded-2xl p-6 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary-accent overflow-hidden transition-all duration-300"
    >
      {/* Top subtle highlight gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Background ambient glow on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:shadow-indigo-500/40 transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80 rounded-full shadow-2xs">
              {badge}
            </span>
          )}
          <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-primary-accent group-hover:bg-indigo-50 transition-colors">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      <div className="mb-2 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600/90">{category}</span>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-accent transition-colors">
          {title}
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed relative z-10">
        {description}
      </p>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-accent relative z-10">
        <span className="group-hover:tracking-wide transition-all">Launch workflow</span>
        <span className="transform transition-transform group-hover:translate-x-1.5">&rarr;</span>
      </div>
    </div>
  );
};
