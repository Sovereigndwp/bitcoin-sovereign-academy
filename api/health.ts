import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple health check that shows environment variable status
  const hasSupabaseUrl = !!process.env.SUPABASE_URL;
  const hasSupabaseKey = !!process.env.SUPABASE_ANON_KEY;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasJwtSecret = !!process.env.JWT_SECRET;
  const hasDatabaseUrl = !!process.env.DATABASE_URL;

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      SUPABASE_URL: hasSupabaseUrl ? 'configured' : 'missing',
      SUPABASE_ANON_KEY: hasSupabaseKey ? 'configured' : 'missing',
      SUPABASE_SERVICE_ROLE_KEY: hasServiceKey ? 'configured' : 'missing',
      JWT_SECRET: hasJwtSecret ? 'configured' : 'missing',
      DATABASE_URL: hasDatabaseUrl ? 'configured' : 'missing'
    },
    node_version: process.version
  });
}
