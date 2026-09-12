import React, { useRef, useState } from 'react';
import { Download, Upload, FileSpreadsheet, FileJson, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import type { UserMount } from '../types/mount';
import { downloadExcelTemplate, downloadCsvTemplate, exportMountsToExcel, exportMountsToJson, parseExcelFile } from '../utils/excelHelper';
import { db } from '../db/mountsDb';

interface ExcelManagerProps {
  mounts: UserMount[];
  onDataChanged: () => void;
}

export const ExcelManager: React.FC<ExcelManagerProps> = ({ mounts, onDataChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const parsedMounts = await parseExcelFile(file);
      await db.mounts.bulkPut(parsedMounts);
      setStatusMessage({
        type: 'success',
        text: `¡Éxito! Se importaron ${parsedMounts.length} monturas correctamente al inventario.`,
      });
      onDataChanged();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al procesar el archivo Excel.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-dofus-card rounded-xl sm:rounded-2xl border border-dofus-border p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dofus-border pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Gestor de Excel y Respaldos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Importa tus monturas masivamente desde Excel o descarga tu inventario actual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadExcelTemplate}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            title="Descarga la plantilla en formato Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-emerald-100" />
            Descargar Plantilla (.xlsx)
          </button>
          <button
            onClick={downloadCsvTemplate}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
            title="Descarga la plantilla en formato CSV universal (.csv)"
          >
            <Download className="w-4 h-4 text-sky-400" />
            Plantilla CSV (.csv)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Subida de Excel */}
        <div className="border-2 border-dashed border-dofus-border hover:border-emerald-500/50 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center bg-slate-900/40 transition">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
            id="excel-upload-input"
          />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2.5 text-emerald-400">
            {isProcessing ? <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Upload className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
          <label
            htmlFor="excel-upload-input"
            className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-emerald-500/20 transition mb-1.5"
          >
            Seleccionar archivo Excel
          </label>
          <p className="text-[11px] text-slate-400">O arrastra el archivo directamente aquí</p>
        </div>

        {/* Exportación */}
        <div className="bg-slate-900/60 rounded-xl p-4 sm:p-6 border border-dofus-border flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">Exportar Base de Datos Local</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Actualmente tienes <strong className="text-amber-400 font-mono">{mounts.length}</strong> monturas registradas en IndexedDB.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => exportMountsToExcel(mounts)}
              disabled={mounts.length === 0}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={() => exportMountsToJson(mounts)}
              disabled={mounts.length === 0}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-sky-700/80 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};
