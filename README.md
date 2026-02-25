# Snaarp Drag-and-Drop Dashboard

<img src="https://res.cloudinary.com/dhdcmkuhx/image/upload/v1772047920/Screenshot_2026-02-25_at_20.28.37_myvsmg.png" />

A modern, accessible React + TypeScript demo that showcases a draggable dashboard and a local upload dropzone. Users can reorder widgets via drag-and-drop (mouse/touch + keyboard) and persist their preferred layout in the browser. The upload area lets users select or drop files, previews images, and simulates an upload with user feedback.

Last updated: 2026-02-25 20:17

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
Root
- README.md (this file)
- client/
  - package.json, Vite config, Tailwind config, etc.
  - src/
    - App.tsx (routing + Toaster provider)
    - main.tsx (app entry)
    - index.css (global styles)
    - layout/
      - MainLayout.tsx (shell: header, content, footer)
    - components/
      - Dashboard.tsx (draggable grid + Upload modal)
      - SortableItem.tsx (sortable wrapper for widgets)
      - WidgetCard.tsx (card UI for each widget)
      - layout/Sidebar.tsx (left navigation; supports desktop/overlay variants)
      - UploadDropzone.tsx (file picker/drag-drop + previews + simulated upload)
    - data.ts (initial widgets + navigation items)
    - types/widget.ts (shared types and props)

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

### Upload Dropzone
- Click the Upload button to open the modal.
- Drag and drop files into the drop area or click to browse and select multiple files.
- Image files get a live preview using URL.createObjectURL.
- Remove individual items using the X button on each preview.
- Click "Upload files" to simulate an upload (about 1.5s). When done:
  - All generated object URLs are revoked to prevent memory leaks.
  - The selection is cleared and a success toast is shown.

Note: The demo does not persist uploaded file data to localStorage or a backend. It is purely a front-end simulation with previews and toasts.

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