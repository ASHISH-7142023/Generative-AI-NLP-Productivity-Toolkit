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
  Layers,
  Cpu,
  CheckCircle2,
  Lock,
  Workflow,
} from 'lucide-react';
import { FeatureCard } from '../../components/FeatureCard';
import { ActiveTab } from '../../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-8">
      {/* High-Performance Hero Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#131131] to-[#1E1B4B] text-white p-6 sm:p-10 shadow-2xl border border-indigo-500/20">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 border border-white/15 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Infosys Springboard Capstone &bull; High Performance NLP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Generative AI</span> Toolkit
            </h2>

            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl">
              Four specialized NLP productivity modules orchestrating OpenAI GPT models through FastAPI. Built for exploratory data analysis, resume generation, interview preparation, and meeting synthesis.
            </p>

            {/* Live Metrics Ticker */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Modules</span>
                </div>
                <div className="text-lg font-bold text-white mt-0.5">4 Active</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security</span>
                </div>
                <div className="text-lg font-bold text-emerald-300 mt-0.5">100% Server</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Execution</span>
                </div>
                <div className="text-lg font-bold text-white mt-0.5">Review-Safe</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('data-analysis')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white hover:opacity-95 transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5"
              >
                <span>Launch Data Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('meeting')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/15 backdrop-blur-md"
              >
                <span>Summarize Meeting Notes</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Pipeline Architecture Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 bg-slate-900/80 border border-indigo-500/30 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live NLP Architecture
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-xs font-bold">
                      01
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Client Payload Request</div>
                      <div className="text-[10px] text-slate-400">Strict Pydantic Input Validation</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold">
                      02
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">FastAPI Orchestration Layer</div>
                      <div className="text-[10px] text-slate-400">gpt-4o-mini &bull; Zero Key Exposure</div>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-indigo-400" />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs font-bold">
                      03
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Review-Only Structured Output</div>
                      <div className="text-[10px] text-slate-400">Python Scripts &bull; ATS Resumes &bull; Q&amp;A</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <div className="pt-2 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Non-Execution Sandbox &bull; Verified Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One-Click Scenario Launch Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Quick Test Scenarios</span>
            <p className="text-xs text-slate-500">Jump directly into capstone validation with pre-configured prompts</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('data-analysis')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors shadow-2xs"
          >
            📊 Titanic Dataset EDA
          </button>
          <button
            onClick={() => onNavigate('resume')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors shadow-2xs"
          >
            📄 Senior Dev Resume
          </button>
          <button
            onClick={() => onNavigate('interview')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors shadow-2xs"
          >
            💡 Java Concurrency Prep
          </button>
          <button
            onClick={() => onNavigate('meeting')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors shadow-2xs"
          >
            📝 Sprint Standup Synthesis
          </button>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Capstone Productivity Modules
            </h3>
            <p className="text-xs text-slate-500">
              Select an intelligent module to trigger server-side NLP workflows
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-indigo-600" />
          <span>Clean 3-Step Lifecycle: Safety &amp; Non-Execution By Design</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">1. Structured Inputs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your dataset description, experience narrative, target programming language, or rough meeting notes with preset support.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">2. Server-Side NLP Orchestration</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              FastAPI validates payloads, applies zero-hallucination domain prompts, and queries OpenAI with strict server-side credentials.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">3. Non-Execution Review &amp; Export</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review highlighted Python scripts or formatted markdown. Code is safely previewed without server execution and exportable to <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">.py</code>.
            </p>
          </div>
        </div>

        {/* Security & Non-Execution Assurance */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Generated code is presented for review only; never automatically executed on the host.</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Client Key Exposure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
