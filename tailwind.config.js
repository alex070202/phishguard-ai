/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06111f',
          900: '#0a1728',
          850: '#0f2036',
          800: '#132944',
        },
        cyber: {
          cyan: '#2dd4ff',
          blue: '#3b82f6',
          green: '#3ddc97',
          red: '#ff5f73',
          amber: '#f5c451',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(45, 212, 255, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
