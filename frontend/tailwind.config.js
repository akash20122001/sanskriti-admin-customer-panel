/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#1a1f37',
          light: '#2d3548',
          dark: '#0f1220',
        },
        // Accent Colors
        accent: {
          blue: '#4F46E5',
          purple: '#7C3AED',
          teal: '#06B6D4',
          amber: '#F59E0B',
          coral: '#F97316',
        },
        // Dark Mode Colors
        dark: {
          bg: {
            primary: '#0F1117',
            secondary: '#1a1f37',
            tertiary: '#252b42',
            elevated: '#2d3548',
          },
          text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            tertiary: '#9CA3AF',
          },
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(79, 70, 229, 0.4)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
