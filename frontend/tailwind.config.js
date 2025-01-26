/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E7EBFC',
          100: '#C2CCF7',
          200: '#97A8F1',
          300: '#6C83EB',
          400: '#4A66E4',
          500: '#1E3A8A',
          600: '#1A327A',
          700: '#15296A',
          800: '#10205A',
          900: '#0B174A',
        },
        secondary: {
          50: '#F2F3FE',
          100: '#D9DAFC',
          200: '#BFC0FA',
          300: '#A5A6F8',
          400: '#8C8DF5',
          500: '#6366F1',
          600: '#575ADC',
          700: '#4A4FC8',
          800: '#3D43B4',
          900: '#3037A0',
        },
        neutral: {
          50: '#FAFAFB',
          100: '#F7F7F8',
          200: '#F3F4F6',
          300: '#E1E3E8',
          400: '#C9CBD1',
          500: '#B0B3BA',
          600: '#979BA3',
          700: '#7F838C',
          800: '#676B75',
          900: '#4E525E',
        },
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
