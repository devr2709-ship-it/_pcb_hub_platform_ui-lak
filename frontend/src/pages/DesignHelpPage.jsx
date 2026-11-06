import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { submitConsultation } from '../services/api.js';

export const DesignHelpPage = () => {
  const { showToast } = useConfig();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Arjun Sharma',
    email: 'arjun@hardwarelab.in',
    phone: '+91 98765 43210',
    service: 'Schematic to PCB Layout',
    boardType: '4-Layer High-Speed MCU',
    description: 'Need routing and 50Ω impedance matching for an ESP32-S3 + Ethernet PHY module with onboard ceramic antenna.'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        scope: `${formData.service} — ${formData.boardType}`,
        edaTool: 'KiCad / Altium',
        notes: formData.description
      });
      setTicketId(res.ticketId);
      setFormSubmitted(true);
      showToast(`Design help ticket ${res.ticketId} created! An engineer will contact you within 2 hours.`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadRule = (tool) => {
    showToast(`Downloading PCB Hub ${tool} DRC Rule File (.dru / .kicad_dru)...`);
  };

  return (
    <div className="flex flex-col w-full py-space-xl">
      <div className="w-full max-w-[1440px] mx-auto px-margin space-y-space-xl">
        {/* Header */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-space-xs bg-primary-container/10 px-3 py-1 rounded-full text-primary font-mono text-xs font-bold mb-space-sm">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              PCB ENGINEERING CONSULTING
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight mb-space-xs">
              Hardware Engineering &amp; Design Services
            </h1>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Don't have a ready Gerber package? Our senior hardware architects can transform your napkin sketches, breadboard prototypes, or schematics into production-ready CAD files.
            </p>
          </div>
        </div>

        {/* 2 Column Layout: Form & Downloads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Request Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
            <h2 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              Request Hardware Design Support
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant mb-space-md">
              Fill in your project specs. We sign mutual NDAs for all commercial IP.
            </p>

            {formSubmitted ? (
              <div className="p-space-lg bg-secondary-container/40 rounded-xl border border-secondary/30 text-center space-y-2">
                <span className="material-symbols-outlined text-secondary text-[48px] block mx-auto">
                  task_alt
                </span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Design Help Request Submitted!
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-md mx-auto">
                  Ticket <strong>{ticketId || '#ENG-REQ-XXXX'}</strong> has been assigned to our Bangalore Hardware Applications Team. You'll receive a callback and preliminary CAD estimate within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-space-md text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block font-medium text-on-surface-variant mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-on-surface-variant mb-1">Work / Student Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block font-medium text-on-surface-variant mb-1">Phone Number (WhatsApp ready)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-on-surface-variant mb-1">Required Service</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option>Schematic to PCB Layout</option>
                      <option>Breadboard to KiCad Conversion</option>
                      <option>High-Speed Impedance Routing</option>
                      <option>DFM &amp; Component Footprint Verification</option>
                      <option>Turnkey PCBA Assembly Sourcing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-on-surface-variant mb-1">Target Board Type / Layer Scope</label>
                  <input
                    type="text"
                    value={formData.boardType}
                    onChange={(e) => setFormData({ ...formData, boardType: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-medium text-on-surface-variant mb-1">Project Details &amp; Key Requirements</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-on-primary rounded-xl font-headline-sm text-xs sm:text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting
                    ? <><span className="material-symbols-outlined text-[18px] animate-spin">refresh</span><span>Submitting...</span></>
                    : <><span className="material-symbols-outlined text-[18px]">send</span><span>Submit Hardware Assistance Request</span></>
                  }
                </button>
              </form>
            )}
          </div>

          {/* Right Column: DRC Downloads & Guides */}
          <div className="lg:col-span-5 space-y-space-md">
            {/* Download DRC Rules */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">download_for_offline</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                  Download EDA DRC Rule Files
                </h3>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-space-md leading-relaxed">
                Import our verified design rule packages directly into your EDA software to ensure 100% first-pass DRC pass rate.
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-on-surface">KiCad 7 &amp; 8 Rules</span>
                    <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">.kicad_dru</span>
                  </div>
                  <button
                    onClick={() => handleDownloadRule('KiCad')}
                    className="p-1.5 text-primary hover:bg-surface-container rounded-lg"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-on-surface">Autodesk Eagle Design Rules</span>
                    <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">.dru</span>
                  </div>
                  <button
                    onClick={() => handleDownloadRule('Eagle')}
                    className="p-1.5 text-primary hover:bg-surface-container rounded-lg"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-on-surface">Altium Designer Ruleset</span>
                    <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">.rul</span>
                  </div>
                  <button
                    onClick={() => handleDownloadRule('Altium')}
                    className="p-1.5 text-primary hover:bg-surface-container rounded-lg"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Engineering Hotline */}
            <div className="bg-surface-container-high/50 p-space-md rounded-2xl border border-outline-variant/30 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-primary block">
                DIRECT FOUNDRY HELPLINE
              </span>
              <p className="font-headline-sm text-sm font-bold text-on-surface">
                Speak directly with a Senior CAM Engineer
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Monday to Saturday, 9:00 AM – 7:30 PM IST
              </p>
              <div className="pt-2 font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>+91 80 4920 8400 (Ext. 4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignHelpPage;

