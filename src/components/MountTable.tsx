import React, { useState, useRef, useEffect } from 'react';
import {
  FolderUp,
  Download,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ArrowUpDown,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileJson,
  RefreshCw,
} from 'lucide-react';
import type { UserMount, SpeciesType, SpecialCapacity, FertilityStatus } from '../types/mount';
import {
  downloadCsvTemplate,
  exportMountsToExcel,
  exportMountsToJson,
  parseExcelFile,
} from '../utils/excelHelper';
import { db } from '../db/mountsDb';
import { ALL_MOUNTS_DATA, getMountsBySpecies } from '../data/allMounts';
import { calculateLevelFromXp, calculateXpForLevel, MAX_MOUNT_XP } from '../data/fuelData';

import { FERTILITY_LABELS, CAPACITY_LABELS, SPECIES_LABELS } from '../data/labels';
export { FERTILITY_LABELS, CAPACITY_LABELS, SPECIES_LABELS } from '../data/labels';

export type NumField = number | '';

export type MountDraft = Omit<
  Partial<UserMount>,
  | 'generation'
  | 'currentLevel'
  | 'currentXp'
  | 'reproductionCount'
  | 'maxReproductions'
  | 'serenity'
  | 'love'
  | 'maturity'
  | 'stamina'
> & {
  generation?: NumField;
  currentLevel?: NumField;
  currentXp?: NumField;
  reproductionCount?: NumField;
  maxReproductions?: NumField;
  serenity?: NumField;
  love?: NumField;
  maturity?: NumField;
  stamina?: NumField;
};

const toNum = (val?: NumField): number => (val === '' || val === undefined ? 0 : Number(val));

interface MountTableProps {
  mounts: UserMount[];
  onDataChanged: () => void;
}

export const MountTable: React.FC<MountTableProps> = ({ mounts, onDataChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados de Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [fertilityFilter, setFertilityFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [genFilter, setGenFilter] = useState<string>('all');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');

  // Ordenación
  const [sortField, setSortField] = useState<keyof UserMount | 'name'>('currentLevel');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Estado del modal de edición / creación manual
  const [editingMount, setEditingMount] = useState<MountDraft | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Importar Excel / CSV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const parsed = await parseExcelFile(file);
      await db.mounts.bulkPut(parsed);
      setStatusMessage({
        type: 'success',
        text: `¡Éxito! Se importaron ${parsed.length} monturas correctamente al establo.`,
      });
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al procesar el archivo Excel. Asegúrate de usar la plantilla oficial.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Limpiar establo completo
  const handleClearAll = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar TODAS las monturas del establo? Esta acción es irreversible.')) return;
    await db.mounts.clear();
    onDataChanged();
  };

  const handleDeleteMount = async (id: string) => {
    const mountToDelete = mounts.find((m) => m.id === id);
    const mountName = mountToDelete?.nickname || mountToDelete?.breed || 'esta montura';
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la montura "${mountName}" del inventario?`)) {
      return;
    }
    await db.mounts.delete(id);
    onDataChanged();
  };

  // Filtrado
  const filteredMounts = mounts.filter((m) => {
    if (speciesFilter !== 'all' && m.species !== speciesFilter) return false;
    if (fertilityFilter !== 'all' && m.fertility !== fertilityFilter) return false;
    if (genderFilter !== 'all' && m.gender !== genderFilter) return false;
    if (genFilter !== 'all' && m.generation !== Number(genFilter)) return false;
    if (capacityFilter !== 'all' && m.capacity !== capacityFilter) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchNick = m.nickname.toLowerCase().includes(term);
      const matchBreed = m.breed.toLowerCase().includes(term);
      const matchNotes = (m.notes || '').toLowerCase().includes(term);
      if (!matchNick && !matchBreed && !matchNotes) return false;
    }

    return true;
  });

  // Ordenado
  const sortedMounts = [...filteredMounts].sort((a, b) => {
    let aVal = a[sortField as keyof UserMount];
    let bVal = b[sortField as keyof UserMount];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }

    return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  const totalPages = Math.ceil(sortedMounts.length / itemsPerPage) || 1;
  const paginatedMounts = sortedMounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Al cambiar búsqueda, filtros u ordenación, volver a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, speciesFilter, fertilityFilter, genderFilter, genFilter, capacityFilter, sortField, sortDirection]);

  // Si tras borrar monturas currentPage > totalPages, ajustarlo a totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (field: keyof UserMount | 'name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Guardar edición o nueva montura
  const handleSaveMount = async () => {
    if (!editingMount || !editingMount.breed || !editingMount.species) return;

    const breedDef = ALL_MOUNTS_DATA.find(
      (d) => d.name === editingMount.breed && d.species === editingMount.species
    );

    const isEsterilOrSenil = editingMount.fertility === 'esteril' || editingMount.fertility === 'senil';

    const currentXp = Math.min(MAX_MOUNT_XP, Math.max(0, toNum(editingMount.currentXp)));
    const currentLevel = Math.min(200, Math.max(1, toNum(editingMount.currentLevel) || calculateLevelFromXp(currentXp)));

    const isNew = !editingMount.id;
    const defaultMaxRepro =
      editingMount.species === 'dragopavo'
        ? 5
        : editingMount.species === 'muluaga'
        ? 4
        : 2;

    const mountData: UserMount = {
      ...editingMount,
      id: editingMount.id || `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: (editingMount.nickname?.trim()) || editingMount.breed,
      definitionId: breedDef ? breedDef.id : `${editingMount.species}_custom`,
      species: editingMount.species as SpeciesType,
      breed: editingMount.breed,
      generation: toNum(editingMount.generation) || (breedDef ? breedDef.generation : 1),
      gender: (editingMount.gender as 'M' | 'F') || 'M',
      currentLevel,
      currentXp,
      fertility: (editingMount.fertility as FertilityStatus) || 'fertil',
      capacity: (editingMount.capacity as SpecialCapacity) || 'ninguna',
      reproductionCount: isNew ? 0 : toNum(editingMount.reproductionCount),
      maxReproductions: isNew ? defaultMaxRepro : (toNum(editingMount.maxReproductions) || defaultMaxRepro),
      serenity: isEsterilOrSenil ? 0 : Math.min(10000, Math.max(-10000, toNum(editingMount.serenity))),
      love: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, toNum(editingMount.love))),
      maturity: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, toNum(editingMount.maturity))),
      stamina: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, toNum(editingMount.stamina))),
      imageUrl: breedDef?.imageUrl || editingMount.imageUrl || '',
      notes: editingMount.notes || '',
      createdAt: editingMount.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await db.mounts.put(mountData);
    setIsEditModalOpen(false);
    setEditingMount(null);
    onDataChanged();
  };

  const handleOpenNewMountModal = () => {
    const defaultSpecies: SpeciesType = 'dragopavo';
    const first = ALL_MOUNTS_DATA.find((m) => m.species === defaultSpecies);
    setEditingMount({
      species: defaultSpecies,
      breed: first?.name || 'Pelirroja',
      generation: first?.generation || 1,
      gender: 'M',
      currentLevel: 1,
      currentXp: 0,
      fertility: 'fertil',
      capacity: 'ninguna',
      reproductionCount: 0,
      maxReproductions: 5,
      serenity: 2000,
      love: 20000,
      maturity: 20000,
      stamina: 20000,
      imageUrl: first?.imageUrl || '',
      notes: '',
    });
    setIsEditModalOpen(true);
  };

  const availableBreedsForModal = editingMount?.species ? getMountsBySpecies(editingMount.species) : [];
  const isEditingEsterilOrSenil = editingMount?.fertility === 'esteril' || editingMount?.fertility === 'senil';

  return (
    <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto relative">
      {/* 1. SECCIÓN SUPERIOR: Botón Seleccionar Archivo y Botón Descargar Plantilla CSV */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Botón Seleccionar Archivo */}
          <label className="cursor-pointer flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100/90 text-[#1e3a8a] font-extrabold text-sm transition shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="sr-only"
            />
            {isUploading ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <FolderUp className="w-5 h-5 text-[#1e3a8a] flex-shrink-0" />
            )}
            <span>Seleccionar archivo</span>
          </label>

          {/* Botón Descargar Plantilla CSV */}
          <button
            onClick={downloadCsvTemplate}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-sm transition shadow-md shadow-blue-950/20"
            title="Descargar plantilla CSV (.csv) universal para Google Sheets y Excel"
          >
            <Download className="w-5 h-5 text-blue-200 flex-shrink-0" />
            <span>Descargar plantilla CSV</span>
          </button>
        </div>

        {/* Acciones de respaldo y exportación discretas */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
          <div className="flex items-center gap-2">
            <span>Plantilla compatible con Google Sheets y Excel.</span>
            {mounts.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-rose-600 hover:text-rose-700 hover:underline font-semibold transition"
              >
                Vaciar establo
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="font-bold text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Exportar datos
            </button>

            {showExportMenu && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 z-30">
                <button
                  onClick={() => {
                    exportMountsToExcel(mounts);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => {
                    exportMountsToJson(mounts);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                >
                  <FileJson className="w-4 h-4 text-blue-600" />
                  <span>JSON (.json)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. ACCIONES RÁPIDAS Y BÚSQUEDA */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between pt-1">
        {/* Barra de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por apodo, color, raza o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
          />
        </div>

        {/* Botón Añadir Montura */}
        <button
          onClick={handleOpenNewMountModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-2xl text-xs font-extrabold transition shadow-sm cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir montura</span>
        </button>
      </div>

      {/* 3. BARRA DE FILTROS */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filtros Activos:
          </span>
          {(speciesFilter !== 'all' ||
            fertilityFilter !== 'all' ||
            genderFilter !== 'all' ||
            genFilter !== 'all' ||
            capacityFilter !== 'all' ||
            searchTerm !== '') && (
            <button
              onClick={() => {
                setSpeciesFilter('all');
                setFertilityFilter('all');
                setGenderFilter('all');
                setGenFilter('all');
                setCapacityFilter('all');
                setSearchTerm('');
              }}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Restablecer
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {/* Especie */}
          <select
            value={speciesFilter}
            onChange={(e) => {
              setSpeciesFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {(Object.keys(SPECIES_LABELS) as SpeciesType[]).map((sp) => (
              <option key={sp} value={sp}>
                {SPECIES_LABELS[sp]}
              </option>
            ))}
          </select>

          {/* Fertilidad */}
          <select
            value={fertilityFilter}
            onChange={(e) => {
              setFertilityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            {(Object.keys(FERTILITY_LABELS) as FertilityStatus[]).map((status) => (
              <option key={status} value={status}>
                {FERTILITY_LABELS[status]}
              </option>
            ))}
          </select>

          {/* Sexo */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="M">Macho (♂)</option>
            <option value="F">Hembra (♀)</option>
          </select>

          {/* Generación */}
          <select
            value={genFilter}
            onChange={(e) => {
              setGenFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
              <option key={g} value={g.toString()}>
                Gen {g}
              </option>
            ))}
          </select>

          {/* Capacidad */}
          <select
            value={capacityFilter}
            onChange={(e) => {
              setCapacityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {(Object.keys(CAPACITY_LABELS) as SpecialCapacity[]).map((cap) => (
              <option key={cap} value={cap}>
                {CAPACITY_LABELS[cap]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. TABLA PRINCIPAL DE MONTURAS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <tr>
                <th
                  onClick={() => handleSort('nickname')}
                  className="py-3 px-3.5 cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Montura</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('species')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Especie / Gen</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('currentLevel')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nivel & XP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fertility')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Fertilidad</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Medidores</th>
                <th className="py-3 px-3">Notas</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedMounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    {mounts.length === 0
                      ? 'Tu establo está vacío. Importa un archivo o pulsa «Añadir montura».'
                      : 'No se encontraron monturas que coincidan con los filtros.'}
                  </td>
                </tr>
              ) : (
                paginatedMounts.map((mount) => {
                  const isReadyForBreeding =
                    mount.fertility !== 'esteril' &&
                    mount.fertility !== 'senil' &&
                    mount.love >= 7500 &&
                    mount.maturity >= 10000 &&
                    mount.stamina >= 7500 &&
                    mount.serenity >= -2000 &&
                    mount.serenity <= 2000;

                  return (
                    <tr
                      key={mount.id}
                      className="hover:bg-blue-50/40 transition group"
                    >
                      {/* Nombre, Raza y Sexo */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs flex-shrink-0 overflow-hidden">
                            <span>🐴</span>
                            {mount.imageUrl && (
                              <img
                                src={mount.imageUrl}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-contain bg-slate-50 p-0.5"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 truncate">
                                {mount.nickname}
                              </span>
                              <span
                                className={`font-bold ${
                                  mount.gender === 'F' ? 'text-rose-500' : 'text-blue-600'
                                }`}
                                aria-label={mount.gender === 'F' ? 'Hembra' : 'Macho'}
                              >
                                {mount.gender === 'F' ? '♀' : '♂'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate font-medium">
                              {mount.breed}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Especie y Generación */}
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800 block">
                          {SPECIES_LABELS[mount.species] || mount.species}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Gen {mount.generation}
                        </span>
                      </td>

                      {/* Nivel y XP */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <span>Nvl {mount.currentLevel}</span>
                          {mount.currentLevel === 200 && (
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {mount.currentXp.toLocaleString()} XP
                        </span>
                      </td>

                      {/* Fertilidad y Capacidad */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              mount.fertility === 'fecunda'
                                ? 'bg-amber-100 text-amber-800'
                                : mount.fertility === 'fertil'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {FERTILITY_LABELS[mount.fertility] || mount.fertility}
                          </span>
                          {mount.capacity !== 'ninguna' && (
                            <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 capitalize font-medium">
                              {CAPACITY_LABELS[mount.capacity] || mount.capacity}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Medidores (Serenidad, Amor, Madurez, Resistencia) */}
                      <td className="py-2.5 px-3">
                        {mount.fertility === 'esteril' || mount.fertility === 'senil' ? (
                          <span className="text-[11px] text-slate-400 italic">No aplicable</span>
                        ) : (
                          <div className="space-y-1 w-28">
                            {/* Serenidad */}
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                              <span>Serenidad:</span>
                              <span
                                className={`font-bold ${
                                  mount.serenity > 0
                                    ? 'text-blue-600'
                                    : mount.serenity < 0
                                    ? 'text-rose-600'
                                    : 'text-slate-600'
                                }`}
                              >
                                {mount.serenity}
                              </span>
                            </div>

                            {/* Amor */}
                            <div
                              className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                              role="img"
                              aria-label={`Amor: ${mount.love}`}
                              title={`Amor: ${mount.love}`}
                            >
                              <div
                                className="bg-rose-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, (mount.love / 20000) * 100)}%` }}
                              />
                            </div>

                            {/* Madurez */}
                            <div
                              className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                              role="img"
                              aria-label={`Madurez: ${mount.maturity}`}
                              title={`Madurez: ${mount.maturity}`}
                            >
                              <div
                                className="bg-purple-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, (mount.maturity / 20000) * 100)}%` }}
                              />
                            </div>

                            {/* Resistencia */}
                            <div
                              className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                              role="img"
                              aria-label={`Resistencia: ${mount.stamina}`}
                              title={`Resistencia: ${mount.stamina}`}
                            >
                              <div
                                className="bg-amber-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, (mount.stamina / 20000) * 100)}%` }}
                              />
                            </div>

                            {isReadyForBreeding && (
                              <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 pt-0.5">
                                <Sparkles className="w-2.5 h-2.5 flex-shrink-0" /> Lista p/ cruce
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Notas */}
                      <td className="py-2.5 px-3 max-w-[120px]">
                        <span className="text-[11px] text-slate-500 truncate block" title={mount.notes}>
                          {mount.notes || '—'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingMount(mount);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar montura"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMount(mount.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Eliminar montura"
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

        {/* 5. BARRA DE PAGINACIÓN */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>
            Página <strong className="text-slate-800">{currentPage}</strong> de{' '}
            <strong className="text-slate-800">{totalPages}</strong> ({filteredMounts.length} monturas)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. MODAL DE EDICIÓN / CREACIÓN MANUAL */}
      {isEditModalOpen && editingMount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Cabecera del Modal */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-extrabold text-slate-900">
                {editingMount.id ? 'Editar Montura' : 'Añadir Nueva Montura'}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMount(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Apodo */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apodo</label>
                <input
                  type="text"
                  value={editingMount.nickname || ''}
                  onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                  placeholder="Ej: Rayito, Furia..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>

              {/* Especie */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Especie</label>
                <select
                  value={editingMount.species}
                  onChange={(e) => {
                    const sp = e.target.value as SpeciesType;
                    const breeds = getMountsBySpecies(sp);
                    const first = breeds[0];
                    setEditingMount({
                      ...editingMount,
                      species: sp,
                      breed: first ? first.name : '',
                      generation: first ? first.generation : 1,
                      imageUrl: first?.imageUrl || '',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {(Object.keys(SPECIES_LABELS) as SpeciesType[]).map((sp) => (
                    <option key={sp} value={sp}>
                      {SPECIES_LABELS[sp]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Raza / Color */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color / Raza</label>
                <select
                  value={editingMount.breed}
                  onChange={(e) => {
                    const br = e.target.value;
                    const def = availableBreedsForModal.find((d) => d.name === br);
                    setEditingMount({
                      ...editingMount,
                      breed: br,
                      generation: def ? def.generation : editingMount.generation,
                      imageUrl: def?.imageUrl || '',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {availableBreedsForModal.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} (Gen {b.generation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sexo */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sexo</label>
                <select
                  value={editingMount.gender}
                  onChange={(e) => setEditingMount({ ...editingMount, gender: e.target.value as 'M' | 'F' })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="M">Macho (♂)</option>
                  <option value="F">Hembra (♀)</option>
                </select>
              </div>

              {/* Fertilidad */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fertilidad</label>
                <select
                  value={editingMount.fertility || 'fertil'}
                  onChange={(e) => {
                    const f = e.target.value as FertilityStatus;
                    setEditingMount({
                      ...editingMount,
                      fertility: f,
                      serenity: f === 'esteril' || f === 'senil' ? 0 : editingMount.serenity,
                      love: f === 'esteril' || f === 'senil' ? 0 : editingMount.love,
                      maturity: f === 'esteril' || f === 'senil' ? 0 : editingMount.maturity,
                      stamina: f === 'esteril' || f === 'senil' ? 0 : editingMount.stamina,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {(Object.keys(FERTILITY_LABELS) as FertilityStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {FERTILITY_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nivel de la montura */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nivel (1-200)</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={editingMount.currentLevel ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingMount({
                      ...editingMount,
                      currentLevel: val === '' ? '' : Number(val),
                    });
                  }}
                  onBlur={() => {
                    const lvl = Math.min(200, Math.max(1, toNum(editingMount.currentLevel) || 1));
                    setEditingMount({
                      ...editingMount,
                      currentLevel: lvl,
                      currentXp: calculateXpForLevel(lvl),
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* XP */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">XP (0 - 867,582)</label>
                <input
                  type="number"
                  min={0}
                  max={MAX_MOUNT_XP}
                  value={editingMount.currentXp ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingMount({
                      ...editingMount,
                      currentXp: val === '' ? '' : Number(val),
                    });
                  }}
                  onBlur={() => {
                    const xp = Math.min(MAX_MOUNT_XP, Math.max(0, toNum(editingMount.currentXp)));
                    setEditingMount({
                      ...editingMount,
                      currentXp: xp,
                      currentLevel: calculateLevelFromXp(xp),
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* Capacidad */}
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Capacidad Especial</label>
                <select
                  value={editingMount.capacity}
                  onChange={(e) => setEditingMount({ ...editingMount, capacity: e.target.value as SpecialCapacity })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {(Object.keys(CAPACITY_LABELS) as SpecialCapacity[]).map((cap) => (
                    <option key={cap} value={cap}>
                      {CAPACITY_LABELS[cap]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medidores (ocultos si estéril o senil) */}
              {!isEditingEsterilOrSenil && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Serenidad (-10k a +10k)</label>
                    <input
                      type="number"
                      min={-10000}
                      max={10000}
                      value={editingMount.serenity ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          serenity: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        const s = Math.min(10000, Math.max(-10000, toNum(editingMount.serenity)));
                        setEditingMount({
                          ...editingMount,
                          serenity: s,
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Amor (0 a 20,000)</label>
                    <input
                      type="number"
                      min={0}
                      max={20000}
                      value={editingMount.love ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          love: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        const l = Math.min(20000, Math.max(0, toNum(editingMount.love)));
                        setEditingMount({
                          ...editingMount,
                          love: l,
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Madurez (0 a 20,000)</label>
                    <input
                      type="number"
                      min={0}
                      max={20000}
                      value={editingMount.maturity ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          maturity: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        const m = Math.min(20000, Math.max(0, toNum(editingMount.maturity)));
                        setEditingMount({
                          ...editingMount,
                          maturity: m,
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Resistencia (0 a 20,000)</label>
                    <input
                      type="number"
                      min={0}
                      max={20000}
                      value={editingMount.stamina ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          stamina: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        const st = Math.min(20000, Math.max(0, toNum(editingMount.stamina)));
                        setEditingMount({
                          ...editingMount,
                          stamina: st,
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </>
              )}

              {/* Notas */}
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Notas / Observaciones</label>
                <textarea
                  value={editingMount.notes || ''}
                  onChange={(e) => setEditingMount({ ...editingMount, notes: e.target.value })}
                  placeholder="Árbol genealógico, camada o recordatorios..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium resize-none"
                />
              </div>
            </div>

            {/* Botones del Modal */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMount(null);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveMount}
                className="px-5 py-2 bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold rounded-xl transition shadow-sm cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
