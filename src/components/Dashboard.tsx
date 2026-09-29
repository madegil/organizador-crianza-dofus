import React, { useEffect, useState } from 'react';
import type { UserMount } from '../types/mount';
import { MountTable } from './MountTable';
import { BreedingGuide } from './BreedingGuide';
import { db, initSeedDataIfEmpty } from '../db/mountsDb';

export const Dashboard: React.FC = () => {
  const [mounts, setMounts] = useState<UserMount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMounts = async () => {
    await initSeedDataIfEmpty();
    const all = await db.mounts.toArray();
    setMounts(all);
    setLoading(false);
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <BreedingGuide />
      <MountTable mounts={mounts} onDataChanged={fetchMounts} />
    </div>
  );
};
