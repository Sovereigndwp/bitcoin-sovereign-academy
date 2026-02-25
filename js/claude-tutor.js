/**
 * Claude AI Tutor Service — Bitcoin Sovereign Academy
 *
 * Calls /api/tutor (Vercel edge function) for Socratic Bitcoin tutoring
 * powered by Claude with streaming + prompt caching.
 *
 * Drop-in replacement for gemini-service.js.
 * Exposes both window.claudeTutor and window.geminiService for compatibility
 * with the existing gemini-tutor-ui.js floating chat panel.
 *
 * Usage in any page:
 *   <script src="/js/claude-tutor.js"></script>
 *   <!-- window.claudeTutor is ready after DOMContentLoaded -->
 */

class ClaudeTutor {
  constructor() {
    this.apiEndpoint = '/api/tutor';
    this.conversationHistory = this._loadHistory();
    this.pageContext = this._detectPageContext();
    this.persona = this._loadPersona();

    // Compatibility shim: gemini-tutor-ui reads these
    this.apiKey = '__server_side__'; // key is stored server-side only
    this.initialized = true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Primary interface — streaming
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Send a message and receive the response as streaming chunks.
   *
   * @param {string} message - User's message
   * @param {(chunk: string) => void} onChunk - Called with each text chunk
   * @param {(fullText: string) => void} [onDone] - Called with the complete response
   * @param {(error: Error) => void} [onError] - Called on error
   * @returns {Promise<string>} Resolves with the full response text
   */
  async sendMessageStreaming(message, onChunk, onDone, onError) {
    const fullText = await this._callAPI(message, onChunk);
    if (onDone) onDone(fullText);
    return fullText;
  }

  /**
   * Send a message and receive the full response as a resolved string.
   * Gemini-UI compatibility: replaces generateTutorResponse().
   *
   * @param {string} message - User's message
   * @param {object} [contextOverride] - Optional context override
   * @returns {Promise<string>}
   */
  async generateTutorResponse(message, contextOverride) {
    const context = contextOverride
      ? { ...this.pageContext, ...contextOverride }
      : this.pageContext;
    return this._callAPI(message, null, context);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // History management
  // ─────────────────────────────────────────────────────────────────────────

  clearHistory() {
    this.conversationHistory = [];
    try {
      localStorage.removeItem('claude_tutor_history');
    } catch { /* ignore */ }
  }

  getHistory() {
    return [...this.conversationHistory];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Persona and context
  // ─────────────────────────────────────────────────────────────────────────

  setPersona(persona) {
    this.persona = persona;
    try {
      localStorage.setItem('bsa_persona', persona);
    } catch { /* ignore */ }
  }

  refreshContext() {
    this.pageContext = this._detectPageContext();
    this.persona = this._loadPersona();
  }

  /** Gemini-UI compatibility */
  hasApiKey() {
    return true; // key is always present server-side
  }

  /** Gemini-UI compatibility — no-op */
  setApiKey(_key) { /* key is managed server-side */ }

  /** Gemini-UI compatibility */
  getContextSummary() {
    const ctx = this.pageContext;
    if (ctx.type === 'learning-path' && ctx.learningPath) {
      return `${ctx.learningPath} path${ctx.stage ? ` · Stage ${ctx.stage}` : ''}`;
    }
    if (ctx.type === 'demo' && ctx.demo) {
      return ctx.demo.replace(/-/g, ' ');
    }
    if (ctx.type === 'deep-dive' && ctx.topic) {
      return ctx.topic.replace(/-/g, ' ');
    }
    return 'Bitcoin Learning';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Internal
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Core API call — fetches /api/tutor and reads the SSE stream.
   * @param {string} message
   * @param {((chunk: string) => void) | null} onChunk
   * @param {object} [contextOverride]
   * @returns {Promise<string>} Full response text
   */
  async _callAPI(message, onChunk, contextOverride) {
    const context = contextOverride ?? this.pageContext;

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: this.conversationHistory.slice(-20),
        context,
        persona: this.persona,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Tutor API error ${response.status}: ${text.slice(0, 200)}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === 'text' && event.content) {
              fullText += event.content;
              if (onChunk) onChunk(event.content);
            } else if (event.type === 'error') {
              throw new Error(event.message ?? 'Unknown tutor error');
            }
            // 'done' event: stream finished — loop will end naturally
          } catch (parseErr) {
            if (parseErr instanceof SyntaxError) continue; // malformed SSE line
            throw parseErr;
          }
        }
      }
    } finally {
      reader.cancel().catch(() => {});
    }

    // Save exchange to history
    this.conversationHistory.push({ role: 'user', content: message });
    this.conversationHistory.push({ role: 'assistant', content: fullText });
    // Keep only last 20 exchanges in memory and storage
    if (this.conversationHistory.length > 40) {
      this.conversationHistory = this.conversationHistory.slice(-40);
    }
    this._saveHistory();

    return fullText;
  }

  _detectPageContext() {
    if (typeof window === 'undefined') return { type: 'unknown' };

    const path = window.location.pathname;
    const context = { type: 'general', path };

    const pathMatch = path.match(/\/paths\/([^/]+)(?:\/stage-(\d+))?(?:\/module-(\d+))?/);
    if (pathMatch) {
      return {
        type: 'learning-path',
        path,
        learningPath: pathMatch[1],
        stage: pathMatch[2] ? parseInt(pathMatch[2], 10) : null,
        module: pathMatch[3] ? parseInt(pathMatch[3], 10) : null,
      };
    }

    const demoMatch = path.match(/\/interactive-demos\/([^/]+)/);
    if (demoMatch) {
      return { type: 'demo', path, demo: demoMatch[1], topic: demoMatch[1].replace(/-/g, ' ') };
    }

    const deepDiveMatch = path.match(/\/deep-dives\/([^/]+)/);
    if (deepDiveMatch) {
      return { type: 'deep-dive', path, topic: deepDiveMatch[1] };
    }

    return context;
  }

  _loadPersona() {
    try {
      return (
        localStorage.getItem('bsa_persona') ||
        localStorage.getItem('userPersona') ||
        localStorage.getItem('persona') ||
        'curious'
      );
    } catch {
      return 'curious';
    }
  }

  _loadHistory() {
    try {
      const raw = localStorage.getItem('claude_tutor_history');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(-40) : [];
    } catch {
      return [];
    }
  }

  _saveHistory() {
    try {
      localStorage.setItem('claude_tutor_history', JSON.stringify(this.conversationHistory));
    } catch { /* ignore quota errors */ }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Expose globally
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  function init() {
    const tutor = new ClaudeTutor();
    window.claudeTutor = tutor;
    // Compatibility alias so gemini-tutor-ui.js works unchanged
    window.geminiService = tutor;
    window.dispatchEvent(new CustomEvent('claudeTutorReady', { detail: tutor }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
