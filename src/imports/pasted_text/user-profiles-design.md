Add these user profiles

Design the system with multiple role-based profiles and dashboards:

1. Citizen / Client Profile

Can:
	•	register complaint
	•	track own complaints
	•	view status, timeline, SLA countdown
	•	receive updates
	•	reopen complaint
	•	rate service

Can see:
	•	only their own complaints
	•	complaint history
	•	assigned department
	•	latest progress

⸻

2. Call Center / Complaint Intake Officer

Can:
	•	create complaint on behalf of citizen
	•	edit basic complaint details before assignment
	•	validate complaint
	•	attach notes and documents

Can see:
	•	all newly submitted complaints
	•	citizen details
	•	complaint source
	•	duplicate complaint suggestions

⸻

3. Support Agent / Case Officer

Can:
	•	work on assigned complaints
	•	update status
	•	add progress notes
	•	upload evidence
	•	resolve case
	•	request more info

Can see:
	•	assigned complaints
	•	citizen details relevant to case
	•	previous updates
	•	AI suggestions
	•	SLA timer

⸻

4. Field Engineer / Inspector

Can:
	•	receive field tasks
	•	update from mobile app
	•	upload images/videos
	•	geo-tag visit
	•	mark field action completed

Can see:
	•	assigned field complaints
	•	citizen location / site info
	•	case notes needed for visit
	•	history relevant to field execution

⸻

5. Supervisor / Team Lead

Can:
	•	view team workload
	•	reassign complaints
	•	escalate complaints
	•	monitor SLA risk
	•	approve closure in selected cases

Can see:
	•	all complaints of their team/department
	•	agent performance
	•	escalation history
	•	SLA compliance
	•	pending approvals

⸻

6. Department Head / Manager

Can:
	•	monitor department performance
	•	approve high-priority closures
	•	reallocate resources
	•	review overdue cases

Can see:
	•	all complaints in department
	•	team dashboards
	•	regional/category trends
	•	breach analysis
	•	citizen satisfaction summary

⸻

7. Executive / National Command Center Profile

Can:
	•	monitor national/statewide performance
	•	view ministry/department KPIs
	•	compare regions
	•	see critical alerts
	•	monitor public service efficiency

Can see:
	•	all departments
	•	all complaint categories
	•	province/city heatmaps
	•	open vs closed trends
	•	SLA and performance metrics

⸻

8. Audit / Compliance Profile

Can:
	•	review full complaint trail
	•	inspect status changes
	•	verify closure path
	•	monitor breach logs
	•	generate compliance reports

Can see:
	•	complete action history
	•	user activity logs
	•	timestamps
	•	approval path
	•	secure audit records

⸻

9. System Admin Profile

Can:
	•	create/manage users
	•	define roles
	•	configure workflow
	•	configure SLA rules
	•	configure departments and permissions
	•	manage demo/live environments

Can see:
	•	all system settings
	•	all user roles
	•	system usage metrics
	•	integration settings

⸻

ROLE-BASED ACCESS & CROSS-PROFILE VISIBILITY

Build a role-based access control structure where one profile can view another profile’s information based on permissions.

Visibility rules to include
	•	Citizen sees only own complaint records
	•	Agent sees citizen complaint details relevant to assigned case
	•	Supervisor sees all agents’ complaints in their team
	•	Department Head sees all supervisors/agents in department
	•	Executive sees summarized information from all departments
	•	Audit profile sees complete history across profiles
	•	Admin sees all profiles, permissions, and environment settings

Add “Profile Relationship View”

Create a feature where authorized users can open a complaint and see:
	•	Citizen profile summary
	•	assigned officer profile
	•	supervisor profile
	•	department profile
	•	action ownership history

Add “View As” / “Switch Role” in Demo mode only

For demo purposes, allow an admin/demo user to:
	•	switch between Citizen, Agent, Supervisor, Executive, Audit, Admin
	•	preview how each dashboard looks
	•	test access levels visually

Do not enable unrestricted role switching in Live mode.

⸻

DEMO MODE AND LIVE MODE

Add two system environments / modes:

1. Demo Mode

Purpose:
	•	presentations
	•	pilot demos
	•	investor meetings
	•	training

Features:
	•	sample data
	•	dummy users
	•	simulated notifications
	•	simulated AI recommendations
	•	role switching
	•	pre-filled complaint records
	•	interactive charts with demo numbers
	•	watermark or badge: “Demo Environment”

Include:
	•	toggle at top right: Demo | Live
	•	banner color difference for demo mode
	•	sample ministries / departments / complaint types

⸻

2. Live Mode

Purpose:
	•	production usage
	•	real citizen complaints
	•	actual workflow
	•	operational dashboards

Features:
	•	real-time complaint data
	•	actual role-based permissions
	•	real notifications
	•	real SLA tracking
	•	no unrestricted role switching
	•	secure audit logs
	•	production-safe actions

Include:
	•	badge: “Live Environment”
	•	stronger security feel
	•	confirmation prompts before key actions
	•	restricted access by role

⸻

UI FEATURES TO ADD

Top Navigation

Add:
	•	environment toggle: Demo / Live
	•	current role display
	•	profile switcher
	•	notifications
	•	language toggle
	•	department selector for authorized roles

User Profile Cards

For each complaint, show connected profiles:
	•	citizen
	•	assigned officer
	•	supervisor
	•	department

Allow authorized roles to click and view summary cards.

Role Access Matrix Screen

Create an admin screen showing:
	•	roles
	•	permissions
	•	visibility scope
	•	environment access
	•	module access

⸻

DASHBOARD ENHANCEMENTS

Citizen Dashboard
	•	own complaint summary
	•	service updates
	•	assigned department
	•	support officer info

Agent Dashboard
	•	assigned complaints
	•	citizen summaries
	•	supervisor visibility
	•	workload and SLA queue

Supervisor Dashboard
	•	team members list
	•	team complaint board
	•	agent-by-agent performance
	•	escalation map

Executive Dashboard
	•	department comparison
	•	regional trends
	•	ministry performance
	•	critical complaint command view

Admin Dashboard
	•	environment management
	•	user/role control
	•	system health
	•	demo dataset controls

⸻

DESIGN REQUIREMENTS

Use a Pakistan National Complaint Center color scheme:
	•	Deep Green
	•	White
	•	official government layout
	•	clean tables
	•	command-center style dashboards

Add:
	•	Demo badge in amber/orange
	•	Live badge in green
	•	clear role labels on each dashboard
	•	secure and official visual feel

⸻

FINAL OUTPUT EXPECTATION

Generate a complete system with:
	•	multiple user profiles
	•	role-based dashboards
	•	cross-profile visibility by permission
	•	complaint ownership chain
	•	demo mode
	•	live mode
	•	admin role switching for demo
	•	environment labels and toggles
	•	production-style UI for government complaint management

⸻

SHORT ADD-ON VERSION

If you want a smaller add-on prompt, use this:

Add role-based profiles including Citizen, Call Center Officer, Agent, Field Engineer, Supervisor, Department Head, Executive, Audit, and Admin. Authorized profiles should be able to view related profiles’ information through role-based permissions. Add Demo and Live environments, with Demo allowing sample data and role switching, and Live using real permissions and real workflow. Show an environment toggle, current role, connected profile summaries, and an admin access matrix.

If you want, I can now merge all of this into one final master prompt for either Caffeine or Figma Make.