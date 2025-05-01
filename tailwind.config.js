/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            hr: {
              borderColor: '#dcd7be',
              margin: '1rem 0',
            },
            h1: {
              color: '#822000',
              borderBottom: '2px solid #822000',
            },
            h2: {
              color: '#822000',
            },
            table: {
              borderCollapse: 'collapse',
            },
            'th, td': {
              padding: '0.5rem',
              border: '1px solid #dcd7be',
            },
            th: {
              backgroundColor: '#f5f0e0',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 