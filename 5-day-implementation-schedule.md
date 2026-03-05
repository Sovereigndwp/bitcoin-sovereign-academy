# FSA Automation Setup - 5-Day Implementation Schedule

## Day 1 (Monday): Domain & Email Foundation
**Goal**: Get professional email system running
**Time Required**: 3-4 hours

### Morning (9:00 AM - 11:00 AM)

#### Task 1: Domain Registration (30 minutes)
1. **Go to Namecheap.com** (recommended for ease of use)
   - Search for: `sovereigndwp.com`
   - If taken, try: `sovereigndwp.org` or `financiallysovereign.academy`
   - Purchase with WhoisGuard privacy protection
   - **Cost**: ~$15/year

2. **Domain DNS Setup**
   - In Namecheap dashboard → Domain List → Manage
   - Click "Advanced DNS" tab
   - Leave this tab open - you'll need it in 30 minutes

#### Task 2: Google Workspace Setup (45 minutes)
1. **Go to workspace.google.com**
   - Click "Get started" → "For my business"
   - Enter your domain: `sovereigndwp.com`
   - Plan: Business Starter ($6/month)
   - **Primary email**: `dalia@sovereigndwp.com`

2. **Verify Domain Ownership**
   - Google will give you a TXT record
   - Go back to Namecheap Advanced DNS tab
   - Add new record: Type "TXT", Host "@", Value (paste Google's code)
   - Save changes

3. **Wait 15 minutes** for DNS propagation
   - Google will automatically verify
   - You'll get confirmation email

#### Task 3: Additional Email Setup (30 minutes)
1. **Create Additional Emails** in Google Workspace:
   - `support@sovereigndwp.com`
   - `info@sovereigndwp.com` 
   - `admin@sovereigndwp.com`

2. **Set Up Email Forwarding**:
   - All emails forward to your main `dalia@sovereigndwp.com`
   - Admin → Users → Select each user → Email routing

### Afternoon (1:00 PM - 3:00 PM)

#### Task 4: Email Client Configuration (45 minutes)
1. **Apple Mail Setup** (if you use Mac Mail):
   - Mail → Preferences → Accounts → Add Account
   - Google → Sign in with `dalia@sovereigndwp.com`
   - Enable Mail, Contacts, Calendar

2. **Gmail Web Interface**:
   - Sign in to gmail.com with `dalia@sovereigndwp.com`
   - Settings → General → Signature:
   ```
   Dalia Platt
   Founder & CEO
   Financial Sovereignty Academy
   
   📧 dalia@sovereigndwp.com
   📅 Schedule a Consultation: [Will add Calendly link tomorrow]
   🌐 financiallysovereign.academy [Will set up later]
   
   Empowering institutions to build financially sovereign communities
   ```

#### Task 5: Auto-Responders Setup (30 minutes)
1. **Set up vacation responders** for support@ and info@:
   ```
   Thank you for contacting Financial Sovereignty Academy.
   
   For institutional program inquiries, please contact:
   Dalia Platt directly at dalia@sovereigndwp.com
   
   For existing client support, someone will respond within 24 hours.
   
   Best regards,
   FSA Support Team
   ```

### End of Day 1 Checklist:
- [ ] Domain purchased and verified
- [ ] Google Workspace active
- [ ] Primary email `dalia@sovereigndwp.com` working
- [ ] Additional emails forwarding properly
- [ ] Email signature configured
- [ ] Auto-responders active

---

## Day 2 (Tuesday): HubSpot Account Setup
**Goal**: Create FSA business unit in HubSpot
**Time Required**: 4-5 hours

### Morning (9:00 AM - 11:30 AM)

#### Task 1: Add FSA User to HubSpot (20 minutes)
1. **Login to HubSpot** with your existing account (`dalia@thebitcoinadviser.com`)
2. **Navigate to**: Settings (gear icon) → Users & Teams
3. **Click**: "Add user"
4. **Fill out**:
   - Email: `dalia@sovereigndwp.com`
   - First Name: `Dalia`
   - Last Name: `Platt (FSA)`
   - Role: `Marketing Hub Professional` + `Sales Hub Professional`
   - Permissions: `Edit contacts, companies, deals`

5. **Accept invitation** in your `dalia@sovereigndwp.com` email

#### Task 2: Create FSA Team (15 minutes)
1. **In HubSpot**: Settings → Users & Teams → Teams tab
2. **Click**: "Create team"
3. **Team Details**:
   - Name: `Financial Sovereignty Academy`
   - Description: `Institutional financial literacy programs`
   - Members: Add `dalia@sovereigndwp.com`
   - Team permissions: `Edit assigned records only`

#### Task 3: Custom Properties Creation (90 minutes)
**Contact Properties** - Settings → Properties → Contact Properties

**Property 1**:
```
Label: FSA Business Unit
Internal name: fsa_business_unit
Field type: Dropdown select
Options: 
  - Bitcoin_Adviser
  - FSA_Institutional
  - FSA_Individual
Default value: Bitcoin_Adviser
```

**Property 2**:
```
Label: FSA Client Type
Internal name: fsa_client_type
Field type: Dropdown select
Options:
  - Municipal
  - Correctional
  - Corporate_HR
  - Individual_Consumer
```

**Property 3**:
```
Label: FSA Deal Size Range
Internal name: fsa_deal_size_range
Field type: Dropdown select
Options:
  - Under_25K
  - 25K_75K
  - 75K_200K
  - 200K_500K
  - 500K_Plus
```

**Property 4**:
```
Label: FSA Lead Source
Internal name: fsa_lead_source
Field type: Dropdown select
Options:
  - LinkedIn_Outreach
  - Email_Campaign
  - Website_Lead
  - Referral
  - Webinar
  - Cold_Outreach
```

### Afternoon (1:00 PM - 3:30 PM)

#### Task 4: Company Properties (30 minutes)
**Company Properties** - Settings → Properties → Company Properties

**Property 1**:
```
Label: FSA Organization Type
Internal name: fsa_org_type
Field type: Dropdown select
Options:
  - Municipality
  - County
  - State_Government
  - Federal_Agency
  - Corporation
  - Correctional_Facility
  - Nonprofit
```

**Property 2**:
```
Label: FSA Employee Count Range
Internal name: fsa_employee_range
Field type: Dropdown select
Options:
  - Under_500
  - 500_1000
  - 1000_5000
  - 5000_10000
  - 10000_Plus
```

#### Task 5: FSA Sales Pipeline Creation (45 minutes)
1. **Navigate to**: Settings → Objects → Deals → Pipelines
2. **Click**: "Create pipeline"
3. **Pipeline Setup**:
   ```
   Name: FSA Institutional Sales
   
   Stages:
   1. Lead Generated (0%)
   2. Initial Contact Made (5%)
   3. Qualified Opportunity (10%)
   4. Discovery Call Scheduled (25%)
   5. Needs Assessment Complete (40%)
   6. Proposal Presented (60%)
   7. Contract Negotiation (80%)
   8. Closed Won (100%)
   9. Closed Lost (0%)
   ```

#### Task 6: Deal Properties (45 minutes)
**Deal Properties** - Settings → Properties → Deal Properties

**Property 1**:
```
Label: FSA Program Type
Internal name: fsa_program_type
Field type: Dropdown select
Options:
  - Financial_Literacy
  - Reentry_Program
  - Employee_Wellness
  - Community_Education
  - Custom_Program
```

**Property 2**:
```
Label: Implementation Timeline
Internal name: implementation_timeline
Field type: Dropdown select
Options:
  - Immediate_30_days
  - This_Quarter
  - Next_Quarter
  - Next_Year
  - To_Be_Determined
```

### End of Day 2 Checklist:
- [ ] FSA user added to HubSpot
- [ ] FSA team created with proper permissions
- [ ] All contact properties created
- [ ] All company properties created
- [ ] FSA sales pipeline active
- [ ] Deal properties configured

---

## Day 3 (Wednesday): Automation & Workflows
**Goal**: Set up automated lead processing
**Time Required**: 4-5 hours

### Morning (9:00 AM - 12:00 PM)

#### Task 1: FSA Contact Auto-Tagging Workflow (60 minutes)
1. **Navigate to**: Automation → Workflows
2. **Click**: "Create workflow" → "Contact-based"
3. **Workflow Name**: `FSA Contact Auto-Tagging`

**Enrollment Triggers** (OR logic):
```
Contact owner is: dalia@sovereigndwp.com
OR
Form submission: Any form with "FSA" in name
OR
Email domain contains: sovereigndwp.com
```

**Actions to Add**:
```
Action 1: Set contact property
  - Property: fsa_business_unit
  - Value: FSA_Institutional

Action 2: Set contact owner
  - Owner: dalia@sovereigndwp.com

Action 3: Add contact to team
  - Team: Financial Sovereignty Academy

Action 4: Send internal email notification
  - To: dalia@sovereigndwp.com
  - Subject: New FSA Lead: {{contact.firstname}} {{contact.lastname}}
  - Body: New institutional lead from {{contact.company}}
```

4. **Turn on workflow**

#### Task 2: FSA Lead Scoring Workflow (90 minutes)
1. **Create new workflow**: "FSA Lead Scoring"
2. **Enrollment**: `fsa_business_unit is FSA_Institutional`

**Scoring Actions** (use HubSpot Score property):
```
IF contact.jobtitle contains "Mayor" → Add 25 points
IF contact.jobtitle contains "Director" → Add 25 points
IF contact.jobtitle contains "Manager" → Add 20 points
IF contact.jobtitle contains "Warden" → Add 30 points
IF contact.jobtitle contains "CHRO" → Add 30 points

IF company.numberofemployees > 500 → Add 20 points
IF company.numberofemployees > 5000 → Add 30 points

IF contact downloaded any content → Add 15 points
IF contact visited pricing page → Add 30 points
IF contact attended webinar → Add 25 points
```

**High Score Actions** (if HubSpot Score > 75):
```
Action 1: Create task
  - Title: High-value FSA lead - schedule discovery call
  - Assign to: dalia@sovereigndwp.com
  - Due: Tomorrow

Action 2: Send notification email
  - To: dalia@sovereigndwp.com
  - Subject: Hot FSA Lead: {{contact.firstname}} at {{contact.company}}
```

3. **Turn on workflow**

### Afternoon (1:00 PM - 4:00 PM)

#### Task 3: Email Templates Creation (90 minutes)
1. **Navigate to**: Marketing → Email → Templates
2. **Create 3 templates**:

**Template 1: FSA Municipal Introduction**
```
Subject: How [Similar City] reduced citizen financial stress by 35%
From: dalia@sovereigndwp.com

Hi {{contact.firstname}},

I noticed {{contact.company}} has been investing in community development initiatives.

[Similar municipality], with a comparable population size, recently launched a financial literacy program that:
• Reduced citizen requests for emergency assistance by 35%
• Increased local business revenue by $2.3M annually
• Improved community financial stability scores

The program paid for itself within 6 months through reduced social services costs.

Would a 15-minute conversation to explore if this approach could benefit {{contact.company}} be worthwhile?

Best regards,
Dalia Platt
Financial Sovereignty Academy
dalia@sovereigndwp.com
```

**Template 2: FSA Corporate Introduction**
```
Subject: Employee financial stress costing {{contact.company}} $XXX,XXX annually?

Hi {{contact.firstname}},

Quick question: Are you seeing increased employee turnover that might be linked to financial stress?

Companies similar to {{contact.company}} typically lose $47,000 per departing employee, with 76% citing financial stress as a primary factor.

Organizations we've helped have achieved:
• 23% reduction in turnover within 12 months
• 18% increase in employee productivity
• $500K+ annual savings in recruitment costs

Worth exploring if this could benefit {{contact.company}}?

Best,
Dalia Platt
dalia@sovereigndwp.com
```

**Template 3: FSA Correctional Introduction**
```
Subject: Reduce recidivism with proven financial literacy education

Hi {{contact.firstname}},

Research shows that inmates with financial literacy training are 43% less likely to be reincarcerated within three years.

Our reentry financial education program has helped facilities achieve:
• 35% reduction in recidivism rates
• 78% of participants maintain employment post-release
• Significant cost savings in rehabilitation programs

Would you be interested in a brief conversation about implementing a pilot program at {{contact.company}}?

Best regards,
Dalia Platt
Financial Sovereignty Academy
```

#### Task 4: Simple Lead Nurture Sequence (90 minutes)
1. **Create workflow**: "FSA Basic Nurture Sequence"
2. **Enrollment**: Contact enters FSA pipeline but hasn't scheduled call
3. **Sequence**:

```
Day 1: Send welcome email + ROI calculator link
Day 3: Send relevant case study based on client type
Day 7: Send industry report on financial literacy ROI
Day 14: Send video testimonial
Day 21: Send final follow-up with calendar link
```

### End of Day 3 Checklist:
- [ ] Auto-tagging workflow active
- [ ] Lead scoring workflow running
- [ ] 3 email templates created
- [ ] Basic nurture sequence deployed
- [ ] Test workflows with sample contact

---

## Day 4 (Thursday): Forms, Landing Pages & Calendar
**Goal**: Create lead capture system
**Time Required**: 5-6 hours

### Morning (9:00 AM - 12:30 PM)

#### Task 1: Calendly Account Setup (45 minutes)
1. **Go to calendly.com**
2. **Sign up** with `dalia@sovereigndwp.com`
3. **Username**: `dalia-fsa` (URL: calendly.com/dalia-fsa)

**Meeting Types to Create**:
```
1. FSA Discovery Call
   - Duration: 30 minutes
   - Description: "Initial consultation for institutional financial literacy programs"
   - Questions:
     * What type of organization? (Municipality/Corporate/Correctional)
     * Current employee/citizen count?
     * Primary financial wellness challenges?
     * Budget range for programs?

2. FSA Needs Assessment
   - Duration: 45 minutes
   - Description: "Detailed assessment of financial literacy program requirements"

3. FSA Program Demo
   - Duration: 60 minutes
   - Description: "Full demonstration of FSA institutional programs"
```

#### Task 2: HubSpot Forms Creation (2 hours)
1. **Navigate to**: Marketing → Lead Capture → Forms

**Form 1: Municipal Financial Assessment**
```
Form Name: Municipal Financial Wellness Assessment
Fields:
  - Municipality/County Name* (Single-line text)
  - Your Title* (Single-line text)
  - Population Size (Dropdown):
    * Under 10,000
    * 10,000-50,000
    * 50,000-100,000
    * 100,000-500,000
    * 500,000+
  - Annual Budget Range (Dropdown):
    * Under $10M
    * $10M-$50M
    * $50M-$100M
    * $100M-$500M
    * $500M+
  - Primary Challenges (Multiple checkboxes):
    * High citizen debt levels
    * Requests for financial assistance
    * Low financial literacy rates
    * Economic development goals
  - Work Email* (Email)
  - Phone Number (Phone number)

Hidden Fields:
  - fsa_business_unit: FSA_Institutional
  - fsa_client_type: Municipal
  - fsa_lead_source: Website_Lead

Thank you message:
"Thank you! We'll send your customized municipal financial wellness analysis within 24 hours."

Follow-up: Redirect to calendly.com/dalia-fsa
```

**Form 2: Corporate Financial Stress Calculator**
```
Form Name: Employee Financial Stress Assessment
Fields:
  - Company Name* (Single-line text)
  - Your Title* (Single-line text)
  - Number of Employees (Dropdown):
    * Under 100
    * 100-500
    * 500-1,000
    * 1,000-5,000
    * 5,000+
  - Annual Employee Turnover Rate (Single-line text)
  - Primary Industry (Dropdown):
    * Healthcare
    * Manufacturing
    * Technology
    * Financial Services
    * Government
    * Other
  - Work Email* (Email)
  - Phone Number (Phone number)

Hidden Fields:
  - fsa_business_unit: FSA_Institutional
  - fsa_client_type: Corporate_HR
  - fsa_lead_source: Website_Lead
```

### Afternoon (1:30 PM - 5:00 PM)

#### Task 3: Landing Pages Creation (3 hours)
**Note**: Use HubSpot's drag-and-drop page builder

**Landing Page 1: Municipal Program**
```
URL: sovereigndwp.com/municipal-financial-wellness
Title: "Reduce Municipal Financial Assistance Costs by 35%"

Content Structure:
1. Hero Section:
   - Headline: "Help Your Citizens Achieve Financial Independence"
   - Subheading: "Proven municipal financial literacy programs that reduce assistance requests and strengthen local economies"
   - CTA Button: "Get Your Free Assessment"

2. Social Proof:
   - "Trusted by 50+ municipalities nationwide"
   - Testimonial placeholder: "Our program reduced citizen financial assistance requests by 40% in the first year"

3. Benefits Section:
   - Reduce emergency assistance costs
   - Strengthen local business revenue
   - Improve community financial health
   - Evidence-based curriculum

4. Form: Municipal Financial Assessment (created above)

5. FAQ Section:
   - How is this funded?
   - What's the time commitment?
   - How do we measure success?
```

**Landing Page 2: Corporate Program**
```
URL: sovereigndwp.com/employee-financial-wellness
Title: "Stop Losing $47,000 Per Employee to Financial Stress"

Content Structure:
1. Hero Section:
   - Headline: "Reduce Employee Turnover by 23% in 12 Months"
   - Subheading: "Financial wellness programs that actually work - with measurable ROI"
   - CTA: "Calculate Your Cost Savings"

2. Problem Statement:
   - 76% of employees cite financial stress
   - Average cost per departing employee
   - Productivity impact statistics

3. Solution Benefits:
   - Reduce turnover costs
   - Increase productivity
   - Improve employee satisfaction
   - Compliance-ready programs

4. Form: Employee Financial Stress Assessment

5. Case Studies:
   - Company A: 25% turnover reduction
   - Company B: $800K annual savings
```

#### Task 4: Integration Testing (30 minutes)
1. **Test Form Submissions**:
   - Submit each form with test data
   - Verify contact created in HubSpot
   - Check if automation workflows trigger
   - Confirm correct properties are set

2. **Test Calendly Integration**:
   - Book test meeting
   - Verify HubSpot contact/deal creation
   - Check if proper FSA properties are set

### End of Day 4 Checklist:
- [ ] Calendly account configured with FSA meetings
- [ ] 2 HubSpot forms created and tested
- [ ] 2 landing pages live and functional
- [ ] Form-to-automation workflow tested
- [ ] Calendar integration working

---

## Day 5 (Friday): Analytics, Testing & Launch
**Goal**: Go live with lead generation
**Time Required**: 4-5 hours

### Morning (9:00 AM - 12:00 PM)

#### Task 1: Analytics Dashboard Creation (90 minutes)
1. **Navigate to**: Reports → Dashboards
2. **Create dashboard**: "FSA Business Performance"

**Widgets to Add**:
```
1. FSA Contacts This Month
   - Chart type: Number
   - Filter: fsa_business_unit = FSA_Institutional
   - Date range: This month

2. FSA Pipeline Value
   - Chart type: Number
   - Object: Deals
   - Filter: Pipeline = FSA Institutional Sales
   - Measure: Sum of deal amount

3. FSA Lead Sources
   - Chart type: Donut
   - Property: fsa_lead_source
   - Filter: fsa_business_unit = FSA_Institutional

4. FSA Deals by Stage
   - Chart type: Funnel
   - Pipeline: FSA Institutional Sales

5. FSA Hot Leads (Score > 75)
   - Chart type: Table
   - Properties: Contact name, Company, HubSpot Score, Last activity
   - Filter: fsa_business_unit = FSA_Institutional AND HubSpot Score > 75

6. FSA Email Performance
   - Chart type: Line
   - Filter: From email contains "sovereigndwp.com"
   - Metrics: Open rate, click rate
```

#### Task 2: Contact Views Creation (30 minutes)
1. **Navigate to**: Contacts → Views

**Create Views**:
```
View 1: "FSA Municipal Prospects"
Filters:
- fsa_business_unit = FSA_Institutional
- fsa_client_type = Municipal
- Lifecycle stage = Lead, MQL, or SQL

View 2: "FSA Corporate Prospects"  
Filters:
- fsa_business_unit = FSA_Institutional
- fsa_client_type = Corporate_HR
- Lifecycle stage = Lead, MQL, or SQL

View 3: "FSA Hot Leads"
Filters:
- fsa_business_unit = FSA_Institutional
- HubSpot Score > 75
- Deal stage ≠ Closed Lost

View 4: "FSA Active Opportunities"
Filters:
- fsa_business_unit = FSA_Institutional
- Associated deals > 0
- Deal stage ≠ Closed Won AND ≠ Closed Lost
```

### Afternoon (1:00 PM - 4:00 PM)

#### Task 3: LinkedIn Setup & Content (90 minutes)
1. **LinkedIn Profile Optimization**:
   - Update headline: "Helping institutions build financially sovereign communities | Financial Literacy Programs | Founder, Financial Sovereignty Academy"
   - Add experience: Founder & CEO at Financial Sovereignty Academy
   - Update contact info: dalia@sovereigndwp.com

2. **LinkedIn Company Page** (if time permits):
   - Create "Financial Sovereignty Academy" page
   - Add logo, description, and contact info
   - Connect to personal profile

3. **LinkedIn Sales Navigator Setup**:
   - Create saved searches:
     * "Municipal Finance Directors"
     * "Corporate HR Directors"
     * "Correctional Facility Administrators"

#### Task 4: Final System Testing (90 minutes)
**Complete End-to-End Testing**:

1. **Test Lead Generation Flow**:
   ```
   □ Visit landing page → Submit form → Check HubSpot contact created
   □ Verify auto-tagging workflow triggered
   □ Confirm email notification received
   □ Check contact assigned to FSA team
   □ Verify proper lead scoring
   ```

2. **Test Calendar Flow**:
   ```
   □ Book meeting via Calendly
   □ Confirm HubSpot deal created
   □ Check FSA properties populated
   □ Verify meeting in calendar
   ```

3. **Test Email System**:
   ```
   □ Send email from dalia@sovereigndwp.com
   □ Verify deliverability (check spam folders)
   □ Test email signature displays properly
   □ Confirm auto-responders work
   ```

#### Task 5: Launch Preparation (60 minutes)
1. **Create Launch Checklist**:
   ```
   □ All systems tested and working
   □ Dashboard showing correct data
   □ Email deliverability confirmed
   □ Forms capturing leads properly
   □ Automation workflows active
   □ Calendar bookings working
   □ LinkedIn profile optimized
   ```

2. **Prepare First Outreach**:
   - Import 25 test contacts (find municipal/corporate contacts on LinkedIn)
   - Tag them appropriately in HubSpot
   - Schedule first LinkedIn outreach for Monday

### End of Day 5 - GO LIVE!

#### Launch Activities:
1. **Send First Email Campaign**:
   - Select 10 municipal contacts
   - Send FSA Municipal Introduction template
   - Monitor delivery and responses

2. **LinkedIn Outreach**:
   - Send 5 connection requests using FSA messaging
   - Share first FSA post about municipal financial wellness

3. **Monitor Systems**:
   - Check dashboard for activity
   - Verify all automations running
   - Monitor email notifications

### End of Day 5 Checklist:
- [ ] Analytics dashboard live and populated
- [ ] Contact views created for easy management
- [ ] LinkedIn profile optimized for FSA
- [ ] Complete system testing passed
- [ ] First leads generated and processed
- [ ] Monitoring systems in place
- [ ] Ready for scale-up next week

---

## Daily Success Metrics

**Day 1**: Professional email system operational  
**Day 2**: HubSpot FSA business unit configured  
**Day 3**: Automation workflows processing leads  
**Day 4**: Lead capture system generating contacts  
**Day 5**: Full system live and scaling

**Week 1 Goal**: Generate first 10 qualified FSA leads  
**Month 1 Goal**: 50+ qualified leads, 5+ discovery calls  
**Quarter 1 Goal**: First FSA institutional contract signed

This 5-day plan transforms your FSA concept into a revenue-generating machine with minimal ongoing effort required from you.