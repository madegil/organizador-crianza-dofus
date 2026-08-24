import React, { useState } from 'react';
import { GitFork, Heart, Shield, Droplet, Sparkles } from 'lucide-react';
import type { SpeciesType } from '../types/mount';
import { DRAGODINDES_DATA } from '../data/dragodindes';
import { MULDOS_DATA } from '../data/muldos';
import { VOLKORNES_DATA } from '../data/volkornes';
import { ALL_MOUNTS_DATA } from '../data/allMounts';
import { MountAvatar } from './MountAvatar';

export const BreedingHelper: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesType>('dragopavo');

  const catalog = species === 'dragopavo' ? DRAGODINDES_DATA : species === 'muluaga' ? MULDOS_DATA : VOLKORNES_DATA;

  const getParentName = (parentId: string) => {
    const parent = ALL_MOUNTS_DATA.find((m) => m.id === parentId);
    return parent ? parent.name : parentId;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <GitFork className="w-7 h-7 text-amber-400" />
          Árbol de Cruces & Guía de Hibridaciones
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Consulta cómo obtener cada generación a partir de los cruces de razas puras y combinadas según las reglas de Dofus 3.5.
        </p>
      </div>

      {/* Reglas de Serenidad y Medidores */}
      <div className="bg-slate-900/80 rounded-2xl border border-dofus-border p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Guía de Medidores y Serenidad (-5.000 a +5.000)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Amor: Dragonalgas
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Requiere Serenidad mayor a 0</p>
            <p className="text-[11px] text-slate-400">Si está entre 0 y 2.000, sube Amor y Madurez simultáneamente.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Resistencia: Fulminador
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Requiere Serenidad menor a 0</p>
            <p className="text-[11px] text-slate-400">Si está entre -2.000 y -1, sube Resistencia y Madurez simultáneamente.</p>
          </div>

          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Droplet className="w-4 h-4" /> Madurez: Abrevadero
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Entre -2.000 y +2.000</p>
            <p className="text-[11px] text-slate-400">Zona neutra óptima para entrenar madurez.</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Experiencia: Pesebre
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Cualquier Serenidad</p>
            <p className="text-[11px] text-slate-400">Sube de nivel pasivamente a 200 en cualquier estado.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-800/50 rounded-xl text-xs text-slate-300 border border-slate-700 flex items-center justify-between">
          <span>• <strong>Aporreador:</strong> Disminuye la serenidad hacia valores negativos</span>
          <span>• <strong>Acariciador:</strong> Aumenta la serenidad hacia valores positivos</span>
        </div>
      </div>

      {/* Catálogo de Recetas de Cruce */}
      <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-dofus-border pb-3">
          <h2 className="text-lg font-bold text-white">Catálogo Completo de Cruces ({catalog.length} Razas)</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSpecies('dragopavo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                species === 'dragopavo' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Dragopavos
            </button>
            <button
              onClick={() => setSpecies('muluaga')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                species === 'muluaga' ? 'bg-sky-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Muluagas
            </button>
            <button
              onClick={() => setSpecies('vueloceronte')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                species === 'vueloceronte' ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Vuelocerontes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {catalog.map((m) => (
            <div key={m.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-dofus-border hover:border-slate-700 transition space-y-2">
              <div className="flex items-center gap-2.5">
                <MountAvatar
                  species={species}
                  breed={m.name}
                  imageUrl={m.imageUrl}
                  size="sm"
                  generation={m.generation}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white truncate">{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">Gen {m.generation}</span>
                  </div>
                </div>
              </div>
              {m.parents && (
                <p className="text-[11px] text-amber-400 font-mono bg-amber-500/5 p-1.5 rounded border border-amber-500/20">
                  Cruzar: <strong className="text-amber-300">{getParentName(m.parents[0])}</strong> + <strong className="text-amber-300">{getParentName(m.parents[1])}</strong>
                </p>
              )}
              <div className="text-[10px] text-slate-400">
                {m.bonuses.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
