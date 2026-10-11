import React, { useState } from 'react';
import { FileText, Sparkles, Shield, Play } from 'lucide-react';
import { apiClient, ApiClientError } from '../../api/client';
import { InputField } from '../../components/InputField';
import { ResultPanel } from '../../components/ResultPanel';
import { LoadingState } from '../../components/LoadingState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ResumeStyle } from '../../types/api';

export const ResumeGeneratorPage: React.FC = () => {
  const [experience, setExperience] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Python Developer');
  const [style, setStyle] = useState<ResumeStyle>('standard');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [resumeResult, setResumeResult] = useState<string | null>(null);

  const loadSampleProfile = () => {
    setExperience(
      'Ashish Sharma is a Software Engineer with 4 years of experience building scalable backend services. Proficient in Python, FastAPI, Django, PostgreSQL, Docker, and Redis. Led the redesign of the core payment reconciliation pipeline at FinTech Corp, cutting processing latency by 35% across 2M daily transactions. Built asynchronous analytics workers using Celery and Redis. Mentored 3 junior developers and conducted weekly code reviews. Holds a B.Tech in Computer Science from National Institute of Technology (2020).'
    );
    setTargetRole('Lead Backend Engineer');
    setStyle('standard');
    setError(null);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!experience.trim()) {
      setError({ message: 'Please provide a background paragraph describing your experience and skillset.', code: 'VALIDATION_ERROR' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.generateResume({
        experience: experience.trim(),
        target_role: targetRole.trim() || undefined,
        style,
      });
      setResumeResult(res.result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: 'An unexpected error occurred while generating resume.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-primary-accent border border-indigo-100 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Module B &bull; Resume Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Turn Experience Paragraphs into Structured Resumes
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Converts your raw experience, skills, and projects into an executive resume strictly preserving your facts without fabrication.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSampleProfile}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-border-color text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors shadow-subtle self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-primary-accent" />
          <span>Load Sample Profile</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5 text-xs text-text-secondary">
        <Shield className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
        <span>
          <strong>Privacy Note:</strong> Do not enter government identification numbers (SSN, Aadhaar), passwords, or confidential customer data. All processing occurs in-memory.
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorMessage
          message={error.message}
          code={error.code}
          onDismiss={() => setError(null)}
          onRetry={() => handleGenerate()}
        />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border-color p-6 shadow-subtle">
          <form onSubmit={handleGenerate} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary">
              Candidate Background & Experience
            </h3>

            <InputField
              label="Experience & Skillset Paragraph"
              name="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              isTextArea
              rows={6}
              required
              placeholder="Paste or write a paragraph describing your roles, achievements, tools, technologies, and education..."
              helperText="E.g. Ashish has 4 years in Python backend, built payment APIs, managed teams..."
            />

            <InputField
              label="Target Role or Title (Optional)"
              name="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="E.g. Senior Backend Engineer"
            />

            <div className="space-y-1.5">
              <label htmlFor="style-select" className="block text-xs font-semibold text-text-primary">
                Resume Depth Style
              </label>
              <div id="style-select" className="grid grid-cols-3 gap-2">
                {(['concise', 'standard', 'detailed'] as ResumeStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStyle(st)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      style === st
                        ? 'bg-indigo-50 border-primary-accent text-primary-accent'
                        : 'bg-white border-border-color text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !experience.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-accent text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'Synthesizing Resume...' : 'Generate Resume'}</span>
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {loading ? (
            <LoadingState
              message="Formatting Professional Resume..."
              submessage="Organizing summary, technical proficiencies, STAR bullet points, and education."
            />
          ) : resumeResult ? (
            <ResultPanel
              title="Generated Professional Resume"
              subtitle="Formed strictly from your background details. You can copy, export, or print to PDF."
              content={resumeResult}
              downloadFilename="generated_resume.txt"
              allowPrint
              onClear={() => setResumeResult(null)}
            >
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans bg-slate-50/60 p-6 rounded-xl border border-slate-200 overflow-y-auto max-h-[600px] whitespace-pre-wrap">
                {resumeResult}
              </div>
            </ResultPanel>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No resume generated yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Paste your experience paragraph on the left or click &quot;Load Sample Profile&quot; to generate a tailored resume draft.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
