/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dofus: {
          bg: '#0f1115',
          card: '#161920',
          hover: '#1f242e',
          border: '#28303f',
          text: '#e2e8f0',
          muted: '#94a3b8',
          gold: '#eab308',
          accent: '#38bdf8',
          dragodinde: '#f97316',
          muldo: '#0ea5e9',
          volkorne: '#a855f7',
        }
      }
    },
  },
  plugins: [],
}
