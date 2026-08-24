import React, { useState } from 'react';
import { GitFork, Heart, Shield, Droplet, Sparkles, HelpCircle } from 'lucide-react';
import type { SpeciesType } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';

export const BreedingHelper: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesType>('dragodinde');
  const [parent1, setParent1] = useState<string>('');
  const [parent2, setParent2] = useState<string>('');

  const catalog = species === 'dragodinde' ? DRAGODINDES_DATA : species === 'muldo' ? MULDOS_DATA : VOLKORNES_DATA;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <GitFork className="w-7 h-7 text-amber-400" />
          Árbol de Cruces & Guía de Hibridaciones
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Consulta cómo obtener cada generación a partir de los cruces de razas puras y combinadas según las guías de Dofus 3.5.
        </p>
      </div>

      {/* Reglas de Serenidad y Jauges */}
      <div className="bg-slate-900/80 rounded-2xl border border-dofus-border p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Guía de Jauges y Serenidad (-5.000 a +5.000)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Amor (Dragofesse)
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Requiere Serenidad &gt; 0</p>
            <p className="text-[11px] text-slate-400">Si está entre 0 y 2.000, sube Amor y Madurez simultáneamente.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Resistencia (Foudroyeur)
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Requiere Serenidad &lt; 0</p>
            <p className="text-[11px] text-slate-400">Si está entre -2.000 y -1, sube Resistencia y Madurez simultáneamente.</p>
          </div>

          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Droplet className="w-4 h-4" /> Madurez (Abreuvoir)
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Entre -2.000 y +2.000</p>
            <p className="text-[11px] text-slate-400">Zona neutra óptima para entrenar madurez.</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> XP (Mangeoire)
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Cualquier Serenidad</p>
            <p className="text-[11px] text-slate-400">Sube de nivel pasivamente a 200 en cualquier estado.</p>
          </div>
        </div>
      </div>

      {/* Catálogo de Recetas de Cruce */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Catálogo Completo de Cruces ({catalog.length} Razas)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {catalog.map((m) => (
            <div key={m.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-dofus-border">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-white">{m.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Gen {m.generation}</span>
              </div>
              {m.parents && (
                <p className="text-[11px] text-amber-400 mt-2 font-mono">
                  Cruzar: {m.parents[0].replace(species + '_', '')} + {m.parents[1].replace(species + '_', '')}
                </p>
              )}
              <div className="mt-2 text-[10px] text-slate-400">
                {m.bonuses.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
