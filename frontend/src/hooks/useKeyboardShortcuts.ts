import { useEffect } from 'react';
import { ActiveTab } from '../components/Sidebar';
import { useToast } from '../context/ToastContext';

interface UseKeyboardShortcutsProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const useKeyboardShortcuts = ({ onSelectTab }: UseKeyboardShortcutsProps) => {
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      if (e.altKey || (e.ctrlKey && !e.shiftKey)) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            onSelectTab('dashboard');
            toast.info('Switched to Workspace Dashboard');
            break;
          case '2':
            e.preventDefault();
            onSelectTab('data-analysis');
            toast.info('Switched to Data Analysis Assistant');
            break;
          case '3':
            e.preventDefault();
            onSelectTab('resume');
            toast.info('Switched to Resume Generator');
            break;
          case '4':
            e.preventDefault();
            onSelectTab('interview');
            toast.info('Switched to Interview Question Generator');
            break;
          case '5':
            e.preventDefault();
            onSelectTab('meeting');
            toast.info('Switched to Meeting Notes Summarizer');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTab, toast]);
};
