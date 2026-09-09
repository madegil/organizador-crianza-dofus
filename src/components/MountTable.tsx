import React, { useState, useRef } from 'react';
import {
  Search,
  FolderUp,
  Download,
  Trash2,
  Edit3,
  Plus,
  X,
  Calculator,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  Check,
} from 'lucide-react';
import type { FertilityStatus, SpecialCapacity, SpeciesType, UserMount } from '../types/mount';
import { MAX_MOUNT_XP } from '../data/fuelData';
import { db } from '../db/mountsDb';
import { ALL_MOUNTS_DATA, getMountsBySpecies, findMountByBreedAndSpecies } from '../data/allMounts';
import { MountAvatar } from './MountAvatar';
import { getFertilityLabel, getFertilityBadgeClasses, getCapacityLabel } from '../utils/badgeHelpers';
import {
  downloadExcelTemplate,
  exportMountsToExcel,
  exportMountsToJson,
  parseExcelFile,
} from '../utils/excelHelper';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Manejo de importación de Excel/CSV simplificada
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const parsedMounts = await parseExcelFile(file);
      await db.mounts.bulkPut(parsedMounts);
      setUploadMessage({
        type: 'success',
        text: `¡Éxito! Se importaron ${parsedMounts.length} monturas a la base de datos.`,
      });
      onDataChanged();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadMessage({
        type: 'error',
        text: err.message || 'Error al procesar el archivo Excel.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Filtrado de monturas
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

  const clearSelection = () => {
    setSelectedMountIds(new Set());
  };

  const handleDeleteMount = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta montura del inventario?')) {
      await db.mounts.delete(id);
      const next = new Set(selectedMountIds);
      next.delete(id);
      setSelectedMountIds(next);
      onDataChanged();
    }
  };

  const handleBatchDelete = async () => {
    if (selectedMountIds.size === 0) return;
    if (confirm(`¿Seguro que deseas eliminar las ${selectedMountIds.size} monturas seleccionadas?`)) {
      await db.mounts.bulkDelete(Array.from(selectedMountIds));
      setSelectedMountIds(new Set());
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

    const matchedDef = findMountByBreedAndSpecies(
      editingMount.breed || '',
      editingMount.species || 'dragopavo'
    );

    const toSave: UserMount = {
      id: editingMount.id || `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: editingMount.nickname || 'Sin Nombre',
      definitionId: editingMount.definitionId || matchedDef?.id || 'custom',
      species: editingMount.species || 'dragopavo',
      breed: editingMount.breed || 'Almendrada',
      generation: Number(editingMount.generation) || matchedDef?.generation || 1,
      gender: (editingMount.gender as 'M' | 'F') || 'M',
      currentLevel: Number(editingMount.currentLevel) || 1,
      currentXp: Number(editingMount.currentXp) || 0,
      fertility: (editingMount.fertility as FertilityStatus) || 'fertil',
      capacity: (editingMount.capacity as SpecialCapacity) || 'ninguna',
      serenity: Number(editingMount.serenity) || 0,
      love: Number(editingMount.love) || 0,
      maturity: Number(editingMount.maturity) || 0,
      stamina: Number(editingMount.stamina) || 0,
      imageUrl: editingMount.imageUrl || matchedDef?.imageUrl || '',
      notes: editingMount.notes || '',
      createdAt: editingMount.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await db.mounts.put(toSave);
    setIsEditModalOpen(false);
    setEditingMount(null);
    onDataChanged();
  };

  const openNewMountModal = () => {
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
      serenity: 2000,
      love: 20000,
      maturity: 20000,
      stamina: 20000,
      imageUrl: first?.imageUrl || '',
    });
    setIsEditModalOpen(true);
  };

  const availableBreedsForModal = editingMount?.species ? getMountsBySpecies(editingMount.species) : [];

  return (
    <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto relative">
      {/* 1. SECCIÓN SUPERIOR SIMPLIFICADA: Botones Seleccionar Archivo y Descargar Plantilla */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Botón Seleccionar Archivo (con borde punteado como en la referencia) */}
          <label className="cursor-pointer flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100/90 text-[#1e3a8a] font-extrabold text-sm transition shadow-sm">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            {isUploading ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <FolderUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
            )}
            <span>Seleccionar archivo</span>
          </label>

          {/* Botón Descargar Plantilla (fondo azul sólido como en la referencia) */}
          <button
            onClick={downloadExcelTemplate}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-sm transition shadow-md shadow-blue-950/20"
          >
            <Download className="w-5 h-5 text-blue-200 flex-shrink-0" />
            <span>Descargar plantilla</span>
          </button>
        </div>

        {/* Acciones de respaldo y exportación discretas */}
        <div className="flex items-center justify-between px-1 text-xs text-slate-500">
          <span className="truncate">
            Base de datos local: <strong className="text-slate-800 font-mono">{mounts.length}</strong> monturas
          </span>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Exportar datos</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 text-xs text-slate-700 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    exportMountsToExcel(mounts);
                    setShowExportMenu(false);
                  }}
                  disabled={mounts.length === 0}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Descargar Excel</span>
                </button>
                <button
                  onClick={() => {
                    exportMountsToJson(mounts);
                    setShowExportMenu(false);
                  }}
                  disabled={mounts.length === 0}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <FileJson className="w-4 h-4 text-sky-600" />
                  <span>Backup JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de estado de subida */}
        {uploadMessage && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
              uploadMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {uploadMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span className="flex-1">{uploadMessage.text}</span>
            <button onClick={() => setUploadMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. BUSCADOR Y FILTROS DE BÚSQUEDA MEJORADOS */}
      <div className="space-y-2.5">
        {/* Input Buscador estilo mockup */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar montura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition shadow-inner font-medium"
          />
        </div>

        {/* Fila de Filtros (Pills con iconos y select nativo estéticamente integrado) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Tipo de montura */}
          <div className="relative">
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value as any)}
              className="w-full appearance-none pl-8 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-500 transition cursor-pointer shadow-sm truncate"
            >
              <option value="all">Tipo de montura</option>
              <option value="dragopavo">Dragopavos</option>
              <option value="muluaga">Muluagas</option>
              <option value="vueloceronte">Vuelocerontes</option>
            </select>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">🐴</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Generación */}
          <div className="relative">
            <select
              value={generationFilter}
              onChange={(e) => setGenerationFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-500 transition cursor-pointer shadow-sm truncate"
            >
              <option value="all">Generación</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                <option key={g} value={g}>Gen. {g}</option>
              ))}
            </select>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">⭐</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Fertilidad */}
          <div className="relative">
            <select
              value={fertilityFilter}
              onChange={(e) => setFertilityFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-500 transition cursor-pointer shadow-sm truncate"
            >
              <option value="all">Fertilidad</option>
              <option value="fertil">Fértil</option>
              <option value="fecunda">Fecunda</option>
              <option value="esteril">Estéril</option>
              <option value="senil">Senil</option>
            </select>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">❤️</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Nivel */}
          <div className="relative">
            <select
              value={level200Filter}
              onChange={(e) => setLevel200Filter(e.target.value as any)}
              className="w-full appearance-none pl-8 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-500 transition cursor-pointer shadow-sm truncate"
            >
              <option value="all">Nivel</option>
              <option value="need200">Faltan a 200</option>
              <option value="is200">Nivel 200 ✓</option>
            </select>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">📊</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Barra de conteo y botón Nueva Montura */}
        <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredMounts.length}</strong> de {mounts.length} monturas
          </span>
          <button
            onClick={openNewMountModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva montura</span>
          </button>
        </div>
      </div>

      {/* 3. LISTADO DE MONTURAS CON EL DISEÑO DE TARJETA EN GRID RESPONSIVE (1 COLUMNA EN MÓVIL, 2 EN ESCRITORIO) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
        {filteredMounts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-slate-200">
            No se encontraron monturas con los filtros aplicados.
          </div>
        ) : (
          filteredMounts.map((m) => {
            const isSelected = selectedMountIds.has(m.id);
            const progressPercent = Math.min(100, Math.max(0, Math.round((m.currentXp / MAX_MOUNT_XP) * 100)));
            const matchedDef = ALL_MOUNTS_DATA.find(
              (def) => def.id === m.definitionId || def.name.toLowerCase() === m.breed.toLowerCase()
            );
            const imageUrl = m.imageUrl || matchedDef?.imageUrl;

            return (
              <div
                key={m.id}
                className={`bg-white rounded-2xl p-3.5 sm:p-4 border transition-all shadow-sm hover:shadow-md flex items-center gap-2 sm:gap-4 ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-400/30' : 'border-slate-200'
                }`}
              >
                {/* Columna Izquierda: Checkbox de selección + Botón de Eliminar (cuadrado rojo) */}
                <div className="flex flex-col items-center justify-between gap-3 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectMount(m.id)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title="Seleccionar para lote de cercado"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMount(m.id);
                    }}
                    className="w-7 h-7 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-sm cursor-pointer"
                    title="Eliminar montura"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Columna Imagen / Avatar de Montura */}
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    setEditingMount(m);
                    setIsEditModalOpen(true);
                  }}
                  title="Clic para ver o editar detalles"
                >
                  <MountAvatar
                    species={m.species}
                    breed={m.breed}
                    imageUrl={imageUrl}
                    size="card"
                    generation={m.generation}
                  />
                </div>

                {/* Columna Central: Apodo, Sexo, Raza y Badges */}
                <div
                  className="flex-1 min-w-0 cursor-pointer space-y-1 sm:space-y-1.5"
                  onClick={() => {
                    setEditingMount(m);
                    setIsEditModalOpen(true);
                  }}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight truncate">
                      {m.nickname || m.breed}
                    </h3>
                    <span className={`text-base font-bold ${m.gender === 'F' ? 'text-pink-500' : 'text-blue-600'}`}>
                      {m.gender === 'F' ? '♀' : '♂'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate font-medium">{m.breed}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 pt-0.5">
                    {/* Badge de Fertilidad (ej. 🍃 Fértil) */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 w-fit border border-emerald-200/60">
                      <span>🍃</span>
                      <span>{getFertilityLabel(m.fertility)}</span>
                    </span>

                    {/* Badge Nivel Actual */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 w-fit border border-blue-100">
                      Nivel actual: {m.currentLevel}
                    </span>
                  </div>
                </div>

                {/* Columna Derecha: XP, Barra de Progreso y Medidores (Amor, Madurez, Energía) */}
                <div
                  className="w-32 sm:w-48 flex-shrink-0 text-right space-y-1.5 cursor-pointer"
                  onClick={() => {
                    setEditingMount(m);
                    setIsEditModalOpen(true);
                  }}
                >
                  <div>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-700 font-mono">
                      XP: {m.currentXp.toLocaleString()}
                    </span>
                    <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full overflow-hidden mt-1 border border-slate-300/60">
                      <div
                        className="h-full bg-lime-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Medidores con iconos (Amor, Madurez, Energía) */}
                  <div className="text-[10px] sm:text-[11px] text-slate-600 space-y-0.5 font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-rose-500 text-xs">❤️</span>
                      <span>Amor: {m.love}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-blue-500 text-xs">💧</span>
                      <span>Madurez: {m.maturity}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-amber-500 text-xs">⚡</span>
                      <span>Energía: {m.stamina}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. BARRA FLOTANTE DE LOTE PARA CERCADO CUANDO HAY SELECCIONADAS */}
      {selectedMountIds.size > 0 && (
        <div className="sticky bottom-20 md:bottom-4 z-40 bg-[#1e293b] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span>
            <span>{selectedMountIds.size} de 10 monturas seleccionadas</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={`/calculadora?batch=${Array.from(selectedMountIds).join(',')}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Calculator className="w-4 h-4" />
              <span>Calcular Lote</span>
            </a>
            <button
              onClick={handleBatchDelete}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Eliminar seleccionadas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
            <button
              onClick={clearSelection}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              title="Limpiar selección"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL PARA CREAR O EDITAR MONTURA */}
      {isEditModalOpen && editingMount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>{editingMount.id ? 'Editar Montura' : 'Nueva Montura'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMount(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Apodo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apodo / Nombre</label>
                  <input
                    type="text"
                    required
                    value={editingMount.nickname || ''}
                    onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    placeholder="Ej. AquaDrak"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sexo</label>
                  <select
                    value={editingMount.gender || 'M'}
                    onChange={(e) => setEditingMount({ ...editingMount, gender: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="M">Macho (♂)</option>
                    <option value="F">Hembra (♀)</option>
                  </select>
                </div>

                {/* Especie */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Especie</label>
                  <select
                    value={editingMount.species || 'dragopavo'}
                    onChange={(e) => handleSpeciesChangeInModal(e.target.value as SpeciesType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="dragopavo">Dragopavo</option>
                    <option value="muluaga">Muluagas</option>
                    <option value="vueloceronte">Vueloceronte</option>
                  </select>
                </div>

                {/* Raza / Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Raza / Color</label>
                  <select
                    value={editingMount.definitionId || ''}
                    onChange={(e) => handleBreedChangeInModal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {availableBreedsForModal.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (Gen {b.generation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nivel Actual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nivel Actual (1-200)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount.currentLevel || 1}
                    onChange={(e) => setEditingMount({ ...editingMount, currentLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* XP Actual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">XP Actual (Max 867.582)</label>
                  <input
                    type="number"
                    min={0}
                    max={MAX_MOUNT_XP}
                    value={editingMount.currentXp || 0}
                    onChange={(e) => setEditingMount({ ...editingMount, currentXp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Fertilidad */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fertilidad</label>
                  <select
                    value={editingMount.fertility || 'fertil'}
                    onChange={(e) => setEditingMount({ ...editingMount, fertility: e.target.value as FertilityStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="fertil">Fértil</option>
                    <option value="fecunda">Fecunda</option>
                    <option value="esteril">Estéril</option>
                    <option value="senil">Senil</option>
                  </select>
                </div>

                {/* Capacidad Especial */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacidad Especial</label>
                  <select
                    value={editingMount.capacity || 'ninguna'}
                    onChange={(e) => setEditingMount({ ...editingMount, capacity: e.target.value as SpecialCapacity })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ninguna">Ninguna</option>
                    <option value="sabia">Sabia (x2 XP)</option>
                    <option value="enamoradiza">Enamoradiza</option>
                    <option value="resistente">Resistente</option>
                    <option value="precoz">Precoz</option>
                    <option value="reproductora">Reproductora</option>
                    <option value="camaleon">Camaleón</option>
                  </select>
                </div>

                {/* Medidores (Amor, Madurez, Energía) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amor (0 - 20.000)</label>
                  <input
                    type="number"
                    min={0}
                    max={20000}
                    value={editingMount.love ?? 20000}
                    onChange={(e) => setEditingMount({ ...editingMount, love: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Madurez (0 - 20.000)</label>
                  <input
                    type="number"
                    min={0}
                    max={20000}
                    value={editingMount.maturity ?? 20000}
                    onChange={(e) => setEditingMount({ ...editingMount, maturity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Energía / Resistencia (0 - 20.000)</label>
                  <input
                    type="number"
                    min={0}
                    max={20000}
                    value={editingMount.stamina ?? 20000}
                    onChange={(e) => setEditingMount({ ...editingMount, stamina: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Serenidad (-5000 a +5000)</label>
                  <input
                    type="number"
                    min={-5000}
                    max={5000}
                    value={editingMount.serenity ?? 0}
                    onChange={(e) => setEditingMount({ ...editingMount, serenity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Botones del Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMount(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md"
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
