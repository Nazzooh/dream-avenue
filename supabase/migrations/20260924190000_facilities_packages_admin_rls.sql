-- Migration: 20260924190000_facilities_packages_admin_rls.sql
-- Fix admin RLS authorization for facilities, packages, and notifications.

-- 1. Make is_admin recognize admins from profiles, user_roles, or admins tables
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = uid AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = uid
  );
$function$;

-- 2. Grant execute permission on is_admin to authenticated and anon roles
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon, service_role, public;

-- 3. Populate user_roles and admins from existing profiles with role = 'admin'
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM public.profiles WHERE role = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO public.admins (user_id)
SELECT id FROM public.profiles WHERE role = 'admin'
ON CONFLICT DO NOTHING;

-- 4. Update facilities RLS policies
DROP POLICY IF EXISTS "Admin can manage facilities secure" ON public.facilities;
DROP POLICY IF EXISTS "Admins can manage facilities" ON public.facilities;

CREATE POLICY "Admins can manage facilities"
ON public.facilities
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 5. Update packages RLS policies
DROP POLICY IF EXISTS "Allow admin manage packages" ON public.packages;
DROP POLICY IF EXISTS "Admins can manage packages" ON public.packages;

CREATE POLICY "Admins can manage packages"
ON public.packages
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
