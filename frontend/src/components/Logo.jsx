import React from 'react';
import { Link } from 'react-router-dom';

export const LogoIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="traceGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="48" height="48" rx="12" fill="#0F172A" />
    <rect x="6" y="6" width="48" height="48" rx="12" stroke="#334155" strokeWidth="1.5" />
    <path
      d="M18 20H26L32 26V34"
      stroke="#2563EB"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M42 40H34L28 34V26"
      stroke="#10B981"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="20" r="3" fill="#60A5FA" />
    <circle cx="42" cy="40" r="3" fill="#34D399" />
    <circle cx="30" cy="30" r="4.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
    <rect x="23" y="14" width="3" height="3" rx="0.75" fill="#94A3B8" />
    <rect x="34" y="43" width="3" height="3" rx="0.75" fill="#94A3B8" />
  </svg>
);

export const Logo = ({ showSubtext = true, className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-space-sm group ${className}`}>
      <LogoIcon className="h-8 w-8 object-contain shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold group-hover:text-primary-container transition-colors">
          PCB Hub
        </span>
        {showSubtext && (
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[9px]">
            FAB &amp; ASSEMBLY
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;

