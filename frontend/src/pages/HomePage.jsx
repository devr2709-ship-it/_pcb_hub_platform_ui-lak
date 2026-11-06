import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { fetchQuickEstimate, subscribeNewsletter } from '../services/api.js';

export const HomePage = ({ onOpenUploadModal }) => {
  const navigate = useNavigate();
  const { setPcbConfig, formatPrice, showToast } = useConfig();

  // Instant Quote Widget State
  const [quoteDim, setQuoteDim] = useState('100 x 100');
  const [quoteLayers, setQuoteLayers] = useState(2);
  const [quoteQty, setQuoteQty] = useState(5);
  const [liveEstimate, setLiveEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);

  // Fetch live estimate from backend whenever widget params change
  const refreshEstimate = useCallback(async () => {
    const dims = quoteDim.toLowerCase().split('x').map(s => parseFloat(s.trim()));
    const length = !isNaN(dims[0]) ? dims[0] : 100;
    const width  = !isNaN(dims[1]) ? dims[1] : 100;
    setEstimateLoading(true);
    try {
      const data = await fetchQuickEstimate({ layers: quoteLayers, length, width, quantity: quoteQty });
      setLiveEstimate(data.estimated);
    } catch {
      setLiveEstimate(null); // Fall back to local formula
    } finally {
      setEstimateLoading(false);
    }
  }, [quoteDim, quoteLayers, quoteQty]);

  useEffect(() => {
    const timer = setTimeout(refreshEstimate, 400);
    return () => clearTimeout(timer);
  }, [refreshEstimate]);

  // Local fallback estimate (used while API is loading)
  const calculateEstimate = () => {
    let baseCost = 299;
    if (quoteLayers === 4) baseCost = 899;
    else if (quoteLayers === 6) baseCost = 1899;
    else if (quoteLayers >= 8) baseCost = 3499;
    const scaleQty = Math.max(1, quoteQty / 5);
    return Math.round(baseCost * (1 + (scaleQty - 1) * 0.45));
  };

  const displayEstimate = liveEstimate
    ? liveEstimate.formattedTotal
    : formatPrice(calculateEstimate());

  const handleQuickQuoteCTA = (e) => {
    e.preventDefault();
    const dims = quoteDim.toLowerCase().split('x').map(s => parseFloat(s.trim()));
    const length = !isNaN(dims[0]) ? dims[0] : 100;
    const width = !isNaN(dims[1]) ? dims[1] : 100;

    setPcbConfig(prev => ({
      ...prev,
      layers: quoteLayers,
      quantity: quoteQty,
      length,
      width
    }));
    navigate('/custom-pcb');
  };

  // Newsletter subscription handler
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    try {
      const res = await subscribeNewsletter(newsletterEmail);
      showToast(res.message || 'Subscribed to Engineering Pulse!', 'success');
      setNewsletterEmail('');
    } catch (err) {
      showToast(err.message || 'Subscription failed. Please try again.', 'error');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Circuit Grid Accent & Ambient Gradient Field */}
      <section className="relative w-full overflow-hidden pb-space-xl">
        {/* Subtle technical grid decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="48" id="grid-pattern" patternUnits="userSpaceOnUse" width="48">
                <circle cx="2" cy="2" fill="#2563eb" opacity="0.18" r="1.2"></circle>
                <path d="M 48 0 L 0 0 0 48" fill="none" opacity="0.4" stroke="#dae2fd" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid-pattern)" height="100%" width="100%"></rect>
          </svg>
        </div>

        {/* Soft radiant light spots */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="w-full max-w-[1440px] mx-auto px-margin">
          {/* Tag / Notice Ribbon */}
          <div className="flex items-center gap-space-sm pt-space-md mb-space-md flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              NEXT-GEN PCB FABRICATION PLATFORM
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 font-label-sm text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
              Gerber DFM 4.2 Engine Live
            </span>
          </div>

          {/* Hero Grid Layout (Bento / Asymmetric Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            {/* Left: Copy & Actions */}
            <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-space-md">
              <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-[44px] leading-tight tracking-tight text-on-surface font-bold mb-space-md">
                Build Your Circuit. <br />
                <span className="bg-gradient-to-r from-primary via-primary-container to-tertiary-container bg-clip-text text-transparent drop-shadow-sm">
                  We Build Your PCB.
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg max-w-xl text-sm sm:text-base leading-relaxed">
                Get high-quality printed circuit boards for education, DIY projects, prototypes, startups, and professional electronics. Instant DFM check, 24-hour turnaround, and aerospace-grade precision.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto mb-space-xl">
                <Link
                  to="/custom-pcb"
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-primary text-on-primary font-headline-sm text-sm font-semibold shadow-md hover:bg-primary-container transition-all active:scale-[0.98]"
                >
                  <span>Create Custom PCB</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <Link
                  to="/product-selection"
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-sm font-semibold hover:bg-surface-container transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">memory</span>
                  <span>Explore PCB Boards</span>
                </Link>
              </div>

              {/* Micro Spec Pills */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                  <span>IPC-6012 Class 3</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
                  <span>24H Express Turnaround</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                  <span>100% AOI &amp; Flying Probe</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive CAD/PCB Showcase Card */}
            <div className="lg:col-span-6 relative mt-space-lg lg:mt-0">
              <div className="relative w-full rounded-2xl bg-surface-container-lowest p-space-md shadow-xl overflow-hidden border border-outline-variant/30">
                {/* Header bar of CAD HUD */}
                <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low/60 p-2.5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-secondary/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-primary/80 inline-block"></span>
                    <span className="ml-2 font-label-sm text-xs text-on-surface-variant font-mono">
                      VIEWPORT: TOP_LAYER_GERBER_3D.FAB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold">
                      DRC PASS
                    </span>
                    <span className="font-label-sm text-xs text-on-surface-variant font-mono">1:1 SCALE</span>
                  </div>
                </div>

                {/* PCB Board Visual Container with Callout Pins */}
                <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
                  <img
                    alt="Multilayer PCB motherboard with gold ENIG pads"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj_7yGuYEgx-5htGpQZ9zbSdO9GpDAJArmMV1wv9FFypO3dcALBAG4Z6UVToyO8Z3yliVPg4a7FpEzBMQvzFdDr5jYzDwrFZtJ7fvxp7PbX7iWrRp4zYClJrK3MSS8wyYrWyEDhRhvzKDsjrVIzmT2n6xlkZuKEosuv1ncIF9EQAPOJ6hHOyndttLt_po2hKtDcTX4kQV4FOYjWLFJtuoNRw4OqbHMP9xD-ZLt_2yM4o6FELUee9jJ"
                  />
                  {/* Dark gradient overlay for HUD contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-transparent to-inverse-surface/40 pointer-events-none"></div>

                  {/* Interactive Callout 1: Gold ENIG */}
                  <div className="absolute top-12 left-6 sm:left-8 group cursor-pointer transition-transform hover:scale-105 z-10">
                    <div className="relative flex items-center gap-2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-outline-variant/30">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping absolute -top-1 -left-1"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface font-bold">ENIG Gold Finish</span>
                        <span className="font-label-sm text-on-surface-variant text-[10px]">Immersion Au 2µ" / Ni 120µ"</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Callout 2: 0.1mm Drill */}
                  <div className="absolute bottom-20 left-6 sm:left-10 group cursor-pointer transition-transform hover:scale-105 z-10">
                    <div className="flex items-center gap-2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary text-[16px]">radio_button_checked</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface font-bold">0.1mm Laser Micro-via</span>
                        <span className="font-label-sm text-on-surface-variant text-[10px]">Staggered &amp; Stacked HDI</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Callout 3: Solder Mask Emerald */}
                  <div className="absolute top-24 right-4 sm:right-6 group cursor-pointer transition-transform hover:scale-105 z-10">
                    <div className="flex items-center gap-2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-outline-variant/30">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim"></span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface font-bold">Dual Emerald Mask</span>
                        <span className="font-label-sm text-on-surface-variant text-[10px]">High-Res Photosensitive LPI</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Callout 4: Controlled Impedance */}
                  <div className="absolute bottom-8 right-6 sm:right-8 group cursor-pointer transition-transform hover:scale-105 z-10">
                    <div className="flex items-center gap-2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary-container text-[16px]">tune</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface font-bold">Controlled Impedance</span>
                        <span className="font-label-sm text-on-surface-variant text-[10px]">±10% Tolerance / 50Ω SE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Overlay Badges */}
                <div className="grid grid-cols-3 gap-2 mt-space-sm">
                  <div className="bg-surface-container-low p-3 rounded-lg text-center">
                    <span className="block font-headline-sm text-base font-bold text-secondary">99.8%</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">First-pass Yield</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg text-center">
                    <span className="block font-headline-sm text-base font-bold text-primary">24–48h</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Rapid Dispatch</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg text-center">
                    <span className="block font-headline-sm text-base font-bold text-on-surface">{formatPrice(299)}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Starting Base (5 Pcs)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Instant Quote Bar (Engineered Precision Widget) */}
          <div className="w-full mt-space-xl bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-lg border border-outline-variant/30">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
              {/* Widget Title Pill */}
              <div className="flex items-center gap-space-sm shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">calculate</span>
                </div>
                <div>
                  <span className="block font-headline-sm text-sm sm:text-base text-on-surface font-bold">
                    Quick Fabrication Estimator
                  </span>
                  <span className="block font-body-sm text-xs text-on-surface-variant">
                    Real-time parameters, zero delays
                  </span>
                </div>
              </div>

              {/* Parameter Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md grow max-w-2xl">
                {/* Dimensions */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-[11px] text-on-surface-variant font-medium">DIMENSIONS (MM)</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={quoteDim}
                      onChange={(e) => setQuoteDim(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-label-md text-xs focus:outline-none focus:bg-surface-container transition-colors"
                    />
                    <span className="absolute right-3 font-label-sm text-[11px] text-on-surface-variant">mm</span>
                  </div>
                </div>

                {/* Layer Count */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-[11px] text-on-surface-variant font-medium">LAYER COUNT</label>
                  <select
                    value={quoteLayers}
                    onChange={(e) => setQuoteLayers(parseInt(e.target.value, 10))}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-label-md text-xs focus:outline-none focus:bg-surface-container transition-colors"
                  >
                    <option value={1}>1 Layer (Single-side)</option>
                    <option value={2}>2 Layers (Standard)</option>
                    <option value={4}>4 Layers (Multilayer)</option>
                    <option value={6}>6 Layers (High-density)</option>
                    <option value={8}>8 Layers (Advanced)</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-[11px] text-on-surface-variant font-medium">QUANTITY</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min={5}
                      step={5}
                      value={quoteQty}
                      onChange={(e) => setQuoteQty(Math.max(5, parseInt(e.target.value, 10) || 5))}
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-label-md text-xs focus:outline-none focus:bg-surface-container transition-colors"
                    />
                    <span className="absolute right-3 font-label-sm text-[11px] text-on-surface-variant">pcs</span>
                  </div>
                </div>
              </div>

              {/* Live Price Display & CTA */}
              <div className="flex items-center justify-between sm:justify-end gap-space-md shrink-0 pt-2 lg:pt-0">
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Est. Base Total</span>
                  <span className={`font-headline-lg text-2xl font-bold text-primary transition-opacity ${estimateLoading ? 'opacity-60' : 'opacity-100'}`}>
                    {displayEstimate}
                  </span>
                </div>
                <button
                  onClick={handleQuickQuoteCTA}
                  className="px-space-lg py-3 rounded-lg bg-primary text-on-primary font-headline-sm text-xs font-semibold hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm flex items-center gap-1.5"
                >
                  <span>Quote Now</span>
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories Section */}
      <section className="w-full py-space-xl bg-surface-container-low">
        <div className="w-full max-w-[1440px] mx-auto px-margin">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
            <div>
              <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider mb-2 font-bold">
                <span className="material-symbols-outlined text-[18px]">developer_board</span>
                <span>Tailored Product Lines</span>
              </div>
              <h2 className="font-headline-xl text-2xl sm:text-3xl text-on-surface font-bold">
                Engineered for Every Innovation Scale
              </h2>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md">
              From rapid collegiate prototyping to flight-qualified multilayer RF stacks, configure fabrication options suited directly to your production tier.
            </p>
          </div>

          {/* 6 Modern Rounded Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* 1. Student Projects */}
            <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">school</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold">
                    85% SUBSIDIZED
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                  Student Projects
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-space-md leading-relaxed">
                  Affordable 2-layer boards with special university coupons, fast 48h dispatch, and hassle-free KiCad/Eagle Gerber acceptance for capstones.
                </p>
              </div>
              <div className="pt-space-md bg-surface-container-low/50 rounded-xl p-space-sm flex items-center justify-between text-xs">
                <span className="font-label-md font-semibold text-on-surface">From {formatPrice(299)} / 5 Pcs</span>
                <Link
                  to="/product-selection"
                  className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1"
                >
                  Configure <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* 2. DIY & Hobby */}
            <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">hardware</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">
                    MAKER READY
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                  DIY &amp; Hobby
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-space-md leading-relaxed">
                  Breadboard-compatible grid pinouts, Arduino &amp; ESP32 custom expansion shields, mechanical keyboard backplates, and maker community kits.
                </p>
              </div>
              <div className="pt-space-md bg-surface-container-low/50 rounded-xl p-space-sm flex items-center justify-between text-xs">
                <span className="font-label-md font-semibold text-on-surface">Standard 1.6mm FR4</span>
                <Link
                  to="/product-selection"
                  className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1"
                >
                  Configure <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* 3. Engineering Projects */}
            <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">precision_manufacturing</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-bold">
                    PCBA READY
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                  Engineering Projects
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-space-md leading-relaxed">
                  Rigid-flex substrates, high-speed signal routing, controlled impedance validation, and automated pick-and-place surface assembly.
                </p>
              </div>
              <div className="pt-space-md bg-surface-container-low/50 rounded-xl p-space-sm flex items-center justify-between text-xs">
                <span className="font-label-md font-semibold text-on-surface">Turnkey Assembly</span>
                <Link
                  to="/custom-pcb"
                  className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1"
                >
                  Configure <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* 4. Startup Prototypes */}
            <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">rocket_launch</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[11px] font-bold">
                    RAPID NPI
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                  Startup Prototypes
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-space-md leading-relaxed">
                  Low-volume fast-turn pilot runs, complete DFM &amp; DFT engineering feedback, component kitting, and serialized automated optical testing.
                </p>
              </div>
              <div className="pt-space-md bg-surface-container-low/50 rounded-xl p-space-sm flex items-center justify-between text-xs">
                <span className="font-label-md font-semibold text-on-surface">Pilot Batches (10–500)</span>
                <Link
                  to="/custom-pcb"
                  className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1"
                >
                  Configure <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* 5. Professional Electronics */}
            <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">layers</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                    UP TO 32 LAYERS
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                  Professional Electronics
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-space-md leading-relaxed">
                  Blind &amp; buried laser microvias, Rogers/PTFE high-frequency laminates, 3oz heavy copper power planes, and Class 3 military/telecom specs.
                </p>
              </div>
              <div className="pt-space-md bg-surface-container-low/50 rounded-xl p-space-sm flex items-center justify-between text-xs">
                <span className="font-label-md font-semibold text-on-surface">Rogers &amp; High-TG FR4</span>
                <Link
                  to="/custom-pcb"
                  className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1"
                >
                  Configure <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* 6. Custom PCB */}
            <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">dashboard_customize</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
                    BESPOKE GEOMETRY
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                  Custom PCB
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-space-md leading-relaxed">
                  Circular and irregular CNC outline routing, aluminum metal core LED sinks, castellated edge holes, and matte black/purple solder masks.
                </p>
              </div>
              <div className="pt-space-md bg-surface-container-low/50 rounded-xl p-space-sm flex items-center justify-between text-xs">
                <span className="font-label-md font-semibold text-on-surface">Aluminum &amp; Heavy Cu</span>
                <Link
                  to="/custom-pcb"
                  className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1"
                >
                  Configure <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Proof & Feature Grid */}
      <section className="w-full py-space-xl bg-surface">
        <div className="w-full max-w-[1440px] mx-auto px-margin">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider block mb-2">
              FABRICATION ASSURANCE
            </span>
            <h2 className="font-headline-xl text-2xl sm:text-3xl text-on-surface font-bold mb-space-sm">
              Why Hardware Teams Choose PCB Hub
            </h2>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
              Built from the ground up to eradicate DFM failure modes and guarantee clean first-spin silicon turn-ons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* Feature 1 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
                  IPC CLASS 2/3
                </span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">High Quality PCB</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                Built strictly to IPC-A-600 standards. Every panel passes 100% automated optical inspection (AOI) and flying-probe netlist continuity verification.
              </p>
              <div className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span>0.00% Netlist Short Tolerance</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">speed</span>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                  24H DISPATCH
                </span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">Fast Manufacturing</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                Rapid prototyping lines handle urgent spin cycles. Standard 2-layer FR4 boards can be etched, masked, drilled, and dispatched in under 24 hours.
              </p>
              <div className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span>Guaranteed Production Slot</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[24px]">currency_rupee</span>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  DIRECT FOUNDRY
                </span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">Affordable Pricing</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                Direct-to-foundry economy eliminates broker markups. Prototyping packs start from {formatPrice(299)} for 5 precision panels with zero setup or tool charges.
              </p>
              <div className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span>Transparent Live Quotation</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  DFM ANALYSIS
                </span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">Custom Designs &amp; Footprints</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                Instant algorithmic Gerber DFM checker highlights annular ring violations, solder bridge clearances, and unrouted air-wires before factory commitment.
              </p>
              <div className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span>Automated Clearance Scans</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">account_balance</span>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
                  100% SECURE
                </span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">Secure Domestic Payments</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                Seamless checkout through UPI, Razorpay, Net Banking, and corporate credit cards. Automated GST tax invoices with input credit for institutions and businesses.
              </p>
              <div className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span>Instant GST Invoicing</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">sensors</span>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                  REAL-TIME LOT
                </span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">IoT Live Order Tracking</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                Track your panel batch step-by-step through our cleanroom barcode monitors: from lamination, exposure, copper bath, to courier vehicle scan.
              </p>
              <div className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span>Live Station Timestamping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fabrication Pipeline */}
      <section className="w-full py-space-xl bg-surface-container-low">
        <div className="w-full max-w-[1440px] mx-auto px-margin">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider">
                FABRICATION PIPELINE
              </span>
              <h3 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                From Design Files to Tested Hardware in 4 Steps
              </h3>
            </div>
            <Link
              to="/how-it-works"
              className="font-headline-sm text-sm text-primary hover:text-primary-container font-semibold flex items-center gap-1"
            >
              <span>Read Full Spec Sheet</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col border border-outline-variant/20">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center font-bold">
                  01
                </div>
                <span className="font-headline-sm text-sm text-on-surface font-bold">Gerber Upload</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Drop your RS-274X, Gerber X2, or Eagle BRD archive. Auto DFM generates 2D layer previews instantly.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col border border-outline-variant/20">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center font-bold">
                  02
                </div>
                <span className="font-headline-sm text-sm text-on-surface font-bold">Spec Validation</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Configure solder mask colors, gold immersion ENIG, copper thickness (1-3oz), and edge connector chamfers.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col border border-outline-variant/20">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center font-bold">
                  03
                </div>
                <span className="font-headline-sm text-sm text-on-surface font-bold">Laser Precision Fab</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Automated cleanroom production featuring CNC high-speed spindle drilling, chemical copper plating, and AOI inspection.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col border border-outline-variant/20">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-mono text-xs flex items-center justify-center font-bold">
                  04
                </div>
                <span className="font-headline-sm text-sm text-on-surface font-bold">Express Delivery</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Vacuum sealed with desiccant gel packs, bubble armored, and expedited via express air logistics across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonial & Metrics Band */}
      <section className="w-full py-space-xl bg-inverse-surface text-inverse-on-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" fill="none" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 H400 L450 250 H900 L950 200 H1440" stroke="currentColor" strokeWidth="2"></path>
            <path d="M200 0 V100 L300 200 V400" stroke="currentColor" strokeWidth="2"></path>
            <circle cx="450" cy="250" fill="currentColor" r="6"></circle>
            <circle cx="950" cy="200" fill="currentColor" r="6"></circle>
          </svg>
        </div>
        <div className="w-full max-w-[1440px] mx-auto px-margin relative z-10">
          {/* Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl pb-space-lg border-b border-surface-variant/20">
            <div>
              <span className="block font-headline-xl text-3xl font-bold text-secondary-fixed">150,000+</span>
              <span className="font-label-sm text-xs text-surface-variant uppercase tracking-wider">PCBs Shipped Across India</span>
            </div>
            <div>
              <span className="block font-headline-xl text-3xl font-bold text-primary-fixed">1,200+</span>
              <span className="font-label-sm text-xs text-surface-variant uppercase tracking-wider">Hardware Startups &amp; Labs</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline-xl text-3xl font-bold text-inverse-on-surface">4.9/5</span>
                <span className="material-symbols-outlined text-[22px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <span className="font-label-sm text-xs text-surface-variant uppercase tracking-wider">Engineering CSAT Rating</span>
            </div>
            <div>
              <span className="block font-headline-xl text-3xl font-bold text-tertiary-fixed">90+</span>
              <span className="font-label-sm text-xs text-surface-variant uppercase tracking-wider">Premier Campus Fab Partners</span>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
            <div className="p-space-lg rounded-2xl bg-inverse-surface/60 backdrop-blur-md border border-surface-variant/15 flex flex-col justify-between">
              <p className="font-body-md text-xs sm:text-sm text-surface-container-highest mb-space-md italic leading-relaxed">
                "PCB Hub turned around our 6-layer high-speed FPGA board in exactly 38 hours. Impedance matched traces were perfectly within the 10% envelope. Zero rework required."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold">
                  AK
                </div>
                <div>
                  <span className="block font-headline-sm text-xs font-bold text-inverse-on-surface leading-tight">Ananya Kulkarni</span>
                  <span className="block font-label-sm text-[11px] text-surface-variant">Lead Hardware Architect, IIT Bombay E-Cell</span>
                </div>
              </div>
            </div>

            <div className="p-space-lg rounded-2xl bg-inverse-surface/60 backdrop-blur-md border border-surface-variant/15 flex flex-col justify-between">
              <p className="font-body-md text-xs sm:text-sm text-surface-container-highest mb-space-md italic leading-relaxed">
                "The automated instant DFM checker saved us from an annular ring breakout on our EV BMS prototype. Their customer engineering support in India is unmatched."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary font-bold">
                  VS
                </div>
                <div>
                  <span className="block font-headline-sm text-xs font-bold text-inverse-on-surface leading-tight">Vikram Singhania</span>
                  <span className="block font-label-sm text-[11px] text-surface-variant">CTO, Voltaic Mobility</span>
                </div>
              </div>
            </div>

            <div className="p-space-lg rounded-2xl bg-inverse-surface/60 backdrop-blur-md border border-surface-variant/15 flex flex-col justify-between">
              <p className="font-body-md text-xs sm:text-sm text-surface-container-highest mb-space-md italic leading-relaxed">
                "For aerospace sensors where outgassing and solder bridge margins are critical, PCB Hub delivered pristine ENIG boards with full microsection test coupons."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary font-bold">
                  RN
                </div>
                <div>
                  <span className="block font-headline-sm text-xs font-bold text-inverse-on-surface leading-tight">Rohit Nair</span>
                  <span className="block font-label-sm text-[11px] text-surface-variant">Avionics Engineer, NewSpace Labs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Logos Bar */}
          <div className="mt-space-xl pt-space-lg border-t border-surface-variant/15 flex flex-wrap items-center justify-between gap-space-md">
            <span className="font-label-sm text-xs text-surface-variant tracking-wider uppercase">TRUSTED BY ENGINEERS ACROSS</span>
            <div className="flex flex-wrap items-center gap-space-md sm:gap-space-lg opacity-85 text-surface-container-high font-mono text-xs sm:text-sm font-semibold">
              <span>IIT MADRAS</span>
              <span>•</span>
              <span>BITS PILANI</span>
              <span>•</span>
              <span>ISRO TECH HUB</span>
              <span>•</span>
              <span>NIT SURATHKAL</span>
              <span>•</span>
              <span>MAKER VILLAGE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Strip */}
      <section className="w-full py-space-xl bg-surface">
        <div className="w-full max-w-[1440px] mx-auto px-margin">
          <div className="bg-gradient-to-br from-primary to-primary-container p-space-xl rounded-2xl text-on-primary flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-xl">
            <div className="max-w-2xl text-left">
              <span className="font-label-sm text-xs bg-on-primary/20 text-on-primary px-3 py-1 rounded-full uppercase tracking-wider font-semibold inline-block mb-space-sm">
                READY FOR MANUFACTURING?
              </span>
              <h2 className="font-headline-xl text-2xl sm:text-3xl font-bold mb-space-xs">
                Upload your Gerber files now.
              </h2>
              <p className="font-body-lg text-sm sm:text-base text-on-primary-container">
                Get instant algorithmic DFM analysis and live domestic pricing in less than 30 seconds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-space-md shrink-0">
              <button
                onClick={onOpenUploadModal}
                className="px-space-xl py-3 rounded-lg bg-surface text-primary font-headline-sm text-sm font-bold shadow-md hover:bg-surface-container-low transition-colors"
              >
                Upload Gerber (ZIP)
              </button>
              <Link
                to="/design-help"
                className="px-space-lg py-3 rounded-lg bg-on-primary/10 text-on-primary font-headline-sm text-sm hover:bg-on-primary/20 transition-colors"
              >
                Fabrication Specs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

