// Dream Avenue Convention Center - Hardened Edge Function
// Full Authentication & Authorization Protection
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(supabaseUrl, supabaseKey);
};

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

const successResponse = (data: any, message?: string, status = 200) => {
  return jsonResponse({ success: true, data, message }, status);
};

const errorResponse = (error: any, status = 500) => {
  return jsonResponse({ success: false, error }, status);
};

type WorkspacePermission = 'operations' | 'content' | 'analytics' | 'destructive';

const hasWorkspacePermission = (role: unknown, permission: WorkspacePermission) => {
  if (role === 'developer' || role === 'owner') return true;
  if (role === 'manager') return permission !== 'destructive';
  if (role === 'coordinator') return permission === 'operations';
  return false;
};

const requireAdminAuth = async (req: Request, supabase: any, permission: WorkspacePermission = 'operations') => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, response: errorResponse('Unauthorized: Missing or invalid token', 401) };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return { authorized: false, response: errorResponse('Unauthorized: Invalid session', 401) };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || !hasWorkspacePermission(profile.role, permission)) {
    return { authorized: false, response: errorResponse('Forbidden: Your team role cannot perform this action', 403) };
  }

  return { authorized: true, user, profile };
};

const validateRequired = (obj: any, fields: string[]) => {
  if (!obj || typeof obj !== 'object') return 'Invalid request body';
  const missing = fields.filter((f) => !obj[f]);
  return missing.length > 0 ? Missing required fields:  : null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let path = url.pathname;
    const method = req.method;

    if (path.includes('/make-server-308644a4/')) {
      path = path.substring(path.indexOf('/make-server-308644a4/') + 21);
    }

    if (path === '/health' || path === '/') {
      return jsonResponse({
        status: 'ok',
        message: 'Dream Avenue Secure Server Running',
        version: '4.0.0-hardened',
        timestamp: new Date().toISOString(),
      });
    }

    const supabase = getSupabaseClient();

    // PACKAGES ROUTES
    if (path.startsWith('/api/packages')) {
      const id = path.split('/')[3];
      if (method === 'GET') {
        if (!id) {
          const { data, error } = await supabase.from('packages').select('*').order('order_index', { ascending: true });
          if (error) throw error;
          return successResponse(data || []);
        }
        const { data, error } = await supabase.from('packages').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Package not found', 404);
        return successResponse(data);
      }

      const auth = await requireAdminAuth(req, supabase, method === 'DELETE' ? 'destructive' : 'content');
      if (!auth.authorized) return auth.response;

      if (method === 'POST') {
        const body = await req.json();
        const err = validateRequired(body, ['name']);
        if (err) return errorResponse(err, 400);
        const { data, error } = await supabase.from('packages').insert([body]).select().single();
        if (error) throw error;
        return successResponse(data, 'Package created successfully', 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('packages').update(body).eq('id', id).select().maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Package not found', 404);
        return successResponse(data, 'Package updated successfully');
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) throw error;
        return successResponse(null, 'Package deleted successfully');
      }
    }

    // FACILITIES ROUTES
    if (path.startsWith('/api/facilities')) {
      const id = path.split('/')[3];
      if (method === 'GET') {
        if (!id) {
          const { data, error } = await supabase.from('facilities').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          return successResponse(data || []);
        }
        const { data, error } = await supabase.from('facilities').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Facility not found', 404);
        return successResponse(data);
      }

      const auth = await requireAdminAuth(req, supabase, method === 'DELETE' ? 'destructive' : 'content');
      if (!auth.authorized) return auth.response;

      if (method === 'POST') {
        const body = await req.json();
        const err = validateRequired(body, ['title']);
        if (err) return errorResponse(err, 400);
        const { data, error } = await supabase.from('facilities').insert([body]).select().single();
        if (error) throw error;
        return successResponse(data, 'Facility created successfully', 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('facilities').update(body).eq('id', id).select().maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Facility not found', 404);
        return successResponse(data, 'Facility updated successfully');
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('facilities').delete().eq('id', id);
        if (error) throw error;
        return successResponse(null, 'Facility deleted successfully');
      }
    }

    // GALLERY ROUTES
    if (path.startsWith('/api/gallery')) {
      const id = path.split('/')[3];
      if (method === 'GET') {
        if (!id) {
          const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          return successResponse(data || []);
        }
        const { data, error } = await supabase.from('gallery').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Gallery item not found', 404);
        return successResponse(data);
      }

      const auth = await requireAdminAuth(req, supabase, method === 'DELETE' ? 'destructive' : 'content');
      if (!auth.authorized) return auth.response;

      if (method === 'POST') {
        const body = await req.json();
        const err = validateRequired(body, ['title', 'image_url']);
        if (err) return errorResponse(err, 400);
        const { data, error } = await supabase.from('gallery').insert([body]).select().single();
        if (error) throw error;
        return successResponse(data, 'Gallery item created successfully', 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('gallery').update(body).eq('id', id).select().maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Gallery item not found', 404);
        return successResponse(data, 'Gallery item updated successfully');
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;
        return successResponse(null, 'Gallery item deleted successfully');
      }
    }

    // EVENTS ROUTES
    if (path.startsWith('/api/events')) {
      const id = path.split('/')[3];
      if (method === 'GET') {
        if (!id) {
          const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
          if (error) throw error;
          return successResponse(data || []);
        }
        const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Event not found', 404);
        return successResponse(data);
      }

      const auth = await requireAdminAuth(req, supabase, method === 'DELETE' ? 'destructive' : 'content');
      if (!auth.authorized) return auth.response;

      if (method === 'POST') {
        const body = await req.json();
        const err = validateRequired(body, ['title', 'event_date']);
        if (err) return errorResponse(err, 400);
        const { data, error } = await supabase.from('events').insert([body]).select().single();
        if (error) throw error;
        return successResponse(data, 'Event created successfully', 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('events').update(body).eq('id', id).select().maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Event not found', 404);
        return successResponse(data, 'Event updated successfully');
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        return successResponse(null, 'Event deleted successfully');
      }
    }

    // AVAILABILITY ROUTES (PUBLIC READ-ONLY)
    if (path === '/api/availability' && method === 'GET') {
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');
      let query = supabase.from('bookings').select('booking_date, start_time, end_time, guest_count, status').neq('status', 'cancelled');
      if (startDate) query = query.gte('booking_date', startDate);
      if (endDate) query = query.lte('booking_date', endDate);
      const { data, error } = await query;
      if (error) throw error;
      return successResponse(data || []);
    }

    if (path === '/api/availability/check' && method === 'GET') {
      const date = url.searchParams.get('date');
      if (!date) return errorResponse('Date is required', 400);
      const { data, error } = await supabase.from('bookings').select('booking_date, start_time, end_time, status').eq('booking_date', date).neq('status', 'cancelled');
      if (error) throw error;
      const conflicts = data || [];
      return successResponse({ available: conflicts.length === 0, conflicts, date });
    }

    // BOOKINGS ROUTES
    if (path.startsWith('/api/bookings')) {
      const id = path.split('/')[3];

      // Public Booking creation
      if (method === 'POST') {
        const body = await req.json();
        const err = validateRequired(body, ['full_name', 'phone', 'booking_date']);
        if (err) return errorResponse(err, 400);

        const bookingPayload = {
          full_name: String(body.full_name).slice(0, 100),
          mobile: String(body.phone || body.mobile || '').slice(0, 20),
          booking_date: body.booking_date,
          start_time: body.start_time || null,
          end_time: body.end_time || null,
          guest_count: Number(body.guest_count) || 0,
          package_id: body.package_id || null,
          special_requests: body.special_requests ? String(body.special_requests).slice(0, 1000) : null,
          email: body.email ? String(body.email).slice(0, 100) : null,
          status: 'pending',
        };

        const { data, error } = await supabase.from('bookings').insert([bookingPayload]).select().single();
        if (error) throw error;
        return successResponse(data, 'Booking created successfully', 201);
      }

      // Protected admin operations
      const auth = await requireAdminAuth(req, supabase, method === 'DELETE' ? 'destructive' : 'operations');
      if (!auth.authorized) return auth.response;

      if (method === 'GET' && !id) {
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return successResponse(data || []);
      }
      if (method === 'GET' && id) {
        const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Booking not found', 404);
        return successResponse(data);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('bookings').update(body).eq('id', id).select().maybeSingle();
        if (error) throw error;
        if (!data) return errorResponse('Booking not found', 404);
        return successResponse(data, 'Booking updated successfully');
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        return successResponse(null, 'Booking deleted successfully');
      }
    }

    // ANALYTICS & DASHBOARD STATS
    if (path === '/api/analytics/summary' && method === 'GET') {
      const { data } = await supabase.from('analytics_summary').select('events_hosted, guests_served, client_satisfaction').limit(1).maybeSingle();
      return jsonResponse({
        success: true,
        data: {
          events_hosted: data?.events_hosted ?? 100,
          guests_served: data?.guests_served ?? 2000,
          client_satisfaction: data?.client_satisfaction ?? 100,
        },
      });
    }

    if (path === '/api/dashboard/stats' && method === 'GET') {
      const auth = await requireAdminAuth(req, supabase);
      if (!auth.authorized) return auth.response;

      const [packagesRes, facilitiesRes, galleryRes, eventsRes, bookingsRes] = await Promise.all([
        supabase.from('packages').select('id', { count: 'exact', head: true }),
        supabase.from('facilities').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('status'),
      ]);

      const bookingsData = bookingsRes.data || [];
      return jsonResponse({
        success: true,
        data: {
          packages: packagesRes.count || 0,
          facilities: facilitiesRes.count || 0,
          gallery: galleryRes.count || 0,
          events: eventsRes.count || 0,
          bookings: {
            total: bookingsData.length,
            pending: bookingsData.filter((b: any) => b.status === 'pending').length,
            confirmed: bookingsData.filter((b: any) => b.status === 'confirmed').length,
            cancelled: bookingsData.filter((b: any) => b.status === 'cancelled').length,
          },
        },
      });
    }

    return errorResponse({ message: `Endpoint not found: ${method} ${path}` }, 404);
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
});
