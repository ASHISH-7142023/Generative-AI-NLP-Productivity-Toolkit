import React from 'react';
import {
  BarChart3,
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
} from 'lucide-react';
import { FeatureCard } from '../../components/FeatureCard';
import { ActiveTab } from '../../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white p-8 sm:p-10 shadow-floating">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Infosys Springboard Capstone</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Your AI Productivity Workspace
          </h2>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Accelerate your developer and professional workflows with four purpose-built Generative AI modules. Powered by OpenAI, orchestrated through FastAPI, and crafted for real-world productivity.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('data-analysis')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-indigo-950 hover:bg-indigo-50 transition-all shadow-sm"
            >
              <span>Explore Data Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('meeting')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <span>Summarize Meeting Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Capstone Productivity Modules
            </h3>
            <p className="text-xs text-text-secondary">
              Select a tool to launch its interactive generation workflow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            title="Data Analysis Assistant"
            category="Module A"
            badge="Pandas & Plots"
            description="Generate clean, runnable Python code for exploratory data analysis, statistics, and Matplotlib/Seaborn visualizations."
            icon={BarChart3}
            onOpen={() => onNavigate('data-analysis')}
          />

          <FeatureCard
            title="Resume Generator"
            category="Module B"
            badge="Career"
            description="Transform your raw experience paragraph into a structured, executive-ready resume strictly respecting your facts."
            icon={FileText}
            onOpen={() => onNavigate('resume')}
          />

          <FeatureCard
            title="Interview Questions"
            category="Module C"
            badge="Prep"
            description="Generate targeted technical interview questions calibrated by programming language, difficulty, and optional topic."
            icon={HelpCircle}
            onOpen={() => onNavigate('interview')}
          />

          <FeatureCard
            title="Meeting Summarizer"
            category="Module D"
            badge="Synthesis"
            description="Convert raw conversation notes into an executive summary with distinct speaker updates, blockers, and action owners."
            icon={MessageSquare}
            onOpen={() => onNavigate('meeting')}
          />
        </div>
      </div>

      {/* How it Works & Architecture Guarantees */}
      <div className="bg-white rounded-3xl border border-border-color p-8 shadow-subtle">
        <h3 className="text-base font-bold text-text-primary mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-accent" />
          <span>How It Works: Clean 3-Step Lifecycle</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-primary-accent font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-text-primary">Provide Inputs</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Enter your dataset description, experience narrative, target programming language, or rough meeting notes.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-primary-accent font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-text-primary">Server-Side NLP</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              FastAPI validates inputs, formats strict domain prompts, and sends requests to OpenAI using server credentials.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-primary-accent font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-text-primary">Review & Export</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Review generated Python code or markdown drafts. Copy to clipboard or download as <code className="font-mono text-[10px]">.py</code> or <code className="font-mono text-[10px]">.txt</code>.
            </p>
          </div>
        </div>

        {/* Security & Non-Execution Assurance */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-500" />
            <span>Generated code is presented for review only; never automatically executed on the host.</span>
          </div>
          <div className="flex items-center gap-2 text-primary-accent font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Client Key Exposure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
