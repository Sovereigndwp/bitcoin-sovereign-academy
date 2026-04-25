import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import { setCorsHeaders } from './lib/origin';

interface AnalyticsEvent {
    event: string;
    timestamp: number;
    sessionId: string;
    [key: string]: any;
}

interface AnalyticsData {
    sessionId: string;
    events: AnalyticsEvent[];
    funnelSteps: Record<string, number>;
    sessionDuration: number;
    url: string;
    timestamp: number;
}

// In-memory storage for development (replace with database in production)
const analyticsStore: Map<string, AnalyticsData> = new Map();
const conversionMetrics: Map<string, any> = new Map();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res, 'POST, OPTIONS', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const analyticsData: AnalyticsData = req.body;
        
        if (!analyticsData.sessionId || !analyticsData.events) {
            return res.status(400).json({ error: 'Invalid analytics data' });
        }

        // Store analytics data
        analyticsStore.set(analyticsData.sessionId, analyticsData);

        // Process and calculate KPIs
        const kpiResults = processKPIs(analyticsData);

        // Update conversion metrics
        updateConversionMetrics(analyticsData, kpiResults);

        // Log key events for monitoring
        logImportantEvents(analyticsData);

        return res.status(200).json({ 
            success: true, 
            sessionId: analyticsData.sessionId,
            kpis: kpiResults
        });

    } catch (error) {
        console.error('Analytics processing error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function processKPIs(data: AnalyticsData) {
    const kpis = {
        homepageToDemo: false,
        demoCompletion: false,
        pathRecommendationAccepted: false,
        returnVisitorEngagement: 'none',
        firstActionTime: null as number | null,
        scrollDepth: 0,
        sessionDuration: data.sessionDuration
    };

    const steps = data.funnelSteps;

    // KPI 1: Homepage → Demo Start conversion rate
    const demoStartEvents = [
        'hero_cta_click', 
        'demo_preview_start', 
        'featured_card_click', 
        'path_card_click'
    ];
    kpis.homepageToDemo = demoStartEvents.some(event => steps[event]);

    // KPI 2: Demo completion rate
    kpis.demoCompletion = !!steps.demo_completed;

    // KPI 3: Path recommendation acceptance rate
    kpis.pathRecommendationAccepted = !!steps.path_recommendation_accepted;

    // KPI 4: Return visitor engagement
    if (steps.return_visitor_engagement) {
        const engagementEvent = data.events.find(e => e.event === 'funnel_step' && e.step === 'return_visitor_engagement');
        kpis.returnVisitorEngagement = engagementEvent?.data?.engagementLevel || 'unknown';
    }

    // Time to first meaningful action
    if (steps.first_meaningful_action && steps.homepage_visit) {
        kpis.firstActionTime = steps.first_meaningful_action - steps.homepage_visit;
    }

    // Scroll depth analysis
    const scrollEvents = Object.keys(steps).filter(key => key.startsWith('scroll_'));
    if (scrollEvents.length > 0) {
        const maxScrollEvent = scrollEvents.reduce((max, current) => {
            const currentDepth = parseInt(current.replace('scroll_', ''));
            const maxDepth = parseInt(max.replace('scroll_', ''));
            return currentDepth > maxDepth ? current : max;
        });
        kpis.scrollDepth = parseInt(maxScrollEvent.replace('scroll_', '')) / 100;
    }

    return kpis;
}

function updateConversionMetrics(data: AnalyticsData, kpis: any) {
    const today = new Date().toISOString().split('T')[0];
    
    if (!conversionMetrics.has(today)) {
        conversionMetrics.set(today, {
            totalSessions: 0,
            homepageToDemoConversions: 0,
            demoCompletions: 0,
            pathRecommendationsAccepted: 0,
            totalRecommendations: 0,
            averageFirstActionTime: 0,
            actionTimes: [],
            newVisitors: 0,
            returningVisitors: 0,
            highEngagementReturningVisitors: 0
        });
    }

    const dayMetrics = conversionMetrics.get(today)!;
    dayMetrics.totalSessions++;

    if (kpis.homepageToDemo) {
        dayMetrics.homepageToDemoConversions++;
    }

    if (kpis.demoCompletion) {
        dayMetrics.demoCompletions++;
    }

    if (data.funnelSteps.path_discovery_q2) {
        dayMetrics.totalRecommendations++;
        if (kpis.pathRecommendationAccepted) {
            dayMetrics.pathRecommendationsAccepted++;
        }
    }

    if (kpis.firstActionTime) {
        dayMetrics.actionTimes.push(kpis.firstActionTime);
        dayMetrics.averageFirstActionTime = 
            dayMetrics.actionTimes.reduce((a, b) => a + b, 0) / dayMetrics.actionTimes.length;
    }

    // Track visitor types
    const isNewVisitor = data.events.some(e => e.event === 'new_visitor');
    const isReturningVisitor = data.events.some(e => e.event === 'returning_visitor');
    
    if (isNewVisitor) dayMetrics.newVisitors++;
    if (isReturningVisitor) {
        dayMetrics.returningVisitors++;
        if (kpis.returnVisitorEngagement === 'high') {
            dayMetrics.highEngagementReturningVisitors++;
        }
    }

    conversionMetrics.set(today, dayMetrics);
}

function logImportantEvents(data: AnalyticsData) {
    const importantEvents = [
        'first_meaningful_action',
        'conversion_milestone',
        'demo_completed',
        'path_recommendation_accepted'
    ];

    data.events
        .filter(event => importantEvents.includes(event.event))
        .forEach(event => {
            console.log(`[KPI] ${event.event}:`, {
                sessionId: data.sessionId,
                timestamp: new Date(event.timestamp).toISOString(),
                data: event
            });
        });
}

// Endpoint to get current metrics (for admin dashboard)
export async function getMetrics(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const today = new Date().toISOString().split('T')[0];
    const todayMetrics = conversionMetrics.get(today);

    if (!todayMetrics) {
        return res.status(200).json({
            date: today,
            totalSessions: 0,
            kpis: {
                homepageToDemo: { rate: 0, count: 0 },
                demoCompletion: { rate: 0, count: 0 },
                pathRecommendationAcceptance: { rate: 0, count: 0 },
                averageFirstActionTime: 0,
                returnVisitorEngagement: { high: 0, total: 0 }
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
                target: 30 // 30% target
            },
            demoCompletion: {
                rate: todayMetrics.homepageToDemoConversions > 0 ? 
                    (todayMetrics.demoCompletions / todayMetrics.homepageToDemoConversions) * 100 : 0,
                count: todayMetrics.demoCompletions,
                target: 65 // 65% target
            },
            pathRecommendationAcceptance: {
                rate: todayMetrics.totalRecommendations > 0 ? 
                    (todayMetrics.pathRecommendationsAccepted / todayMetrics.totalRecommendations) * 100 : 0,
                count: todayMetrics.pathRecommendationsAccepted,
                total: todayMetrics.totalRecommendations,
                target: 40 // 40% target
            },
            averageFirstActionTime: {
                seconds: Math.round(todayMetrics.averageFirstActionTime / 1000),
                target: 60 // 60 seconds target
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

    return res.status(200).json(kpiResults);
}