/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nostalgic Pastel Color Palette
        primary: {
          50: '#fdf2f8',   // Light pink
          100: '#fce7f3',  // Very light pink
          200: '#fbcfe8',  // Light pink
          300: '#f9a8d4',  // Soft pink
          400: '#f472b6',  // Medium pink
          500: '#ec4899',  // Main pink
          600: '#db2777',  // Dark pink
          700: '#be185d',  // Darker pink
          800: '#9d174d',  // Very dark pink
          900: '#831843',  // Darkest pink
        },
        secondary: {
          50: '#f0f9ff',   // Light blue
          100: '#e0f2fe',  // Very light blue
          200: '#bae6fd',  // Light blue
          300: '#7dd3fc',  // Soft blue
          400: '#38bdf8',  // Medium blue
          500: '#0ea5e9',  // Main blue
          600: '#0284c7',  // Dark blue
          700: '#0369a1',  // Darker blue
          800: '#075985',  // Very dark blue
          900: '#0c4a6e',  // Darkest blue
        },
        accent: {
          50: '#fefce8',   // Light yellow
          100: '#fef9c3',  // Very light yellow
          200: '#fef08a',  // Light yellow
          300: '#fde047',  // Soft yellow
          400: '#facc15',  // Medium yellow
          500: '#eab308',  // Main yellow
          600: '#ca8a04',  // Dark yellow
          700: '#a16207',  // Darker yellow
          800: '#854d0e',  // Very dark yellow
          900: '#713f12',  // Darkest yellow
        },
        warm: {
          50: '#fff7ed',   // Light orange
          100: '#ffedd5',  // Very light orange
          200: '#fed7aa',  // Light orange
          300: '#fdba74',  // Soft orange
          400: '#fb923c',  // Medium orange
          500: '#f97316',  // Main orange
          600: '#ea580c',  // Dark orange
          700: '#c2410c',  // Darker orange
          800: '#9a3412',  // Very dark orange
          900: '#7c2d12',  // Darkest orange
        },
        // Additional nostalgic colors
        lavender: {
          50: '#faf7ff',
          100: '#f3edff',
          200: '#e9d9ff',
          300: '#d6baff',
          400: '#b98cff',
          500: '#9f5cff',
          600: '#8b3dff',
          700: '#7c2dff',
          800: '#6b21a8',
          900: '#581c87',
        },
        mint: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        peach: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd5a5',
          300: '#f8b76d',
          400: '#f59232',
          500: '#f17708',
          600: '#e25e03',
          700: '#bb4a07',
          800: '#973c0e',
          900: '#7a3110',
        }
      },
      fontFamily: {
        // Modern, clean fonts for nostalgic feel
        'sans': ['Nunito Sans', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'nostalgic': ['Georgia', 'Times New Roman', 'serif'],
        'handwriting': ['Kalam', 'Brush Script MT', 'cursive'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'nostalgic': '0 4px 20px -2px rgba(236, 72, 153, 0.1), 0 2px 10px -1px rgba(236, 72, 153, 0.05)',
        'glow': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
