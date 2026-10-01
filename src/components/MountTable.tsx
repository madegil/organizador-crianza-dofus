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

interface MountTableProps {
  mounts: UserMount[];
  onDataChanged: () => void;
}

type SortField =
  | 'nickname'
  | 'breed'
  | 'generation'
  | 'currentLevel'
  | 'fertility'
  | 'reproductionCount'
  | 'serenity'
  | 'love'
  | 'maturity'
  | 'stamina';

type SortDirection = 'asc' | 'desc';

export const MountTable: React.FC<MountTableProps> = ({ mounts, onDataChanged }) => {
  const [filterSpecies, setFilterSpecies] = useState<string>('all');
  const [filterFertility, setFilterFertility] = useState<string>('all');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [sortField, setSortField] = useState<SortField>('generation');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMount, setEditingMount] = useState<UserMount | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fileInputId = useId();
  const searchInputId = useId();
  const filterSpeciesId = useId();
  const filterFertilityId = useId();
  const filterCapacityId = useId();
  const filterGenderId = useId();
  const modalTitleId = useId();
  const genderLabelId = useId();
  const modalSpeciesId = useId();
  const modalBreedId = useId();
  const modalNicknameId = useId();
  const modalGenerationId = useId();
  const modalCurrentLevelId = useId();
  const modalCurrentXpId = useId();
  const modalFertilityId = useId();
  const modalCapacityId = useId();
  const modalReproductionCountId = useId();
  const modalMaxReproductionsId = useId();
  const modalSerenityId = useId();
  const modalLoveId = useId();
  const modalMaturityId = useId();
  const modalStaminaId = useId();
  const modalNotesId = useId();

  const getSortAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    return 'none';
  };

  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    if (!modalRef.current) return;

    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [href]'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || !modalRef.current.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !modalRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Accesibilidad Modal: Foco al primer campo al abrir y devolverlo al botón que lo abrió
  useEffect(() => {
    if (isEditModalOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 50);
    } else if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
  }, [isEditModalOpen]);

  // Accesibilidad Modal: Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditModalOpen) {
        setIsEditModalOpen(false);
        setEditingMount(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditModalOpen]);

  // Cerrar menú exportar con click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setStatusMessage(null);

    try {
      let imported: UserMount[] = [];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'json') {
        imported = await parseBackupFile(file);
      } else if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
        imported = await parseExcelFile(file);
      } else {
        throw new Error('Formato no soportado. Usa .xlsx, .csv o .json');
      }

      if (imported.length === 0) {
        throw new Error('No se encontraron registros válidos para importar.');
      }

      const existingMounts = await db.mounts.toArray();
      const existingIds = new Set(existingMounts.map((m) => m.id));

      const newMounts = imported.map((m) => {
        let uniqueId = m.id;
        if (!uniqueId || existingIds.has(uniqueId)) {
          uniqueId = `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        existingIds.add(uniqueId);
        return { ...m, id: uniqueId };
      });

      await db.mounts.bulkAdd(newMounts);
      setStatusMessage({
        text: `¡Éxito! Se importaron ${newMounts.length} monturas correctamente.`,
        type: 'success',
      });
      onDataChanged();
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: err.message || 'Error al procesar el archivo.',
        type: 'error',
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteMount = async (id: string) => {
    const target = mounts.find((m) => m.id === id);
    const targetName = target ? target.nickname : 'esta montura';
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${targetName}"?`)) {
      try {
        await db.mounts.delete(id);
        setStatusMessage({ text: 'Montura eliminada.', type: 'success' });
        onDataChanged();
      } catch (err: any) {
        console.error(err);
        setStatusMessage({ text: 'Error al eliminar la montura.', type: 'error' });
      }
    }
  };

  const handleOpenCreateModal = () => {
    const newEmptyMount: UserMount = {
      id: `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: 'Nueva Montura',
      definitionId: 'dd_1',
      species: 'dragopavo',
      breed: 'Almendrado',
      generation: 1,
      gender: 'M',
      currentLevel: 1,
      currentXp: 0,
      fertility: 'fertil',
      capacity: 'ninguna',
      reproductionCount: 0,
      maxReproductions: getDefaultMaxReproductions('dragopavo'),
      serenity: 0,
      love: 0,
      maturity: 0,
      stamina: 0,
      imageUrl: '',
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEditingMount(newEmptyMount);
    setIsEditModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMount) return;

    try {
      const isNew = !mounts.some((m) => m.id === editingMount.id);
      const isEsterilOrSenil = editingMount.fertility === 'esteril' || editingMount.fertility === 'senil';

      let parsedXp = Number(editingMount.currentXp) || 0;
      let parsedLevel = Math.min(200, Math.max(1, Number(editingMount.currentLevel) || 1));

      if (parsedXp >= MAX_MOUNT_XP) {
        parsedLevel = 200;
      } else if (parsedXp > 0) {
        parsedLevel = calculateLevelFromXp(parsedXp);
      } else if (parsedLevel > 1 && parsedXp === 0) {
        parsedXp = calculateXpForLevel(parsedLevel);
      }

      const mountToSave: UserMount = {
        ...editingMount,
        currentLevel: parsedLevel,
        currentXp: parsedXp,
        serenity: isEsterilOrSenil ? 0 : Math.min(10000, Math.max(-10000, Number(editingMount.serenity) || 0)),
        love: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(editingMount.love) || 0)),
        maturity: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(editingMount.maturity) || 0)),
        stamina: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(editingMount.stamina) || 0)),
        reproductionCount: Math.max(0, Number(editingMount.reproductionCount) || 0),
        maxReproductions: Math.max(
          1,
          Number(editingMount.maxReproductions) || getDefaultMaxReproductions(editingMount.species)
        ),
        updatedAt: Date.now(),
      };

      if (isNew) {
        await db.mounts.add(mountToSave);
        setStatusMessage({ text: 'Montura creada exitosamente.', type: 'success' });
      } else {
        await db.mounts.put(mountToSave);
        setStatusMessage({ text: 'Montura actualizada correctamente.', type: 'success' });
      }

      setIsEditModalOpen(false);
      setEditingMount(null);
      onDataChanged();
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: 'Error al guardar los datos de la montura.', type: 'error' });
    }
  };

  // Filtrado
  const filteredMounts = mounts.filter((mount) => {
    if (filterSpecies !== 'all' && mount.species !== filterSpecies) return false;
    if (filterFertility !== 'all' && mount.fertility !== filterFertility) return false;
    if (filterCapacity !== 'all' && mount.capacity !== filterCapacity) return false;
    if (filterGender !== 'all' && mount.gender !== filterGender) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = mount.nickname.toLowerCase().includes(q);
      const matchBreed = mount.breed.toLowerCase().includes(q);
      const matchNotes = mount.notes.toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchNotes) return false;
    }

    return true;
  });

  // Ordenamiento
  const sortedMounts = [...filteredMounts].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginación
  const totalPages = Math.ceil(sortedMounts.length / itemsPerPage) || 1;
  const paginatedMounts = sortedMounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* TARJETA PRINCIPAL DEL ESTABLO CON CONTENEDOR ENMARCADO Y HEADER ELEGANTE */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xl space-y-5">
        {/* Cabecera / Barra de herramientas superior */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center border border-blue-200/80 shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#1e3a8a]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                Gestión Integral del Establo
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Monitorea, filtra, edita y sincroniza tus ejemplares registrados.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Input oculto para subir archivos */}
            <input
              id={fileInputId}
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv, .json"
              className="sr-only"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="Importar Excel (.xlsx, .csv) o Respaldo JSON"
            >
              {isImporting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <FolderUp className="w-4 h-4 text-slate-600" />
              )}
              <span>{isImporting ? 'Importando...' : 'Importar'}</span>
            </button>

            {/* Menú Desplegable de Exportación */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                aria-expanded={isExportMenuOpen}
                aria-haspopup="menu"
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition flex items-center gap-2 cursor-pointer"
                title="Exportar datos o descargar plantilla"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Exportar</span>
              </button>

              {isExportMenuOpen && (
                <div role="menu" className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 z-30">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      exportMountsToExcel(mounts);
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Exportar a Excel
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      exportMountsToJson(mounts);
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-blue-600" /> Copia JSON
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      downloadCsvTemplate();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-400" /> Plantilla Vacía
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-black rounded-xl shadow-md shadow-blue-950/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Montura</span>
            </button>
          </div>
        </div>

        {/* Mensaje de estado / notificación */}
        {statusMessage && (
          <div
            role={statusMessage.type === 'error' ? 'alert' : 'status'}
            aria-live={statusMessage.type !== 'error' ? 'polite' : undefined}
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Cerrar notificación"
              className="p-1 hover:bg-black/5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="space-y-3">
          <div className="relative">
            <label htmlFor={searchInputId} className="sr-only">
              Buscar por apodo, raza o notas
            </label>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Buscar por apodo, raza o notas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filtros Activos:
            </div>

            {/* Especie */}
            <div>
              <label htmlFor={filterSpeciesId} className="sr-only">
                Filtrar por especie
              </label>
              <select
                id={filterSpeciesId}
                value={filterSpecies}
                onChange={(e) => {
                  setFilterSpecies(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              >
                <option value="all">Todas las Especies</option>
                <option value="dragopavo">🐴 Dragopavos</option>
                <option value="muluaga">🐟 Mulaguas</option>
                <option value="vueloceronte">🦏 Vuelocerontes</option>
              </select>
            </div>

            {/* Fertilidad */}
            <div>
              <label htmlFor={filterFertilityId} className="sr-only">
                Filtrar por fertilidad
              </label>
              <select
                id={filterFertilityId}
                value={filterFertility}
                onChange={(e) => {
                  setFilterFertility(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              >
                <option value="all">Toda Fertilidad</option>
                <option value="fertil">Fértil</option>
                <option value="fecunda">Fecunda</option>
                <option value="esteril">Estéril</option>
                <option value="senil">Senil</option>
              </select>
            </div>

            {/* Capacidad */}
            <div>
              <label htmlFor={filterCapacityId} className="sr-only">
                Filtrar por capacidad
              </label>
              <select
                id={filterCapacityId}
                value={filterCapacity}
                onChange={(e) => {
                  setFilterCapacity(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              >
                <option value="all">Toda Capacidad</option>
                <option value="ninguna">Ninguna</option>
                <option value="camaleon">Camaleón</option>
                <option value="sabia">Sabia</option>
                <option value="enamoradiza">Enamoradiza</option>
                <option value="precoz">Precoz</option>
                <option value="reproductora">Reproductora</option>
                <option value="resistente">Resistente</option>
              </select>
            </div>

            {/* Género */}
            <div>
              <label htmlFor={filterGenderId} className="sr-only">
                Filtrar por género
              </label>
              <select
                id={filterGenderId}
                value={filterGender}
                onChange={(e) => {
                  setFilterGender(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              >
                <option value="all">Ambos Géneros</option>
                <option value="M">Macho (♂)</option>
                <option value="F">Hembra (♀)</option>
              </select>
            </div>

            {(filterSpecies !== 'all' ||
              filterFertility !== 'all' ||
              filterCapacity !== 'all' ||
              filterGender !== 'all' ||
              searchQuery !== '') && (
              <button
                type="button"
                onClick={() => {
                  setFilterSpecies('all');
                  setFilterFertility('all');
                  setFilterCapacity('all');
                  setFilterGender('all');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        </div>

        {/* TABLA PRINCIPAL - CONTENEDOR ENMARCADO CON PADDING Y BORDES DEFINIDOS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                  <th scope="col" aria-sort={getSortAriaSort('nickname')} className="py-3 px-3.5">
                    <button
                      type="button"
                      onClick={() => handleSort('nickname')}
                      className="flex items-center gap-1.5 hover:text-slate-900 transition font-bold cursor-pointer"
                    >
                      Montura <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th scope="col" aria-sort={getSortAriaSort('generation')} className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleSort('generation')}
                      className="flex items-center justify-center gap-1 hover:text-slate-900 transition font-bold mx-auto cursor-pointer"
                    >
                      Gen <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th scope="col" aria-sort={getSortAriaSort('currentLevel')} className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleSort('currentLevel')}
                      className="flex items-center justify-center gap-1 hover:text-slate-900 transition font-bold mx-auto cursor-pointer"
                    >
                      Nivel / XP <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th scope="col" aria-sort={getSortAriaSort('fertility')} className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => handleSort('fertility')}
                      className="flex items-center gap-1 hover:text-slate-900 transition font-bold cursor-pointer"
                    >
                      Estado Reprod. <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-3 text-center">
                    Barras de Cría
                  </th>
                  <th scope="col" className="py-3 px-3 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedMounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <p className="text-sm font-semibold">No se encontraron monturas.</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Intenta ajustar los filtros o añade nuevas monturas con el botón superior.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedMounts.map((mount) => {
                    const isEsterilOrSenil = mount.fertility === 'esteril' || mount.fertility === 'senil';
                    const isFecunda = mount.fertility === 'fecunda';
                    const isFertil = mount.fertility === 'fertil';

                    return (
                      <tr
                        key={mount.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Nombre, Raza y Avatar */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-2.5">
                            {/* Avatar o Miniatura */}
                            {mount.imageUrl ? (
                              <img
                                src={mount.imageUrl}
                                alt={mount.breed}
                                className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-slate-200 flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="relative w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs flex-shrink-0 overflow-hidden">
                                <span>{mount.gender === 'F' ? '♀' : '♂'}</span>
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 truncate">
                                  {mount.nickname}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-1 rounded ${
                                    mount.gender === 'F'
                                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                                  }`}
                                  title={mount.gender === 'F' ? 'Hembra' : 'Macho'}
                                >
                                  {mount.gender === 'F' ? '♀' : '♂'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                <span>{mount.breed}</span>
                                {mount.capacity !== 'ninguna' && (
                                  <span className="font-semibold text-purple-700 bg-purple-50 px-1 rounded text-[10px] border border-purple-200">
                                    {CAPACITY_LABELS[mount.capacity] || mount.capacity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Generación */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200">
                            G{mount.generation}
                          </span>
                        </td>

                        {/* Nivel / XP */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="font-bold text-slate-800">
                            Nvl {mount.currentLevel}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {mount.currentXp.toLocaleString()} XP
                          </div>
                        </td>

                        {/* Fertilidad y Reproducciones */}
                        <td className="py-2.5 px-3">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                isFecunda
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : isFertil
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {FERTILITY_LABELS[mount.fertility] || mount.fertility}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              Partos: {mount.reproductionCount} / {mount.maxReproductions}
                            </div>
                          </div>
                        </td>

                        {/* Barras de Cría */}
                        <td className="py-2.5 px-3">
                          {isEsterilOrSenil ? (
                            <span className="text-[10px] text-slate-500 italic block text-center">
                              No aplicable ({mount.fertility})
                            </span>
                          ) : (
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-44 mx-auto text-[10px]">
                              {/* Amor */}
                              <div>
                                <div className="flex justify-between text-slate-500">
                                  <span>Amor</span>
                                  <span className="font-mono">
                                    {Math.round((mount.love / 20000) * 100)}%
                                  </span>
                                </div>
                                <div
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                  role="progressbar"
                                  aria-label="Amor"
                                  aria-valuenow={mount.love}
                                  aria-valuemin={0}
                                  aria-valuemax={20000}
                                >
                                  <div
                                    className="bg-rose-500 h-full rounded-full"
                                    style={{
                                      width: `${Math.min(100, (mount.love / 20000) * 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* Resistencia */}
                              <div>
                                <div className="flex justify-between text-slate-500">
                                  <span>Resist.</span>
                                  <span className="font-mono">
                                    {Math.round((mount.stamina / 20000) * 100)}%
                                  </span>
                                </div>
                                <div
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                  role="progressbar"
                                  aria-label="Resistencia"
                                  aria-valuenow={mount.stamina}
                                  aria-valuemin={0}
                                  aria-valuemax={20000}
                                >
                                  <div
                                    className="bg-amber-500 h-full rounded-full"
                                    style={{
                                      width: `${Math.min(100, (mount.stamina / 20000) * 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* Madurez */}
                              <div>
                                <div className="flex justify-between text-slate-500">
                                  <span>Madurez</span>
                                  <span className="font-mono">
                                    {Math.round((mount.maturity / 20000) * 100)}%
                                  </span>
                                </div>
                                <div
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                  role="progressbar"
                                  aria-label="Madurez"
                                  aria-valuenow={mount.maturity}
                                  aria-valuemin={0}
                                  aria-valuemax={20000}
                                >
                                  <div
                                    className="bg-purple-500 h-full rounded-full"
                                    style={{
                                      width: `${Math.min(100, (mount.maturity / 20000) * 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* Serenidad (-10k a +10k) */}
                              <div>
                                <div className="flex justify-between text-slate-500">
                                  <span>Serenidad</span>
                                  <span className="font-mono">{mount.serenity}</span>
                                </div>
                                <div
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                  role="progressbar"
                                  aria-label="Serenidad"
                                  aria-valuenow={mount.serenity}
                                  aria-valuemin={-10000}
                                  aria-valuemax={10000}
                                >
                                  <div
                                    className="bg-blue-500 h-full rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(0, ((mount.serenity + 10000) / 20000) * 100)
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMount({ ...mount });
                                setIsEditModalOpen(true);
                              }}
                              aria-label={`Editar ${mount.nickname}`}
                              className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg transition cursor-pointer"
                              title="Editar montura"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMount(mount.id)}
                              aria-label={`Eliminar ${mount.nickname}`}
                              className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition cursor-pointer"
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

          {/* Paginación */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/50">
            <span>
              Mostrando {sortedMounts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, sortedMounts.length)} de {sortedMounts.length}{' '}
              monturas
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN / CREACIÓN MANUAL */}
      {isEditModalOpen && editingMount && (
        <div
          ref={modalRef}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h2 id={modalTitleId} className="text-sm font-extrabold text-slate-900">
                {mounts.some((m) => m.id === editingMount.id) ? 'Editar Montura' : 'Nueva Montura'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMount(null);
                }}
                aria-label="Cerrar"
                className="p-1 text-slate-600 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {statusMessage && statusMessage.type === 'error' && (
                <div
                  role="alert"
                  className="p-3 rounded-xl text-xs font-semibold flex items-center justify-between bg-rose-50 text-rose-800 border border-rose-200"
                >
                  <span>{statusMessage.text}</span>
                  <button
                    type="button"
                    onClick={() => setStatusMessage(null)}
                    aria-label="Cerrar alerta"
                    className="p-1 hover:bg-black/5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Especie y Raza */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={modalSpeciesId} className="block font-bold text-slate-700 mb-1">
                    Especie
                  </label>
                  <select
                    id={modalSpeciesId}
                    ref={firstFieldRef}
                    value={editingMount.species}
                    onChange={(e) => {
                      const sp = e.target.value as SpeciesType;
                      const available = getMountsBySpecies(sp);
                      const firstBreed = available[0] || { id: `${sp}_custom`, name: 'Estándar', generation: 1, imageUrl: '' };
                      setEditingMount({
                        ...editingMount,
                        species: sp,
                        breed: firstBreed.name,
                        definitionId: firstBreed.id,
                        generation: firstBreed.generation,
                        imageUrl: firstBreed.imageUrl || '',
                        maxReproductions: getDefaultMaxReproductions(sp),
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dragopavo">Dragopavo</option>
                    <option value="muluaga">Muluaga</option>
                    <option value="vueloceronte">Vueloceronte</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={modalBreedId} className="block font-bold text-slate-700 mb-1">
                    Raza
                  </label>
                  <select
                    id={modalBreedId}
                    value={editingMount.breed}
                    onChange={(e) => {
                      const bName = e.target.value;
                      const breedDef = ALL_MOUNTS_DATA.find((m) => m.name === bName && m.species === editingMount.species);
                      setEditingMount({
                        ...editingMount,
                        breed: bName,
                        definitionId: breedDef?.id || editingMount.definitionId,
                        generation: breedDef?.generation || editingMount.generation,
                        imageUrl: breedDef?.imageUrl || editingMount.imageUrl || '',
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getMountsBySpecies(editingMount.species).map((def) => (
                      <option key={def.id} value={def.name}>
                        {def.name} (G{def.generation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Apodo y Género */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={modalNicknameId} className="block font-bold text-slate-700 mb-1">
                    Apodo
                  </label>
                  <input
                    id={modalNicknameId}
                    type="text"
                    required
                    value={editingMount.nickname}
                    onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <span id={genderLabelId} className="block font-bold text-slate-700 mb-1">
                    Género
                  </span>
                  <div role="group" aria-labelledby={genderLabelId} className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      aria-pressed={editingMount.gender === 'M'}
                      onClick={() => setEditingMount({ ...editingMount, gender: 'M' })}
                      className={`p-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                        editingMount.gender === 'M'
                          ? 'bg-blue-50 border-blue-400 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      ♂ Macho
                    </button>
                    <button
                      type="button"
                      aria-pressed={editingMount.gender === 'F'}
                      onClick={() => setEditingMount({ ...editingMount, gender: 'F' })}
                      className={`p-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                        editingMount.gender === 'F'
                          ? 'bg-rose-50 border-rose-400 text-rose-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      ♀ Hembra
                    </button>
                  </div>
                </div>
              </div>

              {/* Generación y Nivel */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor={modalGenerationId} className="block font-bold text-slate-700 mb-1">
                    Gen (1-10)
                  </label>
                  <input
                    id={modalGenerationId}
                    type="number"
                    min={1}
                    max={10}
                    value={editingMount.generation}
                    onChange={(e) => setEditingMount({ ...editingMount, generation: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor={modalCurrentLevelId} className="block font-bold text-slate-700 mb-1">
                    Nivel (1-200)
                  </label>
                  <input
                    id={modalCurrentLevelId}
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount.currentLevel}
                    onChange={(e) => {
                      const lvl = Number(e.target.value);
                      const xpForLvl = calculateXpForLevel(lvl);
                      setEditingMount({
                        ...editingMount,
                        currentLevel: lvl,
                        currentXp: xpForLvl,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor={modalCurrentXpId} className="block font-bold text-slate-700 mb-1">
                    XP Actual
                  </label>
                  <input
                    id={modalCurrentXpId}
                    type="number"
                    min={0}
                    max={MAX_MOUNT_XP}
                    value={editingMount.currentXp}
                    onChange={(e) => {
                      const xp = Number(e.target.value);
                      const calculatedLvl = calculateLevelFromXp(xp);
                      setEditingMount({
                        ...editingMount,
                        currentXp: xp,
                        currentLevel: calculatedLvl,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fertilidad y Capacidad Especial */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={modalFertilityId} className="block font-bold text-slate-700 mb-1">
                    Estado de Fertilidad
                  </label>
                  <select
                    id={modalFertilityId}
                    value={editingMount.fertility}
                    onChange={(e) => setEditingMount({ ...editingMount, fertility: e.target.value as FertilityStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fertil">Fértil</option>
                    <option value="fecunda">Fecunda</option>
                    <option value="esteril">Estéril</option>
                    <option value="senil">Senil</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={modalCapacityId} className="block font-bold text-slate-700 mb-1">
                    Capacidad Especial
                  </label>
                  <select
                    id={modalCapacityId}
                    value={editingMount.capacity}
                    onChange={(e) => setEditingMount({ ...editingMount, capacity: e.target.value as SpecialCapacity })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ninguna">Ninguna</option>
                    <option value="camaleon">Camaleón</option>
                    <option value="sabia">Sabia</option>
                    <option value="enamoradiza">Enamoradiza</option>
                    <option value="precoz">Precoz</option>
                    <option value="reproductora">Reproductora</option>
                    <option value="resistente">Resistente</option>
                  </select>
                </div>
              </div>

              {/* Reproducciones / Partos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={modalReproductionCountId} className="block font-bold text-slate-700 mb-1">
                    Reproducciones Hechas
                  </label>
                  <input
                    id={modalReproductionCountId}
                    type="number"
                    min={0}
                    value={editingMount.reproductionCount}
                    onChange={(e) => setEditingMount({ ...editingMount, reproductionCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor={modalMaxReproductionsId} className="block font-bold text-slate-700 mb-1">
                    Reproducciones Máximas
                  </label>
                  <input
                    id={modalMaxReproductionsId}
                    type="number"
                    min={1}
                    value={editingMount.maxReproductions}
                    onChange={(e) => setEditingMount({ ...editingMount, maxReproductions: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Barras de Cría */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                  Estadísticas de Cría
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={modalSerenityId} className="block font-bold text-slate-600 mb-1">
                      Serenidad (-10.000 a 10.000)
                    </label>
                    <input
                      id={modalSerenityId}
                      type="number"
                      min={-10000}
                      max={10000}
                      value={editingMount.serenity}
                      onChange={(e) => setEditingMount({ ...editingMount, serenity: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={modalLoveId} className="block font-bold text-slate-600 mb-1">
                      Amor (0 a 20.000)
                    </label>
                    <input
                      id={modalLoveId}
                      type="number"
                      min={0}
                      max={20000}
                      value={editingMount.love}
                      onChange={(e) => setEditingMount({ ...editingMount, love: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={modalMaturityId} className="block font-bold text-slate-600 mb-1">
                      Madurez (0 a 20.000)
                    </label>
                    <input
                      id={modalMaturityId}
                      type="number"
                      min={0}
                      max={20000}
                      value={editingMount.maturity}
                      onChange={(e) => setEditingMount({ ...editingMount, maturity: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={modalStaminaId} className="block font-bold text-slate-600 mb-1">
                      Resistencia (0 a 20.000)
                    </label>
                    <input
                      id={modalStaminaId}
                      type="number"
                      min={0}
                      max={20000}
                      value={editingMount.stamina}
                      onChange={(e) => setEditingMount({ ...editingMount, stamina: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label htmlFor={modalNotesId} className="block font-bold text-slate-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  id={modalNotesId}
                  rows={2}
                  value={editingMount.notes}
                  onChange={(e) => setEditingMount({ ...editingMount, notes: e.target.value })}
                  placeholder="Información relevante (p.ej. genotipo, dueños, plan de cruce)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Botones de acción modal */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMount(null);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black rounded-xl shadow-md transition cursor-pointer"
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
