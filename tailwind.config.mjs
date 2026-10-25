/** @type {import('tailwindcss').Config} */

// Tema "Cuaderno del ganadero": pergamino y tinta sobre la madera de un cercado de Amakna.
// `slate` y `blue` se redefinen para que todos los componentes existentes hereden el tema
// sin tener que reescribir cada clase: slate = pergamino → tinta, blue = verde hoja del logo.
const pergaminoTinta = {
  50: '#F4E9CC', // pergamino de los paneles internos
  100: '#ECDDB9',
  200: '#DFCB9F', // bordes
  300: '#C4AC80',
  400: '#9A8361',
  500: '#735D40', // texto secundario (AA sobre pergamino)
  600: '#5E4A30',
  700: '#4D3B25',
  800: '#3A2C1B',
  900: '#2A1F12', // tinta
  950: '#1A130B',
};

const verdeHoja = {
  50: '#EEF5DC',
  100: '#DFEDBD',
  200: '#C6DE8F',
  300: '#A5C95E',
  400: '#88B43A',
  500: '#6A9A22',
  600: '#4A7A12', // botón principal (texto crema AA)
  700: '#3D6610',
  800: '#33550F',
  900: '#2A450D',
  950: '#18290A',
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: '#FBF4E1', // "blanco" = pergamino claro
        slate: pergaminoTinta,
        blue: verdeHoja,
        madera: {
          claro: '#6B4A2B',
          DEFAULT: '#3B2817',
          oscuro: '#25180C',
          veta: '#4A321D',
        },
        kama: {
          DEFAULT: '#F2C14E',
          claro: '#F8DA8C',
          oscuro: '#B8861F',
        },
        noche: '#131209',
        dofus: {
          bg: '#131209',
          card: '#FBF4E1',
          hover: '#F4E9CC',
          border: '#DFCB9F',
          text: '#2A1F12',
          muted: '#735D40',
          gold: '#F2C14E',
          accent: '#6A9A22',
          dragodinde: '#f97316',
          muldo: '#0ea5e9',
          volkorne: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Los números usan la misma fuente con cifras tabulares: más amable que una monoespaciada
        mono: ['"Manrope Variable"', 'Manrope', 'ui-sans-serif', 'sans-serif'],
        display: ['"Lilita One"', 'Manrope', 'ui-sans-serif', 'sans-serif'],
      },
      fontWeight: {
        // Manrope llega hasta 800; evitamos pesos ultra negros
        black: '800',
      },
      transitionTimingFunction: {
        resorte: 'cubic-bezier(0.32, 0.72, 0, 1)',
        rebote: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        pergamino: '0 1px 0 rgb(255 248 228 / 0.6) inset, 0 6px 0 -2px #C4AC80, 0 18px 30px -18px rgb(0 0 0 / 0.7)',
      },
    },
  },
  plugins: [],
};
