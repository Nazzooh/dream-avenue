# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [v1.2.0] - 2026-10-15

### Added
- **Admin Gallery Edit & Delete**: Owner, Developer, and Manager roles can now edit existing gallery photos and all event metadata (title, category, event type setting, description, image URL, featured highlights toggle).
- **Custom Delete Confirmation Modal**: Added `DeleteGalleryConfirmModal` with preview thumbnail, category badges, and destructive action safeguards.
- **Role-Based Gallery Permissions**: Added `canManageGallery` authorization helper in `adminPermissions.ts` granting management permissions strictly to `owner`, `developer`, and `manager` roles, with read-only indicators for `coordinator`.
- **Database RLS Migration**: Added migration `20261015121000_gallery_admin_edit_delete.sql` permitting delete, update, and insert access to authenticated admin leadership accounts (Owner, Developer, and Manager).
- **Gallery Search & Details Preview**: Real-time search filter in Gallery admin and enhanced card presentation with descriptions, event types, and featured badges.

## [v1.1.0] - 2026-10-15

### Added
- Multiple image upload support with batch queue and media library modal.
- Modern admin workspace components and security hardening migrations.
