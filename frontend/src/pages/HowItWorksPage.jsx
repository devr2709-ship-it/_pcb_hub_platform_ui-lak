import React from 'react';
import { Link } from 'react-router-dom';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Gerber Upload & Algorithmic DFM Analysis',
      desc: 'Export your board from KiCad, Eagle, Altium Designer, or EasyEDA into RS-274X or Gerber X2 format. Our automated cloud pre-flight engine parses every copper layer, drill file, and solder mask aperture in less than 3 seconds.',
      checklist: ['Annular ring breakout detection', 'Solder bridge clearance verification', 'Unrouted air-wire netlist continuity', 'Drill aspect ratio tolerances'],
      badge: 'DFM v4.8 Engine'
    },
    {
      num: '02',
      title: 'Foundry Spec Validation & Tooling Setup',
      desc: 'Customize board dimensions, copper thickness (1oz to 3oz), photosensitive LPI solder resist colors, and gold immersion ENIG plating. The system computes exact fabrication panelization efficiency.',
      checklist: ['IPC Class 2 & Class 3 standard selection', 'Controlled impedance modeling (50Ω / 90Ω / 100Ω)', 'Blind & buried microvia layer stacks', 'Edge chamfers & castellated pads'],
      badge: 'CAM Tooling'
    },
    {
      num: '03',
      title: 'Laser Direct Imaging & Cleanroom Fabrication',
      desc: 'Panels enter our Class 10,000 cleanroom. High-precision laser direct imaging (LDI) transfers micro-traces onto photographic resist, followed by chemical copper electroplating, LPI solder mask coating, and CNC routing.',
      checklist: ['CNC high-speed spindle drilling (up to 200,000 RPM)', 'Chemical copper PTH metallization', 'UV photoresist cured legend silkscreen', 'Surface finish (ENIG, Lead-Free HASL, OSP)'],
      badge: 'Class 10,000 Cleanroom'
    },
    {
      num: '04',
      title: '100% Flying Probe E-Test & Express Dispatch',
      desc: 'Every fabricated panel undergoes double-sided automated optical inspection (AOI) to eliminate shorts and opens. Netlist flying probes verify 100% conductivity before vacuum sealing with moisture barrier bags.',
      checklist: ['Dual-sided high-resolution optical AOI', 'Flying-probe test netlist matching 100%', 'Thermal stress & solderability coupons', 'ESD bubble-armored express air shipping'],
      badge: 'Zero-Defect QA'
    }
  ];

  const tolerances = [
    { param: 'Minimum Trace Width / Spacing', standard: '4 / 4 mil (0.1mm)', advanced: '3 / 3 mil (0.075mm)' },
    { param: 'Minimum Finished Hole Diameter', standard: '0.20 mm', advanced: '0.15 mm (Laser Microvia 0.10mm)' },
    { param: 'Layer Count', standard: '1 – 8 Layers', advanced: 'Up to 32 Layers HDI' },
    { param: 'Finished Board Thickness', standard: '0.8 – 2.0 mm', advanced: '0.2 – 3.2 mm' },
    { param: 'Copper Weight', standard: '1 oz, 2 oz', advanced: '3 oz, 4 oz Heavy Cu' },
    { param: 'Impedance Control Tolerance', standard: '±10%', advanced: '±5% High-Speed RF' },
    { param: 'Surface Finishes', standard: 'Lead-Free HASL, ENIG', advanced: 'Immersion Silver, OSP, Hard Gold' },
    { param: 'Substrate Laminates', standard: 'FR-4 (TG150)', advanced: 'Rogers 4350B, Aluminum Core, Polyimide Flex' }
  ];

  return (
    <div className="flex flex-col w-full py-space-xl">
      <div className="w-full max-w-[1440px] mx-auto px-margin space-y-space-xl">
        {/* Hero Section */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-space-xs bg-primary-container/10 px-3 py-1 rounded-full text-primary font-mono text-xs font-bold mb-space-sm">
              <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
              FOUNDRY MANUFACTURING PIPELINE
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight mb-space-xs">
              From Schematic to Flight-Ready Hardware
            </h1>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Explore the surgical precision engineering behind PCB Hub's domestic semiconductor &amp; PCB fabrication lines. We eliminate manufacturing bottlenecks through algorithmic validation and automated cleanroom execution.
            </p>
          </div>
        </div>

        {/* 4 Pipeline Steps Detailed */}
        <div className="space-y-space-lg">
          <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
            Step-by-Step Production Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="font-mono text-2xl font-bold text-primary">{st.num}</span>
                    <span className="font-mono text-xs bg-surface-container px-2.5 py-1 rounded-full text-on-surface font-semibold">
                      {st.badge}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2">
                    {st.title}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-space-md">
                    {st.desc}
                  </p>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded-xl space-y-1.5 border border-outline-variant/20">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold block mb-1">
                    Quality Gate Clearances:
                  </span>
                  {st.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tolerances Table */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-primary uppercase font-bold tracking-wider">
                ENGINEERING SPEC SHEET
              </span>
              <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
                Manufacturing Tolerances &amp; Capability Matrix
              </h2>
            </div>
            <span className="font-mono text-xs bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold">
              IPC-A-600 Class 2 &amp; 3 Certified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-mono">
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Standard Capability</th>
                  <th className="py-3 px-4">Advanced / HDI Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {tolerances.map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface">{row.param}</td>
                    <td className="py-3 px-4 font-mono text-on-surface-variant">{row.standard}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">{row.advanced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-space-lg rounded-2xl text-on-primary flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-lg">
          <div>
            <h3 className="font-headline-lg text-xl font-bold mb-1">Have custom layer stack specifications?</h3>
            <p className="font-body-sm text-xs text-on-primary-container">
              Our CAM engineers are on standby to conduct manual impedance validation and DRC reviews.
            </p>
          </div>
          <Link
            to="/custom-pcb"
            className="px-space-lg py-2.5 bg-surface text-primary rounded-xl font-headline-sm text-xs font-bold shadow hover:bg-surface-container-low transition-colors shrink-0"
          >
            Open Configurator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;

