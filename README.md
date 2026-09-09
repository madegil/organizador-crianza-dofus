# 🐉 Gestor de monturas - Crianza & XP Dofus 3.5

Aplicación web **Local-First** moderna desarrollada con **Astro**, **React**, **Tailwind CSS** e **IndexedDB** (`Dexie.js`), optimizada para su despliegue instantáneo en **Vercel**.

Permite organizar y gestionar el inventario de **Dragopavos**, **Muluagas** y **Vuelocerontes**, calcular la experiencia restante hasta el **nivel 200 (867.582 XP)** y planificar el consumo exacto de **carburantes de pesebre** en los cercados de Dofus 3.5.

---

## ✨ Características Principales

1. **Gestor de Inventario & Establo (Local-First):**
   - Tus datos se guardan directamente en el navegador mediante **IndexedDB**.
   - Búsqueda en tiempo real, filtros por especie, generación (1 a 10), estado de fertilidad (*Fértil, Fecunda, Estéril, Senil*), capacidad especial (*Sabia, Enamoradiza, Resistente, Precoz, Reproductora, Camaleón*) y progreso de nivel.

2. **Importación y Exportación Masiva en Excel (.xlsx / .csv):**
   - Sube hojas de cálculo existentes usando `SheetJS` sin necesidad de servidores.
   - Descarga de plantilla oficial en Excel con campos y validaciones en español.
   - Exportación de copias de seguridad en **Excel (.xlsx)** y **JSON**.

3. **Calculadora de XP y Carburantes de Pesebre:**
   - Fórmulas oficiales para los 4 tiers de carburantes (*Extracto, Filtro, Poción, Elixir*).
   - Simulación de durabilidad para variantes: *Minúsculo (1k)*, *Pequeño (2k)*, *Normal (3k)*, *Grande (4k)* y *Gigantesco (5k)*.
   - Soporte para la capacidad **« Sabia »** (XP x2 / tiempo y carburante a la mitad).
   - **Optimización de Cercado por Lotes (hasta 10 monturas):** Calcula el tiempo total y carburantes necesarios para subir en grupo maximizando la rentabilidad.

4. **Matriz de Progreso de Colección (Metas a Nivel 200):**
   - Rastreador visual de las 10 generaciones y más de 300 razas para identificar rápidamente cuáles faltan por conseguir o subir a nivel 200.

5. **Árbol de Cruces y Guía de Medidores:**
   - Catálogo interactivo de fórmulas de hibridación y zonas de serenidad (-5.000 a +5.000) con objetos de cercado (*Pesebre, Abrevadero, Aporreador, Acariciador, Fulminador, Dragonalgas*).

6. **Miniaturas e Iconografía Oficial de Dofus:**
   - Integración de URLs de miniaturas con IDs de Ankama para Dragopavos, Muldos y Vuelocerontes.
   - Sistema híbrido de renderizado en `MountAvatar`: carga de miniaturas oficiales en alta definición con transición suave a sprites vectoriales SVG estilizados como respaldo (*fallback*).

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Astro 4.x/5.x](https://astro.build/)
- **UI & Reactividad:** [React](https://react.dev/) + [Lucide React](https://lucide.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos Local:** [Dexie.js](https://dexie.org/) (IndexedDB)
- **Procesamiento de Excel:** [SheetJS (xlsx)](https://sheetjs.com/)
- **Despliegue:** [Vercel](https://vercel.com/)

---

## 🚀 Instalación y Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/madegil/organizador-crianza-dofus.git
cd organizador-crianza-dofus

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Construir para producción
npm run build
```

---

## ☁️ Despliegue en Vercel

1. Entra a [Vercel Dashboard](https://vercel.com/dashboard).
2. Haz clic en **Add New... -> Project**.
3. Importa el repositorio `madegil/organizador-crianza-dofus`.
4. El preset de Astro se detectará automáticamente. Haz clic en **Deploy**.
