import React, { useEffect, useId, useMemo, useRef } from 'react';
import { Droplet, Heart, Sparkles, X, Zap } from 'lucide-react';
import type { FertilityStatus, SpecialCapacity, SpeciesType } from '../types/mount';
import type { MountDraft } from './MountTable';
import { ALL_MOUNTS_DATA, getMountsBySpecies } from '../data/allMounts';
import { calculateLevelFromXp, calculateXpForLevel, MAX_MOUNT_XP, SERENITY_MAX, SERENITY_MIN, clampSerenity } from '../data/fuelData';
import { CAPACITY_LABELS, FERTILITY_LABELS } from '../data/labels';
import { MountAvatar } from './MountAvatar';
import { IconCalculadora, IconEstablo } from './DofusIcons';
import { formatNumber } from '../utils/formatNumber';

const MAX = 20000;
const toNum = (v?: number | '') => (v === '' || v === undefined ? 0 : Number(v));

const ESPECIES: { key: SpeciesType; label: string; img: string }[] = [
  { key: 'dragopavo', label: 'Dragopavo', img: 'https://api.dofusdu.de/dofus2/img/mount/20.png' },
  { key: 'muluaga', label: 'Mulagua', img: 'https://api.dofusdu.de/dofus3/v1/img/item/97091-128.png' },
  { key: 'vueloceronte', label: 'Vueloceronte', img: 'https://api.dofusdu.de/dofus3/v1/img/item/97177-128.png' },
];

const FERTILIDAD: { key: FertilityStatus; ayuda: string; punto: string }[] = [
  { key: 'fertil', ayuda: 'Puede cruzarse cuando llene amor, madurez y resistencia.', punto: 'bg-emerald-500' },
  { key: 'fecunda', ayuda: 'Tiene los tres medidores llenos: lista para cruzar.', punto: 'bg-amber-500' },
  { key: 'esteril', ayuda: 'Ya se cruzó. No vuelve a cruzarse, pero puedes clonarla.', punto: 'bg-slate-500' },
  { key: 'senil', ayuda: 'Montura anterior a la 3.5: ni se cruza ni se clona.', punto: 'bg-rose-500' },
];

const CAPACIDAD: Record<SpecialCapacity, string> = {
  ninguna: 'Sin capacidad especial.',
  sabia: 'Gana experiencia al doble de velocidad.',
  enamoradiza: 'Gana amor al doble de velocidad.',
  resistente: 'Gana resistencia al doble de velocidad.',
  precoz: 'Gana madurez al doble de velocidad.',
  reproductora: 'Da un bebé extra al cruzarla.',
  camaleon: 'Toma los colores de tu personaje al equiparla.',
};

/** Qué medidores suben con la serenidad actual (regla de la 3.5) */
const zonaSerenidad = (s: number) => {
  if (s <= -2001) return { suben: ['stamina'], texto: 'Solo sube la resistencia.' };
  if (s <= -1) return { suben: ['stamina', 'maturity'], texto: 'Suben la resistencia y la madurez.' };
  if (s <= 2000) return { suben: ['love', 'maturity'], texto: 'Suben el amor y la madurez.' };
  return { suben: ['love'], texto: 'Solo sube el amor.' };
};

const MEDIDORES = [
  { key: 'love', label: 'Amor', Icon: Heart, color: 'bg-pink-500', icono: 'text-pink-600' },
  { key: 'maturity', label: 'Madurez', Icon: Droplet, color: 'bg-sky-500', icono: 'text-sky-600' },
  { key: 'stamina', label: 'Resistencia', Icon: Zap, color: 'bg-amber-500', icono: 'text-amber-600' },
] as const;

const campo =
  'w-full min-h-[42px] px-3 rounded-xl border-2 border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-50';
const etiqueta = 'block text-xs font-bold text-slate-700 mb-1';

const Seccion: React.FC<{ titulo: string; icono: React.ReactNode; children: React.ReactNode }> = ({ titulo, icono, children }) => (
  <fieldset className="space-y-3 pt-4 first:pt-0 border-t first:border-t-0 border-slate-200">
    <legend className="flex items-center gap-2 font-display text-[17px] text-slate-900 float-left w-full mb-1">
      <span className="w-6 h-6 grid place-items-center" aria-hidden="true">
        {icono}
      </span>
      {titulo}
    </legend>
    <div className="clear-both space-y-3">{children}</div>
  </fieldset>
);

interface Props {
  draft: MountDraft;
  setDraft: (d: MountDraft) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  titleId: string;
  error?: string | null;
  onDismissError?: () => void;
}

export const MountForm: React.FC<Props> = ({ draft, setDraft, onSubmit, onCancel, titleId, error, onDismissError }) => {
  const uid = useId();
  const id = (s: string) => `${uid}-${s}`;
  const primerCampo = useRef<HTMLButtonElement>(null);
  const esNueva = !draft.id;

  useEffect(() => {
    primerCampo.current?.focus();
  }, []);

  const especie = (draft.species || 'dragopavo') as SpeciesType;
  const razas = getMountsBySpecies(especie);
  const def = ALL_MOUNTS_DATA.find((m) => m.name === draft.breed && m.species === especie);
  const gens = useMemo(() => Array.from(new Set(razas.map((r) => r.generation))).sort((a, b) => a - b), [razas]);

  const infertil = draft.fertility === 'esteril' || draft.fertility === 'senil';
  const nivel = toNum(draft.currentLevel) || 1;
  const xp = toNum(draft.currentXp);
  const serenidad = toNum(draft.serenity);
  const zona = zonaSerenidad(serenidad);
  const llenos = MEDIDORES.every((m) => toNum(draft[m.key]) >= MAX);
  const fert = FERTILIDAD.find((f) => f.key === (draft.fertility || 'fertil'))!;

  const ponerNivel = (lvl: number) => {
    const n = Math.min(200, Math.max(1, Math.round(lvl)));
    setDraft({ ...draft, currentLevel: n, currentXp: calculateXpForLevel(n) });
  };

  const cambiarEspecie = (sp: SpeciesType) => {
    const lista = getMountsBySpecies(sp);
    // Si el apodo era el nombre de la raza anterior, lo seguimos sincronizando
    const apodoAuto = !draft.nickname || draft.nickname === draft.breed;
    setDraft({
      ...draft,
      species: sp,
      breed: lista[0]?.name || '',
      generation: lista[0]?.generation || 1,
      imageUrl: lista[0]?.imageUrl || '',
      nickname: apodoAuto ? '' : draft.nickname,
    });
  };

  const cambiarRaza = (nombre: string) => {
    const d = ALL_MOUNTS_DATA.find((m) => m.name === nombre && m.species === especie);
    const apodoAuto = !draft.nickname || draft.nickname === draft.breed;
    setDraft({
      ...draft,
      breed: nombre,
      generation: d?.generation || draft.generation,
      imageUrl: d?.imageUrl || draft.imageUrl,
      nickname: apodoAuto ? '' : draft.nickname,
    });
  };

  const numero = (key: 'serenity' | 'love' | 'maturity' | 'stamina', min: number, max: number) => ({
    value: infertil ? 0 : draft[key] ?? 0,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setDraft({ ...draft, [key]: e.target.value === '' ? '' : Number(e.target.value) }),
    onBlur: () =>
      setDraft({
        ...draft,
        [key]: key === 'serenity' ? clampSerenity(toNum(draft.serenity)) : Math.min(max, Math.max(min, toNum(draft[key]))),
      }),
  });

  return (
    <div className="flex flex-col max-h-[calc(100dvh-1.5rem)]">
      {/* Vista previa en vivo: se actualiza al cambiar raza, apodo o sexo */}
      <header className="flex items-start gap-3 p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
        <MountAvatar species={especie} breed={draft.breed || ''} imageUrl={def?.imageUrl || draft.imageUrl} size="lg" />
        <div className="flex-1 min-w-0">
          <p id={titleId} className="text-xs font-bold text-slate-600">
            {esNueva ? 'Añadir montura' : 'Editar montura'}
          </p>
          <p className="font-display text-2xl text-slate-900 leading-tight truncate">
            {draft.nickname?.trim() || draft.breed || 'Sin raza'}{' '}
            <span className={draft.gender === 'F' ? 'text-pink-600' : 'text-sky-700'} aria-label={draft.gender === 'F' ? 'hembra' : 'macho'}>
              {draft.gender === 'F' ? '♀' : '♂'}
            </span>
          </p>
          {def && (
            <p className="text-sm text-slate-600">
              {draft.nickname?.trim() && draft.nickname.trim() !== def.name ? `${def.name}, ` : ''}
              {(ESPECIES.find((e) => e.key === especie)?.label ?? '').toLowerCase()} de generación {def.generation}
            </p>
          )}
          {def && (
            <ul className="flex flex-wrap gap-1 mt-1.5" aria-label="Bonus de la raza">
              {def.bonuses.map((b) => (
                <li key={b} className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="shrink-0 grid place-items-center w-9 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-rose-400"
        >
          <X aria-hidden="true" className="w-5 h-5" />
        </button>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          {error && (
            <div role="alert" className="p-3 rounded-xl text-sm font-semibold flex items-center justify-between gap-2 bg-rose-50 text-rose-800 border border-rose-200">
              <span>{error}</span>
              {onDismissError && (
                <button type="button" onClick={onDismissError} aria-label="Cerrar aviso">
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <Seccion titulo="Raza" icono={<img src={ESPECIES.find((e) => e.key === especie)?.img} alt="" className="w-6 h-6 object-contain" />}>
            <div role="radiogroup" aria-label="Especie" className="grid grid-cols-3 gap-1.5">
              {ESPECIES.map((e) => {
                const activa = especie === e.key;
                return (
                  <button
                    key={e.key}
                    ref={activa ? primerCampo : undefined}
                    type="button"
                    role="radio"
                    aria-checked={activa}
                    onClick={() => cambiarEspecie(e.key)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-h-[48px] px-2 py-1.5 rounded-xl border-2 text-xs sm:text-sm font-bold ${
                      activa ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <img src={e.img} alt="" width="28" height="28" className="w-7 h-7 object-contain" />
                    {e.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={id('raza')} className={etiqueta}>
                  Raza
                </label>
                <select id={id('raza')} value={draft.breed || ''} onChange={(e) => cambiarRaza(e.target.value)} className={campo}>
                  {gens.map((g) => (
                    <optgroup key={g} label={`Generación ${g}`}>
                      {razas
                        .filter((r) => r.generation === g)
                        .map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={id('apodo')} className={etiqueta}>
                  Apodo <span className="font-medium text-slate-500">(opcional)</span>
                </label>
                <input
                  id={id('apodo')}
                  type="text"
                  value={draft.nickname || ''}
                  onChange={(e) => setDraft({ ...draft, nickname: e.target.value })}
                  placeholder={draft.breed || 'Ej. Canela'}
                  className={campo}
                />
              </div>
            </div>

            <div>
              <span id={id('sexo')} className={etiqueta}>
                Sexo
              </span>
              <div role="radiogroup" aria-labelledby={id('sexo')} className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    ['M', '♂', 'Macho', 'bg-sky-50 border-sky-600 text-sky-900'],
                    ['F', '♀', 'Hembra', 'bg-pink-50 border-pink-600 text-pink-900'],
                  ] as const
                ).map(([g, s, label, activo]) => (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={(draft.gender || 'M') === g}
                    onClick={() => setDraft({ ...draft, gender: g })}
                    className={`min-h-[42px] rounded-xl border-2 text-sm font-bold ${
                      (draft.gender || 'M') === g ? activo : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span aria-hidden="true" className="text-base mr-1">
                      {s}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Seccion>

          <Seccion titulo="Nivel y experiencia" icono={<IconCalculadora className="w-6 h-6" />}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={id('nivel')} className={etiqueta}>
                  Nivel
                </label>
                <input
                  id={id('nivel')}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={200}
                  value={draft.currentLevel ?? 1}
                  onChange={(e) => setDraft({ ...draft, currentLevel: e.target.value === '' ? '' : Number(e.target.value) })}
                  onBlur={() => ponerNivel(toNum(draft.currentLevel) || 1)}
                  className={`${campo} font-bold`}
                />
              </div>
              <div>
                <label htmlFor={id('xp')} className={etiqueta}>
                  Experiencia
                </label>
                <input
                  id={id('xp')}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MAX_MOUNT_XP}
                  value={draft.currentXp ?? 0}
                  onChange={(e) => setDraft({ ...draft, currentXp: e.target.value === '' ? '' : Number(e.target.value) })}
                  onBlur={() => {
                    const v = Math.min(MAX_MOUNT_XP, Math.max(0, toNum(draft.currentXp)));
                    setDraft({ ...draft, currentXp: v, currentLevel: calculateLevelFromXp(v) });
                  }}
                  className={`${campo} font-bold`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <input
                type="range"
                min={1}
                max={200}
                value={nivel}
                onChange={(e) => ponerNivel(Number(e.target.value))}
                aria-label="Ajustar el nivel"
                className="w-full"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-600">
                  {nivel >= 200 || xp >= MAX_MOUNT_XP ? (
                    <strong className="text-emerald-700">Nivel máximo alcanzado</strong>
                  ) : (
                    <>Le faltan {formatNumber(MAX_MOUNT_XP - xp)} XP para el nivel 200</>
                  )}
                </span>
                <span className="flex gap-1">
                  {[1, 100, 200].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => ponerNivel(n)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${nivel === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500'}`}
                    >
                      Nivel {n}
                    </button>
                  ))}
                </span>
              </div>
            </div>
          </Seccion>

          <Seccion titulo="Crianza" icono={<IconEstablo className="w-6 h-6" />}>
            <div>
              <span id={id('fert')} className={etiqueta}>
                Fertilidad
              </span>
              <div role="radiogroup" aria-labelledby={id('fert')} className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {FERTILIDAD.map((f) => {
                  const activa = (draft.fertility || 'fertil') === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      role="radio"
                      aria-checked={activa}
                      onClick={() => setDraft({ ...draft, fertility: f.key })}
                      className={`flex items-center justify-center gap-1.5 min-h-[42px] px-2 rounded-xl border-2 text-sm font-bold ${
                        activa ? 'bg-white border-blue-600 text-slate-900 shadow-[0_2px_0_#33550f]' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${f.punto}`} aria-hidden="true" />
                      {FERTILITY_LABELS[f.key]}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-600 mt-1.5">{fert.ayuda}</p>
            </div>

            <div>
              <label htmlFor={id('cap')} className={etiqueta}>
                Capacidad especial
              </label>
              <select
                id={id('cap')}
                value={draft.capacity || 'ninguna'}
                onChange={(e) => setDraft({ ...draft, capacity: e.target.value as SpecialCapacity })}
                className={campo}
              >
                {(Object.keys(CAPACITY_LABELS) as SpecialCapacity[]).map((c) => (
                  <option key={c} value={c}>
                    {CAPACITY_LABELS[c]}
                  </option>
                ))}
              </select>
              <p className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
                {draft.capacity && draft.capacity !== 'ninguna' && <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-[#b8861f]" />}
                {CAPACIDAD[(draft.capacity as SpecialCapacity) || 'ninguna']}
              </p>
            </div>

            {infertil ? (
              <p className="text-sm text-slate-700 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                Una montura {draft.fertility === 'senil' ? 'senil' : 'estéril'} no usa serenidad ni medidores, así que no hace falta
                rellenarlos.
              </p>
            ) : (
              <>
                {/* Serenidad: barra con las cuatro zonas del juego */}
                <div>
                  <div className="flex items-end justify-between gap-2">
                    <label htmlFor={id('ser')} className={etiqueta}>
                      Serenidad
                    </label>
                    <input
                      id={id('ser')}
                      type="number"
                      inputMode="numeric"
                      min={SERENITY_MIN}
                      max={SERENITY_MAX}
                      step={100}
                      {...numero('serenity', SERENITY_MIN, SERENITY_MAX)}
                      className="w-28 min-h-[36px] px-3 rounded-xl border-2 border-slate-300 bg-white text-sm text-slate-900 text-right font-bold focus:border-blue-500"
                    />
                  </div>
                  <div className="relative mt-1.5">
                    <div className="flex h-2.5 rounded-full overflow-hidden" aria-hidden="true">
                      <span className="bg-amber-400" style={{ width: '30%' }} />
                      <span className="bg-orange-300" style={{ width: '20%' }} />
                      <span className="bg-fuchsia-300" style={{ width: '20%' }} />
                      <span className="bg-pink-400" style={{ width: '30%' }} />
                    </div>
                    <input
                      type="range"
                      min={SERENITY_MIN}
                      max={SERENITY_MAX}
                      step={100}
                      value={serenidad}
                      onChange={(e) => setDraft({ ...draft, serenity: Number(e.target.value) })}
                      aria-label="Ajustar la serenidad"
                      className="rango-serenidad absolute inset-x-0 -top-1.5 w-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1" aria-hidden="true">
                    <span>−5.000</span>
                    <span>0</span>
                    <span>5.000</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">En esta zona: {zona.texto.toLowerCase()}</p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                  {MEDIDORES.map((m) => {
                    const v = toNum(draft[m.key]);
                    const sube = zona.suben.includes(m.key) && v < MAX;
                    return (
                      <div key={m.key} className={`p-1.5 sm:p-2.5 rounded-xl border-2 ${sube ? 'border-blue-400 bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
                        <label htmlFor={id(m.key)} className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-800">
                          <m.Icon aria-hidden="true" className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${m.icono}`} fill="currentColor" />
                          <span className="truncate">{m.label}</span>
                        </label>
                        <input
                          id={id(m.key)}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={MAX}
                          step={500}
                          {...numero(m.key, 0, MAX)}
                          className="w-full mt-1 min-h-[36px] px-2 rounded-lg border-2 border-slate-300 bg-white text-sm text-slate-900 font-bold focus:border-blue-500"
                        />
                        <div className="mt-1.5 h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                          <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min(100, (v / MAX) * 100)}%` }} />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-x-1 mt-1">
                          {sube ? (
                            <span className="text-[10px] font-bold text-blue-800">Sube ahora</span>
                          ) : (
                            <span className="text-[10px] text-slate-500">{v >= MAX ? 'Lleno' : 'de 20.000'}</span>
                          )}
                          {v < MAX && (
                            <button
                              type="button"
                              onClick={() => setDraft({ ...draft, [m.key]: MAX })}
                              aria-label={`Llenar ${m.label.toLowerCase()}`}
                              className="text-[11px] font-bold text-blue-800 hover:underline"
                            >
                              Llenar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Avisos que se anticipan a lo que el juego hará */}
                {llenos && draft.fertility === 'fertil' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-sm text-amber-950">
                    <span>
                      <strong>Los tres medidores están llenos.</strong> En el juego ya está fecunda.
                    </span>
                    <button type="button" onClick={() => setDraft({ ...draft, fertility: 'fecunda' })} className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold">
                      Marcar como fecunda
                    </button>
                  </div>
                )}
                {!llenos && draft.fertility === 'fecunda' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-sm text-blue-950">
                    <span>Para estar fecunda necesita los tres medidores a 20.000.</span>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, love: MAX, maturity: MAX, stamina: MAX })}
                      className="shrink-0 px-3 py-1.5 rounded-lg border-2 border-blue-600 bg-white text-blue-900 text-xs font-bold"
                    >
                      Llenar los tres
                    </button>
                  </div>
                )}
              </>
            )}
          </Seccion>

          <Seccion titulo="Notas" icono={<span className="text-lg">✎</span>}>
            <label htmlFor={id('notas')} className="sr-only">
              Notas
            </label>
            <textarea
              id={id('notas')}
              value={draft.notes || ''}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={2}
              className={`${campo} py-2`}
              placeholder="Por ejemplo: pareja prevista, cercado donde está o de quién la compraste"
            />
          </Seccion>
        </div>

        <footer className="flex items-center justify-end gap-2 px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:underline">
            Cancelar
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-extrabold bg-blue-700 text-white">
            {esNueva ? 'Añadir al establo' : 'Guardar cambios'}
          </button>
        </footer>
      </form>
    </div>
  );
};
