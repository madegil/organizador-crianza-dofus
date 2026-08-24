import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Trash2, Edit3, CheckCircle, Zap, Shield, Heart, 
  Sparkles, ExternalLink, Calculator, ChevronRight, X 
} from 'lucide-react';
import type { FertilityStatus, SpecialCapacity, SpeciesType, UserMount } from '../types/mount';
import { MAX_MOUNT_XP } from '../data/fuelData';
import { db } from '../db/mountsDb';
import { ALL_MOUNTS_DATA } from '../data/allMounts';

interface MountTableProps {
  mounts: UserMount[];
  onDataChanged: () => void;
  onSelectForEnclos?: (mount: UserMount) => void;
}

export const MountTable: React.FC<MountTableProps> = ({ mounts, onDataChanged, onSelectForEnclos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | SpeciesType>('all');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [fertilityFilter, setFertilityFilter] = useState<string>('all');
  const [level200Filter, setLevel200Filter] = useState<'all' | 'need200' | 'is200'>('all');

  const [selectedMountIds, setSelectedMountIds] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMount, setEditingMount] = useState<Partial<UserMount> | null>(null);

  const filteredMounts = mounts.filter((m) => {
    if (speciesFilter !== 'all' && m.species !== speciesFilter) return false;
    if (generationFilter !== 'all' && m.generation !== Number(generationFilter)) return false;
    if (fertilityFilter !== 'all' && m.fertility !== fertilityFilter) return false;
    if (level200Filter === 'need200' && m.currentLevel >= 200) return false;
    if (level200Filter === 'is200' && m.currentLevel < 200) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = m.nickname.toLowerCase().includes(term);
      const matchBreed = m.breed.toLowerCase().includes(term);
      if (!matchName && !matchBreed) return false;
    }
    return true;
  });

  const toggleSelectMount = (id: string) => {
    const next = new Set(selectedMountIds);
    if (next.has(id)) next.delete(id);
    else {
      if (next.size >= 10) {
        alert('Un cercado de Dofus tiene un límite máximo de 10 monturas.');
        return;
      }
      next.add(id);
    }
    setSelectedMountIds(next);
  };

  const selectAllFiltered = () => {
    const next = new Set<string>();
    for (const m of filteredMounts.slice(0, 10)) {
      next.add(m.id);
    }
    setSelectedMountIds(next);
  };

  const clearSelection = () => {
    setSelectedMountIds(new Set());
  };

  const handleDeleteMount = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta montura del inventario?')) {
      await db.mounts.delete(id);
      onDataChanged();
    }
  };

  const handleSaveMount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMount) return;

    const toSave: UserMount = {
      id: editingMount.id || `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: editingMount.nickname || 'Sin Nombre',
      definitionId: editingMount.definitionId || 'custom',
      species: editingMount.species || 'dragodinde',
      breed: editingMount.breed || 'Personalizada',
      generation: Number(editingMount.generation) || 1,
      gender: (editingMount.gender as 'M' | 'F') || 'M',
      currentLevel: Number(editingMount.currentLevel) || 1,
      currentXp: Number(editingMount.currentXp) || 0,
      fertility: (editingMount.fertility as FertilityStatus) || 'fertile',
      capacity: (editingMount.capacity as SpecialCapacity) || 'none',
      serenity: Number(editingMount.serenity) || 0,
      love: Number(editingMount.love) || 0,
      maturity: Number(editingMount.maturity) || 0,
      stamina: Number(editingMount.stamina) || 0,
      notes: editingMount.notes || '',
      createdAt: editingMount.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await db.mounts.put(toSave);
    setIsEditModalOpen(false);
    setEditingMount(null);
    onDataChanged();
  };

  const getSpeciesBadge = (species: SpeciesType) => {
    switch (species) {
      case 'dragodinde':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">Dragopavo</span>;
      case 'muldo':
        return <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">Muluaga</span>;
      case 'volkorne':
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">Vueloceronte</span>;
    }
  };

  return (
    <div className="bg-dofus-card rounded-2xl border border-dofus-border p-6 shadow-xl space-y-6">
      {/* Barra superior de búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por apodo, raza o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-dofus-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-900/80 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas las Especies</option>
            <option value="dragodinde">Dragopavos</option>
            <option value="muldo">Muluagas</option>
            <option value="volkorne">Vuelocerones</option>
          </select>

          <select
            value={generationFilter}
            onChange={(e) => setGenerationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Generación (Todas)</option>
            {[1,2,3,4,5,6,7,8,9,10].map(g => (
              <option key={g} value={g}>Gen. {g}</option>
            ))}
          </select>

          <select
            value={level200Filter}
            onChange={(e) => setLevel200Filter(e.target.value as any)}
            className="px-3 py-2 bg-slate-900/80 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Estado Nivel 200</option>
            <option value="need200">Faltan por subir a 200</option>
            <option value="is200">Nivel 200 alcanzado</option>
          </select>

          <button
            onClick={() => {
              setEditingMount({
                species: 'dragodinde',
                generation: 1,
                gender: 'M',
                currentLevel: 1,
                currentXp: 0,
                fertility: 'fertile',
                capacity: 'none',
                serenity: 0,
                love: 0,
                maturity: 0,
                stamina: 0,
              });
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Nueva Montura
          </button>
        </div>
      </div>

      {/* Barra de lote para Cercado */}
      {selectedMountIds.size > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>{selectedMountIds.size} de 10 monturas seleccionadas para el cercado</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/calculadora?batch=${Array.from(selectedMountIds).join(',')}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              Calcular Lote en Pesebre
            </a>
            <button
              onClick={clearSelection}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tabla de monturas */}
      <div className="overflow-x-auto rounded-xl border border-dofus-border">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-dofus-border">
            <tr>
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedMountIds.size > 0 && selectedMountIds.size === Math.min(10, filteredMounts.length)}
                  onChange={(e) => e.target.checked ? selectAllFiltered() : clearSelection()}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
                />
              </th>
              <th className="p-3">Montura & Apodo</th>
              <th className="p-3">Especie / Gen</th>
              <th className="p-3">Nivel & Progreso XP</th>
              <th className="p-3">XP Faltante (200)</th>
              <th className="p-3">Fertilidad & Capacidad</th>
              <th className="p-3">Jauges de Cría</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dofus-border/60 bg-dofus-card">
            {filteredMounts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500 text-sm">
                  No se encontraron monturas con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredMounts.map((m) => {
                const xpRemaining = Math.max(0, MAX_MOUNT_XP - m.currentXp);
                const progressPercent = Math.min(100, Math.round((m.currentXp / MAX_MOUNT_XP) * 100));
                const isSelected = selectedMountIds.has(m.id);

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-800/40 transition ${
                      isSelected ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectMount(m.id)}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-bold text-slate-100">{m.nickname}</p>
                          <p className="text-[11px] text-slate-400">{m.breed}</p>
                        </div>
                        <span className={`text-xs ${m.gender === 'F' ? 'text-rose-400' : 'text-sky-400'}`}>
                          {m.gender === 'F' ? '♀' : '♂'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1 items-start">
                        {getSpeciesBadge(m.species)}
                        <span className="text-[11px] text-slate-400">Gen. {m.generation}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-white">Nivel {m.currentLevel}</span>
                          <span className="text-slate-400">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              m.currentLevel >= 200 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-medium">
                      {xpRemaining === 0 ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Max Nivel 200
                        </span>
                      ) : (
                        <span className="text-amber-300">{xpRemaining.toLocaleString()} XP</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          m.fertility === 'feconde' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          m.fertility === 'sterile' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          m.fertility === 'senile' ? 'bg-slate-700 text-slate-300' :
                          'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {m.fertility}
                        </span>
                        {m.capacity !== 'none' && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                            {m.capacity === 'sage' ? '✨ Sage (XP x2)' : m.capacity}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span title="Serenidad" className="text-purple-300 font-mono">{m.serenity}</span>
                        <span className="text-slate-600">|</span>
                        <span title="Amor" className="text-rose-400">♥ {Math.round(m.love/200)}%</span>
                        <span title="Madurez" className="text-sky-400">💧 {Math.round(m.maturity/200)}%</span>
                        <span title="Resistencia" className="text-amber-400">⚡ {Math.round(m.stamina/200)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingMount(m);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMount(m.id)}
                          className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Creación / Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dofus-card border border-dofus-border rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-dofus-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingMount?.id ? 'Editar Montura' : 'Nueva Montura'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Apodo / Nombre</label>
                  <input
                    type="text"
                    required
                    value={editingMount?.nickname || ''}
                    onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Especie</label>
                  <select
                    value={editingMount?.species || 'dragodinde'}
                    onChange={(e) => setEditingMount({ ...editingMount, species: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="dragodinde">Dragopavo</option>
                    <option value="muldo">Muluaga</option>
                    <option value="volkorne">Vueloceronte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Raza / Color</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Marfil, Almendrado y Dorado..."
                    value={editingMount?.breed || ''}
                    onChange={(e) => setEditingMount({ ...editingMount, breed: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Generación (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingMount?.generation || 1}
                    onChange={(e) => setEditingMount({ ...editingMount, generation: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sexo</label>
                  <select
                    value={editingMount?.gender || 'M'}
                    onChange={(e) => setEditingMount({ ...editingMount, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="M">Macho (♂)</option>
                    <option value="F">Hembra (♀)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Capacidad Especial</label>
                  <select
                    value={editingMount?.capacity || 'none'}
                    onChange={(e) => setEditingMount({ ...editingMount, capacity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="none">Ninguna</option>
                    <option value="sage">Sage (XP x2)</option>
                    <option value="amoureuse">Amoureuse (Amor x2)</option>
                    <option value="endurante">Endurante (Resistencia x2)</option>
                    <option value="precoce">Précoce (Madurez x2)</option>
                    <option value="reproducteur">Reproducteur (+1 Cría)</option>
                    <option value="cameleone">Caméléone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel Actual (1-200)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount?.currentLevel || 1}
                    onChange={(e) => setEditingMount({ ...editingMount, currentLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">XP Actual (Max 867.582)</label>
                  <input
                    type="number"
                    min={0}
                    max={867582}
                    value={editingMount?.currentXp || 0}
                    onChange={(e) => setEditingMount({ ...editingMount, currentXp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dofus-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition"
                >
                  Guardar Montura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
