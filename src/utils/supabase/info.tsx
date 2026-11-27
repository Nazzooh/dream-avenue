const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const derivedProjectId = envUrl
  ? envUrl.replace(/^https?:\/\//, '').split('.')[0]
  : '';

export const projectId = derivedProjectId || "njxtiaokvgoaxjcrnxzo";
export const supabaseUrl = envUrl || `https://${projectId}.supabase.co`;
export const publicAnonKey = envAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeHRpYW9rdmdvYXhqY3JueHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTk2OTIsImV4cCI6MjA3NTQ5NTY5Mn0.3jGkWNSTsdTaeL1h9EkRR3utKzkwXCRizuDLreDf-fs";