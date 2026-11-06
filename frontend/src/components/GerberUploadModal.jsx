import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { uploadGerberFile, runSampleDfm } from '../services/api.js';

export const GerberUploadModal = ({ isOpen, onClose }) => {
  const { pcbConfig, setPcbConfig, showToast } = useConfig();
  const [analyzing, setAnalyzing] = useState(false);
  const [dfmResults, setDfmResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const processDfmResult = (data) => {
    setDfmResults(data);
    setPcbConfig(prev => ({
      ...prev,
      uploadedFiles: [data.fileName, ...prev.uploadedFiles],
      dfmPassed: data.overallStatus === 'APPROVED_FOR_FABRICATION'
    }));
    showToast(`DFM analysis complete for ${data.fileName}! Score: ${data.drcScore}/100`, 'success');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setDfmResults(null);
    try {
      const data = await uploadGerberFile(file);
      processDfmResult(data);
    } catch (err) {
      showToast(err.message || 'DFM upload failed. Please try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setDfmResults(null);
    try {
      const data = await uploadGerberFile(file);
      processDfmResult(data);
    } catch (err) {
      showToast(err.message || 'DFM upload failed.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = async () => {
    setAnalyzing(true);
    setDfmResults(null);
    try {
      const data = await runSampleDfm();
      processDfmResult(data);
    } catch (err) {
      showToast(err.message || 'Sample DFM failed.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm" />

      <div className="relative bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-lg shadow-2xl border border-outline-variant/30 z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/20">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">cloud_upload</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Upload Gerber Production Package
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Dropzone Area */}
        <label
          className={`border-2 border-dashed rounded-xl p-space-xl flex flex-col items-center justify-center cursor-pointer transition-all text-center group ${
            dragOver
              ? 'border-primary bg-primary-fixed/20'
              : 'border-outline-variant hover:border-primary bg-surface-container-low/40 hover:bg-surface-container-low'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".zip,.rar,.tar,.gz,.gerber,.gbr,.kicad_pcb,.brd"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[36px]">file_open</span>
          </div>
          <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-1">
            Drag &amp; Drop Gerber Archive (.ZIP) or Click to Browse
          </h4>
          <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mb-space-sm">
            Supported: RS-274X, Gerber X2, KiCad, Eagle .BRD, Altium. Max 25MB.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary text-on-primary rounded-lg text-xs font-semibold shadow-sm">
              Select Local File
            </span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); loadSample(); }}
              className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition-colors"
            >
              Load Sample Gerber
            </button>
          </div>
        </label>

        {/* Analyzing Animation */}
        {analyzing && (
          <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            <div>
              <p className="font-headline-sm text-xs font-bold text-on-surface">
                Running Automated Cloud DFM Engine v4.8...
              </p>
              <p className="font-label-sm text-[11px] text-on-surface-variant">
                Scanning annular rings, netlist air-wires, and solder mask bridges.
              </p>
            </div>
          </div>
        )}

        {/* DFM Results — from real backend */}
        {dfmResults && (
          <div className="mt-space-md p-space-md rounded-xl bg-secondary-container/40 border border-secondary/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-secondary font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>DFM Passed: {dfmResults.fileName}</span>
              </div>
              <span className="font-label-sm text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded font-bold">
                {dfmResults.drcScore}/100
              </span>
            </div>

            {/* Individual check rows */}
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {(dfmResults.checks || []).map((chk) => (
                <div key={chk.id} className="flex items-center justify-between bg-surface-container-lowest/80 px-2 py-1 rounded text-xs font-mono">
                  <span className="text-on-surface-variant truncate mr-2">{chk.name}</span>
                  <span className={`font-bold shrink-0 ${chk.status === 'PASS' ? 'text-secondary' : 'text-error'}`}>
                    {chk.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-on-surface-variant">
              {dfmResults.manufacturingTier}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 py-2 bg-secondary text-on-secondary rounded-lg font-headline-sm text-xs font-bold hover:bg-secondary/90 transition-all"
            >
              Confirm &amp; Attach to Production Order
            </button>
          </div>
        )}

        {/* Helper Note */}
        <div className="mt-space-sm pt-space-xs text-[11px] text-on-surface-variant flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[14px]">lock</span>
            <span>256-bit AES NDA Protected</span>
          </span>
          <span>Automatic IPC-6012 Rule Check</span>
        </div>
      </div>
    </div>
  );
};

export default GerberUploadModal;
