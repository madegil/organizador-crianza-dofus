import { getDefaultMaxReproductions } from '../utils/mountRules';
import React, { useState, useRef, useEffect, useId } from 'react';
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
  parseBackupFile,
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
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);

  const fileInputId = useId();
  const searchInputId = useId();
  const modalTitleId = useId();
  const speciesId = useId();
  const breedId = useId();
  const nicknameId = useId();
  const genderLabelId = useId();
  const genderMachoId = useId();
  const levelId = useId();
  const xpId = useId();
  const fertilityId = useId();
  const capacityId = useId();
  const serenityId = useId();
  const loveId = useId();
  const maturityId = useId();
  const staminaId = useId();
  const notesId = useId();

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

  const getAriaSort = (field: keyof UserMount | 'name'): 'ascending' | 'descending' | 'none' => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    return 'none';
  };

  // Accesibilidad Modal: Foco al primer campo al abrir y devolverlo al botón que lo abrió
  useEffect(() => {
    if (isEditModalOpen) {
      firstFieldRef.current?.focus();
    } else if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
  }, [isEditModalOpen]);

  // Accesibilidad Modal: Cerrar con Escape
  useEffect(() => {
    if (!isEditModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditModalOpen(false);
        setEditingMount(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditModalOpen]);

  // Accesibilidad Menú Exportar: Cerrar con Escape y al hacer clic fuera
  useEffect(() => {
    if (!showExportMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showExportMenu]);

  // Importar Excel / CSV / JSON
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const isJson = file.name.toLowerCase().endsWith('.json');

      if (isJson) {
        const { mounts: backupMounts, invalid } = await parseBackupFile(file);
        const currentIds = new Set(mounts.map((m) => m.id));
        const existingCount = backupMounts.filter((m) => currentIds.has(m.id)).length;

        if (existingCount > 0) {
          const confirmed = window.confirm(
            `Se restaurarán ${backupMounts.length} monturas; las que ya existen con el mismo id se sobrescribirán. ¿Continuar?`
          );
          if (!confirmed) {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }
        }

        await db.mounts.bulkPut(backupMounts);
        setStatusMessage({
          type: 'success',
          text: `Se importaron ${backupMounts.length} monturas, 0 omitidas por duplicadas y ${invalid} inválidas.`,
        });
        onDataChanged();
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Si es hoja de cálculo (.xlsx, .xls, .csv)
      const parsedMounts = await parseExcelFile(file);

      const getFingerprint = (m: { nickname: string; species: string; breed: string; generation: number; gender: string }) =>
        `${m.nickname}|${m.species}|${m.breed}|${m.generation}|${m.gender}`.toLowerCase();

      const currentFingerprints = new Set(mounts.map(getFingerprint));
      const duplicates = parsedMounts.filter((m) => currentFingerprints.has(getFingerprint(m)));
      let toImport = parsedMounts;
      let duplicatesOmitted = 0;

      if (duplicates.length > 0) {
        const importOnlyNew = window.confirm(
          `${duplicates.length} de ${parsedMounts.length} filas parecen ya existir. ¿Importar solo las nuevas?`
        );
        if (importOnlyNew) {
          toImport = parsedMounts.filter((m) => !currentFingerprints.has(getFingerprint(m)));
          duplicatesOmitted = duplicates.length;
        } else {
          const importAll = window.confirm(
            '¿Importar todas de todos modos? Se crearán duplicados.'
          );
          if (importAll) {
            toImport = parsedMounts;
            duplicatesOmitted = 0;
          } else {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setStatusMessage({
              type: 'error',
              text: 'Importación cancelada',
            });
            return;
          }
        }
      }

      await db.mounts.bulkPut(toImport);
      setStatusMessage({
        type: 'success',
        text: `Se importaron ${toImport.length} monturas, ${duplicatesOmitted} omitidas por duplicadas.`,
      });
      onDataChanged();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error al procesar el archivo. Revisa el formato e inténtalo de nuevo.',
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
    try {
      await db.mounts.clear();
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error al vaciar el establo.',
      });
    }
  };

  const handleRemoveSampleMounts = async () => {
    const sampleMounts = mounts.filter((m) => m.id.startsWith('sample-'));
    if (sampleMounts.length === 0) return;

    const nicknames = sampleMounts.map((m) => m.nickname || m.breed || 'Sin Nombre').join(', ');
    const confirmed = window.confirm(
      `Se eliminarán las siguientes monturas de ejemplo:\n${nicknames}\n\nSi editaste alguna para usarla como real, cancela y renómbrala primero.`
    );
    if (!confirmed) return;

    try {
      await db.mounts.bulkDelete(sampleMounts.map((m) => m.id));
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error al eliminar las monturas de ejemplo.',
      });
    }
  };

  const handleDeleteMount = async (id: string) => {
    const mountToDelete = mounts.find((m) => m.id === id);
    const mountName = mountToDelete?.nickname || mountToDelete?.breed || 'esta montura';

    if (!window.confirm(`¿Seguro que deseas eliminar a "${mountName}" de tu establo?`)) return;

    try {
      await db.mounts.delete(id);
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error al eliminar la montura.',
      });
    }
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, speciesFilter, fertilityFilter, genderFilter, genFilter, capacityFilter, sortField, sortDirection]);

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

  const handleSaveMount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMount || !editingMount.breed) return;

    const breedDef = ALL_MOUNTS_DATA.find(
      (d) => d.name === editingMount.breed && d.species === editingMount.species
    );

    const isEsterilOrSenil = editingMount.fertility === 'esteril' || editingMount.fertility === 'senil';

    const currentXp = Math.min(MAX_MOUNT_XP, Math.max(0, toNum(editingMount.currentXp)));
    const currentLevel = Math.min(200, Math.max(1, toNum(editingMount.currentLevel) || calculateLevelFromXp(currentXp)));

    const isNew = !editingMount.id;
    const defaultMaxRepro = getDefaultMaxReproductions(editingMount.species);

    const isSample = typeof editingMount.id === 'string' && editingMount.id.startsWith('sample-');
    const oldId = editingMount.id;
    const newId = isSample
      ? `mount_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
      : (editingMount.id || `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const mountData: UserMount = {
      ...editingMount,
      id: newId,
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

    try {
      if (isSample && oldId) {
        await db.transaction('rw', db.mounts, async () => {
          await db.mounts.delete(oldId);
          await db.mounts.put(mountData);
        });
      } else {
        await db.mounts.put(mountData);
      }
      setIsEditModalOpen(false);
      setEditingMount(null);
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error al guardar la montura en la base de datos.',
      });
    }
  };

  const handleOpenNewMountModal = (triggerEl?: HTMLElement) => {
    if (triggerEl) {
      lastActiveElementRef.current = triggerEl;
    }
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

  const isEditingEsterilOrSenil = editingMount?.fertility === 'esteril' || editingMount?.fertility === 'senil';

  return (
    <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-2xl border border-slate-200/90 space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto relative">
      {/* 1. SECCIÓN SUPERIOR: Botón Seleccionar Archivo y Botón Descargar Plantilla CSV */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Botón Seleccionar Archivo */}
          <div className="flex flex-col gap-1">
            <label htmlFor={fileInputId} className="cursor-pointer flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100/90 text-[#1e3a8a] font-extrabold text-sm transition shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <input
                id={fileInputId}
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls,.csv,.json"
                className="sr-only"
              />
              {isUploading ? (
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              ) : (
                <FolderUp className="w-5 h-5 text-[#1e3a8a] flex-shrink-0" />
              )}
              <span>Seleccionar archivo</span>
            </label>
            <p className="text-[11px] text-slate-500 text-center">
              Acepta .xlsx, .xls, .csv y backup .json
            </p>
          </div>

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

          <div ref={exportMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              aria-expanded={showExportMenu}
              aria-haspopup="menu"
              className="font-bold text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Exportar datos
            </button>

            {showExportMenu && (
              <div role="menu" className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 z-30">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportMountsToExcel(mounts);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportMountsToJson(mounts);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium cursor-pointer"
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
            role={statusMessage.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button type="button" onClick={() => setStatusMessage(null)} aria-label="Cerrar">
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
            id={searchInputId}
            type="text"
            aria-label="Buscar por apodo, color, raza o notas"
            placeholder="Buscar por apodo, color, raza o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
          />
        </div>

        {/* Botón Añadir Montura */}
        <button
          type="button"
          onClick={(e) => handleOpenNewMountModal(e.currentTarget)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-2xl text-xs font-extrabold transition shadow-sm cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir montura</span>
        </button>
      </div>

      {/* 3. BARRA DE FILTROS */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
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
              type="button"
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
            aria-label="Filtrar por especie"
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
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
            aria-label="Filtrar por fertilidad"
            value={fertilityFilter}
            onChange={(e) => setFertilityFilter(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {(Object.keys(FERTILITY_LABELS) as FertilityStatus[]).map((fert) => (
              <option key={fert} value={fert}>
                {FERTILITY_LABELS[fert]}
              </option>
            ))}
          </select>

          {/* Sexo */}
          <select
            aria-label="Filtrar por sexo"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="M">Macho (♂)</option>
            <option value="F">Hembra (♀)</option>
          </select>

          {/* Generación */}
          <select
            aria-label="Filtrar por generación"
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
              <option key={g} value={g}>
                Gen {g}
              </option>
            ))}
          </select>

          {/* Capacidad */}
          <select
            aria-label="Filtrar por capacidad"
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
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

      {/* Aviso de monturas de ejemplo */}
      {mounts.some((m) => m.id.startsWith('sample-')) && (
        <div className="p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 bg-amber-50 text-amber-800 border border-amber-200">
          <span>Tienes monturas de ejemplo en tu establo</span>
          <button
            onClick={handleRemoveSampleMounts}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex-shrink-0"
          >
            Quitar ejemplos
          </button>
        </div>
      )}

      {/* 4. TABLA PRINCIPAL DE MONTURAS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <tr>
                <th
                  aria-sort={getAriaSort('nickname')}
                  className="py-3 px-3.5 text-left"
                >
                  <button
                    type="button"
                    onClick={() => handleSort('nickname')}
                    className="flex items-center gap-1.5 hover:text-slate-800 transition font-bold uppercase tracking-wider text-[11px] text-inherit cursor-pointer"
                  >
                    <span>Nombre / Raza</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th
                  aria-sort={getAriaSort('generation')}
                  className="py-3 px-3 text-left"
                >
                  <button
                    type="button"
                    onClick={() => handleSort('generation')}
                    className="flex items-center gap-1.5 hover:text-slate-800 transition font-bold uppercase tracking-wider text-[11px] text-inherit cursor-pointer"
                  >
                    <span>Gen</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th
                  aria-sort={getAriaSort('currentLevel')}
                  className="py-3 px-3 text-left"
                >
                  <button
                    type="button"
                    onClick={() => handleSort('currentLevel')}
                    className="flex items-center gap-1.5 hover:text-slate-800 transition font-bold uppercase tracking-wider text-[11px] text-inherit cursor-pointer"
                  >
                    <span>Nivel / XP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th
                  aria-sort={getAriaSort('fertility')}
                  className="py-3 px-3 text-left"
                >
                  <button
                    type="button"
                    onClick={() => handleSort('fertility')}
                    className="flex items-center gap-1.5 hover:text-slate-800 transition font-bold uppercase tracking-wider text-[11px] text-inherit cursor-pointer"
                  >
                    <span>Fertilidad</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3">Medidores</th>
                <th className="py-3 px-3">Notas</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedMounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-600 text-sm">
                    {mounts.length === 0
                      ? 'Tu establo está vacío. Importa un archivo o pulsa «Añadir montura».'
                      : 'No se encontraron monturas que coincidan con los filtros.'}
                  </td>
                </tr>
              ) : (
                paginatedMounts.map((mount) => {
                  const isReadyToBreed =
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
                      className="hover:bg-slate-50/80 transition-colors group text-slate-700"
                    >
                      {/* Nombre, Raza y Sexo */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs flex-shrink-0 overflow-hidden">
                            {mount.imageUrl ? (
                              <>
                                <img
                                  src={mount.imageUrl}
                                  alt=""
                                  loading="lazy"
                                  className="w-full h-full object-contain p-0.5"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                    if (fallback) fallback.style.display = 'inline';
                                  }}
                                />
                                <span style={{ display: 'none' }}>🐴</span>
                              </>
                            ) : (
                              <span>🐴</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 truncate">
                                {mount.nickname}
                              </span>
                              <span
                                role="img"
                                aria-label={mount.gender === 'M' ? 'Macho' : 'Hembra'}
                                className={`text-[10px] font-bold ${
                                  mount.gender === 'M' ? 'text-blue-600' : 'text-rose-500'
                                }`}
                              >
                                {mount.gender === 'M' ? '♂' : '♀'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {mount.breed}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Generación */}
                      <td className="py-2.5 px-3 font-semibold text-slate-600">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[11px]">
                          G{mount.generation}
                        </span>
                      </td>

                      {/* Nivel y XP */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold font-mono ${
                              mount.currentLevel >= 200 ? 'text-emerald-600 font-extrabold' : 'text-slate-800'
                            }`}
                          >
                            Nvl {mount.currentLevel}
                          </span>
                          {mount.currentLevel >= 200 && (
                            <Sparkles className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-slate-600 font-mono block">
                          {mount.currentXp.toLocaleString()} XP
                        </span>
                      </td>

                      {/* Fertilidad y Capacidad */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              mount.fertility === 'fecunda'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : mount.fertility === 'esteril'
                                ? 'bg-slate-200 text-slate-600'
                                : mount.fertility === 'senil'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {FERTILITY_LABELS[mount.fertility]}
                          </span>

                          {mount.capacity !== 'ninguna' && (
                            <span className="block text-xs text-purple-700 font-semibold truncate">
                              ✨ {CAPACITY_LABELS[mount.capacity]}
                            </span>
                          )}

                          {isReadyToBreed && (
                            <span className="block text-xs text-pink-600 font-bold animate-pulse">
                              ❤️ Lista p/ cruzar
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Medidores de Cría */}
                      <td className="py-2.5 px-3">
                        {mount.fertility === 'esteril' || mount.fertility === 'senil' ? (
                          <span className="text-xs text-slate-600 italic">No aplicable</span>
                        ) : (
                          <div className="space-y-1 w-28">
                            {/* Serenidad */}
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                              <span>Serenidad:</span>
                              <span
                                className={`font-bold ${
                                  mount.serenity > 0
                                    ? 'text-sky-600'
                                    : mount.serenity < 0
                                    ? 'text-amber-600'
                                    : 'text-slate-600'
                                }`}
                              >
                                {mount.serenity > 0 ? `+${mount.serenity}` : mount.serenity}
                              </span>
                            </div>

                            {/* Amor */}
                            <div>
                              <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Amor</span>
                                <span>{mount.love}/20k</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-pink-500"
                                  style={{ width: `${Math.min(100, (mount.love / 20000) * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Madurez */}
                            <div>
                              <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Madurez</span>
                                <span>{mount.maturity}/20k</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500"
                                  style={{ width: `${Math.min(100, (mount.maturity / 20000) * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Resistencia */}
                            <div>
                              <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Resistencia</span>
                                <span>{mount.stamina}/20k</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500"
                                  style={{ width: `${Math.min(100, (mount.stamina / 20000) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Notas */}
                      <td className="py-2.5 px-3 max-w-[140px]">
                        <span className="text-[11px] text-slate-500 truncate block">
                          {mount.notes || '—'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              lastActiveElementRef.current = e.currentTarget;
                              setEditingMount({ ...mount });
                              setIsEditModalOpen(true);
                            }}
                            aria-label={`Editar ${mount.nickname}`}
                            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-700 rounded-lg transition cursor-pointer"
                            title="Editar montura"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMount(mount.id)}
                            aria-label={`Eliminar ${mount.nickname}`}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
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

      {/* MODAL DE EDICIÓN / CREACIÓN MANUAL */}
      {isEditModalOpen && editingMount && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 id={modalTitleId} className="font-extrabold text-sm sm:text-base text-slate-900">
                {editingMount.id ? 'Editar Montura' : 'Añadir Nueva Montura'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMount(null);
                }}
                aria-label="Cerrar"
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMount} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {statusMessage && statusMessage.type === 'error' && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3 rounded-xl text-xs font-semibold flex items-center justify-between bg-rose-50 text-rose-800 border border-rose-200"
                >
                  <span>{statusMessage.text}</span>
                  <button type="button" onClick={() => setStatusMessage(null)} aria-label="Cerrar">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Especie */}
                <div>
                  <label htmlFor={speciesId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Especie
                  </label>
                  <select
                    ref={firstFieldRef}
                    id={speciesId}
                    value={editingMount.species || 'dragopavo'}
                    onChange={(e) => {
                      const newSp = e.target.value as SpeciesType;
                      const list = getMountsBySpecies(newSp);
                      setEditingMount({
                        ...editingMount,
                        species: newSp,
                        breed: list[0]?.name || '',
                        generation: list[0]?.generation || 1,
                        imageUrl: list[0]?.imageUrl || '',
                      });
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label htmlFor={breedId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Raza
                  </label>
                  <select
                    id={breedId}
                    value={editingMount.breed || ''}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const def = ALL_MOUNTS_DATA.find(
                        (m) => m.name === selectedName && m.species === editingMount.species
                      );
                      setEditingMount({
                        ...editingMount,
                        breed: selectedName,
                        generation: def?.generation || editingMount.generation,
                        imageUrl: def?.imageUrl || editingMount.imageUrl,
                      });
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getMountsBySpecies(editingMount.species || 'dragopavo').map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} (G{m.generation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apodo */}
                <div>
                  <label htmlFor={nicknameId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Apodo / Nombre
                  </label>
                  <input
                    id={nicknameId}
                    type="text"
                    required
                    value={editingMount.nickname || ''}
                    onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. Flamito"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label id={genderLabelId} htmlFor={genderMachoId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Sexo
                  </label>
                  <div role="group" aria-labelledby={genderLabelId} className="grid grid-cols-2 gap-2">
                    <button
                      id={genderMachoId}
                      type="button"
                      onClick={() => setEditingMount({ ...editingMount, gender: 'M' })}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        editingMount.gender === 'M'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      ♂ Macho
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMount({ ...editingMount, gender: 'F' })}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        editingMount.gender === 'F'
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      ♀ Hembra
                    </button>
                  </div>
                </div>

                {/* Nivel Actual */}
                <div>
                  <label htmlFor={levelId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nivel (1 - 200)
                  </label>
                  <input
                    id={levelId}
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount.currentLevel ?? 1}
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* XP Actual */}
                <div>
                  <label htmlFor={xpId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    XP Actual
                  </label>
                  <input
                    id={xpId}
                    type="number"
                    min={0}
                    max={MAX_MOUNT_XP}
                    value={editingMount.currentXp ?? 0}
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Fertilidad */}
                <div>
                  <label htmlFor={fertilityId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Fertilidad
                  </label>
                  <select
                    id={fertilityId}
                    value={editingMount.fertility || 'fertil'}
                    onChange={(e) => setEditingMount({ ...editingMount, fertility: e.target.value as FertilityStatus })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.keys(FERTILITY_LABELS) as FertilityStatus[]).map((fert) => (
                      <option key={fert} value={fert}>
                        {FERTILITY_LABELS[fert]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacidad Especial */}
                <div>
                  <label htmlFor={capacityId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Capacidad
                  </label>
                  <select
                    id={capacityId}
                    value={editingMount.capacity || 'ninguna'}
                    onChange={(e) => setEditingMount({ ...editingMount, capacity: e.target.value as SpecialCapacity })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.keys(CAPACITY_LABELS) as SpecialCapacity[]).map((cap) => (
                      <option key={cap} value={cap}>
                        {CAPACITY_LABELS[cap]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medidores de Cría */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Medidores Reproductivos {isEditingEsterilOrSenil && '(Bloqueados por estado infértil)'}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label htmlFor={serenityId} className="block text-xs text-slate-600 font-medium mb-1">Serenidad</label>
                    <input
                      id={serenityId}
                      type="number"
                      min={-10000}
                      max={10000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : (editingMount.serenity ?? 0)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          serenity: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        setEditingMount({
                          ...editingMount,
                          serenity: Math.min(10000, Math.max(-10000, toNum(editingMount.serenity))),
                        });
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor={loveId} className="block text-xs text-slate-600 font-medium mb-1">Amor (0-20k)</label>
                    <input
                      id={loveId}
                      type="number"
                      min={0}
                      max={20000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : (editingMount.love ?? 20000)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          love: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        setEditingMount({
                          ...editingMount,
                          love: Math.min(20000, Math.max(0, toNum(editingMount.love))),
                        });
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor={maturityId} className="block text-xs text-slate-600 font-medium mb-1">Madurez (0-20k)</label>
                    <input
                      id={maturityId}
                      type="number"
                      min={0}
                      max={20000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : (editingMount.maturity ?? 20000)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          maturity: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        setEditingMount({
                          ...editingMount,
                          maturity: Math.min(20000, Math.max(0, toNum(editingMount.maturity))),
                        });
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor={staminaId} className="block text-xs text-slate-600 font-medium mb-1">Resist. (0-20k)</label>
                    <input
                      id={staminaId}
                      type="number"
                      min={0}
                      max={20000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : (editingMount.stamina ?? 20000)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMount({
                          ...editingMount,
                          stamina: val === '' ? '' : Number(val),
                        });
                      }}
                      onBlur={() => {
                        setEditingMount({
                          ...editingMount,
                          stamina: Math.min(20000, Math.max(0, toNum(editingMount.stamina))),
                        });
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label htmlFor={notesId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Notas u Observaciones
                </label>
                <textarea
                  id={notesId}
                  value={editingMount.notes || ''}
                  onChange={(e) => setEditingMount({ ...editingMount, notes: e.target.value })}
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detalles sobre cruces previstos, árbol genealógico, etc."
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMount(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-sm transition cursor-pointer"
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
