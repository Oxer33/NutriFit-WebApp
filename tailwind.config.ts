import type { Config } from 'tailwindcss'

/**
 * ============================================
 * TAILWIND CONFIG - NUTRIFIT DESIGN SYSTEM
 * ============================================
 * 
 * Palette colori dalla richiesta:
 * - Primary: #86A788 (verde salvia)
 * - Background: #FFFDEC (crema chiaro)
 * - Accent Light: #FFE2E2 (rosa chiaro)
 * - Accent: #FFCFCF (rosa)
 */

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // =========== COLORI CUSTOM ===========
      colors: {
        // Colori principali dalla palette fornita
        primary: {
          DEFAULT: '#86A788',
          50: '#F0F4F0',
          100: '#E1E9E1',
          200: '#C3D3C4',
          300: '#A5BDA7',
          400: '#86A788',
          500: '#6B8F6D',
          600: '#557156',
          700: '#3F5340',
          800: '#2A362A',
          900: '#151B15',
        },
        cream: {
          DEFAULT: '#FFFDEC',
          50: '#FFFEF8',
          100: '#FFFDEC',
          200: '#FFF9D6',
          300: '#FFF5C0',
          400: '#FFF1AA',
        },
        rose: {
          light: '#FFE2E2',
          DEFAULT: '#FFCFCF',
          dark: '#FFB3B3',
        },
        // Colori semantici
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
      // =========== TIPOGRAFIA ===========
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      // =========== ANIMAZIONI ===========
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-soft': 'pulseSoft 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      // =========== BACKDROP BLUR (glassmorphism) ===========
      backdropBlur: {
        xs: '2px',
      },
      // =========== SPACING CUSTOM ===========
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // =========== BORDER RADIUS ===========
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // =========== BOX SHADOW ===========
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(134, 167, 136, 0.3)',
        'glow-lg': '0 0 40px rgba(134, 167, 136, 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

export default config
