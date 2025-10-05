/**
 * Privacy-Compliant Event Tracking System
 *
 * Integrates with Plausible Analytics for privacy-friendly tracking
 * - No cookies
 * - No cross-site tracking
 * - No PII collection
 * - GDPR compliant by default
 */
export class EventTracker {
    constructor(domain = 'bitcoinsovereign.academy', options = {}) {
        this.enabled = true;
        this.debug = false;
        this.domain = domain;
        this.debug = options.debug || false;
    }
    /**
     * Track a custom event to Plausible
     */
    track(eventName, metadata) {
        if (!this.enabled) {
            return;
        }
        if (this.debug) {
            console.log('[EventTracker] Tracking:', eventName, metadata);
        }
        // Send to Plausible Analytics
        this.sendToPlausible(eventName, metadata);
    }
    /**
     * Track learning events (module completion, progress, etc.)
     */
    trackLearning(event) {
        const eventName = `Learning_${event.action}`;
        const props = {
            category: event.category,
            label: event.label || '',
            value: event.value || 0,
            ...event.metadata
        };
        this.track(eventName, props);
    }
    /**
     * Track course/module start
     */
    trackCourseStart(courseId, courseName, difficulty) {
        this.track('Course_Started', {
            course_id: courseId,
            course_name: courseName,
            difficulty: difficulty,
            timestamp: Date.now()
        });
    }
    /**
     * Track lesson completion
     */
    trackLessonComplete(lessonId, lessonName, timeSpent) {
        this.track('Lesson_Completed', {
            lesson_id: lessonId,
            lesson_name: lessonName,
            time_spent_seconds: timeSpent,
            timestamp: Date.now()
        });
    }
    /**
     * Track assessment attempts
     */
    trackAssessmentStart(assessmentId, topic, difficulty) {
        this.track('Assessment_Started', {
            assessment_id: assessmentId,
            topic: topic,
            difficulty: difficulty
        });
    }
    trackAssessmentComplete(assessmentId, score, totalPoints, passed, timeSpent) {
        this.track('Assessment_Completed', {
            assessment_id: assessmentId,
            score: score,
            total_points: totalPoints,
            percentage: Math.round((score / totalPoints) * 100),
            passed: passed ? 'yes' : 'no',
            time_spent_seconds: timeSpent
        });
    }
    /**
     * Track interactive tool usage
     */
    trackToolUsage(toolName, action, metadata) {
        this.track('Tool_Used', {
            tool: toolName,
            action: action,
            ...metadata
        });
    }
    /**
     * Track user engagement
     */
    trackEngagement(action, element, metadata) {
        this.track('User_Engagement', {
            action: action,
            element: element,
            ...metadata
        });
    }
    /**
     * Track CTA clicks
     */
    trackCTAClick(ctaName, location, metadata) {
        this.track('CTA_Click', {
            cta: ctaName,
            location: location,
            ...metadata
        });
    }
    /**
     * Track page views with context
     */
    trackPageView(pageName, category, metadata) {
        this.track('Page_View', {
            page: pageName,
            category: category || 'general',
            ...metadata
        });
    }
    /**
     * Track video interactions
     */
    trackVideoPlay(videoId, videoTitle) {
        this.track('Video_Play', {
            video_id: videoId,
            video_title: videoTitle
        });
    }
    trackVideoComplete(videoId, videoTitle, watchTime) {
        this.track('Video_Complete', {
            video_id: videoId,
            video_title: videoTitle,
            watch_time_seconds: watchTime
        });
    }
    /**
     * Track search queries
     */
    trackSearch(query, resultsCount, category) {
        this.track('Search', {
            query: query,
            results_count: resultsCount,
            category: category || 'general'
        });
    }
    /**
     * Track downloads
     */
    trackDownload(fileName, fileType, category) {
        this.track('Download', {
            file_name: fileName,
            file_type: fileType,
            category: category || 'resource'
        });
    }
    /**
     * Track form submissions
     */
    trackFormSubmit(formName, success, metadata) {
        this.track('Form_Submit', {
            form: formName,
            success: success ? 'yes' : 'no',
            ...metadata
        });
    }
    /**
     * Track errors (for debugging)
     */
    trackError(errorType, errorMessage, context) {
        if (this.debug) {
            this.track('Error', {
                type: errorType,
                message: errorMessage,
                context: context || 'unknown'
            });
        }
    }
    /**
     * Track milestone achievements
     */
    trackMilestone(milestoneName, milestoneType, metadata) {
        this.track('Milestone_Achieved', {
            milestone: milestoneName,
            type: milestoneType,
            ...metadata
        });
    }
    /**
     * Track social shares
     */
    trackShare(platform, contentType, contentId) {
        this.track('Content_Shared', {
            platform: platform,
            content_type: contentType,
            content_id: contentId
        });
    }
    /**
     * Track outbound links
     */
    trackOutboundLink(url, context) {
        this.track('Outbound_Link', {
            url: url,
            context: context || 'unknown'
        });
    }
    /**
     * Enable/disable tracking
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (this.debug) {
            console.log('[EventTracker] Tracking', enabled ? 'enabled' : 'disabled');
        }
    }
    /**
     * Enable/disable debug mode
     */
    setDebug(debug) {
        this.debug = debug;
    }
    /**
     * Send event to Plausible Analytics
     */
    sendToPlausible(eventName, props) {
        if (typeof window === 'undefined') {
            return;
        }
        // Check if Plausible is loaded
        const plausible = window.plausible;
        if (!plausible) {
            if (this.debug) {
                console.warn('[EventTracker] Plausible not loaded, queuing event:', eventName);
            }
            return;
        }
        // Send event with props
        if (props && Object.keys(props).length > 0) {
            plausible(eventName, { props: props });
        }
        else {
            plausible(eventName);
        }
    }
    /**
     * Generate tracking snippet for HTML injection
     */
    generateTrackingScript() {
        return `
<script>
// Event Tracking Utility
window.bitcoinAcademyTracker = {
  track: function(eventName, metadata) {
    if (window.plausible) {
      if (metadata) {
        window.plausible(eventName, { props: metadata });
      } else {
        window.plausible(eventName);
      }
    }
    console.log('[Event]', eventName, metadata);
  },

  // Quick tracking methods
  trackCourseStart: function(courseId, courseName, difficulty) {
    this.track('Course_Started', {
      course_id: courseId,
      course_name: courseName,
      difficulty: difficulty
    });
  },

  trackLessonComplete: function(lessonId, lessonName, timeSpent) {
    this.track('Lesson_Completed', {
      lesson_id: lessonId,
      lesson_name: lessonName,
      time_spent_seconds: timeSpent
    });
  },

  trackAssessmentComplete: function(assessmentId, score, totalPoints, passed) {
    this.track('Assessment_Completed', {
      assessment_id: assessmentId,
      score: score,
      total_points: totalPoints,
      percentage: Math.round((score / totalPoints) * 100),
      passed: passed ? 'yes' : 'no'
    });
  },

  trackToolUsage: function(toolName, action) {
    this.track('Tool_Used', {
      tool: toolName,
      action: action
    });
  },

  trackCTAClick: function(ctaName, location) {
    this.track('CTA_Click', {
      cta: ctaName,
      location: location
    });
  },

  trackVideoPlay: function(videoId, videoTitle) {
    this.track('Video_Play', {
      video_id: videoId,
      video_title: videoTitle
    });
  },

  trackDownload: function(fileName, fileType) {
    this.track('Download', {
      file_name: fileName,
      file_type: fileType
    });
  }
};

// Auto-track outbound links
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (link && link.hostname !== window.location.hostname) {
    window.bitcoinAcademyTracker.track('Outbound_Link', {
      url: link.href,
      text: link.textContent || link.innerText
    });
  }
});

// Auto-track video plays
document.addEventListener('play', function(e) {
  if (e.target.tagName === 'VIDEO') {
    var video = e.target;
    window.bitcoinAcademyTracker.trackVideoPlay(
      video.id || 'unnamed',
      video.title || video.src
    );
  }
}, true);

console.log('✅ Event tracking initialized');
</script>
`;
    }
}
// Export singleton instance
export const eventTracker = new EventTracker('bitcoinsovereign.academy', {
    debug: process.env.NODE_ENV === 'development'
});
// Common event presets
export const EVENTS = {
    // Learning events
    COURSE_STARTED: 'Course_Started',
    LESSON_COMPLETED: 'Lesson_Completed',
    ASSESSMENT_STARTED: 'Assessment_Started',
    ASSESSMENT_COMPLETED: 'Assessment_Completed',
    MODULE_COMPLETED: 'Module_Completed',
    // Engagement events
    TOOL_USED: 'Tool_Used',
    VIDEO_PLAY: 'Video_Play',
    VIDEO_COMPLETE: 'Video_Complete',
    DOWNLOAD: 'Download',
    SEARCH: 'Search',
    // Conversion events
    CTA_CLICK: 'CTA_Click',
    FORM_SUBMIT: 'Form_Submit',
    SIGNUP: 'Signup',
    PURCHASE: 'Purchase',
    // Navigation events
    PAGE_VIEW: 'Page_View',
    OUTBOUND_LINK: 'Outbound_Link',
    // Social events
    CONTENT_SHARED: 'Content_Shared',
    // Achievement events
    MILESTONE_ACHIEVED: 'Milestone_Achieved',
    STREAK_MAINTAINED: 'Streak_Maintained',
    // Error events
    ERROR: 'Error'
};
