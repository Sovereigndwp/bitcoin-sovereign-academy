import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAccessToken, hasModuleAccess, hasPathAccess } from './entitlements';
import { setCorsHeaders } from './lib/origin';
import { checkRateLimit } from './rate-limiter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    setCorsHeaders(req, res, 'POST,OPTIONS', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!(await checkRateLimit(req, res, 'api'))) return;

    const { moduleId, pathId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ authorized: false, reason: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify JWT signature and expiration
        const entitlement = verifyAccessToken(token);
        const hasWildcardAccess = entitlement.modules.includes('*') || entitlement.paths.includes('*');

        // If specific module access is requested
        if (moduleId) {
            const hasAccess = hasWildcardAccess ||
                entitlement.modules.includes(moduleId) ||
                await hasModuleAccess(entitlement.email, moduleId);
            if (!hasAccess) {
                return res.status(403).json({
                    authorized: false,
                    reason: 'Module not in entitlement'
                });
            }
        }

        // If specific path access is requested
        if (pathId) {
            const hasAccess = hasWildcardAccess ||
                entitlement.paths.includes(pathId) ||
                await hasPathAccess(entitlement.email, pathId);
            if (!hasAccess) {
                return res.status(403).json({
                    authorized: false,
                    reason: 'Path not in entitlement'
                });
            }
        }

        // If just verifying the token itself
        return res.status(200).json({
            authorized: true,
            email: entitlement.email,
            expiresAt: entitlement.expiresAt
        });
    } catch (err: any) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({
            authorized: false,
            reason: 'Invalid or expired token'
        });
    }
}
