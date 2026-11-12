// src/schemas/facilities.ts — Facility validation schemas
import { z } from "zod";

export const facilitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Facility title is required"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  capacity: z.string().optional().nullable(),
  subtitles: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
  created_at: z.string().optional(),
});

export const facilityCreateSchema = facilitySchema.omit({ id: true, created_at: true });
export const facilityUpdateSchema = facilityCreateSchema.partial();

export type Facility = z.infer<typeof facilitySchema>;
export type FacilityCreate = z.infer<typeof facilityCreateSchema>;
export type FacilityUpdate = z.infer<typeof facilityUpdateSchema>;
