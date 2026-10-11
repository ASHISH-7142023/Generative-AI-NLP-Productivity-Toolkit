import React, { useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { HealthResponse } from './types/api';
import { AppHeader } from './components/AppHeader';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { DataAnalysisPage } from './features/data-analysis/DataAnalysisPage';
import { ResumeGeneratorPage } from './features/resume/ResumeGeneratorPage';
import { InterviewGeneratorPage } from './features/interview/InterviewGeneratorPage';
import { MeetingSummarizerPage } from './features/meeting/MeetingSummarizerPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkServer = async () => {
      try {
        const res = await apiClient.getHealth();
        if (isMounted) {
          setHealth(res);
          setHealthError(false);
        }
      } catch (err) {
        if (isMounted) {
          setHealthError(true);
        }
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <AppHeader
        health={health}
        healthError={healthError}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'data-analysis' && <DataAnalysisPage />}
          {activeTab === 'resume' && <ResumeGeneratorPage />}
          {activeTab === 'interview' && <InterviewGeneratorPage />}
          {activeTab === 'meeting' && <MeetingSummarizerPage />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-color bg-white py-6 px-4 sm:px-6 lg:px-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
          <div>
            <p>
              &copy; {new Date().getFullYear()} Generative AI NLP Productivity Toolkit &bull; Infosys Springboard Capstone
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by OpenAI &amp; FastAPI</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500">
              AI Output Disclaimer: Generated content should be reviewed before production use.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
