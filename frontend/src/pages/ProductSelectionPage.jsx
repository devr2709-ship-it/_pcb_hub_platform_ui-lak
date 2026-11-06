import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export const ProductSelectionPage = () => {
  const navigate = useNavigate();
  const {
    selectedDemographic,
    setSelectedDemographic,
    selectedSubstrate,
    setSelectedSubstrate,
    setPcbConfig,
    formatPrice
  } = useConfig();

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const ageOptions = ['< 13', '13–17', '18–24', '25–34', '35–44', '45+'];

  const projectStages = [
    {
      title: 'School Project',
      desc: 'Science fairs, STEM, basic analog/digital kits.',
      tag: 'STEM Verified',
      icon: 'school'
    },
    {
      title: 'College/University Project',
      desc: 'Capstone, IEEE papers, robotics competitions.',
      tag: 'Student Subsidy',
      icon: 'account_balance'
    },
    {
      title: 'DIY / Hobby',
      desc: 'IoT nodes, mechanical keyboards, retro gaming mods.',
      tag: 'Maker Matrix',
      icon: 'build'
    },
    {
      title: 'Startup MVP',
      desc: 'Rapid iteration, investor demos, pilot production.',
      tag: 'Express 24H',
      icon: 'rocket_launch'
    },
    {
      title: 'Professional / Industrial',
      desc: 'Industrial PLCs, automotive grade, ruggedized sensors.',
      tag: 'IPC Class 3',
      icon: 'factory'
    },
    {
      title: 'Research & Lab',
      desc: 'High-frequency RF, cryogenic & quantum test setups.',
      tag: 'Sub-mil Spec',
      icon: 'science'
    },
    {
      title: 'Other Custom Applications',
      desc: 'Artistic copper art, wearables, custom substrate mix.',
      tag: 'Consultation',
      icon: 'settings_suggest'
    }
  ];

  const pcbSubstrates = [
    {
      id: 'single-sided',
      name: 'Single-Sided',
      fullName: 'Single-Sided PCB',
      price: '₹199',
      basePriceNum: 199,
      layerTag: '1-LAYER',
      layers: 1,
      desc: 'Simple analog power & LED indicator boards, FR-4 1.6mm standard core.',
      spec1Label: 'Material',
      spec1Val: 'FR-4 Standard',
      spec2Label: 'Copper Weight',
      spec2Val: '1.0 oz (35µm)',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <rect fill="#cbd5e1" height="24" opacity="0.4" rx="3" width="130" x="15" y="45"></rect>
          <text className="font-mono text-[8px]" fill="currentColor" x="20" y="60">FR-4 (1.6mm)</text>
          <rect fill="#006c4a" height="7" rx="1.5" width="110" x="25" y="38"></rect>
          <circle cx="45" cy="41.5" fill="#dbe1ff" r="2.5"></circle>
          <circle cx="115" cy="41.5" fill="#dbe1ff" r="2.5"></circle>
          <path d="M45 41.5 H 115" stroke="#85f8c4" strokeWidth="1.5"></path>
        </svg>
      )
    },
    {
      id: 'double-sided',
      name: 'Double-Sided',
      fullName: 'Double-Sided PCB',
      price: '₹299',
      basePriceNum: 299,
      layerTag: '2-LAYER',
      popular: true,
      layers: 2,
      desc: 'Most popular prototype standard, plated through-hole (PTH) vias, HASL/ENIG finish.',
      spec1Label: 'Vias / PTH',
      spec1Val: 'Plated & Tented',
      spec2Label: 'Min Track/Space',
      spec2Val: '4 / 4 mil',
      renderSvg: (
        <svg className="w-36 h-20 text-primary" fill="none" viewBox="0 0 160 90">
          <rect fill="#d2d9f4" height="26" opacity="0.6" rx="2" width="130" x="15" y="32"></rect>
          <rect fill="#004ac6" height="6" rx="1.5" width="110" x="25" y="26"></rect>
          <rect fill="#004ac6" height="6" rx="1.5" width="110" x="25" y="58"></rect>
          <rect fill="#85f8c4" height="38" rx="1" width="8" x="45" y="26"></rect>
          <rect fill="#85f8c4" height="38" rx="1" width="8" x="105" y="26"></rect>
          <circle cx="49" cy="45" fill="#131b2e" r="1.5"></circle>
          <circle cx="109" cy="45" fill="#131b2e" r="1.5"></circle>
        </svg>
      )
    },
    {
      id: 'multilayer',
      name: 'Multilayer PCB',
      fullName: 'Multilayer PCB',
      price: '₹799',
      basePriceNum: 799,
      layerTag: '4–32 LAYERS',
      layers: 4,
      desc: 'For high-speed microcontrollers, FPGA, and DDR signal routing with ground planes.',
      spec1Label: 'Impedance Control',
      spec1Val: '±5% Toleranced',
      spec2Label: 'Core Type',
      spec2Val: 'TG150 / TG170',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <rect fill="#cbd5e1" height="50" opacity="0.3" rx="3" width="130" x="15" y="20"></rect>
          <line stroke="#004ac6" strokeWidth="3" x1="25" x2="135" y1="23" y2="23"></line>
          <line stroke="#006c4a" strokeDasharray="8 3" strokeWidth="2.5" x1="25" x2="135" y1="38" y2="38"></line>
          <line stroke="#006c4a" strokeDasharray="12 4" strokeWidth="2.5" x1="25" x2="135" y1="52" y2="52"></line>
          <line stroke="#004ac6" strokeWidth="3" x1="25" x2="135" y1="67" y2="67"></line>
          <rect fill="#68dba9" height="44" width="7" x="75" y="23"></rect>
        </svg>
      )
    },
    {
      id: 'flexible',
      name: 'Flexible PCB',
      fullName: 'Flexible PCB',
      price: '₹999',
      basePriceNum: 999,
      layerTag: 'POLYIMIDE',
      layers: 2,
      desc: 'Polyimide ultra-thin flex for wearable tech, gimbal links, and medical implants.',
      spec1Label: 'Thickness',
      spec1Val: '0.07–0.11 mm',
      spec2Label: 'Bend Cycles',
      spec2Val: '> 100,000',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <path d="M 20 65 Q 50 15 80 50 T 140 30" fill="none" stroke="#d97706" strokeLinecap="round" strokeWidth="8"></path>
          <path d="M 20 65 Q 50 15 80 50 T 140 30" fill="none" stroke="#b45309" strokeDasharray="4 2" strokeWidth="2"></path>
          <circle cx="20" cy="65" fill="#fbbf24" r="4"></circle>
          <circle cx="140" cy="30" fill="#fbbf24" r="4"></circle>
        </svg>
      )
    },
    {
      id: 'rigid-flex',
      name: 'Rigid-Flex',
      fullName: 'Rigid-Flex PCB',
      price: '₹1,499',
      basePriceNum: 1499,
      layerTag: 'HYBRID STACK',
      layers: 4,
      desc: 'Combines rigid circuit boards and flexible polyimide ribbons in one unitary board.',
      spec1Label: 'Transitions',
      spec1Val: 'Prepreg Bond',
      spec2Label: 'Weight Relief',
      spec2Val: 'Up to -60%',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <rect fill="#006c4a" height="30" opacity="0.6" rx="2" width="38" x="15" y="30"></rect>
          <path d="M 53 45 Q 80 20 107 45" fill="none" stroke="#d97706" strokeWidth="5"></path>
          <rect fill="#006c4a" height="30" opacity="0.6" rx="2" width="38" x="107" y="30"></rect>
        </svg>
      )
    },
    {
      id: 'metal-core',
      name: 'Metal Core PCB',
      fullName: 'Metal Core PCB',
      price: '₹499',
      basePriceNum: 499,
      layerTag: 'MCPCB',
      layers: 1,
      desc: 'Aluminum substrate for ultra-high-power thermal dissipation & LED spotlights.',
      spec1Label: 'Thermal Cond.',
      spec1Val: '2.0W - 3.0W/m.K',
      spec2Label: 'Base Alloy',
      spec2Val: 'Al 5052 / 6061',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <rect fill="#94a3b8" height="20" rx="2" width="130" x="15" y="48"></rect>
          <text className="font-mono text-[8px]" fill="#ffffff" x="25" y="62">ALUMINUM CORE</text>
          <rect fill="#38bdf8" height="4" width="130" x="15" y="42"></rect>
          <circle cx="45" cy="34" fill="#f59e0b" r="6"></circle>
          <circle cx="80" cy="34" fill="#f59e0b" r="6"></circle>
          <circle cx="115" cy="34" fill="#f59e0b" r="6"></circle>
        </svg>
      )
    },
    {
      id: 'dev-shields',
      name: 'Dev Shields',
      fullName: 'Dev Board Shields',
      price: '₹349',
      basePriceNum: 349,
      layerTag: 'ESP32 / RP2040',
      layers: 2,
      desc: 'Standard headers, Arduino, Raspberry Pi, and ESP32 expansion pinouts.',
      spec1Label: 'Header Pitch',
      spec1Val: '2.54mm (0.1")',
      spec2Label: 'Silkscreen',
      spec2Val: 'HD High-Contrast',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <rect fill="#006c4a" height="60" opacity="0.7" rx="4" width="110" x="25" y="15"></rect>
          <rect fill="#1e293b" height="4" width="50" x="35" y="18"></rect>
          <rect fill="#1e293b" height="4" width="70" x="35" y="68"></rect>
          <rect fill="#0f172a" height="26" rx="2" width="26" x="80" y="32"></rect>
          <circle cx="85" cy="37" fill="#cbd5e1" r="1"></circle>
        </svg>
      )
    },
    {
      id: 'power-supply',
      name: 'Power Supply',
      fullName: 'Power Supply PCB',
      price: '₹599',
      basePriceNum: 599,
      layerTag: '2OZ - 3OZ COPPER',
      layers: 2,
      desc: 'Heavy copper 2oz/3oz, wide track spacing, high-voltage isolation clearances.',
      spec1Label: 'Creepage / Gap',
      spec1Val: 'IEC 60950 Spec',
      spec2Label: 'Max Current',
      spec2Val: 'Up to 30 Amps',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <rect fill="#131b2e" height="60" rx="3" width="130" x="15" y="15"></rect>
          <path d="M 25 35 H 70 V 60 H 135" stroke="#004ac6" strokeLinecap="square" strokeWidth="8"></path>
          <path d="M 25 60 H 50 V 35 H 90" stroke="#f59e0b" strokeWidth="4"></path>
          <circle cx="120" cy="35" fill="#e2e8f0" r="8" stroke="#004ac6" strokeWidth="2"></circle>
        </svg>
      )
    },
    {
      id: 'sensor-pcb',
      name: 'Sensor PCB',
      fullName: 'Sensor PCB',
      price: '₹449',
      basePriceNum: 449,
      layerTag: 'ULTRA-COMPACT',
      layers: 2,
      desc: 'Ultra-compact form factors with low-noise analog ground plane partitioning.',
      spec1Label: 'Noise Shielding',
      spec1Val: 'Faraday Ring',
      spec2Label: 'SMD Accuracy',
      spec2Val: '0201 Capable',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <circle cx="80" cy="45" fill="#006c4a" opacity="0.7" r="32"></circle>
          <circle cx="80" cy="45" fill="#004ac6" opacity="0.3" r="22"></circle>
          <circle cx="80" cy="45" fill="#f8fafc" r="10"></circle>
          <circle cx="80" cy="45" fill="#006c4a" r="3"></circle>
          <circle cx="65" cy="35" fill="#f59e0b" r="2"></circle>
          <circle cx="95" cy="55" fill="#f59e0b" r="2"></circle>
        </svg>
      )
    },
    {
      id: 'custom-spec',
      name: 'Custom Spec',
      fullName: 'Custom Specification PCB',
      price: '₹899',
      basePriceNum: 899,
      layerTag: 'EXOTIC / ROGERS',
      layers: 4,
      desc: 'Irregular CAD outlines, castellated side vias, Rogers PTFE, and blind/buried microvias.',
      spec1Label: 'Castellation',
      spec1Val: 'Supported',
      spec2Label: 'Custom Edge',
      spec2Val: 'CNC Milling',
      renderSvg: (
        <svg className="w-36 h-20 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" viewBox="0 0 160 90">
          <polygon fill="#2563eb" opacity="0.3" points="30,20 125,20 145,50 115,75 40,75 20,50"></polygon>
          <circle cx="30" cy="20" fill="#cbd5e1" r="3"></circle>
          <circle cx="50" cy="20" fill="#cbd5e1" r="3"></circle>
          <circle cx="70" cy="20" fill="#cbd5e1" r="3"></circle>
          <circle cx="90" cy="20" fill="#cbd5e1" r="3"></circle>
          <circle cx="110" cy="20" fill="#cbd5e1" r="3"></circle>
          <path d="M40 50 L80 40 L110 60" stroke="#004ac6" strokeWidth="2"></path>
        </svg>
      )
    }
  ];

  const handleSelectSubstrate = (sub) => {
    setSelectedSubstrate(sub);
    setPcbConfig(prev => ({
      ...prev,
      layers: sub.layers || 2
    }));
  };

  const handleContinue = () => {
    navigate('/custom-pcb');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Interactive Progress Stepper Canvas */}
      <div className="w-full bg-surface-container-lowest shadow-sm py-space-lg px-margin mb-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
          <div>
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Step 01 of 04
            </span>
            <div className="font-headline-sm text-lg text-on-surface font-bold">
              Intent &amp; Substrate Selection
            </div>
          </div>

          {/* Stepper Nodes */}
          <div className="flex items-center gap-space-sm w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {/* Node 1: Active */}
            <div className="flex items-center gap-space-xs shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-semibold shadow-md">
                1
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs font-semibold text-primary">User &amp; Purpose</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Active Setup</span>
              </div>
            </div>
            <div className="w-8 sm:w-10 h-0.5 bg-surface-container-high mx-1"></div>

            {/* Node 2 */}
            <div className="flex items-center gap-space-xs opacity-60 shrink-0">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-mono text-xs font-medium">
                2
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs font-medium text-on-surface">Architecture</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Layer Stackup</span>
              </div>
            </div>
            <div className="w-8 sm:w-10 h-0.5 bg-surface-container-high mx-1"></div>

            {/* Node 3 */}
            <div className="flex items-center gap-space-xs opacity-60 shrink-0">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-mono text-xs font-medium">
                3
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs font-medium text-on-surface">Specifications</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Trace &amp; Tolerances</span>
              </div>
            </div>
            <div className="w-8 sm:w-10 h-0.5 bg-surface-container-high mx-1"></div>

            {/* Node 4 */}
            <div className="flex items-center gap-space-xs opacity-60 shrink-0">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-mono text-xs font-medium">
                4
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs font-medium text-on-surface">Verification</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">DFM / DRC Check</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-margin space-y-space-xl pb-24">
        {/* Header Block with Geometric Visual Element */}
        <div className="relative bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-sm overflow-hidden border border-outline-variant/30">
          {/* Decorative PCB Traces SVG */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
            <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 400 200">
              <path d="M20 20 H 120 L 160 60 H 300 L 340 100 H 390" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <circle cx="20" cy="20" fill="currentColor" r="4"></circle>
              <circle cx="390" cy="100" fill="currentColor" r="4"></circle>
              <path d="M50 80 H 140 L 180 120 H 260 L 290 150 H 380" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <circle cx="50" cy="80" fill="currentColor" r="4"></circle>
              <circle cx="380" cy="150" fill="currentColor" r="4"></circle>
              <path d="M10 160 H 90 L 130 120 H 170" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              <circle cx="10" cy="160" fill="currentColor" r="4"></circle>
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-primary font-label-sm text-xs font-bold mb-space-sm">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              SPECIFICATION ADAPTIVE ENGINE
            </div>
            <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight mb-space-xs">
              What type of PCB are you looking for?
            </h1>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
              Help us tailor technical recommendations, impedance presets, and project templates for your workflow.
            </p>
          </div>
        </div>

        {/* SECTION 1: User Category & Intent */}
        <div className="space-y-space-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Section 01</span>
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                Target Application &amp; Maker Demographics
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
              <span className="material-symbols-outlined text-[16px]">security</span>
              <span>Zero-Ad Tracking Policy</span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">info</span>
            <div className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Maker Community Context:</span> Demographics are strictly for optional UX personalization and maker community benchmarks. They do <span className="font-bold text-on-surface">NOT</span> affect board pricing, testing rigor, or technical specifications.
            </div>
          </div>

          {/* Demographic Micro Selectors: Split Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
            {/* Gender Selection */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm space-y-space-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-on-surface">Personalization (Optional)</span>
                <span className="font-label-sm text-xs text-on-surface-variant">Profile Preset</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                {genderOptions.map((g) => {
                  const selected = selectedDemographic.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedDemographic(prev => ({ ...prev, gender: g }))}
                      className={`py-2 px-space-xs rounded-lg text-center font-label-md text-xs transition-all ${
                        selected
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container font-medium'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age Group Selection */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm space-y-space-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-on-surface">Experience &amp; Age Group</span>
                <span className="font-label-sm text-xs text-on-surface-variant">Cohort Analysis</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-space-xs">
                {ageOptions.map((age) => {
                  const selected = selectedDemographic.ageGroup === age;
                  return (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setSelectedDemographic(prev => ({ ...prev, ageGroup: age }))}
                      className={`py-2 px-space-xs rounded-lg text-center font-label-md text-xs transition-all ${
                        selected
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container font-medium'
                      }`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Purpose / Project Stage Cards */}
          <div className="space-y-space-sm">
            <span className="font-headline-sm text-sm font-bold text-on-surface">
              Select Your Project Stage &amp; Scope
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-space-sm">
              {projectStages.map((stage) => {
                const isSelected = selectedDemographic.purpose === stage.title;
                return (
                  <div
                    key={stage.title}
                    onClick={() => setSelectedDemographic(prev => ({ ...prev, purpose: stage.title }))}
                    className={`cursor-pointer p-space-md rounded-xl shadow-sm transition-all flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-primary-fixed border-primary shadow-md'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/20'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-space-sm transition-colors ${
                          isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{stage.icon}</span>
                      </div>
                      <span className="font-headline-sm text-xs font-bold text-on-surface block leading-tight mb-1">
                        {stage.title}
                      </span>
                      <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs flex items-center justify-between">
                      <span className="font-label-sm text-[10px] uppercase font-bold text-primary">
                        {stage.tag}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: PCB Type Selection Grid */}
        <div className="space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
            <div>
              <span className="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Section 02</span>
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                Architectural PCB Substrate Type
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Select standard substrate topology for instant production tooling.
              </p>
            </div>
            <div className="flex items-center gap-space-xs font-label-sm text-xs text-secondary font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>RoHS 2.0 &amp; Lead-Free Certified Fab</span>
            </div>
          </div>

          {/* 10 Visual Technical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-space-md">
            {pcbSubstrates.map((card) => {
              const isSelected = selectedSubstrate.id === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectSubstrate(card)}
                  className={`cursor-pointer rounded-2xl p-space-md shadow-sm transition-all flex flex-col justify-between group border ${
                    isSelected
                      ? 'bg-primary-fixed/40 border-primary ring-2 ring-primary/20 shadow-md'
                      : 'bg-surface-container-lowest hover:shadow-md border-outline-variant/30'
                  }`}
                >
                  <div className="space-y-space-sm">
                    {/* SVG Illustration Container */}
                    <div className="w-full h-32 rounded-xl bg-surface-container-low p-space-sm flex items-center justify-center relative overflow-hidden">
                      {card.renderSvg}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="font-mono text-[10px] bg-surface-container px-1.5 py-0.5 rounded font-bold text-on-surface">
                          {card.layerTag}
                        </span>
                        {card.popular && (
                          <span className="font-mono text-[9px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded font-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-headline-sm text-sm font-bold transition-colors ${
                          isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                        }`}>
                          {card.name}
                        </h3>
                        <span className="font-label-sm text-xs font-bold text-secondary">{formatPrice(card.basePriceNum)}</span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-label-sm text-[11px] text-on-surface-variant">
                        <span>{card.spec1Label}</span>
                        <span className="font-mono text-on-surface font-semibold">{card.spec1Val}</span>
                      </div>
                      <div className="flex justify-between font-label-sm text-[11px] text-on-surface-variant">
                        <span>{card.spec2Label}</span>
                        <span className="font-mono text-on-surface font-semibold">{card.spec2Val}</span>
                      </div>
                    </div>
                  </div>

                  {/* Select button */}
                  <button
                    type="button"
                    className={`mt-space-md w-full py-2 px-space-sm rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface group-hover:bg-primary-container group-hover:text-on-primary-container'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Selected</span>
                      </>
                    ) : (
                      'Select'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR HUD */}
      <div className="sticky bottom-0 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-space-md px-margin border-t border-outline-variant/30">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-md">
          {/* Left Config Summary Status */}
          <div className="flex items-center gap-space-lg w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">layers</span>
              </div>
              <div>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                  Currently Configured
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm sm:text-base font-bold text-on-surface leading-tight">
                    {selectedSubstrate.fullName || selectedSubstrate.name}
                  </span>
                  <span className="font-label-sm text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-mono font-bold">
                    From {formatPrice(selectedSubstrate.basePriceNum || selectedSubstrate.startingPrice || 299)}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block h-8 w-px bg-surface-container-high"></div>
            <div className="hidden md:flex flex-col">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Project Scope
              </span>
              <span className="font-body-md text-xs font-bold text-primary">
                {selectedDemographic.purpose}
              </span>
            </div>
          </div>

          {/* Right Action CTA */}
          <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-body-sm text-xs text-on-surface-variant hover:text-on-surface transition-colors py-2 px-space-sm"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back</span>
            </Link>
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-lg py-3 rounded-lg bg-primary text-on-primary font-headline-sm text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(0,74,198,0.3)] hover:bg-primary-container transition-all active:scale-[0.98]"
            >
              <span>Continue to Custom Configuration</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionPage;

