/**
 * Persona Selector System
 *
 * Enables personalized learning experiences based on user personas:
 * - Students (K-12, college, self-learners)
 * - Parents (supporting their children's Bitcoin education)
 * - Policymakers (understanding Bitcoin for regulation)
 * - Educators (teaching Bitcoin concepts)
 * - Entrepreneurs (building on Bitcoin)
 * - Investors (understanding Bitcoin as an asset)
 */

export type PersonaType =
  | 'student'
  | 'parent'
  | 'policymaker'
  | 'educator'
  | 'entrepreneur'
  | 'investor'
  | 'developer'
  | 'journalist';

export interface PersonaProfile {
  id: PersonaType;
  name: string;
  description: string;
  learningGoals: string[];
  preferredFormats: ContentFormat[];
  difficultyRange: DifficultyLevel[];
  topicPriorities: string[];
  timeCommitment: 'low' | 'medium' | 'high';
  technicalLevel: 'non-technical' | 'some-technical' | 'technical' | 'expert';
}

export type ContentFormat =
  | 'video'
  | 'text'
  | 'interactive'
  | 'podcast'
  | 'infographic'
  | 'case-study'
  | 'simulation';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const PERSONA_PROFILES: Record<PersonaType, PersonaProfile> = {
  student: {
    id: 'student',
    name: 'Student',
    description: 'Learning Bitcoin as part of education or personal interest',
    learningGoals: [
      'Understand Bitcoin fundamentals',
      'Learn how money works',
      'Explore career opportunities in Bitcoin',
      'Build practical Bitcoin projects'
    ],
    preferredFormats: ['video', 'interactive', 'infographic', 'simulation'],
    difficultyRange: ['beginner', 'intermediate'],
    topicPriorities: ['basics', 'wallets', 'security', 'career-paths'],
    timeCommitment: 'medium',
    technicalLevel: 'some-technical'
  },

  parent: {
    id: 'parent',
    name: 'Parent',
    description: 'Understanding Bitcoin to guide and support children\'s education',
    learningGoals: [
      'Understand what Bitcoin is',
      'Learn how to keep Bitcoin safe',
      'Evaluate educational opportunities',
      'Guide children\'s financial literacy'
    ],
    preferredFormats: ['text', 'video', 'infographic', 'case-study'],
    difficultyRange: ['beginner'],
    topicPriorities: ['basics', 'security', 'scams', 'responsible-use'],
    timeCommitment: 'low',
    technicalLevel: 'non-technical'
  },

  policymaker: {
    id: 'policymaker',
    name: 'Policymaker',
    description: 'Understanding Bitcoin for informed policy and regulation',
    learningGoals: [
      'Understand Bitcoin technology and economics',
      'Learn regulatory implications',
      'Evaluate societal impact',
      'Make informed policy decisions'
    ],
    preferredFormats: ['text', 'case-study', 'infographic'],
    difficultyRange: ['intermediate', 'advanced'],
    topicPriorities: ['economics', 'regulation', 'monetary-policy', 'global-adoption'],
    timeCommitment: 'medium',
    technicalLevel: 'some-technical'
  },

  educator: {
    id: 'educator',
    name: 'Educator',
    description: 'Teaching Bitcoin concepts to students',
    learningGoals: [
      'Master Bitcoin fundamentals',
      'Learn pedagogical approaches',
      'Access teaching resources',
      'Create engaging lesson plans'
    ],
    preferredFormats: ['text', 'video', 'interactive', 'case-study'],
    difficultyRange: ['intermediate', 'advanced'],
    topicPriorities: ['pedagogy', 'curriculum', 'assessments', 'resources'],
    timeCommitment: 'high',
    technicalLevel: 'some-technical'
  },

  entrepreneur: {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Building businesses on Bitcoin',
    learningGoals: [
      'Understand Bitcoin business models',
      'Learn payment integration',
      'Explore Lightning Network',
      'Build sustainable Bitcoin businesses'
    ],
    preferredFormats: ['case-study', 'interactive', 'video', 'text'],
    difficultyRange: ['intermediate', 'advanced'],
    topicPriorities: ['lightning', 'payments', 'business-models', 'custody'],
    timeCommitment: 'high',
    technicalLevel: 'technical'
  },

  investor: {
    id: 'investor',
    name: 'Investor',
    description: 'Understanding Bitcoin as an investment',
    learningGoals: [
      'Understand Bitcoin value proposition',
      'Learn secure storage methods',
      'Evaluate risks and opportunities',
      'Make informed investment decisions'
    ],
    preferredFormats: ['text', 'infographic', 'case-study', 'video'],
    difficultyRange: ['beginner', 'intermediate', 'advanced'],
    topicPriorities: ['economics', 'custody', 'volatility', 'portfolio-strategy'],
    timeCommitment: 'medium',
    technicalLevel: 'non-technical'
  },

  developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Building applications on Bitcoin',
    learningGoals: [
      'Learn Bitcoin protocol',
      'Master development tools',
      'Build Bitcoin applications',
      'Contribute to Bitcoin ecosystem'
    ],
    preferredFormats: ['text', 'interactive', 'simulation', 'case-study'],
    difficultyRange: ['intermediate', 'advanced', 'expert'],
    topicPriorities: ['protocol', 'development', 'lightning', 'security'],
    timeCommitment: 'high',
    technicalLevel: 'expert'
  },

  journalist: {
    id: 'journalist',
    name: 'Journalist',
    description: 'Reporting accurately on Bitcoin',
    learningGoals: [
      'Understand Bitcoin fundamentals',
      'Debunk common myths',
      'Report accurately on developments',
      'Analyze Bitcoin\'s societal impact'
    ],
    preferredFormats: ['text', 'case-study', 'infographic', 'video'],
    difficultyRange: ['beginner', 'intermediate'],
    topicPriorities: ['basics', 'economics', 'myths', 'current-events'],
    timeCommitment: 'medium',
    technicalLevel: 'some-technical'
  }
};

export class PersonaSelector {
  private currentPersona: PersonaType | null = null;
  private storageKey = 'btc_academy_persona';

  /**
   * Get or select a persona
   */
  getPersona(): PersonaType | null {
    // Check stored persona
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored && this.isValidPersona(stored)) {
        this.currentPersona = stored as PersonaType;
        return this.currentPersona;
      }
    }

    return this.currentPersona;
  }

  /**
   * Set the active persona
   */
  setPersona(persona: PersonaType): void {
    if (!this.isValidPersona(persona)) {
      throw new Error(`Invalid persona: ${persona}`);
    }

    this.currentPersona = persona;

    // Store in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.storageKey, persona);
    }
  }

  /**
   * Get profile for current or specified persona
   */
  getProfile(persona?: PersonaType): PersonaProfile | null {
    const targetPersona = persona || this.currentPersona;
    if (!targetPersona) return null;

    return PERSONA_PROFILES[targetPersona];
  }

  /**
   * Get personalized content recommendations
   */
  getContentRecommendations(persona?: PersonaType): {
    topics: string[];
    formats: ContentFormat[];
    difficulty: DifficultyLevel[];
  } {
    const profile = this.getProfile(persona);
    if (!profile) {
      return {
        topics: [],
        formats: ['video', 'text'],
        difficulty: ['beginner']
      };
    }

    return {
      topics: profile.topicPriorities,
      formats: profile.preferredFormats,
      difficulty: profile.difficultyRange
    };
  }

  /**
   * Customize course/content for persona
   */
  customizeContent(content: any, persona?: PersonaType): any {
    const profile = this.getProfile(persona);
    if (!profile) return content;

    return {
      ...content,
      persona: profile.id,
      personaName: profile.name,
      adjustedDifficulty: this.adjustDifficulty(content.difficulty, profile),
      recommendedFormats: profile.preferredFormats,
      contextualExamples: this.getPersonaExamples(profile.id),
      estimatedTime: this.adjustTimeEstimate(content.estimatedTime, profile.timeCommitment)
    };
  }

  /**
   * Generate persona selection UI
   */
  generatePersonaSelectorHTML(): string {
    return `
<div class="persona-selector">
  <h2>Choose Your Learning Path</h2>
  <p>Select the profile that best matches your goals to get personalized content:</p>

  <div class="persona-grid">
    ${Object.values(PERSONA_PROFILES).map(persona => `
      <div class="persona-card" data-persona="${persona.id}" onclick="selectPersona('${persona.id}')">
        <h3>${this.getPersonaIcon(persona.id)} ${persona.name}</h3>
        <p>${persona.description}</p>
        <ul class="goals-list">
          ${persona.learningGoals.slice(0, 3).map(goal => `<li>${goal}</li>`).join('')}
        </ul>
        <button class="select-btn">Select ${persona.name}</button>
      </div>
    `).join('')}
  </div>
</div>

<style>
.persona-selector {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.persona-selector h2 {
  text-align: center;
  color: #f7931a;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.persona-selector > p {
  text-align: center;
  color: #666;
  font-size: 1.2em;
  margin-bottom: 40px;
}

.persona-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.persona-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.persona-card:hover {
  border-color: #f7931a;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(247, 147, 26, 0.2);
}

.persona-card h3 {
  color: #333;
  font-size: 1.5em;
  margin-bottom: 10px;
}

.persona-card p {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.goals-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.goals-list li {
  padding: 5px 0;
  color: #555;
  font-size: 0.95em;
}

.goals-list li:before {
  content: "✓ ";
  color: #10b981;
  font-weight: bold;
  margin-right: 8px;
}

.select-btn {
  width: 100%;
  background: #f7931a;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.select-btn:hover {
  background: #e8850f;
}

.persona-card.selected {
  border-color: #10b981;
  background: #f0fdf4;
}
</style>

<script>
function selectPersona(personaId) {
  // Store selection
  localStorage.setItem('btc_academy_persona', personaId);

  // Visual feedback
  document.querySelectorAll('.persona-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector('[data-persona="' + personaId + '"]').classList.add('selected');

  // Track event
  if (window.bitcoinAcademyTracker) {
    window.bitcoinAcademyTracker.track('Persona_Selected', {
      persona: personaId
    });
  }

  // Navigate to personalized content
  setTimeout(() => {
    window.location.href = '/dashboard?persona=' + personaId;
  }, 500);
}

// Auto-select if already chosen
window.addEventListener('load', () => {
  const savedPersona = localStorage.getItem('btc_academy_persona');
  if (savedPersona) {
    const card = document.querySelector('[data-persona="' + savedPersona + '"]');
    if (card) {
      card.classList.add('selected');
    }
  }
});
</script>
`;
  }

  // Helper methods
  private isValidPersona(persona: string): boolean {
    return persona in PERSONA_PROFILES;
  }

  private adjustDifficulty(originalDifficulty: string, profile: PersonaProfile): string {
    if (!profile.difficultyRange.includes(originalDifficulty as DifficultyLevel)) {
      // Return closest difficulty in range
      return profile.difficultyRange[0];
    }
    return originalDifficulty;
  }

  private adjustTimeEstimate(baseTime: number, commitment: PersonaProfile['timeCommitment']): number {
    const multipliers = {
      low: 0.7,
      medium: 1.0,
      high: 1.3
    };
    return Math.round(baseTime * multipliers[commitment]);
  }

  private getPersonaIcon(persona: PersonaType): string {
    const icons: Record<PersonaType, string> = {
      student: '🎓',
      parent: '👨‍👩‍👧',
      policymaker: '⚖️',
      educator: '👨‍🏫',
      entrepreneur: '💼',
      investor: '📈',
      developer: '💻',
      journalist: '📰'
    };
    return icons[persona];
  }

  private getPersonaExamples(persona: PersonaType): string[] {
    const examples: Record<PersonaType, string[]> = {
      student: [
        'How Bitcoin could fund your college education',
        'Building a Bitcoin club at your school',
        'Career paths in the Bitcoin industry'
      ],
      parent: [
        'Teaching your kids about saving with Bitcoin',
        'Setting up a secure wallet for your family',
        'Evaluating Bitcoin education programs'
      ],
      policymaker: [
        'Bitcoin\'s impact on monetary sovereignty',
        'Regulatory approaches in different countries',
        'Bitcoin and financial inclusion'
      ],
      educator: [
        'Creating a Bitcoin curriculum for high school',
        'Assessment strategies for Bitcoin education',
        'Hands-on Bitcoin activities for students'
      ],
      entrepreneur: [
        'Accepting Bitcoin payments in your business',
        'Building on Lightning Network',
        'Bitcoin-native business models'
      ],
      investor: [
        'Dollar-cost averaging Bitcoin',
        'Multi-signature custody solutions',
        'Bitcoin in a diversified portfolio'
      ],
      developer: [
        'Building your first Lightning app',
        'Understanding Bitcoin Script',
        'Contributing to Bitcoin Core'
      ],
      journalist: [
        'Fact-checking common Bitcoin claims',
        'Understanding Bitcoin mining energy use',
        'Covering Bitcoin for mainstream media'
      ]
    };
    return examples[persona];
  }
}

// Export singleton instance
export const personaSelector = new PersonaSelector();
