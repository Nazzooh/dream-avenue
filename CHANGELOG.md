# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

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
