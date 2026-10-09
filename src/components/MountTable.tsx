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
import { ALL_MOUNTS_DATA, findMountByBreedAndSpecies } from '../data/allMounts';
import { calculateLevelFromXp, calculateXpForLevel, MAX_MOUNT_XP } from '../data/fuelData';
import { MountAvatar } from './MountAvatar';

type NumField = number | '';

export type MountDraft = Omit<
  UserMount,
  'generation' | 'currentLevel' | 'currentXp' | 'serenity' | 'love' | 'maturity' | 'stamina' | 'reproductionCount' | 'maxReproductions'
> & {
  generation?: NumField;
  currentLevel?: NumField;
  currentXp?: NumField;
  serenity?: NumField;
  love?: NumField;
  maturity?: NumField;
  stamina?: NumField;
  reproductionCount?: NumField;
  maxReproductions?: NumField;
};

const toNum = (val?: NumField): number => (val === '' || val === undefined ? 0 : Number(val));

/** ¿La montura cumple los requisitos para cruzarse? (misma regla en tabla y tarjetas) */
const isMountReadyToBreed = (m: UserMount): boolean =>
  m.fertility !== 'esteril' &&
  m.fertility !== 'senil' &&
  m.love >= 7500 &&
  m.maturity >= 10000 &&
  m.stamina >= 7500 &&
  m.serenity >= -2000 &&
  m.serenity <= 2000;

/** Tarjeta de montura para pantallas pequeñas (< md) */
function MountCard({
  mount,
  onEdit,
  onDelete,
}: {
  mount: UserMount;
  onEdit: (mount: UserMount, trigger: HTMLElement) => void;
  onDelete: (id: string) => void;
}) {
  const infertile = mount.fertility === 'esteril' || mount.fertility === 'senil';
  const ready = isMountReadyToBreed(mount);
  const bars = [
    { label: 'Amor', value: mount.love, color: 'bg-pink-500' },
    { label: 'Madurez', value: mount.maturity, color: 'bg-purple-500' },
    { label: 'Resistencia', value: mount.stamina, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-3.5 space-y-3 text-slate-700">
      {/* Identidad y acciones */}
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
          {mount.imageUrl ? (
            <>
              <img
                src={mount.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
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
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 text-sm truncate">{mount.nickname}</span>
            <span
              role="img"
              aria-label={mount.gender === 'M' ? 'Macho' : 'Hembra'}
              className={`text-xs font-bold ${mount.gender === 'M' ? 'text-blue-600' : 'text-rose-500'}`}
            >
              {mount.gender === 'M' ? '♂' : '♀'}
            </span>
          </div>
          <p className="text-xs text-slate-600 truncate">
            {mount.breed} · <span className="font-mono">G{mount.generation}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 -mr-1.5">
          <button
            type="button"
            onClick={(e) => onEdit(mount, e.currentTarget)}
            aria-label={`Editar ${mount.nickname}`}
            title="Editar montura"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(mount.id)}
            aria-label={`Eliminar ${mount.nickname}`}
            title="Eliminar montura"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nivel, fertilidad y capacidad */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 font-mono font-bold ${
            mount.currentLevel >= 200 ? 'text-emerald-700' : 'text-slate-800'
          }`}
        >
          Nvl {mount.currentLevel}
          {mount.currentLevel >= 200 && <Sparkles className="w-3 h-3 text-emerald-500" />}
          <span className="font-normal text-slate-600">· {mount.currentXp.toLocaleString()} XP</span>
        </span>
        <span
          className={`inline-block text-[11px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
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
          <span className="text-purple-700 font-semibold">✨ {CAPACITY_LABELS[mount.capacity]}</span>
        )}
        {ready && <span className="text-pink-600 font-bold">❤️ Lista p/ cruzar</span>}
      </div>

      {/* Indicadores */}
      {infertile ? (
        <p className="text-xs text-slate-600 italic">Indicadores: no aplicable</p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600">
            <span>Serenidad</span>
            <span
              className={`font-bold ${
                mount.serenity > 0 ? 'text-sky-600' : mount.serenity < 0 ? 'text-amber-600' : 'text-slate-600'
              }`}
            >
              {mount.serenity > 0 ? `+${mount.serenity}` : mount.serenity}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {bars.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between gap-1 text-[11px] text-slate-600 font-medium">
                  <span className="truncate">{b.label}</span>
                  <span className="font-mono">{Math.round(b.value / 1000)}k</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={b.label}
                  aria-valuemin={0}
                  aria-valuemax={20000}
                  aria-valuenow={b.value}
                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1"
                >
                  <div className={`h-full ${b.color}`} style={{ width: `${Math.min(100, (b.value / 20000) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MountTableProps {
  mounts: UserMount[];
  onDataChanged: () => void;
}

const FERTILITY_LABELS: Record<FertilityStatus, string> = {
  fertil: 'Fértil',
  fecunda: 'Fecunda',
  esteril: 'Estéril',
  senil: 'Senil',
};

const CAPACITY_LABELS: Record<SpecialCapacity, string> = {
  ninguna: 'Ninguna',
  sabia: 'Sabia',
  enamoradiza: 'Enamoradiza',
  resistente: 'Resistente',
  precoz: 'Precoz',
  reproductora: 'Reproductora',
  camaleon: 'Camaleón',
};

export const MountTable: React.FC<MountTableProps> = ({ mounts, onDataChanged }) => {
  const [editingMount, setEditingMount] = useState<MountDraft | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fileInputId = useId();
  const searchInputId = useId();
  const mobileSortId = useId();
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
  const [isExportingExcel, setIsExportingExcel] = useState(false);
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

  // Accesibilidad Modal: Foco al primer campo al abrir y restaurar al cerrar
  useEffect(() => {
    if (isEditModalOpen) {
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 50);
    } else if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
  }, [isEditModalOpen]);

  // Accesibilidad: Cerrar menú exportar con click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Accesibilidad: Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditModalOpen) {
          setIsEditModalOpen(false);
          setEditingMount(null);
        }
        if (showExportMenu) {
          setShowExportMenu(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditModalOpen, showExportMenu]);

  // Filtrado reactivo de monturas
  const filteredMounts = mounts.filter((m) => {
    const matchesSearch =
      m.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || m.species === speciesFilter;
    const matchesFertility = fertilityFilter === 'all' || m.fertility === fertilityFilter;
    const matchesGender = genderFilter === 'all' || m.gender === genderFilter;
    const matchesGen = genFilter === 'all' || m.generation.toString() === genFilter;
    const matchesCapacity = capacityFilter === 'all' || m.capacity === capacityFilter;

    return matchesSearch && matchesSpecies && matchesFertility && matchesGender && matchesGen && matchesCapacity;
  });

  // Ordenación de monturas
  const sortedMounts = [...filteredMounts].sort((a, b) => {
    let aVal = a[sortField as keyof UserMount];
    let bVal = b[sortField as keyof UserMount];

    if (sortField === 'name') {
      aVal = a.nickname;
      bVal = b.nickname;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }

    return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  // Paginación
  const totalPages = Math.max(1, Math.ceil(sortedMounts.length / itemsPerPage));
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
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFingerprint = (m: Partial<UserMount>) =>
    `${(m.nickname || '').trim().toLowerCase()}|${m.species}|${(m.breed || '').trim().toLowerCase()}|${m.gender}|${m.generation}`;

  // Manejo de Importación de Archivo (CSV, Excel .xlsx / .xls, o Copia de seguridad JSON)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    const isJson = file.name.toLowerCase().endsWith('.json');

    try {
      let parsedMounts: UserMount[] = [];
      let invalidCount = 0;

      if (isJson) {
        const result = await parseBackupFile(file);
        parsedMounts = result.mounts;
        invalidCount = result.invalid;
      } else {
        parsedMounts = await parseExcelFile(file);
      }

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
      const invalidSuffix = invalidCount > 0 ? `, ${invalidCount} inválidas omitidas` : '';
      setStatusMessage({
        type: 'success',
        text: `Se importaron ${toImport.length} monturas, ${duplicatesOmitted} omitidas por duplicadas${invalidSuffix}.`,
      });
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al procesar el archivo. Revisa el formato.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Eliminación individual
  const handleDeleteMount = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta montura?')) {
      await db.mounts.delete(id);
      setStatusMessage({ type: 'success', text: 'Montura eliminada con éxito.' });
      onDataChanged();
    }
  };

  // Guardado de Creación / Edición
  const handleSaveMount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMount) return;

    if (!editingMount.nickname.trim()) {
      setStatusMessage({ type: 'error', text: 'El nombre de la montura es obligatorio.' });
      return;
    }

    const matchedDef = findMountByBreedAndSpecies(editingMount.breed, editingMount.species);
    const resolvedGeneration = matchedDef ? matchedDef.generation : toNum(editingMount.generation) || 1;
    const resolvedImageUrl = matchedDef ? matchedDef.imageUrl : '';

    const xp = Math.min(MAX_MOUNT_XP, Math.max(0, toNum(editingMount.currentXp)));
    const calculatedLevel = xp >= MAX_MOUNT_XP ? 200 : calculateLevelFromXp(xp);

    const isEsterilOrSenil = editingMount.fertility === 'esteril' || editingMount.fertility === 'senil';

    const defaultMaxRepro = getDefaultMaxReproductions(editingMount.species);
    const parsedRepro = toNum(editingMount.reproductionCount);
    const reproductionCount = Math.max(0, Math.floor(parsedRepro));

    const parsedMaxRepro = toNum(editingMount.maxReproductions);
    const maxReproductions = parsedMaxRepro > 0 ? Math.floor(parsedMaxRepro) : defaultMaxRepro;

    const mountToSave: UserMount = {
      id: editingMount.id,
      nickname: editingMount.nickname.trim(),
      species: editingMount.species,
      breed: editingMount.breed,
      generation: resolvedGeneration,
      imageUrl: resolvedImageUrl,
      gender: editingMount.gender,
      currentLevel: calculatedLevel,
      currentXp: xp,
      fertility: editingMount.fertility,
      capacity: editingMount.capacity,
      reproductionCount,
      maxReproductions,
      serenity: isEsterilOrSenil ? 0 : Math.min(10000, Math.max(-10000, toNum(editingMount.serenity))),
      love: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, toNum(editingMount.love))),
      maturity: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, toNum(editingMount.maturity))),
      stamina: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, toNum(editingMount.stamina))),
      notes: (editingMount.notes || '').trim(),
    };

    try {
      await db.mounts.put(mountToSave);
      setIsEditModalOpen(false);
      setEditingMount(null);
      setStatusMessage({ type: 'success', text: 'Montura guardada con éxito.' });
      onDataChanged();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'No se pudo guardar la montura.' });
    }
  };

  // Abrir Modal para crear nueva montura
  const handleAddNew = (e: React.MouseEvent<HTMLElement>) => {
    lastActiveElementRef.current = e.currentTarget;
    const defaultSpecies: SpeciesType = 'dragopavo';
    const firstBreed = ALL_MOUNTS_DATA.find((m) => m.species === defaultSpecies)?.breed || 'Pelirrojo';
    const matched = findMountByBreedAndSpecies(firstBreed, defaultSpecies);

    setEditingMount({
      id: `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: '',
      species: defaultSpecies,
      breed: firstBreed,
      generation: matched ? matched.generation : 1,
      gender: 'M',
      currentLevel: 1,
      currentXp: 0,
      fertility: 'fertil',
      capacity: 'ninguna',
      reproductionCount: 0,
      maxReproductions: getDefaultMaxReproductions(defaultSpecies),
      serenity: 0,
      love: 0,
      maturity: 0,
      stamina: 0,
      notes: '',
    });
    setIsEditModalOpen(true);
  };

  // Monturas disponibles para el select según la especie seleccionada en el modal
  const availableBreeds = editingMount
    ? ALL_MOUNTS_DATA.filter((m) => m.species === editingMount.species)
    : [];

  return (
    <div className="space-y-4">
      {/* 1. BARRA SUPERIOR DE ACCIONES */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>Establo Oficial</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {filteredMounts.length} {filteredMounts.length === 1 ? 'ejemplar' : 'ejemplares'}
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Gestiona tus monturas, sincroniza niveles y exporta tus registros.
          </p>
        </div>

        {/* Botonera de Importar, Descargar Plantilla y Añadir */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Input oculto para subir archivo */}
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls, .json"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Importar archivo CSV o Excel"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
              <FolderUp className="w-4 h-4 text-blue-600" />
            )}
            <span>{isUploading ? 'Importando...' : 'Importar Archivo'}</span>
          </button>

          <button
            type="button"
            onClick={downloadCsvTemplate}
            aria-label="Descargar plantilla CSV"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Plantilla CSV</span>
          </button>

          <button
            type="button"
            onClick={handleAddNew}
            aria-label="Añadir nueva montura al establo"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-blue-900/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Añadir Montura</span>
          </button>
        </div>
      </div>

      {/* 2. MENSAJES DE ESTADO ACCESIBLES (ARIA-LIVE) */}
      <div className="min-h-[1.5rem]" aria-atomic="true">
        {statusMessage && (
          <div
            role={statusMessage.type === 'error' ? 'alert' : 'status'}
            aria-live={statusMessage.type !== 'error' ? 'polite' : undefined}
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Cerrar notificación"
              className="p-1 hover:bg-black/5 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. BARRA DE FILTROS, BÚSQUEDA Y EXPORTACIÓN */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Búsqueda por texto */}
          <div className="relative min-w-[200px] flex-1">
            <label htmlFor={searchInputId} className="sr-only">
              Buscar por nombre o raza
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Buscar por nombre o raza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro Especie */}
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            aria-label="Filtrar por especie"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Todas las especies</option>
            <option value="dragopavo">Dragopavos</option>
            <option value="muluaga">Mulaguas</option>
            <option value="vueloceronte">Vuelocerontes</option>
          </select>

          {/* Filtro Fertilidad */}
          <select
            value={fertilityFilter}
            onChange={(e) => setFertilityFilter(e.target.value)}
            aria-label="Filtrar por fertilidad"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier fertilidad</option>
            <option value="fertil">Fértil</option>
            <option value="fecunda">Fecunda</option>
            <option value="esteril">Estéril</option>
            <option value="senil">Senil</option>
          </select>

          {/* Filtro Sexo */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            aria-label="Filtrar por sexo"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Ambos sexos</option>
            <option value="M">Macho (♂)</option>
            <option value="F">Hembra (♀)</option>
          </select>

          {/* Filtro Generación */}
          <select
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            aria-label="Filtrar por generación"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Gen</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
              <option key={g} value={g.toString()}>
                Gen {g}
              </option>
            ))}
          </select>

          {/* Filtro Capacidad */}
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            aria-label="Filtrar por capacidad genética"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Todas las capacidades</option>
            <option value="ninguna">Sin capacidad</option>
            <option value="sabia">Sabia (XP x2)</option>
            <option value="enamoradiza">Enamoradiza</option>
            <option value="resistente">Resistente</option>
            <option value="precoz">Precoz</option>
            <option value="reproductora">Reproductora</option>
            <option value="camaleon">Camaleón</option>
          </select>
        </div>

        {/* Menú Desplegable de Exportación */}
        <div className="relative flex-shrink-0" ref={exportMenuRef}>
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            aria-haspopup="menu"
            aria-expanded={showExportMenu}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exportar Establo</span>
          </button>

          {showExportMenu && (
            <div role="menu" className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 z-30">
              <button
                type="button"
                role="menuitem"
                disabled={isExportingExcel}
                onClick={async () => {
                  setIsExportingExcel(true);
                  try {
                    await exportMountsToExcel(mounts);
                  } catch (err: any) {
                    setStatusMessage({
                      type: 'error',
                      text: err?.message || 'Error al exportar a Excel.',
                    });
                  } finally {
                    setIsExportingExcel(false);
                    setShowExportMenu(false);
                  }
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium cursor-pointer disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{isExportingExcel ? 'Cargando…' : 'Excel (.xlsx)'}</span>
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
                <FileJson className="w-4 h-4 text-amber-600" />
                <span>JSON (.json)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. TABLA PRINCIPAL DE MONTURAS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <tr>
                <th scope="col" className="py-2.5 px-3.5">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Montura / Raza</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort('generation')}
                    className="inline-flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Gen</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort('currentLevel')}
                    className="inline-flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Nivel / XP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort('fertility')}
                    className="inline-flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Fertilidad</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort('capacity')}
                    className="inline-flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Capacidad</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-3.5 text-center min-w-[210px] w-60">
                  <span title="Barras de estadísticas de Amor, Madurez y Resistencia">Indicadores (A · M · R)</span>
                </th>
                <th scope="col" className="py-2.5 px-3.5 text-right">
                  <span>Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedMounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-600 font-medium">
                    {mounts.length === 0
                      ? 'Tu establo está vacío. Importa un archivo o pulsa «Añadir montura».'
                      : 'No se encontraron monturas que coincidan con los filtros aplicados.'}
                  </td>
                </tr>
              ) : (
                paginatedMounts.map((mount) => {
                  const isReadyToBreed = isMountReadyToBreed(mount);

                  return (
                    <tr
                      key={mount.id}
                      className="hover:bg-slate-50/80 transition-colors group"
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
                                  decoding="async"
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
                                aria-label={mount.gender === 'M' ? 'Macho' : 'Hembra'}
                                className={`text-[10px] font-bold ${
                                  mount.gender === 'M' ? 'text-blue-600' : 'text-rose-500'
                                }`}
                              >
                                {mount.gender === 'M' ? '♂' : '♀'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium truncate block">
                              {mount.breed}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Generación */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-600 text-[11px]">
                        G{mount.generation}
                      </td>

                      {/* Nivel y XP */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold ${
                              mount.currentLevel >= 200 ? 'text-emerald-700' : 'text-slate-800'
                            }`}
                          >
                            Nvl {mount.currentLevel}
                            {mount.currentLevel >= 200 && (
                              <Sparkles className="w-3 h-3 inline text-emerald-500 ml-0.5" />
                            )}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600">
                            {mount.currentXp.toLocaleString()} XP
                          </span>
                        </div>
                      </td>

                      {/* Fertilidad */}
                      <td className="py-2.5 px-3 text-center">
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
                        {isReadyToBreed && (
                          <span className="block text-[9px] font-bold text-pink-600 mt-0.5">
                            ❤️ Lista p/ cruzar
                          </span>
                        )}
                      </td>

                      {/* Capacidad */}
                      <td className="py-2.5 px-3 text-center">
                        {mount.capacity === 'ninguna' ? (
                          <span className="text-slate-600">—</span>
                        ) : (
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            {CAPACITY_LABELS[mount.capacity]}
                          </span>
                        )}
                      </td>

                      {/* Barras de Estadísticas: Amor, Madurez, Resistencia */}
                      <td className="py-2.5 px-3.5 text-center min-w-[210px] w-60">
                        {mount.fertility === 'esteril' || mount.fertility === 'senil' ? (
                          <span className="text-slate-600 text-[11px] italic">No aplicable</span>
                        ) : (
                          <div className="space-y-1.5 max-w-[220px] mx-auto">
                            {/* Serenidad resumida */}
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                              <span>Serenidad</span>
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

                            {/* 3 mini barras horizontales (Amor, Madurez, Resistencia) */}
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <div className="flex justify-between text-[9px] text-slate-600">
                                  <span>Amor</span>
                                  <span>{Math.round(mount.love / 1000)}k</span>
                                </div>
                                <div
                                  role="progressbar"
                                  aria-label="Amor"
                                  aria-valuemin={0}
                                  aria-valuemax={20000}
                                  aria-valuenow={mount.love}
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                >
                                  <div
                                    className="bg-pink-500 h-full"
                                    style={{ width: `${Math.min(100, (mount.love / 20000) * 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[9px] text-slate-600">
                                  <span>Mad.</span>
                                  <span>{Math.round(mount.maturity / 1000)}k</span>
                                </div>
                                <div
                                  role="progressbar"
                                  aria-label="Madurez"
                                  aria-valuemin={0}
                                  aria-valuemax={20000}
                                  aria-valuenow={mount.maturity}
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                >
                                  <div
                                    className="bg-purple-500 h-full"
                                    style={{ width: `${Math.min(100, (mount.maturity / 20000) * 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[9px] text-slate-600">
                                  <span>Res.</span>
                                  <span>{Math.round(mount.stamina / 1000)}k</span>
                                </div>
                                <div
                                  role="progressbar"
                                  aria-label="Resistencia"
                                  aria-valuemin={0}
                                  aria-valuemax={20000}
                                  aria-valuenow={mount.stamina}
                                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                >
                                  <div
                                    className="bg-amber-500 h-full"
                                    style={{ width: `${Math.min(100, (mount.stamina / 20000) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              lastActiveElementRef.current = e.currentTarget;
                              setEditingMount({ ...mount });
                              setIsEditModalOpen(true);
                            }}
                            aria-label={`Editar ${mount.nickname}`}
                            className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMount(mount.id)}
                            aria-label={`Eliminar ${mount.nickname}`}
                            className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Vista móvil: tarjetas */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/80">
            <label htmlFor={mobileSortId} className="text-xs font-bold text-slate-600 whitespace-nowrap">
              Ordenar por
            </label>
            <select
              id={mobileSortId}
              value={sortField as string}
              onChange={(e) => setSortField(e.target.value as keyof UserMount)}
              className="flex-1 min-w-0 h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nickname">Nombre</option>
              <option value="generation">Generación</option>
              <option value="currentLevel">Nivel</option>
              <option value="fertility">Fertilidad</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
              aria-label={sortDirection === 'asc' ? 'Orden ascendente; cambiar a descendente' : 'Orden descendente; cambiar a ascendente'}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
            >
              <span aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>

          {paginatedMounts.length === 0 ? (
            <p className="py-12 px-4 text-center text-slate-600 text-sm">
              {mounts.length === 0
                ? 'Tu establo está vacío. Importa un archivo o pulsa «Añadir montura».'
                : 'No se encontraron monturas que coincidan con los filtros.'}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {paginatedMounts.map((mount) => (
                <li key={mount.id}>
                  <MountCard
                    mount={mount}
                    onEdit={(m, trigger) => {
                      lastActiveElementRef.current = trigger;
                      setEditingMount({ ...m });
                      setIsEditModalOpen(true);
                    }}
                    onDelete={handleDeleteMount}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 5. BARRA DE PAGINACIÓN */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50/50">
          <span>
            Página <strong className="text-slate-800">{currentPage}</strong> de{' '}
            <strong className="text-slate-800">{totalPages}</strong> ({filteredMounts.length} monturas)
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Página anterior"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 md:p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Página siguiente"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 md:p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 id={modalTitleId} className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>{editingMount.nickname ? `Editar: ${editingMount.nickname}` : 'Nueva Montura'}</span>
              </h3>
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

            {statusMessage && statusMessage.type === 'error' && (
              <div
                role="alert"
                className="p-3 rounded-xl text-xs font-semibold flex items-center justify-between bg-rose-50 text-rose-800 border border-rose-200"
              >
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveMount} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Especie */}
                <div>
                  <label htmlFor={speciesId} className="block font-bold text-slate-700 mb-1">
                    Especie
                  </label>
                  <select
                    id={speciesId}
                    ref={firstFieldRef}
                    value={editingMount.species}
                    onChange={(e) => {
                      const sp = e.target.value as SpeciesType;
                      const firstB = ALL_MOUNTS_DATA.find((m) => m.species === sp)?.breed || '';
                      const mDef = findMountByBreedAndSpecies(firstB, sp);
                      const defaultMax = getDefaultMaxReproductions(sp);
                      setEditingMount({
                        ...editingMount,
                        species: sp,
                        breed: firstB,
                        generation: mDef ? mDef.generation : 1,
                        maxReproductions: defaultMax,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="dragopavo">Dragopavo</option>
                    <option value="muluaga">Mulagua</option>
                    <option value="vueloceronte">Vueloceronte</option>
                  </select>
                </div>

                {/* Color / Raza */}
                <div>
                  <label htmlFor={breedId} className="block font-bold text-slate-700 mb-1">
                    Raza / Color
                  </label>
                  <select
                    id={breedId}
                    value={editingMount.breed}
                    onChange={(e) => {
                      const b = e.target.value;
                      const mDef = findMountByBreedAndSpecies(b, editingMount.species);
                      setEditingMount({
                        ...editingMount,
                        breed: b,
                        generation: mDef ? mDef.generation : editingMount.generation,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {availableBreeds.map((b) => (
                      <option key={b.breed} value={b.breed}>
                        {b.breed} (Gen {b.generation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nombre y Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor={nicknameId} className="block font-bold text-slate-700 mb-1">
                    Nombre / Apodo
                  </label>
                  <input
                    id={nicknameId}
                    type="text"
                    required
                    placeholder="Ej. RayoVeloz"
                    value={editingMount.nickname}
                    onChange={(e) => setEditingMount({ ...editingMount, nickname: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <span id={genderLabelId} className="block font-bold text-slate-700 mb-1">
                    Sexo
                  </span>
                  <div role="radiogroup" aria-labelledby={genderLabelId} className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      id={genderMachoId}
                      type="button"
                      role="radio"
                      aria-checked={editingMount.gender === 'M'}
                      onClick={() => setEditingMount({ ...editingMount, gender: 'M' })}
                      className={`py-1 rounded-lg font-bold transition ${
                        editingMount.gender === 'M'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ♂ M
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={editingMount.gender === 'F'}
                      onClick={() => setEditingMount({ ...editingMount, gender: 'F' })}
                      className={`py-1 rounded-lg font-bold transition ${
                        editingMount.gender === 'F'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ♀ H
                    </button>
                  </div>
                </div>
              </div>

              {/* Sincronización Automática: Nivel y Experiencia */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label htmlFor={levelId} className="block font-bold text-slate-700 mb-1">
                    Nivel (1–200)
                  </label>
                  <input
                    id={levelId}
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount.currentLevel ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.min(200, Math.max(1, Number(e.target.value)));
                      const autoXp = val === '' ? '' : calculateXpForLevel(val);
                      setEditingMount({
                        ...editingMount,
                        currentLevel: val,
                        currentXp: autoXp,
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor={xpId} className="block font-bold text-slate-700 mb-1">
                    XP Acumulada
                  </label>
                  <input
                    id={xpId}
                    type="number"
                    min={0}
                    max={MAX_MOUNT_XP}
                    value={editingMount.currentXp ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.min(MAX_MOUNT_XP, Math.max(0, Number(e.target.value)));
                      const autoLvl = val === '' ? '' : val >= MAX_MOUNT_XP ? 200 : calculateLevelFromXp(val);
                      setEditingMount({
                        ...editingMount,
                        currentXp: val,
                        currentLevel: autoLvl,
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Fertilidad y Capacidad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={fertilityId} className="block font-bold text-slate-700 mb-1">
                    Fertilidad
                  </label>
                  <select
                    id={fertilityId}
                    value={editingMount.fertility}
                    onChange={(e) => {
                      const fert = e.target.value as FertilityStatus;
                      setEditingMount({
                        ...editingMount,
                        fertility: fert,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="fertil">Fértil</option>
                    <option value="fecunda">Fecunda</option>
                    <option value="esteril">Estéril</option>
                    <option value="senil">Senil</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={capacityId} className="block font-bold text-slate-700 mb-1">
                    Capacidad Especial
                  </label>
                  <select
                    id={capacityId}
                    value={editingMount.capacity}
                    onChange={(e) =>
                      setEditingMount({ ...editingMount, capacity: e.target.value as SpecialCapacity })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ninguna">Ninguna</option>
                    <option value="sabia">Sabia (XP x2)</option>
                    <option value="enamoradiza">Enamoradiza</option>
                    <option value="resistente">Resistente</option>
                    <option value="precoz">Precoz</option>
                    <option value="reproductora">Reproductora</option>
                    <option value="camaleon">Camaleón</option>
                  </select>
                </div>
              </div>

              {/* Estadísticas de Cría (Serenidad, Amor, Madurez, Resistencia) */}
              {editingMount.fertility !== 'esteril' && editingMount.fertility !== 'senil' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                    Indicadores de Crianza
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label htmlFor={serenityId} className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Serenidad (-10k/10k)
                      </label>
                      <input
                        id={serenityId}
                        type="number"
                        min={-10000}
                        max={10000}
                        value={editingMount.serenity ?? ''}
                        onChange={(e) =>
                          setEditingMount({
                            ...editingMount,
                            serenity: e.target.value === '' ? '' : Math.min(10000, Math.max(-10000, Number(e.target.value))),
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono text-center font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor={loveId} className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Amor (0–20k)
                      </label>
                      <input
                        id={loveId}
                        type="number"
                        min={0}
                        max={20000}
                        value={editingMount.love ?? ''}
                        onChange={(e) =>
                          setEditingMount({
                            ...editingMount,
                            love: e.target.value === '' ? '' : Math.min(20000, Math.max(0, Number(e.target.value))),
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono text-center font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor={maturityId} className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Madurez (0–20k)
                      </label>
                      <input
                        id={maturityId}
                        type="number"
                        min={0}
                        max={20000}
                        value={editingMount.maturity ?? ''}
                        onChange={(e) =>
                          setEditingMount({
                            ...editingMount,
                            maturity: e.target.value === '' ? '' : Math.min(20000, Math.max(0, Number(e.target.value))),
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono text-center font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor={staminaId} className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Resistencia (0–20k)
                      </label>
                      <input
                        id={staminaId}
                        type="number"
                        min={0}
                        max={20000}
                        value={editingMount.stamina ?? ''}
                        onChange={(e) =>
                          setEditingMount({
                            ...editingMount,
                            stamina: e.target.value === '' ? '' : Math.min(20000, Math.max(0, Number(e.target.value))),
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono text-center font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción del Modal */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMount(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-900/20 transition cursor-pointer"
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
