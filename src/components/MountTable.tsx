import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Trash2, Edit3, CheckCircle, Zap, Shield, Heart, 
  Sparkles, ExternalLink, Calculator, ChevronRight, X, Image as ImageIcon 
} from 'lucide-react';
import type { FertilityStatus, SpecialCapacity, SpeciesType, UserMount } from '../types/mount';
import { MAX_MOUNT_XP } from '../data/fuelData';
import { db } from '../db/mountsDb';
import { ALL_MOUNTS_DATA, getMountsBySpecies } from '../data/allMounts';
import { MountAvatar } from './MountAvatar';
import { getFertilityLabel, getFertilityBadgeClasses, getCapacityLabel } from '../utils/badgeHelpers';

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
    
    if (fertilityFilter !== 'all') {
      const normFertility = getFertilityLabel(m.fertility).toLowerCase();
      if (fertilityFilter === 'fertil' && !normFertility.includes('fér') && !normFertility.includes('fer')) return false;
      if (fertilityFilter === 'fecunda' && !normFertility.includes('fec')) return false;
      if (fertilityFilter === 'esteril' && !normFertility.includes('est') && !normFertility.includes('ste')) return false;
      if (fertilityFilter === 'senil' && !normFertility.includes('sen')) return false;
    }

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

  const handleSpeciesChangeInModal = (newSpecies: SpeciesType) => {
    const available = getMountsBySpecies(newSpecies);
    const firstBreed = available[0];
    setEditingMount({
      ...editingMount,
      species: newSpecies,
      breed: firstBreed ? firstBreed.name : 'Personalizada',
      definitionId: firstBreed ? firstBreed.id : 'custom',
      generation: firstBreed ? firstBreed.generation : 1,
      imageUrl: firstBreed?.imageUrl || '',
    });
  };

  const handleBreedChangeInModal = (breedId: string) => {
    const matched = ALL_MOUNTS_DATA.find((m) => m.id === breedId);
    if (matched) {
      setEditingMount({
        ...editingMount,
        breed: matched.name,
        definitionId: matched.id,
        generation: matched.generation,
        imageUrl: matched.imageUrl || '',
      });
    }
  };

  const handleSaveMount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMount) return;

    const toSave: UserMount = {
      id: editingMount.id || `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: editingMount.nickname || 'Sin Nombre',
      definitionId: editingMount.definitionId || 'custom',
      species: editingMount.species || 'dragopavo',
      breed: editingMount.breed || 'Almendrada',
      generation: Number(editingMount.generation) || 1,
      gender: (editingMount.gender as 'M' | 'F') || 'M',
      currentLevel: Number(editingMount.currentLevel) || 1,
      currentXp: Number(editingMount.currentXp) || 0,
      fertility: (editingMount.fertility as FertilityStatus) || 'fertil',
      capacity: (editingMount.capacity as SpecialCapacity) || 'ninguna',
      serenity: Number(editingMount.serenity) || 0,
      love: Number(editingMount.love) || 0,
      maturity: Number(editingMount.maturity) || 0,
      stamina: Number(editingMount.stamina) || 0,
      imageUrl: editingMount.imageUrl || '',
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
      case 'dragopavo':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Dragopavo</span>;
      case 'muluaga':
        return <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">Muluaga</span>;
      case 'vueloceronte':
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">Vueloceronte</span>;
    }
  };

  const availableBreedsForModal = editingMount?.species ? getMountsBySpecies(editingMount.species) : [];

  return (
    <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
      {/* Barra superior de búsqueda y filtros (Totalmente responsive) */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por apodo, raza o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-dofus-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value as any)}
            className="px-2.5 py-2 bg-slate-900/90 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Especies (Todas)</option>
            <option value="dragopavo">Dragopavos</option>
            <option value="muluaga">Muluagas</option>
            <option value="vueloceronte">Vuelocerontes</option>
          </select>

          <select
            value={generationFilter}
            onChange={(e) => setGenerationFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-900/90 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Gen. (Todas)</option>
            {[1,2,3,4,5,6,7,8,9,10].map(g => (
              <option key={g} value={g}>Gen. {g}</option>
            ))}
          </select>

          <select
            value={fertilityFilter}
            onChange={(e) => setFertilityFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-900/90 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Fertilidad (Todas)</option>
            <option value="fertil">Fértil</option>
            <option value="fecunda">Fecunda</option>
            <option value="esteril">Estéril</option>
            <option value="senil">Senil</option>
          </select>

          <select
            value={level200Filter}
            onChange={(e) => setLevel200Filter(e.target.value as any)}
            className="px-2.5 py-2 bg-slate-900/90 border border-dofus-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Nivel (Todos)</option>
            <option value="need200">Faltan a 200</option>
            <option value="is200">Nivel 200 ✓</option>
          </select>

          <button
            onClick={() => {
              const defaultBreeds = getMountsBySpecies('dragopavo');
              const first = defaultBreeds[0];
              setEditingMount({
                species: 'dragopavo',
                breed: first ? first.name : 'Almendrada',
                definitionId: first ? first.id : 'dd_amande',
                generation: first ? first.generation : 1,
                gender: 'M',
                currentLevel: 1,
                currentXp: 0,
                fertility: 'fertil',
                capacity: 'ninguna',
                serenity: 0,
                love: 0,
                maturity: 0,
                stamina: 0,
              });
              setIsEditModalOpen(true);
            }}
            className="col-span-2 sm:col-span-1 sm:ml-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Montura</span>
          </button>
        </div>
      </div>

      {/* Barra de lote para Cercado */}
      {selectedMountIds.size > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span>
            <span>{selectedMountIds.size} de 10 monturas seleccionadas para el cercado</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={`/calculadora?batch=${Array.from(selectedMountIds).join(',')}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              Calcular Lote en Pesebre
            </a>
            <button
              onClick={clearSelection}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
              title="Limpiar selección"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VISTA MÓVIL: Tarjetas de Montura (Visible en pantallas < md) */}
      <div className="block md:hidden space-y-3">
        {filteredMounts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm bg-slate-900/40 rounded-xl border border-dofus-border">
            No se encontraron monturas con los filtros aplicados.
          </div>
        ) : (
          filteredMounts.map((m) => {
            const xpRemaining = Math.max(0, MAX_MOUNT_XP - m.currentXp);
            const progressPercent = Math.min(100, Math.round((m.currentXp / MAX_MOUNT_XP) * 100));
            const isSelected = selectedMountIds.has(m.id);
            const capacityLabel = getCapacityLabel(m.capacity);

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border transition space-y-3 ${
                  isSelected ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900/70 border-dofus-border'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectMount(m.id)}
                      className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <MountAvatar
                      species={m.species}
                      breed={m.breed}
                      imageUrl={m.imageUrl}
                      size="sm"
                      generation={m.generation}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-100 text-xs truncate">{m.nickname}</p>
                        <span className={`text-xs ${m.gender === 'F' ? 'text-rose-400' : 'text-sky-400'}`}>
                          {m.gender === 'F' ? '♀' : '♂'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{m.breed}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingMount(m);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMount(m.id)}
                      className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Barra de nivel y progreso */}
                <div className="space-y-1 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white">Nivel {m.currentLevel} ({progressPercent}%)</span>
                    <span className="text-amber-300 font-mono font-semibold">
                      {xpRemaining === 0 ? 'Max 200 ✓' : `${xpRemaining.toLocaleString()} XP falta`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        m.currentLevel >= 200 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Badges y Medidores */}
                <div className="flex items-center justify-between gap-2 text-[10px] pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${getFertilityBadgeClasses(m.fertility)}`}>
                      {getFertilityLabel(m.fertility)}
                    </span>
                    {capacityLabel && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {capacityLabel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-purple-300 font-mono">S:{m.serenity}</span>
                    <span>♥{Math.round(m.love/200)}%</span>
                    <span>💧{Math.round(m.maturity/200)}%</span>
                    <span>⚡{Math.round(m.stamina/200)}%</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* VISTA ESCRITORIO: Tabla Completa (Visible en md+) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-dofus-border">
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
              <th className="p-3">XP Faltante para Nivel 200</th>
              <th className="p-3">Fertilidad & Capacidad</th>
              <th className="p-3">Medidores de Cría</th>
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
                const capacityLabel = getCapacityLabel(m.capacity);

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
                      <div className="flex items-center gap-3">
                        <MountAvatar
                          species={m.species}
                          breed={m.breed}
                          imageUrl={m.imageUrl}
                          size="md"
                          generation={m.generation}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-100 text-sm">{m.nickname}</p>
                            <span className={`text-xs ${m.gender === 'F' ? 'text-rose-400' : 'text-sky-400'}`}>
                              {m.gender === 'F' ? '♀' : '♂'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{m.breed}</p>
                        </div>
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
                          <span className="text-slate-400 font-mono">{progressPercent}%</span>
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getFertilityBadgeClasses(m.fertility)}`}>
                          {getFertilityLabel(m.fertility)}
                        </span>
                        {capacityLabel && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-medium">
                            {capacityLabel}
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

      {/* Modal de Creación / Edición con Selector de Razas e Imagen */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-dofus-card border border-dofus-border rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-dofus-border pb-3">
              <div className="flex items-center gap-3">
                <MountAvatar
                  species={editingMount?.species || 'dragopavo'}
                  breed={editingMount?.breed || 'Almendrada'}
                  imageUrl={editingMount?.imageUrl}
                  size="md"
                  generation={editingMount?.generation}
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {editingMount?.id ? 'Editar Montura' : 'Nueva Montura'}
                  </h3>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Selecciona la especie y raza oficial para configurar automáticamente su icono y generación.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Especie */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Especie</label>
                  <select
                    value={editingMount?.species || 'dragopavo'}
                    onChange={(e) => handleSpeciesChangeInModal(e.target.value as SpeciesType)}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="dragopavo">Dragopavo (66 Razas)</option>
                    <option value="muluaga">Muluaga (120 Razas)</option>
                    <option value="vueloceronte">Vueloceronte (120 Razas)</option>
                  </select>
                </div>

                {/* Lista desplegable de Razas Oficiales */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Raza Oficial / Color ({availableBreedsForModal.length} disponibles)
                  </label>
                  <select
                    value={editingMount?.definitionId || ''}
                    onChange={(e) => handleBreedChangeInModal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {availableBreedsForModal.map((b) => (
                      <option key={b.id} value={b.id}>
                        Gen. {b.generation} • {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apodo / Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Apodo / Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Made, Trueno..."
                    value={editingMount?.nickname || ''}
                    onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sexo</label>
                  <select
                    value={editingMount?.gender || 'M'}
                    onChange={(e) => setEditingMount({ ...editingMount, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="M">Macho (♂)</option>
                    <option value="F">Hembra (♀)</option>
                  </select>
                </div>

                {/* Nivel Actual */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel Actual (1 a 200)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount?.currentLevel || 1}
                    onChange={(e) => setEditingMount({ ...editingMount, currentLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {/* XP Actual */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">XP Actual (Máx. 867.582)</label>
                  <input
                    type="number"
                    min={0}
                    max={867582}
                    value={editingMount?.currentXp || 0}
                    onChange={(e) => setEditingMount({ ...editingMount, currentXp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {/* Fertilidad */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado de Fertilidad</label>
                  <select
                    value={editingMount?.fertility || 'fertil'}
                    onChange={(e) => setEditingMount({ ...editingMount, fertility: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="fertil">Fértil</option>
                    <option value="fecunda">Fecunda</option>
                    <option value="esteril">Estéril</option>
                    <option value="senil">Senil</option>
                  </select>
                </div>

                {/* Capacidad Especial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Capacidad Especial</label>
                  <select
                    value={editingMount?.capacity || 'ninguna'}
                    onChange={(e) => setEditingMount({ ...editingMount, capacity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ninguna">Ninguna</option>
                    <option value="sabia">Sabia • Duplica ganancia de XP</option>
                    <option value="enamoradiza">Enamoradiza • Duplica ganancia de Amor</option>
                    <option value="resistente">Resistente • Duplica ganancia de Resistencia</option>
                    <option value="precoz">Precoz • Duplica ganancia de Madurez</option>
                    <option value="reproductora">Reproductora • +1 Cría en parto</option>
                    <option value="camaleon">Camaleón</option>
                  </select>
                </div>

                {/* URL de Imagen Personalizada */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    URL de Imagen Personalizada (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/mi-montura.png (dejar vacío para usar imagen estándar)"
                    value={editingMount?.imageUrl || ''}
                    onChange={(e) => setEditingMount({ ...editingMount, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-dofus-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
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
