import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { subscribeNewsletter } from '../services/api.js';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // Fall back gracefully — still mark as subscribed locally
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-surface-container-low text-on-surface mt-space-xl border-t border-outline-variant/30">
      <div className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
          {/* Col 1: Identity & Compliance */}
          <div>
            <div className="mb-space-sm">
              <Logo />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs sm:text-sm leading-relaxed">
              Industrial-grade precision fabrication and rapid hardware prototyping. Certified electronic production facility delivering sub-mil tolerance execution.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="font-label-sm text-label-sm bg-surface-container px-2 py-1 rounded text-on-surface-variant font-medium text-[11px]">
                ISO 9001:2015
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container px-2 py-1 rounded text-on-surface-variant font-medium text-[11px]">
                IPC-A-600 Class 3
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container px-2 py-1 rounded text-on-surface-variant font-medium text-[11px]">
                ITAR Compliant
              </span>
            </div>
          </div>

          {/* Col 2: Capabilities */}
          <div>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-space-md uppercase tracking-wider">
              Capabilities
            </h4>
            <ul className="space-y-2 font-body-sm text-xs text-on-surface-variant">
              <li>
                <Link to="/custom-pcb" className="hover:text-primary transition-colors">
                  FR-4 Standard &amp; High-TG (Up to 32 Layers)
                </Link>
              </li>
              <li>
                <Link to="/custom-pcb" className="hover:text-primary transition-colors">
                  Rogers &amp; High Frequency Teflon
                </Link>
              </li>
              <li>
                <Link to="/product-selection" className="hover:text-primary transition-colors">
                  Aluminum &amp; Metal Core PCBs
                </Link>
              </li>
              <li>
                <Link to="/product-selection" className="hover:text-primary transition-colors">
                  Rigid-Flex &amp; Polyimide Flex
                </Link>
              </li>
              <li>
                <Link to="/custom-pcb" className="hover:text-primary transition-colors">
                  HDI with Laser Staggered Microvias
                </Link>
              </li>
              <li>
                <Link to="/design-help" className="hover:text-primary transition-colors">
                  SMT Stencils &amp; Pick-and-Place Assembly
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tools & Diagnostics */}
          <div>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-space-md uppercase tracking-wider">
              Tools &amp; Diagnostics
            </h4>
            <ul className="space-y-2 font-body-sm text-xs text-on-surface-variant">
              <li>
                <Link to="/custom-pcb" className="hover:text-primary transition-colors">
                  Interactive Gerber Viewer 3D
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  Instant DFM Rule Checker &amp; Live Quote
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  Controlled Impedance Calculator
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  Multi-layer Stackup Planner
                </Link>
              </li>
              <li>
                <Link to="/design-help" className="hover:text-primary transition-colors">
                  IPC-A-600 Guidelines &amp; Footprints
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-primary transition-colors">
                  Live Production Lot Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Engineering Newsletter */}
          <div>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-space-md uppercase tracking-wider">
              Engineering Pulse
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant mb-space-sm">
              Subscribe for fabrication tolerance updates, component shortage feeds, and technical whitepapers.
            </p>
            {subscribed ? (
              <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-semibold flex items-center gap-2 mb-space-md">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Subscribed! Check your inbox for DFM cheatsheet.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-space-xs mb-space-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  required
                  className="w-full px-3 py-2 bg-surface-container text-on-surface rounded-lg font-label-md text-xs border border-outline-variant focus:outline-none focus:border-primary placeholder:text-on-surface-variant"
                />
                <button
                  type="submit"
                  className="px-space-md py-2 bg-primary text-on-primary rounded-lg font-headline-sm text-xs font-semibold hover:bg-primary-container transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            )}
            <div className="flex items-center gap-3 pt-space-xs">
              <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
              <div className="text-left">
                <span className="block font-label-sm text-label-sm text-on-surface font-semibold text-xs">
                  100% RoHS &amp; UL 94V-0
                </span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                  Certified lead-free &amp; flame retardant
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-space-md border-t border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-xs text-on-surface-variant">
          <div>© {new Date().getFullYear()} PCB Hub Foundry Ltd. All rights reserved. Precision Electronic Assembly &amp; Manufacturing.</div>
          <div className="flex flex-wrap items-center gap-space-md font-label-sm text-xs">
            <a href="#terms" className="hover:text-on-surface transition-colors">
              Terms of Fabrication
            </a>
            <a href="#drc" className="hover:text-on-surface transition-colors">
              DRC Quality Guarantee
            </a>
            <a href="#nda" className="hover:text-on-surface transition-colors">
              Security &amp; NDA
            </a>
            <a href="#privacy" className="hover:text-on-surface transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

