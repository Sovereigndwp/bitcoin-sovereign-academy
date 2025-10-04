# Event Tracking Guide

## Overview

Privacy-compliant event tracking system for Bitcoin Sovereign Academy using Plausible Analytics.

**Key features:**
- ✅ **No cookies** - Uses browser APIs only
- ✅ **No PII** - Zero personal information collected
- ✅ **GDPR compliant** - Privacy-first by design
- ✅ **Lightweight** - Minimal performance impact
- ✅ **Automatic tracking** - Outbound links, videos, errors

## Quick Start

### 1. Basic Setup (Already Configured)

All HTML templates include:
```html
<!-- Plausible Analytics -->
<script defer data-domain="bitcoinsovereign.academy"
        src="https://plausible.io/js/script.js"></script>

<!-- Event Tracking Utility -->
<script>
window.bitcoinAcademyTracker = { /* ... */ };
</script>
```

### 2. Track Custom Events

```javascript
// Simple event
window.bitcoinAcademyTracker.track('Button_Click', {
  button_name: 'start_course',
  location: 'homepage'
});

// Learning events
window.bitcoinAcademyTracker.trackCourseStart(
  'bitcoin-basics',
  'Bitcoin Fundamentals',
  'beginner'
);

window.bitcoinAcademyTracker.trackLessonComplete(
  'lesson-1',
  'What is Bitcoin',
  300  // 5 minutes
);

// Assessment tracking
window.bitcoinAcademyTracker.trackAssessmentComplete(
  'assessment-fees',
  23,   // score
  26,   // total points
  true  // passed
);
```

## Event Categories

### 1. Learning Events

#### Course Started
```javascript
window.bitcoinAcademyTracker.trackCourseStart(
  courseId,      // 'bitcoin-basics'
  courseName,    // 'Bitcoin Fundamentals'
  difficulty     // 'beginner' | 'intermediate' | 'advanced'
);
```

**Plausible event:** `Course_Started`
**Properties:**
- `course_id`: Unique course identifier
- `course_name`: Human-readable course name
- `difficulty`: Course difficulty level

#### Lesson Completed
```javascript
window.bitcoinAcademyTracker.trackLessonComplete(
  lessonId,        // 'lesson-1'
  lessonName,      // 'What is Bitcoin'
  timeSpentSeconds // 300
);
```

**Plausible event:** `Lesson_Completed`
**Properties:**
- `lesson_id`: Unique lesson identifier
- `lesson_name`: Lesson title
- `time_spent_seconds`: Time spent on lesson

#### Assessment Completed
```javascript
window.bitcoinAcademyTracker.trackAssessmentComplete(
  assessmentId,   // 'assessment-fees'
  score,          // 23
  totalPoints,    // 26
  passed          // true
);
```

**Plausible event:** `Assessment_Completed`
**Properties:**
- `assessment_id`: Unique assessment identifier
- `score`: Points earned
- `total_points`: Maximum possible points
- `percentage`: Calculated percentage score
- `passed`: 'yes' or 'no'

### 2. Engagement Events

#### Tool Usage
```javascript
window.bitcoinAcademyTracker.trackToolUsage(
  toolName,  // 'fee-calculator'
  action     // 'calculate' | 'reset' | 'share'
);
```

**Plausible event:** `Tool_Used`
**Properties:**
- `tool`: Tool identifier
- `action`: Action performed

#### Video Interactions
```javascript
// Automatically tracked via event listener
// Or manually:
window.bitcoinAcademyTracker.trackVideoPlay(
  videoId,     // 'intro-video'
  videoTitle   // 'Introduction to Bitcoin'
);
```

**Plausible event:** `Video_Play` / `Video_Complete`

#### Downloads
```javascript
window.bitcoinAcademyTracker.trackDownload(
  fileName,  // 'bitcoin-whitepaper.pdf'
  fileType   // 'pdf'
);
```

**Plausible event:** `Download`

### 3. Conversion Events

#### CTA Clicks
```javascript
window.bitcoinAcademyTracker.trackCTAClick(
  ctaName,   // 'start-learning'
  location   // 'homepage' | 'dashboard' | 'course-page'
);
```

**Plausible event:** `CTA_Click`
**Properties:**
- `cta`: CTA identifier
- `location`: Where the CTA was clicked

#### Form Submissions
```javascript
window.bitcoinAcademyTracker.track('Form_Submit', {
  form: 'newsletter_signup',
  success: 'yes'
});
```

### 4. Navigation Events

#### Page Views
```javascript
window.bitcoinAcademyTracker.track('Page_View', {
  page: 'course_detail',
  category: 'learning',
  course_id: 'bitcoin-basics'
});
```

#### Outbound Links
Automatically tracked! Every external link click sends:

**Plausible event:** `Outbound_Link`
**Properties:**
- `url`: Destination URL
- `text`: Link text

## Auto-Tracked Events

The following events are tracked automatically:

### 1. Outbound Links
```javascript
// Automatically tracks all clicks to external sites
<a href="https://bitcoin.org">Bitcoin.org</a>
// → Tracked as Outbound_Link
```

### 2. Video Plays
```javascript
// Automatically tracks all <video> element plays
<video id="intro" src="intro.mp4"></video>
// → Tracked as Video_Play when played
```

### 3. Error Tracking (Debug Mode)
```javascript
// Automatically logs JavaScript errors
// (Only in debug mode)
```

## Example Implementations

### Course Page

```html
<!DOCTYPE html>
<html>
<head>
  <script defer data-domain="bitcoinsovereign.academy"
          src="https://plausible.io/js/script.js"></script>
  <!-- Event tracking script included -->
</head>
<body>
  <h1>Bitcoin Fundamentals</h1>

  <button onclick="startCourse()">Start Course</button>

  <script>
    // Track page view
    window.bitcoinAcademyTracker.track('Page_View', {
      page: 'course_detail',
      course_id: 'bitcoin-fundamentals',
      difficulty: 'beginner'
    });

    function startCourse() {
      // Track course start
      window.bitcoinAcademyTracker.trackCourseStart(
        'bitcoin-fundamentals',
        'Bitcoin Fundamentals',
        'beginner'
      );

      // Navigate to course
      window.location.href = '/courses/bitcoin-fundamentals/lesson-1';
    }
  </script>
</body>
</html>
```

### Interactive Tool

```html
<div class="tool-card" onclick="useTool('fee-calculator')">
  <h3>Fee Calculator</h3>
  <p>Calculate transaction fees</p>
</div>

<script>
function useTool(toolName) {
  // Track tool usage
  window.bitcoinAcademyTracker.trackToolUsage(toolName, 'open');

  // Show tool interface
  showToolModal(toolName);
}

function calculateFee(size, feeRate) {
  // Track calculation
  window.bitcoinAcademyTracker.trackToolUsage('fee-calculator', 'calculate');

  // Perform calculation
  return size * feeRate;
}
</script>
```

### Assessment Flow

```html
<script>
// Start assessment
function startAssessment(assessmentId, topic, difficulty) {
  window.bitcoinAcademyTracker.track('Assessment_Started', {
    assessment_id: assessmentId,
    topic: topic,
    difficulty: difficulty
  });

  // Load assessment
  loadAssessment(assessmentId);
}

// Complete assessment
function submitAssessment(assessmentId, answers) {
  const result = gradeAssessment(assessmentId, answers);

  window.bitcoinAcademyTracker.trackAssessmentComplete(
    assessmentId,
    result.score,
    result.totalPoints,
    result.passed
  );

  // Show results
  showResults(result);
}
</script>
```

### Download Tracking

```html
<a href="/downloads/bitcoin-whitepaper.pdf"
   onclick="trackDownloadClick(event, 'bitcoin-whitepaper.pdf', 'pdf')">
  Download Bitcoin Whitepaper
</a>

<script>
function trackDownloadClick(event, fileName, fileType) {
  event.preventDefault();

  // Track download
  window.bitcoinAcademyTracker.trackDownload(fileName, fileType);

  // Trigger download
  window.location.href = event.target.href;
}
</script>
```

## Viewing Analytics in Plausible

### 1. Standard Metrics

Navigate to: https://plausible.io/bitcoinsovereign.academy

**Default dashboard shows:**
- Page views
- Unique visitors
- Bounce rate
- Visit duration
- Top pages

### 2. Custom Events

Click **"Custom Events"** in the left sidebar to see:
- Course_Started
- Lesson_Completed
- Assessment_Completed
- Tool_Used
- CTA_Click
- Video_Play
- Download

### 3. Event Properties

Click any event to see breakdown by properties:

**Example: Course_Started**
- Group by `course_id` → See most popular courses
- Group by `difficulty` → See difficulty distribution
- Compare conversion rates

**Example: Assessment_Completed**
- Filter by `passed: yes` → Completion rate
- Group by `assessment_id` → See hardest assessments
- View average `percentage` → Overall performance

### 4. Funnels

Create conversion funnels:

**Example: Course Completion Funnel**
1. `Page_View` (course_detail)
2. `Course_Started`
3. `Lesson_Completed` (×5)
4. `Assessment_Completed` (passed: yes)

**Example: Tool Engagement Funnel**
1. `Page_View` (dashboard)
2. `Tool_Used` (any tool)
3. `CTA_Click` (start-learning)

### 5. Goals

Set up goals for key conversions:

**Example Goals:**
- Course completion: `Assessment_Completed` where `passed = yes`
- Tool usage: Any `Tool_Used` event
- Newsletter signup: `Form_Submit` where `form = newsletter`

## Best Practices

### 1. Consistent Naming

Use consistent event and property names:

✅ **Good:**
```javascript
// snake_case for properties
{ course_id: 'bitcoin-basics', difficulty: 'beginner' }

// PascalCase for event names
'Course_Started', 'Lesson_Completed'
```

❌ **Bad:**
```javascript
// Inconsistent casing
{ CourseID: 'bitcoin-basics', Difficulty: 'beginner' }

// Inconsistent naming
'courseStarted', 'lesson-complete'
```

### 2. Meaningful Properties

Include context that helps analysis:

✅ **Good:**
```javascript
window.bitcoinAcademyTracker.track('Button_Click', {
  button_id: 'start-course',
  button_text: 'Start Learning',
  location: 'homepage_hero',
  course_id: 'bitcoin-basics'
});
```

❌ **Bad:**
```javascript
window.bitcoinAcademyTracker.track('Click', {
  id: 'btn1'
});
```

### 3. Track User Journey

Track complete flows, not just endpoints:

✅ **Good:**
```javascript
// Track entire assessment flow
'Assessment_Started' → 'Question_Answered' → 'Assessment_Completed'
```

❌ **Bad:**
```javascript
// Only track final result
'Assessment_Completed'
```

### 4. Performance Considerations

Don't track too frequently:

✅ **Good:**
```javascript
// Track on meaningful milestones
trackLessonProgress(25);  // 25% complete
trackLessonProgress(50);  // 50% complete
trackLessonProgress(100); // Completed
```

❌ **Bad:**
```javascript
// Track every scroll event
window.addEventListener('scroll', () => {
  tracker.track('Scroll', { position: window.scrollY });
});
```

## Privacy & Compliance

### What We Track

✅ **We DO track:**
- Page views (URL only)
- Button clicks (element ID/text)
- Course progress (course ID, not user ID)
- Tool usage (tool name, action)
- Time spent (session duration)

❌ **We DON'T track:**
- Personal information (name, email, etc.)
- User identifiers (no user IDs)
- IP addresses (anonymized by Plausible)
- Cookies (none used)
- Cross-site activity

### GDPR Compliance

Plausible is GDPR compliant by default:
- No cookies → No consent banner needed
- No PII collection → No data breach risk
- EU-hosted data → GDPR protection
- User can't be identified → No "right to be forgotten" issues

### Data Retention

Configure in Plausible dashboard:
- Default: 2 years
- Recommended: 1 year for learning analytics

## Troubleshooting

### Events Not Showing

**Check 1: Plausible loaded?**
```javascript
console.log(typeof window.plausible); // Should be 'function'
```

**Check 2: Domain correct?**
```html
<script defer data-domain="bitcoinsovereign.academy"
        src="https://plausible.io/js/script.js"></script>
```

**Check 3: Ad blocker?**
Plausible is sometimes blocked. Test in incognito mode.

### Testing Events

```javascript
// Enable debug mode in console
window.bitcoinAcademyTracker.track('Test_Event', {
  test: 'value',
  timestamp: Date.now()
});

// Check browser console for confirmation
```

### Viewing Real-Time Events

In Plausible dashboard:
1. Click **"Realtime"** (top right)
2. Perform action on site
3. Event appears within 1-2 seconds

## TypeScript Integration

```typescript
import { eventTracker, EVENTS } from './utils/event-tracking';

// Type-safe event tracking
eventTracker.trackCourseStart(
  'bitcoin-basics',
  'Bitcoin Fundamentals',
  'beginner'
);

// Use event constants
eventTracker.track(EVENTS.COURSE_STARTED, {
  course_id: 'bitcoin-basics',
  difficulty: 'beginner'
});
```

## Advanced: Custom Implementation

Create custom tracking for specific features:

```typescript
class CourseTracker {
  private startTime: number;
  private courseId: string;

  constructor(courseId: string) {
    this.courseId = courseId;
    this.startTime = Date.now();
  }

  trackProgress(lessonIndex: number, totalLessons: number) {
    const progress = Math.round((lessonIndex / totalLessons) * 100);

    window.bitcoinAcademyTracker.track('Course_Progress', {
      course_id: this.courseId,
      lesson_index: lessonIndex,
      total_lessons: totalLessons,
      progress_percentage: progress,
      time_elapsed_seconds: Math.floor((Date.now() - this.startTime) / 1000)
    });
  }

  trackComplete() {
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);

    window.bitcoinAcademyTracker.track('Course_Completed', {
      course_id: this.courseId,
      total_time_seconds: totalTime
    });
  }
}
```

## Support

Questions? Check:
- Implementation: `src/utils/event-tracking.ts`
- Examples: `src/cases/complete_system_demo.ts`
- Plausible docs: https://plausible.io/docs/custom-event-goals
