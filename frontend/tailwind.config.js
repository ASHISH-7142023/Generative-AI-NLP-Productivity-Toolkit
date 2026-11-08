/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FC',
        surface: '#FFFFFF',
        'text-primary': '#172033',
        'text-secondary': '#667085',
        'primary-accent': '#5B5FEF',
        'primary-hover': '#4549D8',
        'border-color': '#E5E7EB',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
        // Dark Mode & High-Contrast Tokens
        'dark-bg': '#0B0F19',
        'dark-surface': '#111827',
        'dark-panel': '#1F2937',
        'dark-border': '#374151',
        'dark-muted': '#9CA3AF',
        'accent-cyan': '#06B6D4',
        'accent-violet': '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        floating: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
