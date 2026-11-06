# PCB Hub - React Application

A modern, high-precision industrial PCB fabrication and rapid prototyping web application converted from Stitch design code into modular React + Tailwind CSS.

## 🛠️ Features & Pages

- **Home Page (`/`)**: High-impact landing page featuring CAD viewport HUD, interactive callouts (Gold ENIG, Micro-vias, Solder mask, Impedance), live fabrication estimator, tailored product lines, feature matrices, 4-step fabrication pipeline, customer testimonials, and verified partner marks.
- **Product Selection (`/product-selection`)**: "Tell Us What You Need" product finder with a 4-step progress stepper, maker demographic selectors (Gender & Age group), project scope cards (7 stages), 10 architectural substrate cards with technical SVG cross-sections, and sticky bottom summary HUD.
- **Custom PCB Configurator (`/custom-pcb`)**: Deep foundry parameter console featuring layer selector (1 to 10+ layers), live dimension & area calculator with aspect ratio CAD preview, quantity matrix, real-time solder mask color switcher, surface finishes, copper weights, board thicknesses, file dropzone, interactive 3D board visualizer, and sticky itemized calculation.
- **Instant Price Calculator (`/pricing`)**: Real-time Foundry Live Quote Engine v4.2 with dynamic unit rates, batch size buttons, dimension sliders, layer stackups, surface finishes, turnaround speed toggles, DFM review option, and live quotation breakdown with GST.
- **How It Works (`/how-it-works`)**: 4-step manufacturing pipeline breakdown, cleanroom specifications, and IPC Class 2/3 manufacturing tolerance matrix.
- **Design Help (`/design-help`)**: Hardware engineering assistance request form, downloadable EDA design rule files (KiCad, Eagle, Altium), and direct engineering helpline.
- **Track Order (`/track-order`)**: IoT cleanroom sensor network tracker for order `#PCB-84920` with timestamped station checkpoints and cleanroom environment telemetry.
- **Components & Modals**:
  - Global responsive Navbar with announcement banner, currency switcher, and search
  - Cart Side Drawer with live subtotal, GST calculation, and domestic checkout trigger
  - Gerber Upload Modal with simulated automated cloud DFM rule check
  - Industrial Footer with compliance marks and engineering newsletter signup
  - Vector SVG PCB Hub Logo component

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

