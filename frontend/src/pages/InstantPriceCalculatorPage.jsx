import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { LogoIcon } from '../components/Logo';
import { fetchQuote } from '../services/api';

export const InstantPriceCalculatorPage = () => {
  const {
    addToCart,
    showToast,
    formatPrice,
    setIsCheckoutModalOpen
  } = useConfig();

  // Calculation State mirroring the stitch design exactly
  const [qty, setQty] = useState(5);
  const [unitRate, setUnitRate] = useState(60);
  const [length, setLength] = useState(100);
  const [width, setWidth] = useState(80);
  const [layers, setLayers] = useState(2);
  const [finishExtra, setFinishExtra] = useState(0);
  const [leadExtra, setLeadExtra] = useState(199);
  const [designReview, setDesignReview] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // API-driven quote state
  const [apiQuote, setApiQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  const qtyOptions = [
    { qty: 5, rate: 60 },
    { qty: 10, rate: 48 },
    { qty: 25, rate: 40 },
    { qty: 50, rate: 34 },
    { qty: 100, rate: 29 },
    { qty: 250, rate: 26 },
    { qty: 500, rate: 24 }
  ];

  // Map local state to surface finish name
  const surfaceFinish = finishExtra > 0 ? 'ENIG' : 'HASL-LF';
  // Map leadExtra to turnaround option
  const turnaround = leadExtra > 0 ? 'express-24h' : 'standard';

  // Fetch quote from backend whenever parameters change
  const loadQuote = useCallback(async () => {
    setQuoteLoading(true);
    setQuoteError(null);
    try {
      const result = await fetchQuote({
        layers,
        length,
        width,
        quantity: qty,
        surfaceFinish,
        turnaround,
        copperWeight: 1,
        solderMask: 'green',
        ipcClass: 2,
        includeDesignReview: designReview
      });
      setApiQuote(result);
    } catch (err) {
      setQuoteError(err.message);
      setApiQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  }, [layers, length, width, qty, surfaceFinish, turnaround, designReview]);

  useEffect(() => {
    const timer = setTimeout(loadQuote, 400); // Debounce 400ms
    return () => clearTimeout(timer);
  }, [loadQuote]);

  // Local fallback calculations (used when API is loading or errored)
  const baseFab = 299;
  const shipping = 99;
  const promoDiscount = 387.28;
  const areaM2 = (length * width) / 1000000;
  const areaFactor = Math.max(1, areaM2 / 0.008);
  const adjustedBase = Math.round(baseFab * areaFactor);
  let layerCost = 0;
  let layerDesc = 'Additional Layers (Base 2 layers)';
  if (layers === 4) { layerCost = 100; layerDesc = 'Additional Layers (2 additional layers)'; }
  else if (layers === 6) { layerCost = 250; layerDesc = 'Additional Layers (4 additional layers)'; }
  const qtyCost = qty * 120;
  const designCost = designReview ? 299 : 0;
  const subtotal = adjustedBase + layerCost + qtyCost + finishExtra + designCost + leadExtra + shipping;
  const gst = subtotal * 0.18;
  const localFinalTotal = Math.max(299, Math.round(subtotal + gst - promoDiscount));

  // Use API quote when available, fallback to local
  const finalTotal = apiQuote ? apiQuote.breakdown.totalINR : localFinalTotal;
  const displayBreakdown = apiQuote ? apiQuote.breakdown : null;

  const handleProceedToCheckout = () => {
    addToCart({
      id: `calc-${Date.now()}`,
      title: `${layers}-Layer Custom Batch`,
      dimensions: `${length} × ${width} mm`,
      quantity: qty,
      layers,
      finish: surfaceFinish === 'ENIG' ? 'ENIG Gold' : 'Lead-Free HASL',
      solderMask: 'Classic Green',
      turnaround: leadExtra > 0 ? 'Express 24h' : 'Standard 4-5 days',
      price: finalTotal
    });
    setIsCheckoutModalOpen(true);
  };

  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full overflow-hidden bg-surface py-space-xl">
        {/* Circuit Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full text-surface-container-high" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="grid-circuit" patternUnits="userSpaceOnUse" width="40">
                <path d="M0 20h40M20 0v40" fill="none" stroke="currentColor" strokeDasharray="2,6" strokeWidth="1"></path>
                <circle cx="20" cy="20" fill="currentColor" r="1.5"></circle>
              </pattern>
            </defs>
            <rect fill="url(#grid-circuit)" height="100%" width="100%"></rect>
          </svg>
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto px-margin">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-space-xs bg-surface-container px-3 py-1 rounded-full mb-space-sm shadow-sm border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-mono text-xs text-secondary uppercase tracking-widest font-bold">
                  FOUNDRY LIVE QUOTE ENGINE v4.2
                </span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight mb-space-xs">
                Your Estimated PCB Price
              </h1>
              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl">
                Transparent, real-time formula calculation based on board footprint, layers, copper weight, and fabrication logistics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-md bg-surface-container-lowest p-3 rounded-2xl shadow-sm border border-outline-variant/30 text-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                <span className="font-mono text-on-surface font-semibold">IPC Class 2 &amp; 3 Precision</span>
              </div>
              <span className="text-outline-variant font-mono">|</span>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                <span className="font-mono text-on-surface font-semibold">Sub-mil Calibration</span>
              </div>
            </div>
          </div>

          {/* Master 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left Controls */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md flex flex-col gap-space-lg border border-outline-variant/30">
                {/* 1. Batch Quantity */}
                <div className="flex items-center justify-between pb-space-sm bg-gradient-to-r from-surface-container-high/40 to-transparent p-2 rounded-xl">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[22px]">developer_board</span>
                    <span className="font-headline-sm text-sm font-bold text-on-surface">1. Batch Quantity</span>
                  </div>
                  <span className="font-mono text-[11px] bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-bold">
                    Bulk Tier Scale Active
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-space-xs text-xs">
                    <span className="font-body-sm text-on-surface-variant font-medium">Select Batch Size (pcs):</span>
                    <span className="font-mono text-primary font-bold">
                      Unit Rate: {formatPrice(unitRate)} / pc
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-space-xs">
                    {qtyOptions.map((opt) => {
                      const isSelected = qty === opt.qty;
                      return (
                        <button
                          key={opt.qty}
                          type="button"
                          onClick={() => {
                            setQty(opt.qty);
                            setUnitRate(opt.rate);
                          }}
                          className={`py-2.5 rounded-xl font-mono text-xs text-center transition-all ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-sm font-bold'
                              : 'bg-surface-container-low text-on-surface hover:bg-surface-container font-medium'
                          }`}
                        >
                          {opt.qty}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Board Dimensions */}
                <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-headline-sm text-sm font-bold text-on-surface">2. Board Dimensions</span>
                    <span className="font-mono text-xs bg-surface text-primary px-2.5 py-1 rounded shadow-sm font-bold">
                      Area: {areaM2.toFixed(4)} m²
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <label className="font-body-sm text-on-surface-variant" htmlFor="dim-length">Length (mm)</label>
                        <span className="font-mono text-on-surface font-bold">{length} mm</span>
                      </div>
                      <input
                        id="dim-length"
                        type="range"
                        min={20}
                        max={300}
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value, 10))}
                        className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[10px] text-on-surface-variant mt-1">
                        <span>20mm</span><span>300mm</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <label className="font-body-sm text-on-surface-variant" htmlFor="dim-width">Width (mm)</label>
                        <span className="font-mono text-on-surface font-bold">{width} mm</span>
                      </div>
                      <input
                        id="dim-width"
                        type="range"
                        min={20}
                        max={300}
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                        className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[10px] text-on-surface-variant mt-1">
                        <span>20mm</span><span>300mm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Layer Stackup Configuration */}
                <div>
                  <span className="font-headline-sm text-sm font-bold text-on-surface block mb-space-sm">
                    3. Layer Stackup Configuration
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setLayers(2);
                        setLayerExtra(0);
                      }}
                      className={`p-space-md rounded-2xl text-left transition-all border ${
                        layers === 2
                          ? 'bg-primary-fixed border-primary shadow-sm text-on-primary-fixed font-bold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <span className="font-headline-sm text-sm font-bold block">2 Layers</span>
                      <span className="font-label-sm text-xs text-on-surface-variant block mt-0.5">Base Standard</span>
                      <span className="font-mono text-xs font-bold text-primary block mt-2">Included</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLayers(4);
                        setLayerExtra(100);
                      }}
                      className={`p-space-md rounded-2xl text-left transition-all border ${
                        layers === 4
                          ? 'bg-primary-fixed border-primary shadow-sm text-on-primary-fixed font-bold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <span className="font-headline-sm text-sm font-bold block">4 Layers</span>
                      <span className="font-label-sm text-xs text-on-surface-variant block mt-0.5">High Density Multi</span>
                      <span className="font-mono text-xs font-bold text-primary block mt-2">+{formatPrice(100)} / layer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLayers(6);
                        setLayerExtra(250);
                      }}
                      className={`p-space-md rounded-2xl text-left transition-all border ${
                        layers === 6
                          ? 'bg-primary-fixed border-primary shadow-sm text-on-primary-fixed font-bold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <span className="font-headline-sm text-sm font-bold block">6 Layers</span>
                      <span className="font-label-sm text-xs text-on-surface-variant block mt-0.5">Controlled RF/High-Speed</span>
                      <span className="font-mono text-xs font-bold text-primary block mt-2">+{formatPrice(250)} / layer</span>
                    </button>
                  </div>
                </div>

                {/* 4. Surface Metallization Finish */}
                <div>
                  <span className="font-headline-sm text-sm font-bold text-on-surface block mb-space-sm">
                    4. Surface Metallization Finish
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <label
                      onClick={() => setFinishExtra(0)}
                      className={`flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all border ${
                        finishExtra === 0
                          ? 'bg-primary-fixed/40 border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <input
                          type="radio"
                          name="finish-radio"
                          checked={finishExtra === 0}
                          onChange={() => setFinishExtra(0)}
                          className="accent-primary w-4 h-4"
                        />
                        <div>
                          <span className="font-headline-sm text-xs sm:text-sm text-on-surface font-bold block">
                            HASL Lead-free
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            Standard hot air solder levelling
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-secondary font-bold">{formatPrice(0)}</span>
                    </label>

                    <label
                      onClick={() => setFinishExtra(150)}
                      className={`flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all border ${
                        finishExtra === 150
                          ? 'bg-primary-fixed/40 border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <input
                          type="radio"
                          name="finish-radio"
                          checked={finishExtra === 150}
                          onChange={() => setFinishExtra(150)}
                          className="accent-primary w-4 h-4"
                        />
                        <div>
                          <span className="font-headline-sm text-xs sm:text-sm text-on-surface font-bold block">
                            ENIG Gold Immersion
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            Electroless Ni / Immersion Au
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-primary font-bold">+{formatPrice(150)}</span>
                    </label>
                  </div>
                </div>

                {/* 5. Turnaround & Engineering Speed */}
                <div>
                  <span className="font-headline-sm text-sm font-bold text-on-surface block mb-space-sm">
                    5. Turnaround &amp; Engineering Speed
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <label
                      onClick={() => setLeadExtra(0)}
                      className={`flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all border ${
                        leadExtra === 0
                          ? 'bg-primary-fixed border-primary shadow-sm text-on-primary-fixed'
                          : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <input
                          type="radio"
                          name="lead-radio"
                          checked={leadExtra === 0}
                          onChange={() => setLeadExtra(0)}
                          className="accent-primary w-4 h-4"
                        />
                        <div>
                          <span className="font-headline-sm text-xs sm:text-sm font-bold block">
                            Standard Turnaround
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            4-5 business days dispatch
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-secondary font-bold">{formatPrice(0)}</span>
                    </label>

                    <label
                      onClick={() => setLeadExtra(199)}
                      className={`flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all border ${
                        leadExtra === 199
                          ? 'bg-primary-fixed border-primary shadow-sm text-on-primary-fixed'
                          : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <input
                          type="radio"
                          name="lead-radio"
                          checked={leadExtra === 199}
                          onChange={() => setLeadExtra(199)}
                          className="accent-primary w-4 h-4"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                            <span className="font-headline-sm text-xs sm:text-sm font-bold block">
                              24h Express Turnaround
                            </span>
                          </div>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            Fast-track fabrication queue
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-primary font-bold">+{formatPrice(199)}</span>
                    </label>
                  </div>
                </div>

                {/* DFM verification banner & Design Review checkbox */}
                <div className="pt-space-sm flex flex-col gap-space-sm">
                  <div className="p-space-md rounded-2xl bg-surface-container-high flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                      <div>
                        <span className="font-headline-sm text-xs sm:text-sm text-on-surface font-bold block">
                          DFM Verification &amp; Flying Probe E-Test
                        </span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant">
                          100% Netlist connectivity check &amp; IPC clearance validation
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs bg-surface-container-lowest text-secondary px-2.5 py-1 rounded-full font-bold shadow-sm">
                      100% FREE
                    </span>
                  </div>

                  <label className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container cursor-pointer flex items-center justify-between transition-colors border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <input
                        type="checkbox"
                        checked={designReview}
                        onChange={(e) => setDesignReview(e.target.checked)}
                        className="accent-primary w-5 h-5 rounded"
                      />
                      <div>
                        <span className="font-headline-sm text-xs sm:text-sm text-on-surface font-bold block">
                          Include Schematic DFM Review &amp; Optimization
                        </span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant">
                          Engineer-conducted DRC, signal-integrity check, and BOM footprint validation
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-primary font-bold">+{formatPrice(299)}</span>
                  </label>
                </div>
              </div>

              {/* Material Grade & Testing Image Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center gap-space-md border border-outline-variant/30">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1328TkEEi2S8D7TOC284j9DyPKHZte9GHQsqy6AztQ7lJ1Di8fEUn-1he1y_N1--pFM0Axvw_6CHixU0q9APhdd87T7xZw1Nynj9ZXCrl1AWY55emX6592YXKrhwc_VlbK2Th0Aau5NYi2INMYxhgXtA4dn4hfWOwwgY2_RoBQYasW33NFWPgiAGkKF5E-rPxgnv-XV2KuFVlGvP25vDPEzA0iEh1jpMaIcagF9oxc7yZIQ4CW0nN"
                      alt="Precision green PCB"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold">
                      Fabrication Grade
                    </span>
                    <span className="font-headline-sm text-sm text-on-surface font-bold block">
                      TG155 FR-4 Substrate
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Class 2 thermal rating with ultra-low loss factor
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center gap-space-md border border-outline-variant/30">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLwJxhDfFswA6UOPcXFBXI6DRlLqR7q8VafO2HsPmGDjI82dgdVTyy6itPGHpLHPpAP3pc3k56Y9mbK9Pt9hXQJLaq3HskQpDOpGyXknskhV6O6iXsMcgzPY7UI9pDrOtsy7y2_FGqjR7anGz94M9sDRB5Sw1eT6DtN8SJuANW3GYqLSbmZn1fiIWChSNJes5DGNKR-RPxavKpFLT5EN0wHO5Uuc4zEmep-JSA80pR91WWm1OkhVfm"
                      alt="AOI automated inspection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold">
                      Yield Testing
                    </span>
                    <span className="font-headline-sm text-sm text-on-surface font-bold block">
                      100% Optical AOI
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Dual-sided vision scan prior to package dispatch
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sticky Quotation Sidebar */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl flex flex-col gap-space-md border border-outline-variant/30">
                <div className="bg-surface-container p-space-md rounded-xl flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                      <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                        Fabrication Quotation Breakdown
                      </h2>
                    </div>
                    <span className="font-mono text-[11px] text-on-surface-variant mt-0.5 block">
                      Official Quotation #PCB-84920
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded font-bold">
                    LIVE DFM
                  </span>
                </div>

                <div className="space-y-2 text-on-surface font-body-sm text-xs">
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">PCB Manufacturing (Base 2-Layer FR-4)</span>
                    <span className="font-mono font-semibold">{formatPrice(adjustedBase)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">{layerDesc}</span>
                    <span className="font-mono font-semibold">{formatPrice(layerCost)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">
                      Quantity Tier ({qty} boards × {formatPrice(unitRate)} unit rate scaled)
                    </span>
                    <span className="font-mono font-semibold">{formatPrice(qtyCost)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">Surface Finish Metallization</span>
                    <span className="font-mono font-semibold">{formatPrice(finishExtra)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">Custom Design / Engineering Review Service</span>
                    <span className="font-mono font-semibold">{formatPrice(designCost)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">Express 24-48h Fast-Track Manufacturing</span>
                    <span className="font-mono font-semibold">{formatPrice(leadExtra)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-container-low transition-colors">
                    <span className="text-on-surface-variant">Secure ESD Packaging &amp; Express Courier</span>
                    <span className="font-mono font-semibold">{formatPrice(shipping)}</span>
                  </div>

                  <div className="my-2 bg-surface-container h-px w-full"></div>

                  <div className="flex items-center justify-between py-1 px-2 font-bold">
                    <span className="text-on-surface">Subtotal before Taxes</span>
                    <span className="font-mono text-on-surface">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 text-[11px]">
                    <span className="text-on-surface-variant">GST (18% with Input Tax Credit)</span>
                    <span className="font-mono font-semibold text-on-surface-variant">
                      {formatPrice(gst)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 bg-secondary-container/40 rounded">
                    <span className="text-on-secondary-container font-bold flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-[16px]">sell</span>
                      Welcome Maker Discount (PROMO: 'FIRSTPCB')
                    </span>
                    <span className="font-mono font-bold text-secondary">
                      -{formatPrice(promoDiscount)}
                    </span>
                  </div>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/30">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs text-on-surface font-bold uppercase tracking-tight">
                      FINAL ESTIMATED TOTAL
                    </span>
                    <span className={`font-headline-xl text-2xl font-bold text-primary transition-opacity ${quoteLoading ? 'opacity-50' : 'opacity-100'}`}>
                      {quoteLoading ? (
                        <span className="inline-flex items-center gap-1 text-lg text-on-surface-variant">
                          <span className="animate-spin material-symbols-outlined text-[18px]">sync</span>
                          Calculating…
                        </span>
                      ) : formatPrice(finalTotal)}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    {quoteError ? (
                      <>
                        <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                        <span className="font-mono text-[11px] text-error font-semibold">
                          Using local estimate — backend offline
                        </span>
                      </>
                    ) : apiQuote ? (
                      <>
                        <span className="material-symbols-outlined text-secondary text-[16px]">cloud_done</span>
                        <span className="font-mono text-[11px] text-on-secondary-container font-semibold">
                          Live IPC-Class-2 quote • All inclusive • No hidden fees
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-secondary text-[16px]">task_alt</span>
                        <span className="font-mono text-[11px] text-on-secondary-container font-semibold">
                          All inclusive, zero hidden tooling/NRE fees
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-space-xs text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant block leading-relaxed">
                    {apiQuote
                      ? `Live backend quote • ${apiQuote.breakdown.quantity} pcs • ${apiQuote.breakdown.turnaround || turnaround}`
                      : 'Price dynamically updates in real-time as dimensions, layer stacks, or lead times are adjusted.'}
                  </span>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 px-space-md rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline-sm text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span>Proceed to Checkout ({formatPrice(finalTotal)})</span>
                  </button>

                  <Link
                    to="/custom-pcb"
                    className="w-full py-2.5 px-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-xs font-semibold transition-colors flex items-center justify-center gap-space-xs border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span>Modify PCB Specifications in Configurator</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(true)}
                    className="w-full py-2 px-space-md rounded-xl bg-transparent hover:bg-surface-container-low text-primary font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    <span>Download Official PDF Quotation</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-high flex items-center gap-2.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">shield</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight">
                    <strong className="text-on-surface">Trust Guarantee:</strong> Guaranteed IPC-A-600 Class 2 Tolerances • Free Remanufacture if DFM Fails.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official PDF Quotation Preview Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowQuoteModal(false)}
            className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm"
          ></div>

          <div className="relative bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-space-xl shadow-2xl border border-outline-variant/30 z-10 max-h-[90vh] overflow-y-auto">
            {/* Header & Logo */}
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-space-md mb-space-md">
              <div className="flex items-center gap-space-sm">
                <LogoIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">PCB Hub Foundry Ltd.</h3>
                  <p className="font-mono text-[10px] text-on-surface-variant">Plot 42, Electronic City Phase 1, Bangalore, Karnataka 560100</p>
                  <p className="font-mono text-[10px] text-on-surface-variant">GSTIN: 29AABCP8492K1Z8 • ISO 9001:2015</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold bg-primary-fixed text-primary px-2.5 py-1 rounded">
                  ESTIMATE #PCB-84920
                </span>
                <p className="font-mono text-[10px] text-on-surface-variant mt-1">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-space-md text-xs mb-space-md p-space-sm bg-surface-container-low rounded-xl">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant block">Bill To:</span>
                <strong className="text-on-surface block mt-0.5">Arjun Sharma</strong>
                <p className="text-on-surface-variant">Hardware Innovation Labs</p>
                <p className="text-on-surface-variant">GST: 29AABCH8492K1Z9</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant block">Fabrication Specs:</span>
                <strong className="text-on-surface block mt-0.5">{layers}-Layer FR-4 PCB</strong>
                <p className="text-on-surface-variant">{length}mm × {width}mm • {qty} Units</p>
                <p className="text-on-surface-variant">Finish: {finishExtra > 0 ? 'ENIG Gold' : 'HASL Lead-Free'}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-xs text-left border-collapse mb-space-md">
              <thead>
                <tr className="border-b border-outline-variant/30 font-mono text-[11px] text-on-surface-variant">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono">
                <tr>
                  <td className="py-2">Base PCB Prototyping ({qty} boards × {length}×{width}mm)</td>
                  <td className="py-2 text-right">{formatPrice(adjustedBase)}</td>
                </tr>
                {layerCost > 0 && (
                  <tr>
                    <td className="py-2">{layerDesc}</td>
                    <td className="py-2 text-right">{formatPrice(layerCost)}</td>
                  </tr>
                )}
                {finishExtra > 0 && (
                  <tr>
                    <td className="py-2">ENIG Gold Immersion Metallization</td>
                    <td className="py-2 text-right">{formatPrice(finishExtra)}</td>
                  </tr>
                )}
                {designCost > 0 && (
                  <tr>
                    <td className="py-2">Automated DFM &amp; Schematic Review</td>
                    <td className="py-2 text-right">{formatPrice(designCost)}</td>
                  </tr>
                )}
                {leadExtra > 0 && (
                  <tr>
                    <td className="py-2">24h Express Priority Slot</td>
                    <td className="py-2 text-right">{formatPrice(leadExtra)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-2">ESD Vacuum Packaging &amp; Courier</td>
                  <td className="py-2 text-right">{formatPrice(shipping)}</td>
                </tr>
                <tr className="font-bold text-on-surface">
                  <td className="py-2 pt-3">Subtotal before Taxes</td>
                  <td className="py-2 pt-3 text-right">{formatPrice(subtotal)}</td>
                </tr>
                <tr className="text-on-surface-variant">
                  <td className="py-1">Integrated GST (18%)</td>
                  <td className="py-1 text-right">{formatPrice(gst)}</td>
                </tr>
                <tr className="text-secondary font-bold">
                  <td className="py-1">Welcome Maker Discount (FIRSTPCB)</td>
                  <td className="py-1 text-right">-{formatPrice(promoDiscount)}</td>
                </tr>
                <tr className="font-bold text-sm text-primary border-t border-outline-variant/30">
                  <td className="py-2.5">Total Amount Payable</td>
                  <td className="py-2.5 text-right font-headline-sm text-base">{formatPrice(finalTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Actions */}
            <div className="flex items-center justify-between pt-space-md border-t border-outline-variant/30">
              <span className="font-mono text-[10px] text-on-surface-variant">Valid for 30 Days • Authorized Foundry Signatory</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface rounded-xl font-mono text-xs font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrintQuote}
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl font-mono text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstantPriceCalculatorPage;
