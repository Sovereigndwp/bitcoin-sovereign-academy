# FSA HubSpot Implementation - Step-by-Step Guide

## Immediate Action Items (This Week)

### Day 1: Domain and Email Setup

#### 1. Domain Registration
```bash
# Check availability and register
Go to: namecheap.com or godaddy.com
Domain: sovereigndwp.com
Cost: ~$15/year
Privacy Protection: Yes (included)
```

#### 2. Google Workspace Setup
```
Go to: workspace.google.com
Plan: Business Starter ($6/month)
Domain: sovereigndwp.com
Primary Email: dalia@sovereigndwp.com

Additional Emails to Create:
- support@sovereigndwp.com
- info@sovereigndwp.com
- admin@sovereigndwp.com
```

#### 3. Email Configuration
**Gmail Settings for dalia@sovereigndwp.com**:
- Enable IMAP/POP
- Set up email client (Apple Mail/Outlook)
- Configure email signature (use template from previous file)
- Set up auto-responder for info@ and support@ emails

### Day 2: HubSpot User Setup

#### 1. Add New User to Existing HubSpot Account
```
Login to HubSpot as: dalia@thebitcoinadviser.com
Navigate to: Settings → Users & Teams
Click: "Add user"

User Details:
- Email: dalia@sovereigndwp.com
- First Name: Dalia
- Last Name: Platt (FSA)
- Role: Marketing Hub Professional + Sales Hub Professional
- Permissions: Can edit all contacts, companies, deals, tickets
```

#### 2. Create FSA Team
```
Settings → Users & Teams → Teams tab
Click: "Create team"

Team Details:
- Team Name: "Financial Sovereignty Academy"
- Description: "Institutional financial literacy programs"
- Team Members: Add dalia@sovereigndwp.com
- Access: Team-only access to FSA contacts and deals
```

### Day 3: Custom Properties Setup

#### 1. Contact Properties
```
Settings → Properties → Contact Properties
Click: "Create property"

Property 1:
- Label: FSA Business Unit
- Internal Name: fsa_business_unit
- Field Type: Dropdown select
- Options: Bitcoin_Adviser, FSA_Institutional, FSA_Individual
- Default: Bitcoin_Adviser

Property 2:
- Label: FSA Client Type  
- Internal Name: fsa_client_type
- Field Type: Dropdown select
- Options: Municipal, Correctional, Corporate_HR, Individual_Consumer

Property 3:
- Label: FSA Deal Size Range
- Internal Name: fsa_deal_size_range
- Field Type: Dropdown select
- Options: Under_25K, 25K_75K, 75K_200K, 200K_500K, 500K_Plus

Property 4:
- Label: FSA Lead Source
- Internal Name: fsa_lead_source
- Field Type: Dropdown select
- Options: LinkedIn_Outreach, Email_Campaign, Website_Lead, Referral, Webinar
```

#### 2. Company Properties
```
Settings → Properties → Company Properties

Property 1:
- Label: FSA Organization Type
- Internal Name: fsa_org_type
- Field Type: Dropdown select
- Options: Municipality, County, State_Government, Federal_Agency, Corporation, Correctional_Facility

Property 2:
- Label: FSA Employee Count Range
- Internal Name: fsa_employee_range
- Field Type: Dropdown select
- Options: Under_500, 500_1000, 1000_5000, 5000_10000, 10000_Plus

Property 3:
- Label: FSA Annual Budget Range
- Internal Name: fsa_annual_budget
- Field Type: Dropdown select
- Options: Under_1M, 1M_5M, 5M_25M, 25M_100M, 100M_Plus
```

### Day 4: Pipeline Setup

#### 1. Create FSA Sales Pipeline
```
Settings → Objects → Deals → Pipelines
Click: "Create pipeline"

Pipeline Name: FSA Institutional Sales
Stages:
1. Lead Generated - 0%
2. Initial Contact Made - 5% 
3. Qualified Opportunity - 10%
4. Discovery Call Scheduled - 25%
5. Needs Assessment Complete - 40%
6. Proposal Presented - 60%
7. Contract Negotiation - 80%
8. Closed Won - 100%
9. Closed Lost - 0%
```

#### 2. Deal Properties for FSA Pipeline
```
Settings → Properties → Deal Properties

Property 1:
- Label: FSA Program Type
- Internal Name: fsa_program_type
- Field Type: Dropdown select
- Options: Financial_Literacy, Reentry_Program, Employee_Wellness, Community_Education

Property 2:
- Label: Implementation Timeline
- Internal Name: implementation_timeline
- Field Type: Dropdown select
- Options: Immediate, This_Quarter, Next_Quarter, Next_Year

Property 3:
- Label: Decision Committee Size
- Internal Name: decision_committee_size
- Field Type: Number
- Description: Number of people involved in purchase decision
```

### Day 5: Automation Workflows

#### 1. FSA Contact Auto-Tagging Workflow
```
Automation → Workflows → Create workflow
Type: Contact-based workflow

Enrollment Triggers:
- Contact owner is dalia@sovereigndwp.com OR
- Form submission contains "FSA" OR  
- Email domain contains sovereigndwp.com

Actions:
1. Set property: fsa_business_unit = "FSA_Institutional"
2. Add to team: Financial Sovereignty Academy
3. Set contact owner: dalia@sovereigndwp.com
4. Send internal notification: "New FSA lead added"
```

#### 2. FSA Lead Scoring Workflow  
```
Automation → Workflows → Create workflow
Type: Contact-based workflow

Enrollment: fsa_business_unit = "FSA_Institutional"

Scoring Actions:
- Title contains "Mayor", "Director", "Manager": +25 points
- Company size 500-5000: +20 points  
- Downloaded content: +15 points
- Attended webinar: +20 points
- Visited pricing page: +30 points

If HubSpot Score > 75:
- Create task: "High-value FSA lead - schedule call"
- Send notification to dalia@sovereigndwp.com
```

## Week 2: Content and Email Setup

### Email Templates Creation

#### 1. FSA Email Templates
```
Marketing → Email → Templates

Template 1: FSA Municipal Introduction
Subject: Financial literacy programs reducing city costs by 35%
From: dalia@sovereigndwp.com
Content: [Use municipal template from marketing automation file]

Template 2: FSA Corporate HR Introduction  
Subject: Employee financial stress costing [Company] $XXX,XXX?
From: dalia@sovereigndwp.com
Content: [Use corporate template from marketing automation file]

Template 3: FSA Correctional Introduction
Subject: Reduce recidivism with financial literacy education
From: dalia@sovereigndwp.com
Content: [Use correctional template from marketing automation file]
```

### Landing Page Setup

#### 1. Create FSA Landing Pages
```
Marketing → Landing Pages → Create

Page 1: FSA Municipal Assessment
URL: sovereigndwp.com/municipal-financial-assessment
Form: Municipal needs assessment form
CTA: "Get Your Free Municipal ROI Analysis"

Page 2: FSA Corporate Calculator
URL: sovereigndwp.com/employee-financial-stress-calculator  
Form: Employee count and turnover data
CTA: "Calculate Your Financial Stress Costs"

Page 3: FSA Correctional Pilot
URL: sovereigndwp.com/correctional-reentry-pilot
Form: Facility information and reentry goals
CTA: "Request Pilot Program Proposal"
```

### Forms Setup

#### 1. FSA Lead Capture Forms
```
Marketing → Lead Capture → Forms

Form 1: Municipal Financial Assessment
Fields:
- Municipality/County Name*
- Your Title*  
- Population Size (dropdown)
- Annual Budget Range (dropdown)
- Primary Challenge (checkbox multiple)
- Email Address*
- Phone Number

Hidden Fields:
- fsa_business_unit: FSA_Institutional
- fsa_client_type: Municipal
- fsa_lead_source: Website_Lead

Form 2: Corporate Financial Stress Calculator
Fields:
- Company Name*
- Your Title*
- Number of Employees (dropdown)
- Annual Turnover Rate (%)
- Primary Industry (dropdown)
- Email Address*
- Phone Number

Hidden Fields:
- fsa_business_unit: FSA_Institutional  
- fsa_client_type: Corporate_HR
- fsa_lead_source: Website_Lead
```

## Week 3: Dashboard and Views Setup

### Custom Dashboards

#### 1. FSA Performance Dashboard
```
Reports → Dashboards → Create dashboard
Name: "FSA Business Performance"

Widgets to Add:
1. FSA Contacts Created (This Month)
   - Filter: fsa_business_unit = "FSA_Institutional"
   
2. FSA Deals in Pipeline
   - Filter: Pipeline = "FSA Institutional Sales"
   
3. FSA Email Performance
   - Filter: From email contains "sovereigndwp.com"
   
4. FSA Lead Sources
   - Chart: fsa_lead_source breakdown
   
5. FSA Deal Size Distribution
   - Chart: fsa_deal_size_range values

6. FSA Sales Velocity
   - Average days in pipeline for closed won deals
```

### Custom Views

#### 1. Contact Views for FSA
```
Contacts → Views → Create view

View 1: "FSA Municipal Prospects"
Filters:
- fsa_business_unit = "FSA_Institutional"
- fsa_client_type = "Municipal" 
- Lifecycle stage = "Lead" or "Marketing Qualified Lead"

View 2: "FSA Active Opportunities"  
Filters:
- fsa_business_unit = "FSA_Institutional"
- Associated deals > 0
- Deal stage ≠ "Closed Lost"

View 3: "FSA Hot Leads"
Filters:
- fsa_business_unit = "FSA_Institutional"
- HubSpot Score > 75
- Last activity date < 7 days ago
```

## Week 4: Integration Setup

### Calendar Integration

#### 1. Separate Calendly Account
```
Create new Calendly account:
Email: dalia@sovereigndwp.com
URL: calendly.com/dalia-fsa

Meeting Types:
1. "FSA Discovery Call" (30 min)
2. "FSA Needs Assessment" (45 min)  
3. "FSA Program Demo" (60 min)
4. "FSA Proposal Review" (30 min)

Integration:
- Connect to HubSpot
- Auto-create contacts and deals
- Set FSA custom properties on booking
```

### LinkedIn Integration

#### 1. LinkedIn Sales Navigator
```
Account: Use existing or create new with sovereigndwp.com email
Saved Searches:
- "Municipal Decision Makers"
- "Corporate HR Directors" 
- "Correctional Administrators"

LinkedIn Company Page:
- Create "Financial Sovereignty Academy" page
- Connect to dalia@sovereigndwp.com
- Optimize for institutional buyer keywords
```

## Testing Checklist

### Week 5: System Testing

#### 1. Data Separation Verification
```
Tests to Run:
□ Submit FSA form - verify auto-tagging works
□ Send email from dalia@sovereigndwp.com - verify ownership
□ Create FSA deal - verify correct pipeline
□ Check Bitcoin Adviser contacts - ensure no FSA data visible
□ Test team permissions - FSA team sees only FSA data
```

#### 2. Automation Testing
```
Tests to Run:
□ FSA lead scoring workflow triggers correctly
□ Email sequences send from correct address
□ Landing pages capture leads with right properties
□ Dashboard shows FSA data only
□ Calendar bookings create FSA deals
```

#### 3. Email Deliverability Testing
```
Tests to Run:
□ Test dalia@sovereigndwp.com email delivery
□ Check SPF/DKIM records configured
□ Send test emails to Gmail, Outlook, Yahoo
□ Verify email signature displays correctly
□ Test autoresponders work
```

## Go-Live Checklist

### Final Pre-Launch Items
```
□ Domain fully propagated (24-48 hours)
□ All email accounts working
□ HubSpot permissions tested
□ Forms and landing pages live
□ Email templates approved
□ Calendar booking system working
□ Analytics tracking configured
□ Team training completed (if applicable)
```

### Launch Day Tasks
```
□ Send first FSA LinkedIn outreach campaign
□ Publish first FSA blog post
□ Launch first email nurture sequence
□ Share FSA landing pages
□ Monitor for any technical issues
□ Track initial lead generation results
```

This implementation gives you a professional FSA business setup within your existing HubSpot account while maintaining complete separation from your Bitcoin Adviser work. The total additional cost is less than $300/year, but you get enterprise-level marketing and sales automation capabilities.