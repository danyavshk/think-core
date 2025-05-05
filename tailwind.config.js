/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Material Design palette
        primary: {
          DEFAULT: '#1976d2', // blue 700
          light: '#63a4ff', // blue 400
          dark: '#004ba0', // blue 900
        },
        secondary: {
          DEFAULT: '#9c27b0', // purple 500
          light: '#d05ce3', // purple 300
          dark: '#6a0080', // purple 900
        },
        surface: {
          DEFAULT: '#fff',
          dark: '#121212',
        },
        onSurface: {
          DEFAULT: '#222',
          dark: '#fff',
        },
        error: '#d32f2f',
        success: '#388e3c',
        warning: '#fbc02d',
        info: '#0288d1',
        // Old custom colors for fallback
        dark: '#0C0032',
        darkBlue: '#190061',
        deepBlue: '#240090',
        accentBlue: '#3500D3',
        darkGray: '#282828',
        grayish: '#E0E0E0',
      },
      borderRadius: {
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        material: '0 1px 3px 0 rgba(60,60,60,0.10), 0 1px 2px 0 rgba(60,60,60,0.06)',
        'material-lg': '0 4px 20px 0 rgba(60,60,60,0.18)',
      },
    },
  },
  plugins: [],
}
