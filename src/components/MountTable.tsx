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

interface MountTableProps {
  mounts: UserMount[];
  onDataChanged: () => void;
}

type SortField =
  | 'nickname'
  | 'species'
  | 'breed'
  | 'generation'
  | 'currentLevel'
  | 'fertility'
  | 'capacity'
  | 'reproductionCount'
  | 'updatedAt';

export const MountTable: React.FC<MountTableProps> = ({ mounts, onDataChanged }) => {
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [fertilityFilter, setFertilityFilter] = useState<string>('all');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  // Ordenación y Paginación
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estados de interfaz y feedback
  const [selectedMountIds, setSelectedMountIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fileInputId = useId();
  const searchInputId = useId();
  const speciesFilterId = useId();
  const generationFilterId = useId();
  const fertilityFilterId = useId();
  const capacityFilterId = useId();
  const genderFilterId = useId();
  const modalTitleId = useId();

  // Modal Crear / Editar
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMount, setEditingMount] = useState<Partial<UserMount> | null>(null);

  // Modal Confirmación Duplicados
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [pendingDuplicates, setPendingDuplicates] = useState<{
    incoming: UserMount[];
    existing: UserMount[];
  } | null>(null);

  // Accesibilidad: Cerrar menú contextual al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowExportMenu(false);
        if (isEditModalOpen) {
          setIsEditModalOpen(false);
          setEditingMount(null);
        }
        if (isDuplicateModalOpen) {
          handleCancelImport();
        }
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isEditModalOpen, isDuplicateModalOpen]);

  const getSortAria = (field: SortField) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? 'ascending' : 'descending';
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
        if (firstFieldRef.current) {
          firstFieldRef.current.focus();
        }
      }, 50);
    } else if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
  }, [isEditModalOpen]);

  // Limpiar mensaje de estado automáticamente tras 6 segundos
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Iniciar creación con valores oficiales por defecto
  const handleOpenCreateModal = () => {
    const defaultBreeds = getMountsBySpecies('dragopavo');
    const first = defaultBreeds[0];
    setEditingMount({
      species: 'dragopavo',
      breed: first ? first.name : 'Almendrado',
      definitionId: first ? first.id : 'dd_amande',
      generation: first ? first.generation : 1,
      gender: 'M',
      currentLevel: 1,
      currentXp: 0,
      fertility: 'fertil',
      capacity: 'ninguna',
      reproductionCount: 0,
      maxReproductions: 5,
      serenity: 0,
      love: 0,
      maturity: 0,
      stamina: 0,
      imageUrl: first ? first.imageUrl : '',
      notes: '',
    });
    setIsEditModalOpen(true);
  };

  // Cambio dinámico de especie en Modal
  const handleSpeciesChangeInModal = (newSpecies: SpeciesType) => {
    const available = getMountsBySpecies(newSpecies);
    const first = available[0];
    const maxRep = getDefaultMaxReproductions(newSpecies);
    setEditingMount((prev) => ({
      ...prev,
      species: newSpecies,
      breed: first ? first.name : 'Personalizada',
      definitionId: first ? first.id : 'custom',
      generation: first ? first.generation : 1,
      imageUrl: first?.imageUrl || '',
      maxReproductions: maxRep,
      reproductionCount: Math.min(prev?.reproductionCount || 0, maxRep),
    }));
  };

  // Cambio dinámico de raza en Modal
  const handleBreedChangeInModal = (breedId: string) => {
    const matched = ALL_MOUNTS_DATA.find((m) => m.id === breedId);
    if (matched) {
      setEditingMount((prev) => ({
        ...prev,
        breed: matched.name,
        definitionId: matched.id,
        generation: matched.generation,
        imageUrl: matched.imageUrl || '',
      }));
    }
  };

  // Guardar montura creada o editada
  const handleSaveMount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMount) return;

    try {
      const xp = Math.min(MAX_MOUNT_XP, Math.max(0, Number(editingMount.currentXp) || 0));
      const lvl =
        xp >= MAX_MOUNT_XP
          ? 200
          : xp > 0
          ? calculateLevelFromXp(xp)
          : Number(editingMount.currentLevel) || 1;
      const isEsterilOrSenil =
        editingMount.fertility === 'esteril' || editingMount.fertility === 'senil';

      const spec = editingMount.species || 'dragopavo';
      const maxRep =
        Number(editingMount.maxReproductions) || getDefaultMaxReproductions(spec);
      const repCount = Math.min(
        maxRep,
        Math.max(0, Number(editingMount.reproductionCount) || 0)
      );

      const toSave: UserMount = {
        id:
          editingMount.id ||
          `mount_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        nickname: (editingMount.nickname || 'Sin Nombre').trim(),
        definitionId: editingMount.definitionId || 'custom',
        species: spec,
        breed: editingMount.breed || 'Almendrado',
        generation: Number(editingMount.generation) || 1,
        gender: (editingMount.gender as 'M' | 'F') || 'M',
        currentLevel: lvl,
        currentXp: xp,
        fertility: (editingMount.fertility as FertilityStatus) || 'fertil',
        capacity: (editingMount.capacity as SpecialCapacity) || 'ninguna',
        reproductionCount: repCount,
        maxReproductions: maxRep,
        serenity: isEsterilOrSenil ? 0 : Number(editingMount.serenity) || 0,
        love: isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(editingMount.love) || 0)),
        maturity: isEsterilOrSenil
          ? 0
          : Math.min(20000, Math.max(0, Number(editingMount.maturity) || 0)),
        stamina: isEsterilOrSenil
          ? 0
          : Math.min(20000, Math.max(0, Number(editingMount.stamina) || 0)),
        imageUrl: editingMount.imageUrl || '',
        notes: (editingMount.notes || '').trim(),
        createdAt: editingMount.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await db.mounts.put(toSave);
      setIsEditModalOpen(false);
      setEditingMount(null);
      setStatusMessage({
        text: `Montura «${toSave.nickname}» guardada correctamente.`,
        type: 'success',
      });
      onDataChanged();
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Error al guardar la montura en la base de datos.', type: 'error' });
    }
  };

  // Eliminación individual
  const handleDeleteMount = async (id: string) => {
    const mount = mounts.find((m) => m.id === id);
    const name = mount ? mount.nickname : 'esta montura';
    if (!confirm(`¿Estás seguro de que deseas eliminar a «${name}» de tu establo?`)) {
      return;
    }
    try {
      await db.mounts.delete(id);
      setSelectedMountIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setStatusMessage({ text: `Montura «${name}» eliminada.`, type: 'success' });
      onDataChanged();
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Error al eliminar la montura.', type: 'error' });
    }
  };

  // Eliminación en lote
  const handleBatchDelete = async () => {
    if (selectedMountIds.size === 0) return;
    if (
      !confirm(
        `¿Eliminar definitivamente las ${selectedMountIds.size} monturas seleccionadas?`
      )
    ) {
      return;
    }
    try {
      await db.mounts.bulkDelete(Array.from(selectedMountIds));
      setSelectedMountIds(new Set());
      setStatusMessage({
        text: 'Monturas seleccionadas eliminadas correctamente.',
        type: 'success',
      });
      onDataChanged();
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Error en la eliminación en lote.', type: 'error' });
    }
  };

  // Vaciado completo del establo
  const handleClearAllMounts = async () => {
    if (mounts.length === 0) return;
    if (
      !confirm(
        `¡Atención! Vas a eliminar TODAS las ${mounts.length} monturas de tu establo.\nEsta acción no se puede deshacer.\n\n¿Deseas continuar?`
      )
    ) {
      return;
    }
    try {
      await db.mounts.clear();
      setSelectedMountIds(new Set());
      setStatusMessage({ text: 'El establo se ha vaciado por completo.', type: 'success' });
      onDataChanged();
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Error al vaciar el establo.', type: 'error' });
    }
  };

  // Selección individual para lote
  const toggleSelectMount = (id: string) => {
    setSelectedMountIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Selección de todas las monturas de la página actual
  const toggleSelectAllPage = () => {
    const pageIds = paginatedMounts.map((m) => m.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedMountIds.has(id));

    setSelectedMountIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Manejo de carga de archivos (Excel, CSV, JSON)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lower = file.name.toLowerCase();
    try {
      if (lower.endsWith('.json')) {
        const { mounts: parsed, invalid } = await parseBackupFile(file);
        if (parsed.length === 0) {
          setStatusMessage({
            text: 'El archivo JSON no contiene monturas válidas.',
            type: 'error',
          });
          return;
        }
        await processIncomingMounts(parsed, invalid);
      } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) {
        const parsed = await parseExcelFile(file);
        if (parsed.length === 0) {
          setStatusMessage({
            text: 'El archivo no contiene filas de monturas válidas.',
            type: 'error',
          });
          return;
        }
        await processIncomingMounts(parsed, 0);
      } else {
        setStatusMessage({
          text: 'Formato no soportado. Usa archivos .xlsx, .csv o .json.',
          type: 'error',
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: err.message || 'Error al procesar el archivo seleccionado.',
        type: 'error',
      });
    } finally {
      e.target.value = '';
    }
  };

  // Comparación y detección de duplicados por clave única (especie + raza + sexo + generación)
  const processIncomingMounts = async (incoming: UserMount[], invalidCount: number) => {
    const getKey = (m: UserMount) =>
      `${m.species.toLowerCase()}_${m.breed.toLowerCase()}_${m.gender.toUpperCase()}_${m.generation}`;

    const existingKeys = new Map<string, UserMount>();
    mounts.forEach((m) => existingKeys.set(getKey(m), m));

    const duplicates: UserMount[] = [];
    const novelties: UserMount[] = [];

    incoming.forEach((m) => {
      if (existingKeys.has(getKey(m))) {
        duplicates.push(m);
      } else {
        novelties.push(m);
      }
    });

    if (duplicates.length > 0) {
      setPendingDuplicates({ incoming, existing: duplicates });
      setIsDuplicateModalOpen(true);
    } else {
      await db.mounts.bulkPut(incoming);
      setStatusMessage({
        text: `Se importaron ${incoming.length} monturas correctamente.${
          invalidCount > 0 ? ` (${invalidCount} descartadas por formato inválido)` : ''
        }`,
        type: 'success',
      });
      onDataChanged();
    }
  };

  // Resolución de duplicados: Sobrescribir coincidentes
  const handleOverwriteDuplicates = async () => {
    if (!pendingDuplicates) return;
    const { incoming } = pendingDuplicates;

    const getKey = (m: UserMount) =>
      `${m.species.toLowerCase()}_${m.breed.toLowerCase()}_${m.gender.toUpperCase()}_${m.generation}`;
    const existingKeyMap = new Map<string, UserMount>();
    mounts.forEach((m) => existingKeyMap.set(getKey(m), m));

    const toPut: UserMount[] = incoming.map((m) => {
      const match = existingKeyMap.get(getKey(m));
      return match ? { ...m, id: match.id, createdAt: match.createdAt, updatedAt: Date.now() } : m;
    });

    await db.mounts.bulkPut(toPut);
    setIsDuplicateModalOpen(false);
    setPendingDuplicates(null);
    setStatusMessage({
      text: `Importación finalizada: ${toPut.length} monturas procesadas (duplicadas actualizadas).`,
      type: 'success',
    });
    onDataChanged();
  };

  // Resolución de duplicados: Omitir duplicadas y añadir solo nuevas
  const handleSkipDuplicates = async () => {
    if (!pendingDuplicates) return;
    const { incoming } = pendingDuplicates;

    const getKey = (m: UserMount) =>
      `${m.species.toLowerCase()}_${m.breed.toLowerCase()}_${m.gender.toUpperCase()}_${m.generation}`;
    const existingKeys = new Set(mounts.map(getKey));

    const onlyNew = incoming.filter((m) => !existingKeys.has(getKey(m)));
    if (onlyNew.length > 0) {
      await db.mounts.bulkPut(onlyNew);
    }

    setIsDuplicateModalOpen(false);
    setPendingDuplicates(null);
    setStatusMessage({
      text: `Se importaron ${onlyNew.length} monturas nuevas (${
        incoming.length - onlyNew.length
      } duplicadas omitidas).`,
      type: 'success',
    });
    onDataChanged();
  };

  // Cancelar importación completa
  const handleCancelImport = () => {
    setIsDuplicateModalOpen(false);
    setPendingDuplicates(null);
    setStatusMessage({ text: 'Importación cancelada.', type: 'error' });
  };

  // FILTRADO DINÁMICO
  const filteredMounts = mounts.filter((m) => {
    if (speciesFilter !== 'all' && m.species !== speciesFilter) return false;
    if (generationFilter !== 'all' && m.generation !== Number(generationFilter)) return false;
    if (fertilityFilter !== 'all' && m.fertility !== fertilityFilter) return false;
    if (capacityFilter !== 'all' && m.capacity !== capacityFilter) return false;
    if (genderFilter !== 'all' && m.gender !== genderFilter) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchNickname = m.nickname.toLowerCase().includes(term);
      const matchBreed = m.breed.toLowerCase().includes(term);
      const matchNotes = (m.notes || '').toLowerCase().includes(term);
      if (!matchNickname && !matchBreed && !matchNotes) return false;
    }
    return true;
  });

  // ORDENACIÓN
  const sortedMounts = [...filteredMounts].sort((a, b) => {
    let result = 0;
    if (sortField === 'nickname') result = a.nickname.localeCompare(b.nickname);
    else if (sortField === 'species') result = a.species.localeCompare(b.species);
    else if (sortField === 'breed') result = a.breed.localeCompare(b.breed);
    else if (sortField === 'generation') result = a.generation - b.generation;
    else if (sortField === 'currentLevel') {
      const aLvl =
        a.currentXp >= MAX_MOUNT_XP
          ? 200
          : a.currentXp > 0
          ? calculateLevelFromXp(a.currentXp)
          : a.currentLevel;
      const bLvl =
        b.currentXp >= MAX_MOUNT_XP
          ? 200
          : b.currentXp > 0
          ? calculateLevelFromXp(b.currentXp)
          : b.currentLevel;
      result = aLvl - bLvl;
    } else if (sortField === 'fertility') result = a.fertility.localeCompare(b.fertility);
    else if (sortField === 'capacity') result = a.capacity.localeCompare(b.capacity);
    else if (sortField === 'reproductionCount') {
      result = (a.reproductionCount || 0) - (b.reproductionCount || 0);
    } else if (sortField === 'updatedAt') result = a.updatedAt - b.updatedAt;

    return sortOrder === 'asc' ? result : -result;
  });

  // PAGINACIÓN
  const totalPages = Math.max(1, Math.ceil(sortedMounts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedMounts = sortedMounts.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const isEditingEsterilOrSenil =
    editingMount?.fertility === 'esteril' || editingMount?.fertility === 'senil';
  const availableBreedsForModal = editingMount?.species
    ? getMountsBySpecies(editingMount.species)
    : [];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* 1. SECCIÓN SUPERIOR: IMPORTACIÓN Y PLANTILLA CSV */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 md:p-6 shadow-xl space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Botón Seleccionar Archivo */}
          <label
            htmlFor={fileInputId}
            className="cursor-pointer flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100/90 text-[#1e3a8a] font-extrabold text-sm transition shadow-xs"
          >
            <input
              id={fileInputId}
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={handleFileUpload}
              className="sr-only"
            />
            <FolderUp className="w-5 h-5 text-[#1e3a8a] flex-shrink-0" />
            <span>Importar archivo (Excel, CSV o JSON)</span>
          </label>

          {/* Botón Descargar Plantilla CSV */}
          <button
            type="button"
            onClick={downloadCsvTemplate}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-sm transition shadow-md shadow-blue-950/20 cursor-pointer"
            title="Descargar plantilla CSV universal compatible con Excel y Google Sheets"
          >
            <Download className="w-5 h-5 text-blue-200 flex-shrink-0" />
            <span>Descargar plantilla CSV oficial</span>
          </button>
        </div>

        {/* Acciones de Respaldo y Exportación */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80 text-xs">
          <span className="text-slate-500 font-medium">
            Formatos soportados:{' '}
            <strong className="text-slate-700 font-semibold">.xlsx, .csv y .json</strong>. Los datos
            se guardan exclusivamente en tu navegador (Local-First).
          </span>

          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              aria-haspopup="menu"
              aria-expanded={showExportMenu}
              className="font-bold text-[#1e3a8a] hover:text-blue-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition cursor-pointer"
            >
              <span>Exportar / Respaldo</span>
              <span className="text-[10px]">▼</span>
            </button>

            {showExportMenu && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportMountsToExcel(mounts);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Descargar Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportMountsToJson(mounts);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                >
                  <FileJson className="w-4 h-4 text-purple-600" />
                  <span>Copia de seguridad (.json)</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    handleClearAllMounts();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer font-semibold"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Vaciar todo el establo</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de Estado / Notificación */}
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
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. BARRA DE HERRAMIENTAS: BÚSQUEDA Y BOTÓN NUEVA MONTURA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f8fafc] text-slate-900 rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-sm">
        {/* Barra de búsqueda interactiva */}
        <div className="relative flex-1 min-w-[200px]">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar montura por apodo, raza o notas
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Buscar por apodo, raza o notas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Acciones de selección múltiple y añadir montura */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {selectedMountIds.size > 0 && (
            <button
              type="button"
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar ({selectedMountIds.size})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-950/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva montura</span>
          </button>
        </div>
      </div>

      {/* 3. FILTROS RÁPIDOS */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-sm space-y-2.5">
        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtros avanzados</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          {/* Especie */}
          <div>
            <label htmlFor={speciesFilterId} className="sr-only">
              Filtrar por especie
            </label>
            <select
              id={speciesFilterId}
              value={speciesFilter}
              onChange={(e) => {
                setSpeciesFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">Especie: Todas</option>
              <option value="dragopavo">Dragopavos</option>
              <option value="muluaga">Muldos</option>
              <option value="vueloceronte">Vuelocerontes</option>
            </select>
          </div>

          {/* Generación */}
          <div>
            <label htmlFor={generationFilterId} className="sr-only">
              Filtrar por generación
            </label>
            <select
              id={generationFilterId}
              value={generationFilter}
              onChange={(e) => {
                setGenerationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">Generación: Todas</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                <option key={g} value={g}>
                  Generación {g}
                </option>
              ))}
            </select>
          </div>

          {/* Fertilidad */}
          <div>
            <label htmlFor={fertilityFilterId} className="sr-only">
              Filtrar por estado de fertilidad
            </label>
            <select
              id={fertilityFilterId}
              value={fertilityFilter}
              onChange={(e) => {
                setFertilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">Fertilidad: Todas</option>
              <option value="fertil">Fértil</option>
              <option value="fecunda">Fecunda</option>
              <option value="esteril">Estéril</option>
              <option value="senil">Senil</option>
            </select>
          </div>

          {/* Capacidad Especial */}
          <div>
            <label htmlFor={capacityFilterId} className="sr-only">
              Filtrar por capacidad especial
            </label>
            <select
              id={capacityFilterId}
              value={capacityFilter}
              onChange={(e) => {
                setCapacityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">Capacidad: Todas</option>
              <option value="ninguna">Sin capacidad</option>
              <option value="sabia">✨ Sabia</option>
              <option value="enamoradiza">Enamoradiza</option>
              <option value="resistente">Resistente</option>
              <option value="precoz">Precoz</option>
              <option value="reproductora">Reproductora</option>
              <option value="camaleon">Camaleón</option>
            </select>
          </div>

          {/* Sexo */}
          <div>
            <label htmlFor={genderFilterId} className="sr-only">
              Filtrar por sexo
            </label>
            <select
              id={genderFilterId}
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">Sexo: Todos</option>
              <option value="M">Macho (♂)</option>
              <option value="F">Hembra (♀)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. TABLA PRINCIPAL DE MONTURAS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-3 w-10 text-center"
                  aria-sort={getSortAria('nickname')}
                >
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todas las monturas de la página actual"
                    checked={
                      paginatedMounts.length > 0 &&
                      paginatedMounts.every((m) => selectedMountIds.has(m.id))
                    }
                    onChange={toggleSelectAllPage}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th scope="col" className="py-3 px-3" aria-sort={getSortAria('nickname')}>
                  <button
                    type="button"
                    onClick={() => handleSort('nickname')}
                    className="flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Ejemplar</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3" aria-sort={getSortAria('species')}>
                  <button
                    type="button"
                    onClick={() => handleSort('species')}
                    className="flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Especie / Raza</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3" aria-sort={getSortAria('generation')}>
                  <button
                    type="button"
                    onClick={() => handleSort('generation')}
                    className="flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Gen.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3" aria-sort={getSortAria('currentLevel')}>
                  <button
                    type="button"
                    onClick={() => handleSort('currentLevel')}
                    className="flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Nivel / XP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3" aria-sort={getSortAria('fertility')}>
                  <button
                    type="button"
                    onClick={() => handleSort('fertility')}
                    className="flex items-center gap-1 hover:text-slate-800 transition cursor-pointer"
                  >
                    <span>Estado / Crías</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3">Indicadores</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedMounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-600 text-sm">
                    {mounts.length === 0
                      ? 'Tu establo está vacío. Importa un archivo o pulsa «Añadir montura».'
                      : 'No se encontraron monturas que coincidan con los filtros.'}
                  </td>
                </tr>
              ) : (
                paginatedMounts.map((mount) => {
                  const isSelected = selectedMountIds.has(mount.id);
                  const lvl =
                    mount.currentXp >= MAX_MOUNT_XP
                      ? 200
                      : mount.currentXp > 0
                      ? calculateLevelFromXp(mount.currentXp)
                      : mount.currentLevel || 1;
                  const progress = Math.min(
                    100,
                    Math.round((mount.currentXp / MAX_MOUNT_XP) * 100)
                  );
                  const maxRep =
                    mount.maxReproductions || getDefaultMaxReproductions(mount.species);
                  const repCount = mount.reproductionCount || 0;

                  return (
                    <tr
                      key={mount.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {/* Casilla Selección */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Seleccionar ${mount.nickname}`}
                          checked={isSelected}
                          onChange={() => toggleSelectMount(mount.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Ejemplar */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {mount.imageUrl ? (
                            <img
                              src={mount.imageUrl}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                              className="w-8 h-8 object-contain rounded-lg bg-slate-50 border border-slate-200/80 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-slate-200/80">
                              🐴
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 block truncate">
                              {mount.nickname}
                            </span>
                            <span
                              className={`text-[11px] font-bold ${
                                mount.gender === 'F' ? 'text-rose-600' : 'text-sky-600'
                              }`}
                            >
                              {mount.gender === 'F' ? 'Hembra ♀' : 'Macho ♂'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Especie / Raza */}
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800 block">{mount.breed}</span>
                        <span className="text-[11px] text-slate-500 capitalize">
                          {SPECIES_LABELS[mount.species] || mount.species}
                        </span>
                      </td>

                      {/* Generación */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold font-mono text-[11px] border border-slate-200">
                          G{mount.generation}
                        </span>
                      </td>

                      {/* Nivel / XP */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="font-extrabold text-slate-800">Nvl {lvl}</span>
                            <span className="text-slate-500">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/80">
                            <div
                              className="bg-[#1e3a8a] h-full rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Estado / Crías */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                                mount.fertility === 'fecunda'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : mount.fertility === 'esteril'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : mount.fertility === 'senil'
                                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}
                            >
                              {FERTILITY_LABELS[mount.fertility] || mount.fertility}
                            </span>
                            <span
                              className="text-[11px] text-slate-600 font-mono font-bold"
                              title={`Ha tenido ${repCount} de ${maxRep} crías posibles`}
                            >
                              ({repCount}/{maxRep})
                            </span>
                          </div>
                          {mount.capacity !== 'ninguna' && (
                            <span className="inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {CAPACITY_LABELS[mount.capacity] || mount.capacity}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Indicadores de Cría */}
                      <td className="py-2.5 px-3">
                        {mount.fertility === 'esteril' || mount.fertility === 'senil' ? (
                          <span className="text-[11px] text-slate-600 italic">No aplicable</span>
                        ) : (
                          <div className="space-y-1 w-56 sm:w-64">
                            {/* Serenidad */}
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                              <span>Serenidad:</span>
                              <span
                                className={`font-bold ${
                                  mount.serenity > 0
                                    ? 'text-rose-600'
                                    : mount.serenity < 0
                                    ? 'text-amber-600'
                                    : 'text-sky-600'
                                }`}
                              >
                                {mount.serenity > 0 ? `+${mount.serenity}` : mount.serenity}
                              </span>
                            </div>

                            {/* Amor */}
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                                <span>Amor</span>
                                <span>{mount.love}/20k</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                <div
                                  className="bg-rose-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, (mount.love / 20000) * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Madurez */}
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                                <span>Madurez</span>
                                <span>{mount.maturity}/20k</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                <div
                                  className="bg-sky-500 h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (mount.maturity / 20000) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Resistencia */}
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                                <span>Resistencia</span>
                                <span>{mount.stamina}/20k</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                <div
                                  className="bg-amber-500 h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (mount.stamina / 20000) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
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

        {/* 5. BARRA DE PAGINACIÓN */}
        {sortedMounts.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Mostrar</span>
              <select
                aria-label="Monturas por página"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>por página (Total: {sortedMounts.length})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                aria-label="Página anterior"
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 font-semibold text-slate-800">
                Página {safeCurrentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                aria-label="Página siguiente"
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
              <h2 id={modalTitleId} className="font-extrabold text-sm sm:text-base text-slate-900">
                {editingMount.id ? 'Editar montura' : 'Añadir nueva montura'}
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

            <form onSubmit={handleSaveMount} className="p-5 space-y-4 text-xs">
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
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 1. Datos Principales */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Especie
                  </label>
                  <select
                    ref={firstFieldRef}
                    value={editingMount.species || 'dragopavo'}
                    onChange={(e) => handleSpeciesChangeInModal(e.target.value as SpeciesType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="dragopavo">Dragopavo</option>
                    <option value="muluaga">Mulagua</option>
                    <option value="vueloceronte">Vueloceronte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Raza Oficial
                  </label>
                  <select
                    value={editingMount.definitionId || ''}
                    onChange={(e) => handleBreedChangeInModal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 truncate"
                  >
                    {availableBreedsForModal.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (G{b.generation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Apodo y Sexo */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Apodo de la montura
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMount.nickname || ''}
                    onChange={(e) =>
                      setEditingMount({ ...editingMount, nickname: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    placeholder="Ej. Mi Montura"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Sexo
                  </label>
                  <select
                    value={editingMount.gender || 'M'}
                    onChange={(e) =>
                      setEditingMount({ ...editingMount, gender: e.target.value as 'M' | 'F' })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="M">Macho ♂</option>
                    <option value="F">Hembra ♀</option>
                  </select>
                </div>
              </div>

              {/* 3. Nivel y Experiencia */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nivel (1-200)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={editingMount.currentLevel || 1}
                    onChange={(e) => {
                      const lvl = Math.min(200, Math.max(1, Number(e.target.value) || 1));
                      const autoXp = calculateXpForLevel(lvl);
                      setEditingMount({
                        ...editingMount,
                        currentLevel: lvl,
                        currentXp: autoXp,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    XP Acumulada
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={MAX_MOUNT_XP}
                    value={editingMount.currentXp ?? 0}
                    onChange={(e) => {
                      const xp = Math.min(
                        MAX_MOUNT_XP,
                        Math.max(0, Number(e.target.value) || 0)
                      );
                      const autoLvl =
                        xp >= MAX_MOUNT_XP
                          ? 200
                          : xp > 0
                          ? calculateLevelFromXp(xp)
                          : editingMount.currentLevel || 1;
                      setEditingMount({
                        ...editingMount,
                        currentXp: xp,
                        currentLevel: autoLvl,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* 4. Fertilidad y Capacidad Especial */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Estado Reproductivo
                  </label>
                  <select
                    value={editingMount.fertility || 'fertil'}
                    onChange={(e) =>
                      setEditingMount({
                        ...editingMount,
                        fertility: e.target.value as FertilityStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="fertil">Fértil</option>
                    <option value="fecunda">Fecunda</option>
                    <option value="esteril">Estéril</option>
                    <option value="senil">Senil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Capacidad Especial
                  </label>
                  <select
                    value={editingMount.capacity || 'ninguna'}
                    onChange={(e) =>
                      setEditingMount({
                        ...editingMount,
                        capacity: e.target.value as SpecialCapacity,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="ninguna">Ninguna</option>
                    <option value="sabia">✨ Sabia</option>
                    <option value="enamoradiza">Enamoradiza</option>
                    <option value="resistente">Resistente</option>
                    <option value="precoz">Precoz</option>
                    <option value="reproductora">Reproductora</option>
                    <option value="camaleon">Camaleón</option>
                  </select>
                </div>
              </div>

              {/* 5. Crías / Reproducciones */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Crías tenidas
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={editingMount.maxReproductions || 5}
                    value={editingMount.reproductionCount ?? 0}
                    onChange={(e) =>
                      setEditingMount({
                        ...editingMount,
                        reproductionCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Máximo de crías
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={
                      editingMount.maxReproductions ||
                      getDefaultMaxReproductions(editingMount.species)
                    }
                    onChange={(e) =>
                      setEditingMount({
                        ...editingMount,
                        maxReproductions: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Indicadores de Cría */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Medidores Reproductivos {isEditingEsterilOrSenil && '(Bloqueados por estado infértil)'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Serenidad (-5k / +5k)</label>
                    <input
                      type="number"
                      min={-5000}
                      max={5000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : editingMount.serenity ?? 0}
                      onChange={(e) =>
                        setEditingMount({ ...editingMount, serenity: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Amor (0-20k)</label>
                    <input
                      type="number"
                      min={0}
                      max={20000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : editingMount.love ?? 0}
                      onChange={(e) =>
                        setEditingMount({ ...editingMount, love: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Madurez (0-20k)</label>
                    <input
                      type="number"
                      min={0}
                      max={20000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : editingMount.maturity ?? 0}
                      onChange={(e) =>
                        setEditingMount({ ...editingMount, maturity: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Resistencia (0-20k)</label>
                    <input
                      type="number"
                      min={0}
                      max={20000}
                      disabled={isEditingEsterilOrSenil}
                      value={isEditingEsterilOrSenil ? 0 : editingMount.stamina ?? 0}
                      onChange={(e) =>
                        setEditingMount({ ...editingMount, stamina: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* 7. Notas */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Notas / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={editingMount.notes || ''}
                  onChange={(e) => setEditingMount({ ...editingMount, notes: e.target.value })}
                  placeholder="Árbol genealógico, camada o recordatorios..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMount(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold shadow-md shadow-blue-950/20 transition cursor-pointer"
                >
                  Guardar Montura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE DUPLICADOS */}
      {isDuplicateModalOpen && pendingDuplicates && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 p-5 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <Sparkles className="w-6 h-6 flex-shrink-0" />
              <h2 className="font-extrabold text-base text-slate-900">
                Coincidencias de monturas detectadas
              </h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              El archivo que estás importando contiene{' '}
              <strong className="text-slate-900 font-bold">
                {pendingDuplicates.existing.length} montura(s)
              </strong>{' '}
              con la misma especie, raza, sexo y generación que ya existen en tu establo.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1.5 max-h-36 overflow-y-auto">
              {pendingDuplicates.existing.map((dup, i) => (
                <div key={i} className="flex justify-between items-center text-slate-700 font-medium">
                  <span className="truncate">
                    {dup.nickname} ({dup.breed})
                  </span>
                  <span className="font-mono text-slate-500 font-bold text-[10px]">
                    {dup.gender === 'F' ? '♀ Hembra' : '♂ Macho'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleOverwriteDuplicates}
                className="w-full py-2.5 px-4 bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Actualizar / Sobrescribir existentes
              </button>
              <button
                type="button"
                onClick={handleSkipDuplicates}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Conservar existentes e importar solo nuevas
              </button>
              <button
                type="button"
                onClick={handleCancelImport}
                className="w-full py-2 px-4 text-slate-500 hover:text-slate-700 text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancelar importación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
