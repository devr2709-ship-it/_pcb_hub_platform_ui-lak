import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { PcbVisualizer3D } from '../components/PcbVisualizer3D';

export const CustomPcbConfiguratorPage = ({ onOpenUploadModal }) => {
  const navigate = useNavigate();
  const {
    pcbConfig,
    setPcbConfig,
    addToCart,
    calculateCurrentTotal,
    formatPrice,
    showToast
  } = useConfig();

  const solderMaskOptions = [
    { id: 'green', name: 'Classic Green', hex: '#006c4a', bgClass: 'bg-[#006c4a]', label: 'Classic', sub: 'Green' },
    { id: 'blue', name: 'Precision Cobalt Blue', hex: '#004ac6', bgClass: 'bg-[#004ac6]', label: 'Cobalt', sub: 'Blue' },
    { id: 'black', name: 'Matte Black', hex: '#18181b', bgClass: 'bg-[#18181b]', label: 'Matte', sub: 'Black' },
    { id: 'red', name: 'Signal Red', hex: '#ba1a1a', bgClass: 'bg-[#ba1a1a]', label: 'Signal', sub: 'Red' },
    { id: 'white', name: 'Polar White', hex: '#f8fafc', bgClass: 'bg-[#f8fafc]', label: 'Polar', sub: 'White' },
    { id: 'yellow', name: 'Industrial Yellow', hex: '#ca8a04', bgClass: 'bg-[#eab308]', label: 'Industrial', sub: 'Yellow' }
  ];

  const surfaceFinishOptions = [
    { id: 'hasl', name: 'Lead-Free HASL', desc: 'Sn/Cu/Ni Hot Air Level', extra: 0 },
    { id: 'enig', name: 'ENIG Gold', desc: 'Electroless Ni / Immersion Au', extra: 150, verified: true },
    { id: 'osp', name: 'OSP Organic', desc: 'Solderability Preservative', extra: 80 },
    { id: 'silver', name: 'Immersion Silver', desc: 'High Frequency RF', extra: 210 }
  ];

  const quantityOptions = [
    { qty: 5, price: 299 },
    { qty: 10, price: 450 },
    { qty: 20, price: 780, badge: true, label: '-24% Save' },
    { qty: 50, price: 1620, badge: true, label: '-45% Save' },
    { qty: 100, price: 2850, badge: true, label: 'Batch Rate' },
    { qty: 'custom', price: null, rate: 'Quote >500' }
  ];

  const layerOptions = [
    { count: 1, label: '1 Layer', sub: 'Single-sided' },
    { count: 2, label: '2 Layers', sub: 'Top + Bottom' },
    { count: 4, label: '4 Layers', sub: 'GND/PWR planes' },
    { count: 6, label: '6 Layers', sub: 'Controlled Z' },
    { count: 8, label: '8 Layers', sub: 'High Speed' },
    { count: 10, label: '10+ Layers', sub: 'Custom HDI' }
  ];

  const copperWeights = [
    { id: '1oz', name: '1 oz (35μm)', sub: 'Standard Digital' },
    { id: '2oz', name: '2 oz (70μm)', sub: 'High Current' },
    { id: '3oz', name: '3 oz Heavy', sub: 'Power Stage' }
  ];

  const boardThicknesses = ['0.8mm', '1.0mm', '1.6mm', '2.0mm'];

  // Dimensions & Area
  const areaCm2 = (pcbConfig.length * pcbConfig.width) / 100;
  const areaM2 = areaCm2 / 10000;
  const currentTotal = calculateCurrentTotal();

  const handleAddToCartAndProceed = () => {
    addToCart();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1440px] mx-auto px-margin pt-space-lg pb-space-xl">
        {/* Breadcrumb & Industrial Status Stepper */}
        <div className="mb-space-lg bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/30">
          <div className="flex items-center gap-space-sm overflow-x-auto pb-1 md:pb-0">
            {/* Step 1: Done */}
            <Link to="/product-selection" className="flex items-center gap-space-xs shrink-0 hover:opacity-80">
              <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-mono text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="font-label-md text-xs text-on-surface font-semibold">1. Selection</span>
            </Link>
            <div className="w-8 h-0.5 bg-secondary shrink-0"></div>

            {/* Step 2: Active */}
            <div className="flex items-center gap-space-xs shrink-0">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,74,198,0.4)]">
                2
              </div>
              <span className="font-label-md text-xs text-primary font-bold">2. PCB Configuration</span>
              <span className="bg-primary-fixed text-on-primary-fixed font-mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                Active
              </span>
            </div>
            <div className="w-8 h-0.5 bg-surface-container-highest shrink-0"></div>

            {/* Step 3: Pending */}
            <div className="flex items-center gap-space-xs shrink-0 text-on-surface-variant">
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-mono text-xs font-semibold">
                3
              </div>
              <span className="font-label-md text-xs">3. Design Verification</span>
            </div>
            <div className="w-8 h-0.5 bg-surface-container-highest shrink-0"></div>

            {/* Step 4: Checkout */}
            <div className="flex items-center gap-space-xs shrink-0 text-on-surface-variant">
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-mono text-xs font-semibold">
                4
              </div>
              <span className="font-label-md text-xs">4. Checkout</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              DRC Engine v4.8 Online
            </span>
            <span className="bg-surface-container text-on-surface font-label-sm text-xs px-2.5 py-1 rounded-md font-semibold">
              IPC Class 2 Standard
            </span>
          </div>
        </div>

        {/* Header Block */}
        <div className="mb-space-xl flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">
                Foundry Configurator
              </span>
              <span className="text-on-surface-variant text-xs">/</span>
              <span className="font-label-sm text-xs text-on-surface-variant">Spec: FR4-STD-2025</span>
            </div>
            <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight">
              Customize Your PCB
            </h1>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl mt-1">
              Configure precise fabrication parameters, copper weights, solder mask finishes, and upload production files.
            </p>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low p-2 rounded-xl text-on-surface-variant font-label-sm text-xs border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
            <span>Lead time starts upon DFM Gerber clearance</span>
          </div>
        </div>

        {/* 2 Column Master Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* LEFT COLUMN: Deep Technical Parameter Stack */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-xl">
            {/* SECTION 1: Board Dimensions & Quantity */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low -mx-space-lg -mt-space-lg p-space-lg rounded-t-2xl border-b border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      Board Geometry &amp; Batch Size
                    </h2>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Physical sizing, layer stacks, and fabrication quantity lot.
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-xs bg-surface-container-high text-primary px-2.5 py-1 rounded font-bold">
                  Substrate: Double-Sided FR-4
                </span>
              </div>

              {/* Layer Selector */}
              <div className="mb-space-lg">
                <div className="flex items-center justify-between mb-space-xs">
                  <label className="font-headline-sm text-sm font-bold text-on-surface">
                    Number of Copper Layers
                  </label>
                  <span className="font-label-sm text-xs text-on-surface-variant">
                    Stackup: {pcbConfig.boardThickness} 1/1oz FR-4
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-space-xs">
                  {layerOptions.map((layer) => {
                    const isSelected = pcbConfig.layers === layer.count;
                    return (
                      <button
                        key={layer.count}
                        type="button"
                        onClick={() => setPcbConfig(prev => ({ ...prev, layers: layer.count }))}
                        className={`py-2.5 px-3 rounded-xl font-label-md text-xs transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-md font-bold'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className="font-bold">{layer.label}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                          {layer.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dimensions & Visual Aspect Display */}
              <div className="mb-space-lg grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                <div className="md:col-span-7 flex flex-col gap-space-sm">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    Dimensions (Length × Width)
                  </span>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="relative bg-surface-container-low rounded-xl p-2.5 border border-outline-variant/30">
                      <label className="block font-label-sm text-[11px] text-on-surface-variant mb-1">Board Length</label>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          min={10}
                          max={500}
                          value={pcbConfig.length}
                          onChange={(e) => setPcbConfig(prev => ({ ...prev, length: parseFloat(e.target.value) || 10 }))}
                          className="w-full bg-transparent font-mono text-base font-bold text-on-surface focus:outline-none"
                        />
                        <span className="font-label-sm text-xs text-on-surface-variant">mm</span>
                      </div>
                    </div>
                    <div className="relative bg-surface-container-low rounded-xl p-2.5 border border-outline-variant/30">
                      <label className="block font-label-sm text-[11px] text-on-surface-variant mb-1">Board Width</label>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          min={10}
                          max={500}
                          value={pcbConfig.width}
                          onChange={(e) => setPcbConfig(prev => ({ ...prev, width: parseFloat(e.target.value) || 10 }))}
                          className="w-full bg-transparent font-mono text-base font-bold text-on-surface focus:outline-none"
                        />
                        <span className="font-label-sm text-xs text-on-surface-variant">mm</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-xs px-1">
                    <span>Calculated Total Surface Area:</span>
                    <span className="font-mono font-bold text-on-surface">
                      {areaCm2.toFixed(2)} cm² ({areaM2.toFixed(4)} m²)
                    </span>
                  </div>
                </div>

                {/* Aspect Ratio Indicator Canvas */}
                <div className="md:col-span-5 bg-surface-container-low rounded-2xl p-space-md flex flex-col items-center justify-center min-h-[140px] border border-outline-variant/30">
                  <div className="text-[11px] font-label-sm text-on-surface-variant mb-2">
                    Geometric Footprint (Scale: 1:1.25)
                  </div>
                  <div className="w-32 h-24 rounded-lg bg-primary-container/20 flex items-center justify-center relative shadow-inner border border-primary/30">
                    <span className="font-mono text-[10px] text-primary font-bold">
                      {pcbConfig.length} × {pcbConfig.width} mm
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 left-1.5"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 right-1.5"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1.5 left-1.5"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1.5 right-1.5"></span>
                  </div>
                  <span className="font-label-sm text-[10px] text-secondary font-semibold mt-1">
                    Standard Panelization Fit: 94.2%
                  </span>
                </div>
              </div>

              {/* Quantity Matrix Selection */}
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <label className="font-headline-sm text-sm font-bold text-on-surface">
                    Fabrication Quantity
                  </label>
                  <span className="font-label-sm text-xs text-secondary font-bold">Volume Savings Active</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-xs">
                  {quantityOptions.map((opt, i) => {
                    const isSelected = pcbConfig.quantity === opt.qty;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (opt.qty !== 'custom') {
                            setPcbConfig(prev => ({ ...prev, quantity: opt.qty }));
                          } else {
                            showToast('Custom volume quote request initiated. Contact foundry support.');
                          }
                        }}
                        className={`p-2.5 rounded-xl text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-sm font-bold'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold">
                            {opt.qty === 'custom' ? 'Custom' : `${opt.qty} pcs`}
                          </span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="font-mono text-xs font-bold">
                            {opt.price ? formatPrice(opt.price) : 'Quote >500'}
                          </div>
                          <div className={`font-mono text-[10px] ${
                            isSelected
                              ? 'text-on-primary-container'
                              : opt.badge ? 'text-secondary font-medium' : 'text-on-surface-variant'
                          }`}>
                            {opt.price ? `${formatPrice(opt.price / opt.qty)}/pc` : opt.rate}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 2: Metallurgy, Masking & Physical Finishes */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low -mx-space-lg -mt-space-lg p-space-lg rounded-t-2xl border-b border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      Metallurgy, Masking &amp; Physical Finishes
                    </h2>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Substrate layers, plating types, and optical legend parameters.
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-xs text-on-surface-variant">
                  Class: Commercial Grade IPC-A-600
                </span>
              </div>

              <div className="space-y-space-lg">
                {/* Solder Mask Color Selection with Rich Swatches */}
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <label className="font-headline-sm text-sm font-bold text-on-surface">
                      PCB Solder Mask Color
                    </label>
                    <span className="font-label-sm text-xs text-primary font-bold">
                      {pcbConfig.solderMask.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-xs">
                    {solderMaskOptions.map((mask) => {
                      const isSelected = pcbConfig.solderMask.id === mask.id;
                      return (
                        <button
                          key={mask.id}
                          type="button"
                          onClick={() => {
                            setPcbConfig(prev => ({
                              ...prev,
                              solderMask: {
                                id: mask.id,
                                name: mask.name,
                                colorHex: mask.hex,
                                bgClass: mask.bgClass
                              }
                            }));
                          }}
                          className={`p-2.5 rounded-xl flex items-center gap-space-xs text-left transition-all border ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-sm border-primary font-bold'
                              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                          }`}
                        >
                          <span
                            style={{ backgroundColor: mask.hex }}
                            className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-white/30"
                          ></span>
                          <div className="min-w-0">
                            <span className="block font-mono text-xs font-semibold truncate">{mask.label}</span>
                            <span className={`block text-[10px] truncate ${
                              isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                            }`}>
                              {mask.sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Surface Finish Grid */}
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <label className="font-headline-sm text-sm font-bold text-on-surface">
                      Surface Plating Finish
                    </label>
                    <span className="font-label-sm text-xs text-on-surface-variant">Recommended for fine-pitch BGA</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-xs">
                    {surfaceFinishOptions.map((finish) => {
                      const isSelected = pcbConfig.surfaceFinish.id === finish.id;
                      return (
                        <button
                          key={finish.id}
                          type="button"
                          onClick={() => {
                            setPcbConfig(prev => ({
                              ...prev,
                              surfaceFinish: {
                                id: finish.id,
                                name: finish.name,
                                extra: finish.extra,
                                included: finish.extra === 0
                              }
                            }));
                          }}
                          className={`p-3 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-sm border-primary'
                              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="block font-mono text-xs font-bold">{finish.name}</span>
                            {finish.verified && (
                              <span className="material-symbols-outlined text-[16px]">verified</span>
                            )}
                          </div>
                          <span className={`block font-body-sm text-[11px] mt-0.5 ${
                            isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                          }`}>
                            {finish.desc}
                          </span>
                          <span className="block font-mono text-xs font-bold mt-2">
                            {finish.extra > 0 ? `+${formatPrice(finish.extra)}` : 'Standard Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Copper Weight & Substrate Thickness */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Copper Thickness */}
                  <div>
                    <label className="block font-headline-sm text-sm font-bold text-on-surface mb-space-xs">
                      Copper Thickness (Weight)
                    </label>
                    <div className="grid grid-cols-3 gap-space-xs">
                      {copperWeights.map((cw) => {
                        const isSelected = pcbConfig.copperWeight === cw.name;
                        return (
                          <button
                            key={cw.id}
                            type="button"
                            onClick={() => setPcbConfig(prev => ({ ...prev, copperWeight: cw.name }))}
                            className={`p-2.5 rounded-xl text-center font-mono text-xs transition-all ${
                              isSelected
                                ? 'bg-primary text-on-primary font-bold shadow-sm'
                                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                            }`}
                          >
                            <span>{cw.name}</span>
                            <span className={`block text-[10px] font-normal ${
                              isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                            }`}>
                              {cw.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Board Thickness */}
                  <div>
                    <label className="block font-headline-sm text-sm font-bold text-on-surface mb-space-xs">
                      Board Thickness
                    </label>
                    <div className="grid grid-cols-4 gap-space-xs">
                      {boardThicknesses.map((th) => {
                        const isSelected = pcbConfig.boardThickness === th;
                        return (
                          <button
                            key={th}
                            type="button"
                            onClick={() => setPcbConfig(prev => ({ ...prev, boardThickness: th }))}
                            className={`p-2.5 rounded-xl text-center font-mono text-xs transition-all ${
                              isSelected
                                ? 'bg-primary text-on-primary font-bold shadow-sm'
                                : 'bg-surface-container-low text-on-surface hover:bg-surface-container font-semibold'
                            }`}
                          >
                            {th}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Precision Specs & Edge Fabrication Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm pt-space-xs">
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <span className="block font-label-sm text-[11px] text-on-surface-variant">Min Hole / Trace Clearance</span>
                    <span className="block font-mono text-xs font-bold text-on-surface mt-1">0.3mm / 6/6 mil</span>
                    <span className="block font-body-sm text-[10px] text-secondary mt-0.5">Standard IPC Class 2</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <span className="block font-label-sm text-[11px] text-on-surface-variant">Silkscreen Legend Color</span>
                    <span className="block font-mono text-xs font-bold text-on-surface mt-1">High-Res Polar White</span>
                    <span className="block font-body-sm text-[10px] text-on-surface-variant mt-0.5">Ultra-crisp UV cured</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                    <div>
                      <span className="block font-label-sm text-[11px] text-on-surface-variant">Castellated Edge Holes</span>
                      <span className="block font-mono text-xs font-bold text-on-surface mt-1">
                        {pcbConfig.castellated ? 'Plated Halves Added' : 'No Plated Halves'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPcbConfig(prev => ({ ...prev, castellated: !prev.castellated }))}
                      className="text-left mt-1 text-[11px] font-mono font-semibold text-primary cursor-pointer hover:underline"
                    >
                      {pcbConfig.castellated ? `Remove (-${formatPrice(150)})` : `Add (+${formatPrice(150)})`}
                    </button>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                    <div>
                      <span className="block font-label-sm text-[11px] text-on-surface-variant">Gold Fingers / Edge Chamfer</span>
                      <span className="block font-mono text-xs font-bold text-on-surface mt-1">
                        {pcbConfig.edgeChamfer ? '30° Bevel Bevelled' : 'None / Square Edge'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPcbConfig(prev => ({ ...prev, edgeChamfer: !prev.edgeChamfer }))}
                      className="text-left mt-1 text-[11px] font-mono font-semibold text-primary cursor-pointer hover:underline"
                    >
                      {pcbConfig.edgeChamfer ? `Remove (-${formatPrice(180)})` : `30° Bevel (+${formatPrice(180)})`}
                    </button>
                  </div>
                </div>

                {/* Priority Speed Tier */}
                <div className="bg-surface-container-high/60 p-space-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/30">
                  <div className="flex items-center gap-space-sm">
                    <div className="p-2 rounded-xl bg-surface-container-lowest text-primary">
                      <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                        Manufacturing Turnaround Speed
                      </h4>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        Select production scheduling slot in our Bangalore fab line.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => setPcbConfig(prev => ({ ...prev, turnaround: 'standard' }))}
                      className={`py-2 px-3.5 rounded-xl font-mono text-xs transition-all ${
                        pcbConfig.turnaround === 'standard'
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container-lowest text-on-surface font-semibold hover:bg-surface-container'
                      }`}
                    >
                      Standard: 3-4 Days (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPcbConfig(prev => ({ ...prev, turnaround: 'express' }))}
                      className={`py-2 px-3.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1 ${
                        pcbConfig.turnaround === 'express'
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container-lowest text-on-surface font-semibold hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      Express: 24-48h (+{formatPrice(199)})
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: Design File Upload Zone */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low -mx-space-lg -mt-space-lg p-space-lg rounded-t-2xl border-b border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      PCB Production File Package
                    </h2>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Automated Design Rule Check (DRC) and instant layer validation.
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-xs bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded font-bold">
                  256-Bit Encrypted / NDA Compliant
                </span>
              </div>

              {/* Drag and Drop Active Card */}
              <div
                onClick={onOpenUploadModal}
                className="relative rounded-2xl p-space-xl text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-all cursor-pointer group border-2 border-dashed border-outline-variant hover:border-primary"
              >
                <div className="w-16 h-16 mx-auto mb-space-md rounded-2xl bg-surface-container-high text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[36px]">cloud_upload</span>
                </div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface mb-1">
                  Upload Your PCB Production Files (Gerber, ZIP, KiCad, Eagle, Altium)
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-lg mx-auto mb-space-md">
                  Automated DFM analysis runs instantly upon upload. Supported archive formats: <code className="font-mono text-xs font-bold text-on-surface">.zip, .gerber, .kicad_pcb, .brd</code> (Max 50MB)
                </p>

                {pcbConfig.uploadedFiles.length > 0 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold mb-space-md shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    <span>Attached: {pcbConfig.uploadedFiles[0]}</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-space-sm mb-space-md">
                    <button
                      type="button"
                      className="px-space-lg py-2.5 bg-primary text-on-primary rounded-xl font-headline-sm text-xs font-semibold shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">file_open</span>
                      <span>Browse &amp; Upload Design File</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUploadModal();
                      }}
                      className="px-space-md py-2.5 bg-surface-container text-on-surface rounded-xl font-mono text-xs font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Load Sample Gerber
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-on-surface-variant flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span> Drill Layer Check
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span> Track Clearance
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span> Annular Ring Verification
                  </span>
                </div>
              </div>

              {/* Secondary Engineering Assistance Helper Banner */}
              <div className="mt-space-md p-space-md rounded-2xl bg-surface-container-high/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm text-left">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">support_agent</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-xs font-bold text-on-surface">
                      I don't have a ready production file
                    </span>
                    <span className="block font-body-sm text-[11px] text-on-surface-variant">
                      Our hardware engineering team can route schematics or convert breadboard diagrams.
                    </span>
                  </div>
                </div>
                <Link
                  to="/design-help"
                  className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container font-mono text-xs font-bold shrink-0 transition-colors shadow-sm"
                >
                  Request PCB Design Help →
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Live Visualizer & Instant Cost Matrix */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[112px] flex flex-col gap-space-md">
            {/* Live Visualizer Card */}
            <PcbVisualizer3D
              colorClass={pcbConfig.solderMask.bgClass}
              colorHex={pcbConfig.solderMask.colorHex}
              colorName={pcbConfig.solderMask.name}
              finishName={pcbConfig.surfaceFinish.name}
              dimensions={`${pcbConfig.length} × ${pcbConfig.width} mm`}
              layers={pcbConfig.layers}
              thickness={pcbConfig.boardThickness}
              copperWeight={pcbConfig.copperWeight}
            />

            {/* Instant Cost & Turnaround Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/30 mb-space-sm">
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">Order Calculation</h3>
                <span className="font-mono text-xs text-secondary bg-secondary-container px-2 py-0.5 rounded font-bold">
                  {pcbConfig.quantity} Pcs Selected
                </span>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-2 font-body-sm text-xs mb-space-md">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Base Fabrication ({pcbConfig.quantity} pcs × {pcbConfig.length}×{pcbConfig.width}mm)</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {formatPrice(299 * Math.max(1, (areaM2 / 0.008)))}
                  </span>
                </div>
                {pcbConfig.layers > 2 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Multilayer Core ({pcbConfig.layers} Layers)</span>
                    <span className="font-mono font-semibold text-on-surface">
                      {formatPrice(pcbConfig.layers === 4 ? 450 : 950)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span>{pcbConfig.surfaceFinish.name} Plating</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                  </span>
                  <span className="font-mono font-semibold text-on-surface">
                    {formatPrice(pcbConfig.surfaceFinish.extra)}
                  </span>
                </div>
                {pcbConfig.turnaround === 'express' && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Express Bangalore Rapid Turnaround (24-48h)</span>
                    <span className="font-mono font-semibold text-on-surface">{formatPrice(199)}</span>
                  </div>
                )}
                {pcbConfig.castellated && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Castellated Holes Milling</span>
                    <span className="font-mono font-semibold text-on-surface">{formatPrice(150)}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Automated DFM Pre-Flight Verification</span>
                  <span className="font-mono font-bold text-secondary">FREE</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>GST &amp; Industrial Surcharge (18%)</span>
                  <span className="font-mono font-semibold text-on-surface">Included</span>
                </div>
              </div>

              {/* Total Calculation Row */}
              <div className="p-space-md bg-surface-container-low rounded-xl mb-space-md flex items-center justify-between border border-outline-variant/30">
                <div>
                  <span className="block font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Total Estimated Amount
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl text-2xl font-bold text-on-surface">
                      {formatPrice(currentTotal)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-secondary font-bold">DISPATCH TIMELINE</span>
                  <span className="block font-mono text-xs font-bold text-on-surface">
                    {pcbConfig.turnaround === 'express' ? 'Tomorrow 4:00 PM' : '3-4 Business Days'}
                  </span>
                </div>
              </div>

              {/* Primary Flow CTA */}
              <button
                type="button"
                onClick={handleAddToCartAndProceed}
                className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-headline-sm text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(0,74,198,0.25)] hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <span>Add to Cart &amp; View DFM Summary</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <p className="font-body-sm text-[11px] text-on-surface-variant text-center mt-space-sm flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                100% E-Test &amp; Flying Probe Tested Guarantee
              </p>
            </div>

            {/* Production Facility Live Status Pill Card */}
            <div className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-sm border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-on-surface truncate">Bangalore Fab Plant 01</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                  Current queue: 42 panel lots | Capacity: 88% Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPcbConfiguratorPage;

