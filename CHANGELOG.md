# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [v1.2.3] - 2026-10-15

### Fixed
- **Topbar Profile Card Geometry & Alignment**:
  - Fixed awkward dropdown alignment and border clipping by removing relative margin conflicts and assigning explicit `top: calc(100% + 10px)` positioning.
  - Added full 4-side bordered container with luxury shadow (`0 16px 36px -4px rgba(27, 34, 27, 0.14)`), generous internal header padding, and smooth opening animation.
  - Added `overflow: visible !important` to the topbar container to prevent boundary clipping.
- **Navigation Session Retention & Audit Log Access**:
  - Implemented module-level singleton store and synchronous local storage hydration in `useAdminGuard.ts`.
  - Prevented session timeouts from wiping admin profile and degrading developer/owner permissions to "Team member" upon navigating to `/admin/activity`.
  - Deduplicated concurrent in-flight profile checks across multiple workspace components on route change.

## [v1.2.2] - 2026-10-15

### Fixed & Enhanced
- **Stale-While-Revalidate Auth Guard**:
  - Eliminated "Verifying access..." lockouts and blank screen hangs caused by window minimization, tab switching, or browser throttle timeouts.
  - Replaced blocking full-page reload on background token refresh with silent background verification, preserving admin state and avoiding route unmounting.
- **Admin Workspace Sidebar & Topbar Polish**:
  - Embedded official company logo (`b9e63ce206aa68d0d57227942230badde2fa6a6b.png`) in the sidebar brand header.
  - Elevated "Overview" into a prominent, highlighted Hero Command Center card at the top of sidebar navigation.
  - Replaced generic "Core" category with a dedicated "Performance & Insights" section.
  - Added a sleek, discreet header chevron toggle for collapsing/expanding the sidebar.
  - Replaced "DA" square avatar with an elegant stone luxury `User` icon across sidebar and topbar.
  - Replaced generic fallback emails with the authenticated administrator's verified email.
  - Removed redundant "Live Website" / "Preview Public Website" navigation links from sidebar footer and topbar profile menu, keeping a single fast "Live Site" button in the topbar.
  - Removed boring `Developer • Manager Access` pill in Gallery header for verified admins.
- **Mobile & Tablet Friendly Media Overhaul**:
  - Upgraded `MediaLibraryModal` to a dynamic 100dvh full-screen sheet on mobile devices (`< 768px`) with safe-area insets and momentum touch scrolling.
  - Redesigned `MediaModalHeader` with a responsive 2-tier layout: title row and full-width touch tabs (min 38px height).
  - Optimized `MediaGrid` for mobile viewports with a 2-column layout, enlarged 24px selection check rings, and touch-accessible deletion actions.
  - Redesigned `MediaModalFooter` with sticky thumb-friendly action buttons (min 40px height).
  - Enhanced `MediaDropzone` with a dedicated "Choose from Device / Photos" button for mobile/tablet environments where drag-and-drop is unavailable.
  - Overhauled `ImageUploadField` to provide touch-accessible action pills directly below attached previews without relying on desktop hover states.

## [v1.2.1] - 2026-10-15

### Redesigned & Enhanced
- **Gallery Section & Image Cards Overhaul**:
  - Implemented 16:10 structured aspect ratio cards with rounded geometry and elevated multi-layer shadows.
  - Generous internal padding (18px-20px) eliminating text cutoffs and border-touching issues.
  - Floating glassmorphic badges for categories and event settings, plus champagne gold ⭐ Featured highlight pills.
  - Redesigned category filter pill bar with active dark-ink pill states and count badges.
  - Added real-time search input with clear button and sorting options (Newest, Oldest, Featured First, Title A-Z).
  - Hover action overlay with high-contrast "Edit Details" and "Delete" quick actions.
- **Sidebar (Menubar) Redesign**:
  - Warm Editorial Luxury sidebar with gold-accented Dream Avenue venue emblem.
  - Grouped navigation sections: Core, Venue & Content, Operations, Administration.
  - Refined active link indicator, desktop collapse/expand toggle, and user profile footer card with verified role badge.
- **Navbar (Topbar) Redesign**:
  - Frosted glassmorphic header with breadcrumb navigation and Georgia serif page title.
  - Real-time "Venue Active" status badge with pulsing live indicator.
  - Interactive user account dropdown menu with verified role details and fast logout.
- **Resolved Code Quality Warnings**:
  - Cleaned up unused imports across `ImageUploadField.tsx`, `MediaGrid.tsx`, `MediaLibraryModal.tsx`, `MediaModalFooter.tsx`, and `MediaUploadQueue.tsx`.
  - Fixed progress bar style interpolation in `MediaDropzone.tsx`.

## [v1.2.0] - 2026-10-15

### Added
- Admin Gallery Edit & Delete feature with role-based authorization for Owner, Developer, and Manager.
- Custom `DeleteGalleryConfirmModal` and Supabase RLS delete policy migration.

## [v1.1.0] - 2026-10-15

### Added
- Multiple image upload support with batch queue and media library modal.
