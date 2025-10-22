import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D6EFD',
        accent: '#1B6CFF',
        dark: '#0B1F4E',
        light: '#F5F7FB'
      }
    }
  },
  plugins: []
};

export default config;
