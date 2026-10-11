import React, { useState } from 'react';
import { HelpCircle, Sparkles, Play, Code } from 'lucide-react';
import { apiClient, ApiClientError } from '../../api/client';
import { InputField } from '../../components/InputField';
import { ResultPanel } from '../../components/ResultPanel';
import { LoadingState } from '../../components/LoadingState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { InterviewDifficulty } from '../../types/api';

const POPULAR_LANGUAGES = [
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'C++',
  'Go',
  'Rust',
  'SQL',
  'C#',
];

export const InterviewGeneratorPage: React.FC = () => {
  const [language, setLanguage] = useState('Java');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Intermediate');
  const [count, setCount] = useState<number>(5);
  const [topic, setTopic] = useState('Object-Oriented Programming (OOP) & Collections');
  const [includeAnswers, setIncludeAnswers] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadPreset = () => {
    setLanguage('Java');
    setDifficulty('Intermediate');
    setCount(5);
    setTopic('Object-Oriented Programming and JVM Concurrency');
    setIncludeAnswers(true);
    setError(null);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!language.trim()) {
      setError({ message: 'Please select or enter a programming language.', code: 'VALIDATION_ERROR' });
      return;
    }

    if (count < 1 || count > 30) {
      setError({ message: 'Question count must be between 1 and 30.', code: 'VALIDATION_ERROR' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.generateInterviewQuestions({
        language: language.trim(),
        difficulty,
        count,
        topic: topic.trim() || undefined,
        include_answers: includeAnswers,
      });
      setResult(res.result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: 'An unexpected error occurred while generating interview questions.' });
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
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Module C &bull; Interview Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Programming Interview Question Generator
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Generate tailored technical interview questions across languages, topics, and calibrated difficulty tiers.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPreset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-border-color text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors shadow-subtle self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-primary-accent" />
          <span>Load Java Preset</span>
        </button>
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
              Interview Specifications
            </h3>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label htmlFor="language-select" className="block text-xs font-semibold text-text-primary">
                Programming Language <span className="text-danger">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {POPULAR_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      language.toLowerCase() === lang.toLowerCase()
                        ? 'bg-primary-accent text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <input
                id="language-select"
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Or type custom language (e.g. Scala, Kotlin)..."
                required
                className="w-full rounded-xl border border-border-color bg-white px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label htmlFor="difficulty-tier" className="block text-xs font-semibold text-text-primary">
                Difficulty Tier
              </label>
              <div id="difficulty-tier" className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as InterviewDifficulty[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      difficulty === lvl
                        ? 'bg-indigo-50 border-primary-accent text-primary-accent'
                        : 'bg-white border-border-color text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="question-count" className="block text-xs font-semibold text-text-primary">
                  Question Count
                </label>
                <span className="text-xs font-bold text-primary-accent">{count} questions</span>
              </div>
              <input
                id="question-count"
                type="range"
                min="1"
                max="30"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10))}
                className="w-full accent-primary-accent cursor-pointer"
              />
            </div>

            {/* Topic Input */}
            <InputField
              label="Focus Topic or Concept (Optional)"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Memory management, Async/Await, Generics, Microservices"
            />

            {/* Include Answers Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeAnswers}
                onChange={(e) => setIncludeAnswers(e.target.checked)}
                className="w-4 h-4 rounded text-primary-accent focus:ring-primary-accent/30 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">
                Include model answers, hints, and interviewer rubrics
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !language.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-accent text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'Generating Questions...' : `Generate ${count} Questions`}</span>
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {loading ? (
            <LoadingState
              message={`Drafting ${count} ${language} (${difficulty}) Questions...`}
              submessage="Synthesizing conceptual problems, practical code challenges, and evaluator hints."
            />
          ) : result ? (
            <ResultPanel
              title={`${language} Interview Questions (${difficulty})`}
              subtitle={`Set of ${count} technical questions with structured evaluation criteria.`}
              content={result}
              downloadFilename={`${language.toLowerCase()}_interview_questions.txt`}
              onClear={() => setResult(null)}
            >
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans bg-slate-50/60 p-6 rounded-xl border border-slate-200 overflow-y-auto max-h-[600px] whitespace-pre-wrap">
                {result}
              </div>
            </ResultPanel>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Code className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No questions generated yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select your language and question parameters on the left to generate customized interview questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
