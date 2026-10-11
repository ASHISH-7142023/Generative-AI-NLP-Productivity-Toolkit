import React, { useState } from 'react';
import { MessageSquare, Sparkles, Play, CheckCircle } from 'lucide-react';
import { apiClient, ApiClientError } from '../../api/client';
import { InputField } from '../../components/InputField';
import { ResultPanel } from '../../components/ResultPanel';
import { LoadingState } from '../../components/LoadingState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { MeetingStyle } from '../../types/api';

const EXAMPLE_CAPSTONE_NOTES = `Max: Profits up 50%
Ruby: New servers are online
Kyle: Need more time to fix software
Walker: Happy to help
Parkman: Beta testing almost done`;

export const MeetingSummarizerPage: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [style, setStyle] = useState<MeetingStyle>('standard');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const loadCapstoneExample = () => {
    setNotes(EXAMPLE_CAPSTONE_NOTES);
    setStyle('standard');
    setError(null);
  };

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!notes.trim()) {
      setError({ message: 'Please provide raw meeting notes to summarize.', code: 'VALIDATION_ERROR' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.summarizeMeeting({
        notes: notes.trim(),
        style,
      });
      setSummaryResult(res.result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: 'An unexpected error occurred while summarizing meeting notes.' });
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
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Module D &bull; Meeting Notes Summarizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Convert Raw Meeting Notes into Executive Summaries
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Extract key updates, blockers, support offers, and action owners while retaining strict factual fidelity.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCapstoneExample}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-border-color text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors shadow-subtle self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-primary-accent" />
          <span>Load Capstone Example</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorMessage
          message={error.message}
          code={error.code}
          onDismiss={() => setError(null)}
          onRetry={() => handleSummarize()}
        />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border-color p-6 shadow-subtle">
          <form onSubmit={handleSummarize} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">
                Raw Meeting Transcript
              </h3>
              <button
                type="button"
                onClick={loadCapstoneExample}
                className="text-[11px] font-semibold text-primary-accent hover:underline"
              >
                Use Assignment Notes
              </button>
            </div>

            <InputField
              label="Meeting Notes / Transcript"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              isTextArea
              rows={7}
              required
              placeholder="Paste raw conversation notes or speaker updates here..."
              helperText="E.g. Speaker: Status / update / blocker..."
            />

            <div className="space-y-1.5">
              <label htmlFor="style-selector" className="block text-xs font-semibold text-text-primary">
                Summary Output Style
              </label>
              <div id="style-selector" className="grid grid-cols-3 gap-2">
                {(['concise', 'standard', 'action-focused'] as MeetingStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStyle(st)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      style === st
                        ? 'bg-indigo-50 border-primary-accent text-primary-accent'
                        : 'bg-white border-border-color text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {st.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-text-secondary space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <span>Faithful Fact Preservation</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The summarizer preserves stated metrics (e.g. 50% profit increase) and speaker names, without inventing deadlines or unrecorded commitments.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !notes.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-accent text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'Synthesizing Notes...' : 'Summarize Meeting'}</span>
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {loading ? (
            <LoadingState
              message="Synthesizing Executive Meeting Summary..."
              submessage="Separating participant updates, blockers, offers of assistance, and action owners."
            />
          ) : summaryResult ? (
            <ResultPanel
              title="Executive Meeting Summary"
              subtitle="Structured summary categorized by overview, updates, blockers, and next steps."
              content={summaryResult}
              downloadFilename="meeting_summary.txt"
              allowPrint
              onClear={() => setSummaryResult(null)}
            >
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans bg-slate-50/60 p-6 rounded-xl border border-slate-200 overflow-y-auto max-h-[600px] whitespace-pre-wrap">
                {summaryResult}
              </div>
            </ResultPanel>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No meeting summary generated yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Paste meeting notes on the left or click &quot;Load Capstone Example&quot; to test the summarizer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
