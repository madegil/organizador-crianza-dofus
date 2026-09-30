import React, { useEffect, useState } from 'react';
import type { UserMount } from '../types/mount';
import { MountTable } from './MountTable';
import { BreedingGuide } from './BreedingGuide';
import { db, normalizeStoredMounts } from '../db/mountsDb';

export const Dashboard: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchMounts = async () => {
    setLoadError(false);
    try {
      await normalizeStoredMounts();
      const all = await db.mounts.toArray();
      setMounts(all);
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 max-w-lg mx-auto my-12 text-rose-900">
        <p className="text-sm font-semibold">
          No se pudo acceder al almacenamiento local (¿modo privado o almacenamiento bloqueado?)
        </p>
        <button
          onClick={() => {
            setLoading(true);
            fetchMounts();
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <BreedingGuide />
      <MountTable mounts={mounts} onDataChanged={fetchMounts} />
    </div>
  );
};
