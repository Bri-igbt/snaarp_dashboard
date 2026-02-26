# Snaarp Drag-and-Drop Dashboard

<img src="https://res.cloudinary.com/dhdcmkuhx/image/upload/v1772108630/Screenshot_2026-02-26_at_13.23.26_pzljqh.png" />

A modern, accessible React + TypeScript demo that showcases a draggable dashboard and a local upload dropzone. Users can reorder widgets via drag-and-drop (mouse/touch + keyboard) and persist their preferred layout in the browser. The upload area lets users select or drop files, previews images, and simulates an upload with user feedback.

Last updated: 2026-02-26 12:57

---

## Table of Contents
- Overview
- Key Features
- Tech Stack
- Project Structure
- Getting Started
- Available Scripts
- Usage Guide
  - Dashboard (Drag & Drop)
  - Upload Dropzone
- Architecture & Decisions
  - State Persistence
  - Accessibility
  - Styling
- Known Limitations
- Changelog (This Update)
- Roadmap / Future Enhancements
- License

---

## Overview
Snaarp implements a draggable dashboard using @dnd-kit. The layout is responsive and supports keyboard interactions for accessibility. An Upload Dropzone is included to simulate file uploads with image previews and simple status toasts. This project is a good starting point for building a real admin analytics dashboard.

## Key Features
- Responsive, reorderable widgets grid (drag-and-drop)
- Pointer and keyboard interactions for DnD
- Layout persistence via localStorage
- Upload Dropzone with image previews, per-item removal, and simulated upload
- Clean, modular React components with TypeScript types
- App shell with sidebar navigation, header (search + notifications), and footer

## Tech Stack
- React 19 + Vite 6 + TypeScript
- @dnd-kit (core + sortable)
- Tailwind CSS 3
- React Router 7
- lucide-react icons
- react-hot-toast for user feedback

Recommended Node.js: v18 or newer

## Project Structure
Full repository layout annotated with roles and key responsibilities.

snarp/
- README.md – Project documentation (you are here)
- client/ – Vite + React frontend
  - package.json – scripts and dependencies
  - vite.config.ts – Vite config
  - tsconfig.json / tsconfig.app.json – TypeScript configs
  - public/ – static assets copied as-is to build
  - src/ – application source code
    - main.tsx – App entry; mounts React root
    - App.tsx – Router + providers (e.g., Toaster)
    - index.css – Global Tailwind styles
    - assets/ – optional images/icons
    - layout/
      - MainLayout.tsx – App shell (header with search + notifications, content outlet, footer). Wraps all pages.
    - components/
      - Dashboard.tsx – Homepage containing:
        - Draggable widgets grid (DnD via @dnd-kit)
        - Uploads section with grid/table toggle, drag-sorting, preview modal
        - Upload modal that renders UploadDropzone
      - UploadDropzone.tsx – Drag-and-drop area and file picker inside the modal. Builds a client-side list of selected files, shows previews, and hands completed assets up to Dashboard.
      - SortableItem.tsx – Sortable wrapper for grid items (uploads grid and widgets grid)
      - SortableRow.tsx – Sortable wrapper for table rows (uploads table)
      - WidgetCard.tsx – Presentation for each dashboard widget
      - layout/Sidebar.tsx – Left navigation (desktop variant in this demo)
    - data.ts – Initial widgets and any static content
    - types/widget.ts – Shared TypeScript types for widgets and assets

## Getting Started
1) Install dependencies
   cd client
   npm install

2) Start the dev server
   npm run dev
   Open the printed URL (usually http://localhost:5173)

3) Build for production
   npm run build
   npm run preview  # preview the production build

## Available Scripts (from client/)
- npm run dev – start Vite dev server
- npm run build – type-check and build
- npm run preview – preview production build
- npm run lint – run ESLint

## Usage Guide
### Dashboard (Drag & Drop)
- Click and drag a widget card to reorder it; keyboard users can also re-order using the configured @dnd-kit keyboard sensor.
- Changes persist automatically to localStorage under the key "dashboard-layout".

### Uploads Section & Dropzone
- Click the Upload button to open the modal with a drag-and-drop area (or Browse).
- Select multiple files; images show previews. Remove individual selections before uploading.
- Click "Upload files" to simulate an upload. When complete, the files appear in the Uploaded Files section on the dashboard.
- Layout toggle: switch between Grid and Table for uploaded items. Your choice persists in localStorage.
- Reorder uploads by dragging (grid: cards, table: rows). Order persists in localStorage.
- Mobile actions: on small screens, each upload has a compact dropdown with View, Edit (rename), and Delete. On larger screens, these appear as inline buttons.

Notes
- Uploaded items are stored in localStorage under "uploaded-assets" with basic metadata (name, type, size, data URL, createdAt).
- This is a demo; there is no backend. Data stays in your browser and can be cleared via site data or code changes.

## Architecture & Decisions
### State Persistence
- Dashboard layout only: saved to localStorage using a constant key and basic try/catch for safety.
- Key: "dashboard-layout" (array of Widget: { id, title })

### Accessibility
- Keyboard DnD enabled via @dnd-kit KeyboardSensor and sortableKeyboardCoordinates.
- Focusable, descriptive controls with aria-labels (e.g., Notifications button, Sidebar close button, labeled Upload area).
- Enter key opens the file picker when the dropzone is focused.

### Styling
- Tailwind CSS utility-first styling (see Tailwind config under client/).
- Consistent focus and hover states across interactive elements.

## Known Limitations
- Upload is simulated; there is no backend integration.
- Preview URLs exist only during the current selection (revoked after upload/clear or on unmount).
- Navigation links beyond the dashboard route are placeholders.
- No automated tests yet (unit or E2E).

## Changelog (This Update)
Comprehensive documentation refresh to accurately reflect the current codebase:
- Corrected Upload Dropzone behavior documentation: no localStorage persistence of uploaded items; clarified simulated upload and memory cleanup.
- Detailed Usage Guide for both dashboard DnD and the Upload modal.
- Expanded Accessibility and Styling sections to match implemented features.
- Explicit Tech Stack versions (React 19, Vite 6, Tailwind 3, Router 7) and Node version guidance.
- Clarified project structure with component responsibilities.
- Added Known Limitations and Roadmap sections.

Implementation highlights currently present in the codebase:
- Dashboard.tsx: localStorage persistence with try/catch and shape validation; pointer + keyboard sensors; arrayMove reordering.
- UploadDropzone.tsx: drag-over highlighting, previews via object URLs, removal with cleanup, simulated upload with react-hot-toast, comprehensive URL revocation on item removal, on successful upload, and on unmount.
- Sidebar.tsx: accessible overlay-capable sidebar component with aria-labels on interactive controls.
- types/widget.ts: typed widget IDs and icon ElementType for stronger typing.

## Roadmap / Future Enhancements
- Real data/chart widgets (e.g., Recharts or Chart.js).
- Backend integration for uploads; progress and error states per file.
- Tests (unit + E2E) and CI integration.
- i18n and theme/dark mode support.
- Reduce bundle by pruning unused deps (e.g., consider removing react-dropzone if not used).

## License
MIT