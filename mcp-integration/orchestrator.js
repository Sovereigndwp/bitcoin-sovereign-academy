/**
 * AgentOrchestrator - lightweight multi-agent coordinator for the Academy
 * Wires together existing in-browser agents to solve compound tasks.
 * Uses MCP client when available for data/context fetching with graceful fallbacks.
 */
class AgentOrchestrator {
  constructor({ market, mempool, lightning, security, learning, mcpClient }) {
    this.market = market;
    this.mempool = mempool;
    this.lightning = lightning;
    this.security = security;
    this.learning = learning;
    this.mcp = mcpClient || (typeof BitcoinMCPClient !== 'undefined' ? new BitcoinMCPClient() : null);
  }

  async solve(goal) {
    // Run independent analyses in parallel
    const tasks = [];
    if (this.market) tasks.push(this.market.analyzeSentiment('24h'));
    if (this.mempool) tasks.push(this.mempool.analyzeMempoolState());
    if (this.security) tasks.push(this.security.performSecurityAudit({ type: 'wallet', id: 'demo' }, 'intermediate'));

    const [market, mempool, security] = await Promise.all(tasks);

    // Use results to inform Lightning routing
    let lightningPlan = null;
    if (this.lightning) {
      const feeTarget = mempool?.feeDistribution?.percentiles?.p50 || 10;
      const amount = '150000';
      lightningPlan = await this.lightning.findOptimalRoute('Alice', 'Bob', amount);
    }

    // Create a quick learning artifact tying it all together
    let lesson = null;
    if (this.learning) {
      lesson = await this.learning.storyAgent.generatePersonalizedStory({});
    }

    // Optionally enrich with MCP intelligence summary
    let intel = null;
    try {
      if (this.mcp) intel = await this.mcp.getIntelligenceSummary();
    } catch (_) {}

    return {
      goal,
      timestamp: new Date().toISOString(),
      context: {
        marketSummary: market?.psychology || market?.signals || market || null,
        mempoolSummary: mempool?.insights || mempool?.predictions || mempool || null,
        securityFindings: security?.report?.executive_summary || security || null,
        lightningPlan: lightningPlan || null,
        learningSnippet: lesson?.story || null,
        intelligence: intel || null
      },
      recommendations: this.composeRecommendations({ market, mempool, security, lightningPlan })
    };
  }

  composeRecommendations({ market, mempool, security, lightningPlan }) {
    const recs = [];
    if (mempool?.feeDistribution?.percentiles?.p50) {
      recs.push(`Consider fee ~${mempool.feeDistribution.percentiles.p50} sat/vB for next block.`);
    }
    if (lightningPlan?.optimal) {
      recs.push(`Route via ${lightningPlan.optimal.hops.length - 1} hops, est. fee ${lightningPlan.optimal.totalFee}.`);
    }
    if (security?.recommendations?.length) {
      recs.push(`Security: ${security.recommendations.slice(0, 3).map(r => r.recommendation).join('; ')}.`);
    }
    if (market?.psychology?.fearGreedIndex?.label) {
      recs.push(`Market psychology: ${market.psychology.fearGreedIndex.label}.`);
    }
    return recs;
  }
}

if (typeof window !== 'undefined') {
  window.AgentOrchestrator = AgentOrchestrator;
}
