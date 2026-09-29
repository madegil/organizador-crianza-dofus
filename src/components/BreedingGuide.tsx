import React, { useState } from 'react';
import { Sparkles, Heart, Shield, Droplet, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface BreedingGuideProps {
  defaultOpen?: boolean;
}

export const BreedingGuide: React.FC<BreedingGuideProps> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Botón Cabecera / Acordeón */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-xs flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Guía de Medidores y Serenidad (-5.000 a +5.000)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 hidden xs:inline-block">
                Referencia
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              {isOpen
                ? 'Toca para ocultar los medidores de crianza y objetos de cercado'
                : 'Toca para desplegar objetos de cercado, zonas de serenidad y reglas de fecundidad'}
            </p>
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 flex-shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Contenido desplegable */}
      {isOpen && (
        <div className="p-3.5 sm:p-5 pt-0 border-t border-slate-100 space-y-3.5 sm:space-y-4">
          {/* Tarjetas de Medidores Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3">
            {/* Amor: Dragonalgas */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 flex-shrink-0" /> Amor: Dragonalgas
                </span>
                <p className="text-xs text-rose-900 mt-1 font-bold">
                  Requiere Serenidad &gt; 0
                </p>
                <p className="text-[11px] text-rose-700/90 font-medium mt-0.5">
                  Entre 0 y +2.000, sube Amor y Madurez a la vez. Máximo 20.000.
                </p>
              </div>
            </div>

            {/* Resistencia: Fulminador */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" /> Resistencia: Fulminador
                </span>
                <p className="text-xs text-amber-900 mt-1 font-bold">
                  Requiere Serenidad &lt; 0
                </p>
                <p className="text-[11px] text-amber-700/90 font-medium mt-0.5">
                  Entre -2.000 y -1, sube Resistencia y Madurez. Máximo 20.000.
                </p>
              </div>
            </div>

            {/* Madurez: Abrevadero */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 flex-shrink-0" /> Madurez: Abrevadero
                </span>
                <p className="text-xs text-sky-900 mt-1 font-bold">
                  Entre -2.000 y +2.000
                </p>
                <p className="text-[11px] text-sky-700/90 font-medium mt-0.5">
                  Zona neutra óptima. Al llegar a 20.000 la montura ya puede montarse.
                </p>
              </div>
            </div>

            {/* Experiencia / Energía: Pesebre */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> Energía: Pesebre
                </span>
                <p className="text-xs text-purple-900 mt-1 font-bold">
                  Cualquier Serenidad
                </p>
                <p className="text-[11px] text-purple-700/90 font-medium mt-0.5">
                  Aumenta energía para montar o cruzar. Máximo 20.000.
                </p>
              </div>
            </div>
          </div>

          {/* Ajuste de Serenidad */}
          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl text-[11px] sm:text-xs text-slate-600 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-medium">
            <span>• <strong className="text-slate-800 font-bold">Aporreador:</strong> Disminuye la serenidad hacia valores negativos (-5.000 a 0)</span>
            <span>• <strong className="text-slate-800 font-bold">Acariciador:</strong> Aumenta la serenidad hacia valores positivos (0 a +5.000)</span>
          </div>

          {/* Reglas de Fértil vs Fecunda */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 text-[11px] sm:text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong className="font-extrabold text-blue-900">Montura Fértil:</strong> Inicia con medidores en 0 hasta completarlos en 20.000.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                <strong className="font-extrabold text-blue-900">Montura Fecunda:</strong> Los 3 medidores están al 100% (20.000 Amor, Madurez y Energía), lista para cruce.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
