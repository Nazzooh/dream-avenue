-- Migration: 20261103171500_add_facilities_category_subtitles.sql
-- Add category (space badge), capacity, and subtitles (features/highlights) to public.facilities

ALTER TABLE public.facilities 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS capacity text,
ADD COLUMN IF NOT EXISTS subtitles text;
