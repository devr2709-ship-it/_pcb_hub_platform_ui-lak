---
name: Precision Trace Engineering
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#005a82'
  on-tertiary: '#ffffff'
  tertiary-container: '#0074a6'
  on-tertiary-container: '#e4f2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an ultra-refined, high-precision industrial aesthetic engineered specifically for hardware architects, electrical engineers, and high-spec electronics fabrication teams. The design ethos merges the functional rigor of electronic design automation (EDA) software with the frictionless polish of modern enterprise commerce.

### Brand Personality & Emotional Impact
- **Surgical Precision:** Every trace, border, and measurement conveys absolute geometric exactness. The interface instills trust through mathematical rhythm, zero unnecessary fluff, and clear visual signaling.
- **Advanced Technical Fluency:** Tailored for engineers who review complex multi-layer stackups, DRC (Design Rule Check) clearances, and micro-via specs. Visual density is balanced by structured spatial partitioning.
- **Controlled Innovation:** Clean architectural whites juxtaposed against electric signal blues and solder-mask emeralds communicate bleeding-edge manufacturing readiness.

### Design Movement: Precision Functionalism & Technical Glass
The interface synthesizes **Precision Functionalism** with **Controlled Glassmorphic Overlays**. It avoids purely decorative skeuomorphism, opting instead for structural grids, hairline substrate borders, micro-dot matrix overlays, and semi-transparent inspection HUDs that mimic high-end hardware diagnostic stations.

## Colors

The color architecture is derived from the core physical realities of advanced electronics fabrication: structural copper traces, optical inspection beams, solder resist layers, and high-grade dielectric substrates.

### Color Tokens & Semantic Assignments

- **Primary (`#2563EB` | Signal Blue):** Serves as the primary operational hue—conveying interactive actions, primary callouts, automated quoting triggers, and selected routing pathways. Paired with an interactive active state `#1D4ED8`.
- **Secondary (`#059669` / `#10B981` | Mask Emerald):** Dedicated to verified clearances, passing DRC tests, lead-free surface finish validations, and automated production clearances. Evokes the physical familiarity of high-reliability green solder resist.
- **Tertiary (`#0EA5E9` | Trace Cyan):** Utilized for dynamic parameters, interactive Gerber layer toggles, visual differential pairs, and auxiliary telemetry indicators.
- **Neutral & Structural Foundations:**
  - `Neutral Darkest (#0F172A)`: Primary typography, board layer legends, and dominant structural frames.
  - `Neutral Slate (#1E293B, #334155)`: Secondary data labels, inactive pin states, and table headers.
  - `Neutral Subdued (#64748B, #94A3B8)`: Supporting documentation and passive unit measurements.
  - `Neutral Border (`#E2E8F0`, `#CBD5E1`)`: Substrate outlines, component card perimeters, and modular grid dividers.
  - `Neutral Surface Base (`#F8FAFC`, `#FFFFFF`)`: Pure clean clinical workspaces and high-contrast spec inspection panels.

### Contrast & Functional Rules
Text rendered on neutral surfaces strictly satisfies WCAG 2.1 AAA for data specs (`#0F172A` on `#FFFFFF` yields a contrast ratio of 16.9:1). Emerald signals are reserved strictly for verification, status affirmation, and zero-defect tolerances.

## Typography

The typographic hierarchy implements an intentional three-tiered system to separate conversational instructions, operational navigation, and technical specifications:

1. **Display & Headlines (`Plus Jakarta Sans`):** Delivers clean geometry with subtle organic softening. It anchors page titles, board configurator tiers, and primary system metrics.
2. **Body & Interface (`Inter`):** Selected for its hyper-neutral readability across dense multi-column layouts, parameter controls, configuration accordions, and documentation guides.
3. **Monospaced Data Specs (`JetBrains Mono`):** Dedicated exclusively to engineering variables, layer counts, copper weight (e.g., `1 oz`, `2 oz`), board dimensions (`100mm × 160mm`), hole tolerances (`±0.05mm`), impedance values (`50Ω ±10%`), and transactional calculations in Indian Rupee format (`₹12,450.00`).

All monospaced labels leverage tabular lining numbers (`tnum`) by default, preventing jitter during real-time automated quotation calculations and dynamic layer stack updates.

## Layout & Spacing

The layout is grounded in a modular 4px/8px baseline grid designed to support high-density parameter panels alongside spacious interactive Gerber/3D model viewports.

### Grid Configuration
- **Desktop (≥ 1280px):** 12-column fluid grid, max container width `1440px`, `1.5rem` (`24px`) gutters, and `2rem` (`32px`) canvas margins. Configurator consoles pin a 4-column parameter stack against an 8-column CAD/Gerber render canvas.
- **Tablet (768px - 1279px):** 8-column layout with `1.25rem` (`20px`) gutters and `1.5rem` (`24px`) margins. Side-by-side inspect modes fold into layered split-sheets.
- **Mobile (< 768px):** 4-column layout with `1rem` (`16px`) gutters and `1rem` (`16px`) margins. Spec tables transition into horizontal swipe cards or consolidated vertical readouts.

### Component Spacing Discipline
- `space-xs` (4px): Micro-alignment between pin icons, unit suffixes, and status pill dots.
- `space-sm` (8px): Internal paddings for spec chips, table cells, and parameter inputs.
- `space-md` (16px): Structural distance between form groups, stepper milestones, and badge groups.
- `space-lg` (24px): Padding within cards, modal dialogs, and configuration sections.
- `space-xl` (40px): Section breaks between spec tables, vendor tier selectors, and order summaries.

## Elevation & Depth

Visual depth is achieved through layered crystalline planes, directional keylines, and soft technical ambient lighting rather than heavy diffused drop shadows.

### Surface Hierarchy & Elevation Levels

1. **Substrate Base (Level 0):** Background surface (`#F8FAFC`). Flat, static, crisp base level with an optional 32px SVG circuit grid dot pattern at 4% opacity (`#CBD5E1`).
2. **Component Plane (Level 1):** Solid white (`#FFFFFF`) with a 1px structural hairline border (`#E2E8F0`). Used for order cards, configuration panels, and spec matrices. Shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`.
3. **Floating Diagnostics / Hover HUD (Level 2):** Elevated interactive components and active parameter dropdowns. Shadow: `0 4px 16px -2px rgba(37, 99, 235, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.06)`, with border tint shifting to `#CBD5E1`.
4. **Gerber Inspection Overlays / Modals (Level 3):** Glassmorphic surface built with `rgba(255, 255, 255, 0.88)` backdropped by a `12px` Gaussian blur (`backdrop-filter: blur(12px)`) and a 1px luminous edge highlight (`rgba(255, 255, 255, 0.6)` top, `rgba(226, 232, 240, 0.8)` bottom). Shadow: `0 20px 30px -10px rgba(15, 23, 42, 0.12)`.

## Shapes

The design system maintains a `roundedness: 2` standard (`0.5rem` / `8px` base curve). This strikes the exact balance between modern industrial software fluidity and the rigid structural discipline of circuit hardware.

### Corner Radius Mapping
- **Base (0.5rem / 8px):** Input fields, interactive spec chips, dropdown controls, step triggers, and buttons.
- **Rounded-LG (1rem / 16px):** Modular configuration blocks, layer stack containers, quotation summaries, and file dropzones.
- **Rounded-XL (1.5rem / 24px):** Primary engineering canvas cards, top-level hero product enclosures, and verification inspection panels.
- **Micro (0.25rem / 4px):** Tooltips, data tags, solder pad indicators, and sub-millimeter unit badges.
- **Pill (9999px):** Live DRC status indicators, active connection nodes, and order step counters.

## Components

### Buttons & Interactive Triggers
- **Primary Industrial Trigger:** Solid `#2563EB` background, white text, 8px radius, font weight 600. Includes an active state of `#1D4ED8` and an illuminated outer ring (`0 0 0 3px rgba(37, 99, 235, 0.25)`) on keyboard focus. Hover shifts upward by `1px` with a subtle technical drop glow.
- **Secondary / Verification Action:** Clean white canvas, 1px border `#E2E8F0`, text `#0F172A`. On hover, the border transitions to `#2563EB` and the surface tints to `#F8FAFC`.
- **DRC Clearance Button:** Solid emerald `#059669` with monospaced pass counters (e.g., `RUN DRC (0 ERRORS)`).

### Badges & Technical Chips
- **Engineering Chips:** 8px radius, built with `#F1F5F9` background, `#334155` text, and monospaced typography (`JetBrains Mono`, 12px). Active/selected chips feature a 1.5px solid `#2563EB` outline and `#EFF6FF` background.
- **Status Pills:** Pill-shaped (`9999px`), 11px monospaced typography, containing a 6px pulsating circular node indicator. Emerald (`#ECFDF5` surface, `#059669` dot/text) for "Gerber Verified"; Amber (`#FFFBEB` surface, `#D97706` dot/text) for "Impedance Review Required".

### Specification Tables
- Structured table rows with 44px height, hairline bottom borders (`#E2E8F0`), and zebra-tint alternative rows using `#F8FAFC` at 50% opacity.
- Left column: Parameter titles in `Inter` 13px regular (`#64748B`).
- Right column: Exact engineering measurements rendered in `JetBrains Mono` 13px medium (`#0F172A`), strictly aligned right.

### Input Fields & Parameter Steppers
- **Technical Inputs:** 40px height, 8px radius, white background, 1px border in `#CBD5E1`. Focus state initiates a 1px border `#2563EB` with `0 0 0 3px rgba(37, 99, 235, 0.15)`. Suffix labels (e.g., `mm`, `mil`, `oz`, `layers`) sit pinned inside the right field boundary in muted monospace.
- **Numeric Layer Steppers:** Segmented controls with increment/decrement buttons flanking a central monospaced counter.

### Rounded-XL Cards
- 24px corner radius (`rounded-xl`), framed with 1px hairline border (`#E2E8F0`), housing nested inspection headers and technical metadata grids. Headers feature subtle circuit-trace-inspired divider lines fading out towards the right edge.

### Workflow Stepper
- Horizontal progress bar connecting circular nodes (32px diameter). Passed nodes display an emerald checkmark; the active node features an electric blue ring with an illuminated core; pending nodes remain `#E2E8F0` with slate numbering. Step labels are placed below in 12px `JetBrains Mono`.