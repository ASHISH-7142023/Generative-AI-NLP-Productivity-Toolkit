import React, { useState } from 'react';
import { Send, Sparkles, Building, Briefcase, RefreshCw } from 'lucide-react';
import { InputField } from '../../components/InputField';
import { ResultPanel } from '../../components/ResultPanel';
import { LoadingState } from '../../components/LoadingState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ContentMetrics } from '../../components/ContentMetrics';
import { saveToHistory } from '../../components/HistoryDrawer';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../api/client';

const SAMPLE_JOB_DESCRIPTION = `We are seeking a Senior Full-Stack Engineer to lead the design and implementation of modern AI-powered developer tooling. 
Requirements:
- 4+ years building high-throughput REST APIs with Python/FastAPI.
- Proficiency with modern React, TypeScript, and responsive styling.
- Experience integrating LLM APIs and designing prompt architectures.
- Proven track record delivering scalable microservices with Docker and CI/CD pipelines.`;

const SAMPLE_EXPERIENCE = `Senior Software Engineer with 5 years experience architecting cloud-native web services.
Led redesign of core API platform using FastAPI and Python, reducing p95 latency by 42%. Built interactive React 18 / TypeScript dashboards with Tailwind CSS adopted by 25,000 monthly users. Integrated OpenAI and Anthropic APIs for automated data analysis and code generation workflows. Configured GitHub Actions CI/CD pipelines and Docker containerization.`;

export const CoverLetterTab: React.FC = () => {
  const [experienceText, setExperienceText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const toast = useToast();

  const handleLoadSample = () => {
    setExperienceText(SAMPLE_EXPERIENCE);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setCompanyName('ScaleTech Solutions');
    setTone('enthusiastic');
    toast.show('Sample job & experience loaded into form', 'info');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceText.trim() || !jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<any>('/generate/cover-letter', {
        experience_text: experienceText,
        job_description: jobDescription,
        company_name: companyName || 'Hiring Team',
        tone,
      });

      if (response.data?.success) {
        const text = response.data.result;
        setResult(text);
        saveToHistory('cover-letter', `Cover Letter - ${companyName || 'Hiring Team'}`, text);
        toast.show('Targeted cover letter generated successfully!', 'success');
      } else {
        setError(response.data?.error?.message || 'Failed to generate cover letter.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.message || 'Error communicating with generation API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
        <div>
          <h3 className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
            ATS-Aligned Cover Letter Generator
          </h3>
          <p className="text-xs text-indigo-700/80 dark:text-indigo-400 mt-0.5">
            Craft a targeted cover letter matching your accomplishments directly to the employer's requirements.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700/60 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Load Sample Job & Profile</span>
        </button>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Company / Employer Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Anthropic, Stripe"
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
              <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Writing Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="professional">Professional & Polished (Corporate)</option>
              <option value="enthusiastic">Enthusiastic & High Energy (Startups)</option>
              <option value="executive">Executive & Strategic (Leadership)</option>
              <option value="technical">Technical & Pragmatic (Engineering)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputField
            name="jobDescription"
            label="Target Job Description & Key Requirements"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={7}
            required
            placeholder="Paste target job duties, qualifications, and stack requirements..."
          />

          <InputField
            name="experienceText"
            label="Your Experience & Relevant Accomplishments"
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            rows={7}
            required
            placeholder="Paste your career highlights, tech stack, and quantifiable achievements..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !experienceText.trim() || !jobDescription.trim()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isLoading ? 'Synthesizing Cover Letter...' : 'Generate Tailored Cover Letter'}</span>
          </button>
        </div>
      </form>

      {error && <ErrorMessage message={error} />}

      {isLoading && <LoadingState message="Tailoring your background to job requirements with ATS keyword matching..." />}

      {result && (
        <div className="space-y-3">
          <ContentMetrics content={result} />
          <ResultPanel
            title="Generated Cover Letter"
            subtitle={`Targeted for ${companyName || 'Hiring Team'} (${tone} tone)`}
            content={result}
            downloadFilename={`cover_letter_${companyName ? companyName.toLowerCase().replace(/\s+/g, '_') : 'tailored'}.txt`}
            allowPrint
            onClear={() => setResult(null)}
          />
        </div>
      )}
    </div>
  );
};
