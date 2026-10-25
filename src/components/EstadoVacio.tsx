import React from 'react';

interface EstadoVacioProps {
  titulo: string;
  children?: React.ReactNode;
}

/** Mensaje para listas sin contenido: un título claro y qué hacer a continuación */
export const EstadoVacio: React.FC<EstadoVacioProps> = ({ titulo, children }) => (
  <div className="flex flex-col items-center text-center gap-1.5 py-12 px-4">
    <p className="font-display text-xl text-slate-900">{titulo}</p>
    {children && <div className="text-sm text-slate-600 max-w-md">{children}</div>}
  </div>
);
