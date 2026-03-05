import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

// Reward structure (in sats)
const REWARDS = {
    apprentice: 5_000,
    sovereign: 10_000,
};

/**
 * Generate a short, unique referral code
 */
function generateReferralCode(): string {
    return 'BSA-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

/**
 * Verify JWT and extract user ID
 */
function getUserIdFromToken(req: VercelRequest): string | null {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;

    try {
        const token = auth.slice(7);
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload.exp && payload.exp * 1000 < Date.now()) return null;
        return payload.userId || payload.sub || null;
    } catch {
        return null;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { action } = req.query;

    try {
        switch (action) {
            case 'generate':
                return handleGenerate(req, res);
            case 'stats':
                return handleStats(req, res);
            case 'claim':
                return handleClaim(req, res);
            default:
                return res.status(400).json({ error: 'Invalid action. Use ?action=generate|stats|claim' });
        }
    } catch (error) {
        console.error('[Referrals API] Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * POST /api/referrals?action=generate
 * Creates a referral code for the authenticated user.
 */
async function handleGenerate(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    // Check if user already has a referral code
    const { data: existing } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_user_id', userId)
        .is('referred_email', null)
        .limit(1)
        .single();

    if (existing) {
        return res.status(200).json({
            code: existing.referral_code,
            link: `https://bitcoinsovereign.academy/membership.html?ref=${existing.referral_code}`,
        });
    }

    // Generate new code
    const code = generateReferralCode();
    const { error } = await supabase.from('referrals').insert({
        referrer_user_id: userId,
        referral_code: code,
        status: 'pending',
        reward_sats: 0,
    });

    if (error) {
        console.error('[Referrals] Generate error:', error);
        return res.status(500).json({ error: 'Failed to generate referral code' });
    }

    return res.status(201).json({
        code,
        link: `https://bitcoinsovereign.academy/membership.html?ref=${code}`,
    });
}

/**
 * GET /api/referrals?action=stats
 * Returns referral stats for the authenticated user.
 */
async function handleStats(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'GET required' });

    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { data: referrals, error } = await supabase
        .from('referrals')
        .select('referral_code, referred_email, referred_tier, reward_sats, status, created_at, converted_at')
        .eq('referrer_user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Referrals] Stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch referral stats' });
    }

    const stats = {
        totalReferrals: referrals?.length || 0,
        conversions: referrals?.filter(r => r.status === 'converted' || r.status === 'rewarded').length || 0,
        totalSatsEarned: referrals?.reduce((sum, r) => sum + (r.reward_sats || 0), 0) || 0,
        referralCode: referrals?.find(r => !r.referred_email)?.referral_code || null,
        referrals: referrals?.filter(r => r.referred_email) || [],
    };

    return res.status(200).json(stats);
}

/**
 * POST /api/referrals?action=claim
 * Called by payment webhook when a referred user completes purchase.
 * Body: { referralCode, referredEmail, tier }
 */
async function handleClaim(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

    // Verify webhook secret (internal use only)
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { referralCode, referredEmail, tier } = req.body;
    if (!referralCode || !referredEmail || !tier) {
        return res.status(400).json({ error: 'Missing referralCode, referredEmail, or tier' });
    }

    const rewardSats = REWARDS[tier as keyof typeof REWARDS] || REWARDS.apprentice;

    // Find the referral entry
    const { data: referral, error: findError } = await supabase
        .from('referrals')
        .select('id, referrer_user_id')
        .eq('referral_code', referralCode)
        .is('referred_email', null)
        .limit(1)
        .single();

    if (findError || !referral) {
        // Create a new conversion entry if no blank slot exists
        const { data: codeOwner } = await supabase
            .from('referrals')
            .select('referrer_user_id')
            .eq('referral_code', referralCode)
            .limit(1)
            .single();

        if (!codeOwner) {
            return res.status(404).json({ error: 'Referral code not found' });
        }

        const { error: insertError } = await supabase.from('referrals').insert({
            referrer_user_id: codeOwner.referrer_user_id,
            referral_code: referralCode + '-' + Date.now(),
            referred_email: referredEmail,
            referred_tier: tier,
            reward_sats: rewardSats,
            status: 'converted',
            converted_at: new Date().toISOString(),
        });

        if (insertError) {
            console.error('[Referrals] Claim insert error:', insertError);
            return res.status(500).json({ error: 'Failed to record referral' });
        }

        return res.status(200).json({ success: true, rewardSats });
    }

    // Update existing entry
    const { error: updateError } = await supabase
        .from('referrals')
        .update({
            referred_email: referredEmail,
            referred_tier: tier,
            reward_sats: rewardSats,
            status: 'converted',
            converted_at: new Date().toISOString(),
        })
        .eq('id', referral.id);

    if (updateError) {
        console.error('[Referrals] Claim update error:', updateError);
        return res.status(500).json({ error: 'Failed to record referral conversion' });
    }

    return res.status(200).json({ success: true, rewardSats });
}
