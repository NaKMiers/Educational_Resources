import type { Config } from 'tailwindcss'

export const theme = {
  extend: {
    colors: {
      primary: '#AAD7D9',
      secondary: '#92A5CF',
      dark: '#000000',
      light: '#fff',
      loading: '#334155',
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      body: ['Source Sans Pro', 'sans-serif'],
    },
    spacing: {
      21: '21px',
      '21/2': '10.5px',
    },
    maxWidth: {
      1200: '1200px',
    },
    borderRadius: {
      large: '24px',
      medium: '16px',
      small: '12px',
      'extra-small': '6px',
    },
    backgroundColor: {
      dark: {
        0: '#000000',
        100: '#2f2e3e',
        200: '#003e70',
      },
      light: {
        100: '#f4f4f4',
        200: '#fff',
      },
    },
    textColor: {
      light: '#fff',
      darker: '#003e70',
      dark: '#000',
    },
    boxShadow: {
      'medium-light': '0px 2px 10px 1px rgba(255, 255, 255, 0.1)',
      medium: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
      small: '0px 2px 10px 1px rgba(0, 0, 0, 0.1)',
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    fill: {
      light: '#fff',
    },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      'scale-wiggle': {
        '0%, 100%': { transform: 'rotate(-3deg) scale(1.2)' },
        '50%': { transform: 'rotate(3deg) scale(1.2)' },
      },
    },
    animation: {
      'spin-slow': 'spin 2s linear infinite',
      wiggle: 'wiggle 0.8s ease-in-out infinite',
      'scale-wiggle': 'scale-wiggle 0.8s ease-in-out infinite 0.2s',
    },
  },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme,
  plugins: [],
}
export default config
