/**
 * MCP Content API
 * Returns personalized content based on user persona and progress
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================
// Types
// ============================================

interface MCPResponse {
  persona: PersonaInfo | null;
  modules: ModuleItem[];
  featured: FeaturedItem[];
  recommendations: Recommendation[];
  lastUpdated: string;
  patchNotes: PatchNote[];
}

interface PersonaInfo {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  contentPriority: string[];
}

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  completed: boolean;
  relevanceScore: number;
}

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  path: string;
  type: 'module' | 'demo' | 'tool' | 'guide';
  imageUrl?: string;
  tags: string[];
}

interface Recommendation {
  type: string;
  title: string;
  description: string;
  action: string;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

interface PatchNote {
  date: string;
  version: string;
  type: 'feature' | 'improvement' | 'fix' | 'content';
  title: string;
  description: string;
}

// ============================================
// Content Database (will move to Supabase later)
// ============================================

const PERSONAS: Record<string, PersonaInfo> = {
  'curious': {
    id: 'curious',
    name: 'The Curious',
    level: 'beginner',
    interests: ['basics', 'getting-started', 'what-is-bitcoin', 'money-fundamentals'],
    contentPriority: ['fundamentals', 'use-cases', 'getting-started']
  },
  'pragmatist': {
    id: 'pragmatist',
    name: 'The Pragmatist',
    level: 'intermediate',
    interests: ['practical', 'security', 'wallets', 'buying'],
    contentPriority: ['wallet-setup', 'security-basics', 'practical-use']
  },
  'sovereign': {
    id: 'sovereign',
    name: 'The Sovereign',
    level: 'advanced',
    interests: ['self-custody', 'privacy', 'security', 'advanced-topics'],
    contentPriority: ['advanced-security', 'privacy-tools', 'self-sovereignty']
  },
  'builder': {
    id: 'builder',
    name: 'The Builder',
    level: 'advanced',
    interests: ['technical', 'programming', 'lightning', 'development'],
    contentPriority: ['technical-implementation', 'lightning-network', 'development']
  },
  'principled': {
    id: 'principled',
    name: 'The Principled',
    level: 'intermediate',
    interests: ['philosophy', 'economics', 'monetary-theory', 'freedom'],
    contentPriority: ['monetary-theory', 'philosophy', 'economics']
  }
};

const FEATURED_CONTENT: FeaturedItem[] = [
  {
    id: 'transaction-builder',
    title: 'Build Your First Bitcoin Transaction',
    description: 'Interactive demo where you create a real Bitcoin transaction step by step',
    path: '/interactive-demos/transaction-builder/',
    type: 'demo',
    tags: ['interactive', 'beginner', 'transactions']
  },
  {
    id: 'wallet-security',
    title: 'Wallet Security Workshop',
    description: 'Practice securing your Bitcoin with seed phrases, backups, and multi-sig',
    path: '/interactive-demos/wallet-security-workshop/',
    type: 'demo',
    tags: ['security', 'wallets', 'hands-on']
  },
  {
    id: 'lightning-payment',
    title: 'Lightning Network Payment Demo',
    description: 'Experience instant Bitcoin payments through the Lightning Network',
    path: '/interactive-demos/lightning-payment/',
    type: 'demo',
    tags: ['lightning', 'advanced', 'payments']
  }
];

const LATEST_PATCHES: PatchNote[] = [
  {
    date: '2026-01-11',
    version: '2.1.0',
    type: 'feature',
    title: 'Module Progress Indicators',
    description: 'Added reading time calculation and scroll-based progress tracking to all modules'
  },
  {
    date: '2026-01-10',
    version: '2.0.5',
    type: 'improvement',
    title: 'Paywall Value Proposition',
    description: 'Enhanced lock overlay with dynamic context, progress tracking, and social proof'
  },
  {
    date: '2026-01-10',
    version: '2.0.4',
    type: 'improvement',
    title: 'Form Validation Enhancement',
    description: 'Added real-time visual feedback for email validation in checkout flow'
  },
  {
    date: '2026-01-10',
    version: '2.0.3',
    type: 'improvement',
    title: 'Accessibility Improvements',
    description: 'Fixed color contrast, added focus indicators, and improved touch target sizes'
  },
  {
    date: '2026-01-09',
    version: '2.0.0',
    type: 'feature',
    title: 'Server-Side Access Verification',
    description: 'Implemented JWT verification and database-backed entitlements for secure content access'
  }
];

// ============================================
// Helper Functions
// ============================================

function generateRecommendations(persona: PersonaInfo | null, completedCount: number): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!persona) {
    recommendations.push({
      type: 'persona-selection',
      title: 'Choose Your Learning Path',
      description: 'Get personalized content tailored to your goals and experience level',
      action: 'Take the Quiz',
      actionUrl: '/onboarding/',
      priority: 'high'
    });
    return recommendations;
  }

  // First-time user
  if (completedCount === 0) {
    recommendations.push({
      type: 'getting-started',
      title: `Welcome, ${persona.name}!`,
      description: 'Start your Bitcoin journey with a 20-minute introduction',
      action: 'Begin Stage 1',
      actionUrl: `/paths/${persona.id}/stage-1/`,
      priority: 'high'
    });
  }

  // Interactive demos
  if (persona.level === 'beginner' || completedCount < 3) {
    recommendations.push({
      type: 'interactive',
      title: 'Try Interactive Demos',
      description: 'Learn by doing with hands-on Bitcoin simulations',
      action: 'Explore Demos',
      actionUrl: '/interactive-demos/',
      priority: 'medium'
    });
  }

  // Advanced content
  if (persona.level === 'advanced' && completedCount > 5) {
    recommendations.push({
      type: 'advanced',
      title: 'Lightning Network Deep Dive',
      description: 'Master instant Bitcoin payments and channel management',
      action: 'Start Lightning Path',
      actionUrl: '/paths/builder/stage-2/',
      priority: 'medium'
    });
  }

  return recommendations;
}

function getPersonalizedModules(persona: PersonaInfo | null): ModuleItem[] {
  if (!persona) {
    return []; // Return empty for anonymous users
  }

  // In production, this would query Supabase for actual module data
  // For now, return sample modules based on persona
  const baseModules: Partial<ModuleItem>[] = [
    {
      title: 'What is Money?',
      description: 'Understanding the fundamental properties and history of money',
      category: 'fundamentals',
      difficulty: 'beginner',
      estimatedTime: '15 min'
    },
    {
      title: 'How Bitcoin Works',
      description: 'The technical foundation of Bitcoin explained simply',
      category: 'fundamentals',
      difficulty: 'beginner',
      estimatedTime: '20 min'
    },
    {
      title: 'Your First Wallet',
      description: 'Setting up and securing your Bitcoin wallet',
      category: 'practical',
      difficulty: 'beginner',
      estimatedTime: '25 min'
    }
  ];

  return baseModules.map((module, idx) => ({
    id: `module-${idx + 1}`,
    title: module.title!,
    description: module.description!,
    path: `/paths/${persona.id}/stage-1/module-${idx + 1}.html`,
    category: module.category!,
    difficulty: module.difficulty!,
    estimatedTime: module.estimatedTime!,
    completed: false,
    relevanceScore: 10 - idx
  }));
}

// ============================================
// API Handler
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get persona from query or body
    const personaId = (req.query.persona as string) || (req.body?.persona as string) || null;
    const completedCount = parseInt((req.query.completed as string) || (req.body?.completed as string) || '0');

    const persona = personaId ? PERSONAS[personaId] : null;

    // Build response
    const response: MCPResponse = {
      persona,
      modules: getPersonalizedModules(persona),
      featured: FEATURED_CONTENT,
      recommendations: generateRecommendations(persona, completedCount),
      lastUpdated: new Date().toISOString(),
      patchNotes: LATEST_PATCHES.slice(0, 5) // Return last 5 updates
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes
    return res.status(200).json(response);

  } catch (error: any) {
    console.error('MCP API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
