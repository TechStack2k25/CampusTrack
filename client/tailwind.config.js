/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo
        accent: '#10B981', // Emerald
        surface: '#FFFFFF',
        background: '#F9FAFB',
        textPrimary: '#111827', // Dark Gray
        textSecondary: '#6B7280',
        borderColor: '#5E7EB',
        error: '#EF4444', // Red
        warning: '#F59E0B', // Amber
      },
    },
  },
  plugins: [],
};
