import React, { useState } from 'react';
import { BarChart3, Database, Sparkles, FileCode, Play } from 'lucide-react';
import { apiClient, ApiClientError } from '../../api/client';
import { InputField } from '../../components/InputField';
import { CodeResult } from '../../components/CodeResult';
import { LoadingState } from '../../components/LoadingState';
import { ErrorMessage } from '../../components/ErrorMessage';

export const DataAnalysisPage: React.FC = () => {
  const [subTab, setSubTab] = useState<'eda' | 'viz'>('eda');

  // EDA Form state
  const [edaDataset, setEdaDataset] = useState('');
  const [edaFilename, setEdaFilename] = useState('students.csv');
  const [edaGoals, setEdaGoals] = useState('');

  // Visualization Form state
  const [vizDataset, setVizDataset] = useState('');
  const [vizDfName, setVizDfName] = useState('df');
  const [vizGoal, setVizGoal] = useState('');
  const [vizColumns, setVizColumns] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const loadStudentPreset = () => {
    const desc =
      'A student performance dataset containing 500 rows with columns: student_id (int), name (string), gender (category), math_score (0-100 float), science_score (0-100 float), attendance_rate (0.0-1.0 float), and passed (boolean).';
    if (subTab === 'eda') {
      setEdaDataset(desc);
      setEdaFilename('students.csv');
      setEdaGoals('Identify missing scores, examine distribution of math & science marks, and detect attendance outliers.');
    } else {
      setVizDataset(desc);
      setVizDfName('df');
      setVizColumns('math_score, science_score, attendance_rate, passed, gender');
      setVizGoal('Correlation heatmap between numeric metrics, distribution plots of exam scores, and count plot by gender.');
    }
    setError(null);
  };

  const handleGenerateEDA = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!edaDataset.trim()) {
      setError({ message: 'Please provide a dataset description to generate EDA code.', code: 'VALIDATION_ERROR' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.generateEDA({
        dataset_description: edaDataset.trim(),
        filename: edaFilename.trim() || undefined,
        analysis_goals: edaGoals.trim() || undefined,
      });
      setGeneratedCode(res.result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: 'An unexpected error occurred while generating EDA code.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateViz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vizDataset.trim()) {
      setError({ message: 'Please provide a dataset description to generate visualization code.', code: 'VALIDATION_ERROR' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.generateVisualization({
        dataset_description: vizDataset.trim(),
        dataframe_name: vizDfName.trim() || undefined,
        visualization_goal: vizGoal.trim() || undefined,
        columns: vizColumns.trim() || undefined,
      });
      setGeneratedCode(res.result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: 'An unexpected error occurred while generating visualization code.' });
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
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Module A &bull; Data Analysis Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Exploratory Data Analysis & Visualization
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Generate production-ready Python code using Pandas, Matplotlib, and Seaborn from natural language.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStudentPreset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-border-color text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors shadow-subtle self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-primary-accent" />
          <span>Load Sample Dataset</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-border-color flex items-center gap-6">
        <button
          onClick={() => {
            setSubTab('eda');
            setGeneratedCode(null);
            setError(null);
          }}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            subTab === 'eda'
              ? 'text-primary-accent border-b-2 border-primary-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>Pandas EDA Code</span>
          </div>
        </button>

        <button
          onClick={() => {
            setSubTab('viz');
            setGeneratedCode(null);
            setError(null);
          }}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            subTab === 'viz'
              ? 'text-primary-accent border-b-2 border-primary-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            <span>Matplotlib & Seaborn Plots</span>
          </div>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorMessage
          message={error.message}
          code={error.code}
          onDismiss={() => setError(null)}
          onRetry={subTab === 'eda' ? () => handleGenerateEDA() : () => handleGenerateViz()}
        />
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border-color p-6 shadow-subtle">
          {subTab === 'eda' ? (
            <form onSubmit={handleGenerateEDA} className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Dataset & Analysis Parameters
              </h3>

              <InputField
                label="Dataset Description"
                name="edaDataset"
                value={edaDataset}
                onChange={(e) => setEdaDataset(e.target.value)}
                isTextArea
                rows={4}
                required
                placeholder="Describe your dataset, columns, data types, and contents..."
                helperText="E.g. A students dataset with test scores, attendance, and demographics."
              />

              <InputField
                label="CSV Filename or Path (Optional)"
                name="edaFilename"
                value={edaFilename}
                onChange={(e) => setEdaFilename(e.target.value)}
                placeholder="students.csv"
              />

              <InputField
                label="Specific Analysis Goals (Optional)"
                name="edaGoals"
                value={edaGoals}
                onChange={(e) => setEdaGoals(e.target.value)}
                isTextArea
                rows={2}
                placeholder="E.g. Check for missing values, distribution of marks, and duplicate student IDs."
              />

              <button
                type="submit"
                disabled={loading || !edaDataset.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-accent text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{loading ? 'Generating Code...' : 'Generate Pandas EDA Code'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleGenerateViz} className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Visualization Parameters
              </h3>

              <InputField
                label="Dataset Description"
                name="vizDataset"
                value={vizDataset}
                onChange={(e) => setVizDataset(e.target.value)}
                isTextArea
                rows={4}
                required
                placeholder="Describe your dataset and what variables you wish to plot..."
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="DataFrame Var"
                  name="vizDfName"
                  value={vizDfName}
                  onChange={(e) => setVizDfName(e.target.value)}
                  placeholder="df"
                />
                <InputField
                  label="Columns (Optional)"
                  name="vizColumns"
                  value={vizColumns}
                  onChange={(e) => setVizColumns(e.target.value)}
                  placeholder="col1, col2"
                />
              </div>

              <InputField
                label="Visualization Goals (Optional)"
                name="vizGoal"
                value={vizGoal}
                onChange={(e) => setVizGoal(e.target.value)}
                isTextArea
                rows={2}
                placeholder="E.g. Correlation heatmap, histogram of scores, boxplot of outliers."
              />

              <button
                type="submit"
                disabled={loading || !vizDataset.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-accent text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{loading ? 'Generating Code...' : 'Generate Plotting Code'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {loading ? (
            <LoadingState
              message={subTab === 'eda' ? 'Writing Pandas EDA Script...' : 'Constructing Matplotlib & Seaborn Plots...'}
              submessage="Synthesizing data exploration logic, figure sizing, labels, and statistics."
            />
          ) : generatedCode ? (
            <CodeResult
              code={generatedCode}
              language="python"
              filename={subTab === 'eda' ? 'exploratory_data_analysis.py' : 'data_visualization.py'}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <FileCode className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No Python code generated yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Fill in the dataset parameters on the left or click &quot;Load Sample Dataset&quot; to see generated Pandas or Matplotlib code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
