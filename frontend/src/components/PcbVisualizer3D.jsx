import React, { useState } from 'react';

export const PcbVisualizer3D = ({
  colorClass = 'bg-[#004ac6]',
  colorHex = '#004ac6',
  colorName = 'Precision Cobalt Blue',
  finishName = 'ENIG Gold',
  dimensions = '100 × 80 mm',
  layers = 2,
  thickness = '1.6mm',
  copperWeight = '1oz'
}) => {
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  // Pad color depending on finish
  const padColor = finishName.toLowerCase().includes('enig')
    ? '#facc15' // Gold
    : finishName.toLowerCase().includes('silver')
    ? '#e2e8f0' // Silver
    : '#cbd5e1'; // HASL Tin

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md overflow-hidden">
      {/* Visualizer Controls Header */}
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface text-xs">
            Interactive 3D Board Canvas
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRotate}
            type="button"
            className="p-1.5 rounded bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            title="Rotate View 90°"
          >
            <span className="material-symbols-outlined text-[16px]">3d_rotation</span>
          </button>
          <button
            onClick={handleFlip}
            type="button"
            className="p-1.5 rounded bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            title="Flip Board Side"
          >
            <span className="material-symbols-outlined text-[16px]">flip</span>
          </button>
          <span className="font-label-sm text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-mono">
            {isFlipped ? 'Bottom Layer (B.Cu)' : 'Top Layer (F.Cu)'}
          </span>
        </div>
      </div>

      {/* Synthetic High-Precision PCB Vector Render Canvas */}
      <div className="relative w-full h-64 rounded-xl bg-[#0a1128] overflow-hidden flex items-center justify-center p-4 shadow-inner group">
        {/* Engineering Radial Grid Underlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>

        {/* Rendered PCB Substrate Box */}
        <div
          style={{
            backgroundColor: colorHex,
            transform: `rotate(${rotation}deg) ${isFlipped ? 'scaleX(-1)' : ''}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          className="relative w-72 h-48 rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between p-3.5 border border-white/20"
        >
          {/* Edge Chamfer & Mounting Holes with ENIG gold rings */}
          <div className="flex justify-between items-start">
            <div
              style={{ borderColor: padColor }}
              className="w-4 h-4 rounded-full bg-[#0a1128] border-2 flex items-center justify-center shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0a1128]"></div>
            </div>
            {/* Silkscreen Marking */}
            <div className="font-label-sm text-[8px] text-white/90 tracking-widest uppercase font-mono font-bold bg-black/20 px-1.5 py-0.5 rounded">
              PCB-HUB v2.4 • {layers}L
            </div>
            <div
              style={{ borderColor: padColor }}
              className="w-4 h-4 rounded-full bg-[#0a1128] border-2 flex items-center justify-center shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0a1128]"></div>
            </div>
          </div>

          {/* Circuit Trace Schematics & IC Footprint */}
          <div className="relative flex items-center justify-center my-auto">
            {/* Golden Chip Footprint */}
            <div className="relative w-20 h-20 bg-[#0f172a] rounded flex items-center justify-center shadow-md border border-slate-700">
              <div className="font-label-sm text-[8px] text-primary-container font-mono text-center leading-tight">
                CORTEX-M4<br />
                <span className="text-[7px] text-white/70">120MHz</span>
              </div>
              {/* Pins around perimeter */}
              <div className="absolute -top-1.5 left-2 right-2 flex justify-between">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={`pin-t-${i}`}
                    style={{ backgroundColor: padColor }}
                    className="w-1 h-1.5 rounded-t-sm shadow"
                  ></span>
                ))}
              </div>
              <div className="absolute -bottom-1.5 left-2 right-2 flex justify-between">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={`pin-b-${i}`}
                    style={{ backgroundColor: padColor }}
                    className="w-1 h-1.5 rounded-b-sm shadow"
                  ></span>
                ))}
              </div>
              <div className="absolute -left-1.5 top-2 bottom-2 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={`pin-l-${i}`}
                    style={{ backgroundColor: padColor }}
                    className="h-1 w-1.5 rounded-l-sm shadow"
                  ></span>
                ))}
              </div>
              <div className="absolute -right-1.5 top-2 bottom-2 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={`pin-r-${i}`}
                    style={{ backgroundColor: padColor }}
                    className="h-1 w-1.5 rounded-r-sm shadow"
                  ></span>
                ))}
              </div>
            </div>

            {/* Traces */}
            <div
              style={{ backgroundColor: padColor }}
              className="absolute -left-4 top-1 w-9 h-0.5 opacity-80 transform rotate-12"
            ></div>
            <div
              style={{ backgroundColor: padColor }}
              className="absolute -left-4 bottom-1 w-8 h-0.5 opacity-80 transform -rotate-12"
            ></div>
            <div
              style={{ backgroundColor: padColor }}
              className="absolute -right-4 top-1 w-10 h-0.5 opacity-80 transform -rotate-6"
            ></div>
            <div
              style={{ backgroundColor: padColor }}
              className="absolute -right-4 bottom-2 w-9 h-0.5 opacity-80 transform rotate-12"
            ></div>
          </div>

          {/* Bottom Mounting Holes & Trace bus */}
          <div className="flex justify-between items-end">
            <div
              style={{ borderColor: padColor }}
              className="w-4 h-4 rounded-full bg-[#0a1128] border-2 flex items-center justify-center shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0a1128]"></div>
            </div>
            {/* Monospaced QA Stamp */}
            <div className="font-label-sm text-[7px] text-white/80 font-mono tracking-tight">
              {finishName.toUpperCase()} / {thickness} / RoHS
            </div>
            <div
              style={{ borderColor: padColor }}
              className="w-4 h-4 rounded-full bg-[#0a1128] border-2 flex items-center justify-center shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0a1128]"></div>
            </div>
          </div>
        </div>

        {/* Inspect Overlay Watermark */}
        <div className="absolute bottom-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-label-sm text-on-surface font-semibold shadow">
          Live Render: {colorName}
        </div>
      </div>

      {/* Board Specs Summary Chips */}
      <div className="flex flex-wrap gap-1.5 mt-space-sm pt-space-xs">
        <span className="font-label-sm text-[11px] bg-surface-container-low text-on-surface px-2 py-1 rounded font-medium">
          {dimensions}
        </span>
        <span className="font-label-sm text-[11px] bg-surface-container-low text-on-surface px-2 py-1 rounded font-medium">
          {layers}-Layer FR-4
        </span>
        <span className="font-label-sm text-[11px] bg-surface-container-low text-on-surface px-2 py-1 rounded font-medium">
          {thickness}
        </span>
        <span className="font-label-sm text-[11px] bg-surface-container-low text-on-surface px-2 py-1 rounded font-medium">
          {copperWeight} Cu
        </span>
        <span className="font-label-sm text-[11px] bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded font-bold">
          {finishName}
        </span>
      </div>
    </div>
  );
};

export default PcbVisualizer3D;

