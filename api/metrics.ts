import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './lib/origin';

// Simple analytics storage
const analyticsStore: Map<string, any> = new Map();
const conversionMetrics: Map<string, any> = new Map();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res, 'GET, OPTIONS', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        const todayMetrics = conversionMetrics.get(today);

        if (!todayMetrics) {
            return res.status(200).json({
                date: today,
                totalSessions: 0,
                kpis: {
                    homepageToDemo: { rate: 0, count: 0, target: 30 },
                    demoCompletion: { rate: 0, count: 0, target: 65 },
                    pathRecommendationAcceptance: { rate: 0, count: 0, total: 0, target: 40 },
                    averageFirstActionTime: { seconds: 0, target: 60 },
                    returnVisitorEngagement: { high: 0, total: 0, rate: 0 }
                },
                visitorBreakdown: {
                    new: 0,
                    returning: 0,
                    total: 0
                },
                summary: {
                    status: 'No data available',
                    topPerforming: null,
                    needsAttention: null
                }
            });
        }

        const kpiResults = {
            date: today,
            totalSessions: todayMetrics.totalSessions,
            kpis: {
                homepageToDemo: {
                    rate: todayMetrics.totalSessions > 0 ? 
                        (todayMetrics.homepageToDemoConversions / todayMetrics.totalSessions) * 100 : 0,
                    count: todayMetrics.homepageToDemoConversions,
                    target: 30,
                    status: getKPIStatus(
                        todayMetrics.homepageToDemoConversions / todayMetrics.totalSessions * 100, 
                        30
                    )
                },
                demoCompletion: {
                    rate: todayMetrics.homepageToDemoConversions > 0 ? 
                        (todayMetrics.demoCompletions / todayMetrics.homepageToDemoConversions) * 100 : 0,
                    count: todayMetrics.demoCompletions,
                    target: 65,
                    status: getKPIStatus(
                        todayMetrics.homepageToDemoConversions > 0 ? 
                            (todayMetrics.demoCompletions / todayMetrics.homepageToDemoConversions) * 100 : 0, 
                        65
                    )
                },
                pathRecommendationAcceptance: {
                    rate: todayMetrics.totalRecommendations > 0 ? 
                        (todayMetrics.pathRecommendationsAccepted / todayMetrics.totalRecommendations) * 100 : 0,
                    count: todayMetrics.pathRecommendationsAccepted,
                    total: todayMetrics.totalRecommendations,
                    target: 40,
                    status: getKPIStatus(
                        todayMetrics.totalRecommendations > 0 ? 
                            (todayMetrics.pathRecommendationsAccepted / todayMetrics.totalRecommendations) * 100 : 0, 
                        40
                    )
                },
                averageFirstActionTime: {
                    seconds: Math.round(todayMetrics.averageFirstActionTime / 1000),
                    target: 60,
                    status: todayMetrics.averageFirstActionTime ? 
                        (todayMetrics.averageFirstActionTime / 1000 <= 60 ? 'meeting' : 'below') : 'no-data'
                },
                returnVisitorEngagement: {
                    high: todayMetrics.highEngagementReturningVisitors,
                    total: todayMetrics.returningVisitors,
                    rate: todayMetrics.returningVisitors > 0 ? 
                        (todayMetrics.highEngagementReturningVisitors / todayMetrics.returningVisitors) * 100 : 0
                }
            },
            visitorBreakdown: {
                new: todayMetrics.newVisitors,
                returning: todayMetrics.returningVisitors,
                total: todayMetrics.totalSessions
            }
        };

        // Add summary insights
        const summary = generateSummary(kpiResults);
        
        return res.status(200).json({
            ...kpiResults,
            summary
        });

    } catch (error) {
        console.error('Metrics retrieval error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function getKPIStatus(actual: number, target: number) {
    if (actual >= target * 1.1) return 'exceeding'; // 10% above target
    if (actual >= target) return 'meeting';
    if (actual >= target * 0.8) return 'approaching'; // Within 20% of target
    return 'below';
}

function generateSummary(kpiResults: any) {
    const kpis = kpiResults.kpis;
    const topPerforming: string[] = [];
    const needsAttention: string[] = [];

    if (kpis.homepageToDemo.status === 'exceeding') {
        topPerforming.push('Homepage to Demo conversion');
    } else if (kpis.homepageToDemo.status === 'below') {
        needsAttention.push('Homepage to Demo conversion');
    }

    if (kpis.demoCompletion.status === 'exceeding') {
        topPerforming.push('Demo completion rate');
    } else if (kpis.demoCompletion.status === 'below') {
        needsAttention.push('Demo completion rate');
    }

    if (kpis.pathRecommendationAcceptance.status === 'exceeding') {
        topPerforming.push('Path recommendation acceptance');
    } else if (kpis.pathRecommendationAcceptance.status === 'below') {
        needsAttention.push('Path recommendation acceptance');
    }

    if (kpis.averageFirstActionTime.status === 'below') {
        needsAttention.push('Time to first action');
    }

    let status = 'Good performance';
    if (needsAttention.length > 2) {
        status = 'Needs optimization';
    } else if (topPerforming.length > 1) {
        status = 'Excellent performance';
    } else if (needsAttention.length > 0) {
        status = 'Room for improvement';
    }

    return {
        status,
        topPerforming: topPerforming.length > 0 ? topPerforming : null,
        needsAttention: needsAttention.length > 0 ? needsAttention : null,
        totalSessions: kpiResults.totalSessions,
        conversionFunnel: {
            visitors: kpiResults.totalSessions,
            demoStarts: kpis.homepageToDemo.count,
            demoCompletions: kpis.demoCompletion.count,
            pathRecommendations: kpis.pathRecommendationAcceptance.total,
            pathAcceptances: kpis.pathRecommendationAcceptance.count
        }
    };
}