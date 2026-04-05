// Mock Data Store - Simulates backend data

import { Ticket, User, Notification, Comment, KPIMetrics, TeamPerformance } from '../types';
import { SLAEngine } from '../services/sla-engine';
import { AIService } from '../services/ai-service';

// ──────────────────────────────────────────────
// DEMO USERS (Quick-login, password: demo123)
// ──────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'U001', name: 'Ahmed Khan', email: 'ahmed@citizen.pk', role: 'Citizen', department: null },
  { id: 'U002', name: 'Fatima Ali', email: 'fatima@citizen.pk', role: 'Citizen', department: null },
  { id: 'U003', name: 'Saira Malik', email: 'saira@pda.gov.pk', role: 'Call Center Officer', department: 'Intake' },
  { id: 'U004', name: 'Hassan Raza', email: 'hassan@pda.gov.pk', role: 'Support Agent', department: 'Technical Support' },
  { id: 'U005', name: 'Ayesha Siddiqui', email: 'ayesha@pda.gov.pk', role: 'Support Agent', department: 'Billing' },
  { id: 'U006', name: 'Usman Tariq', email: 'usman@pda.gov.pk', role: 'Field Engineer', department: 'Field Operations' },
  { id: 'U007', name: 'Zainab Hussain', email: 'zainab@pda.gov.pk', role: 'Supervisor', department: 'Technical Support' },
  { id: 'U008', name: 'Ali Akbar', email: 'ali@pda.gov.pk', role: 'Supervisor', department: 'Billing' },
  { id: 'U009', name: 'Dr. Imran Sheikh', email: 'imran@pda.gov.pk', role: 'Department Head', department: 'Operations' },
  { id: 'U010', name: 'Syed Farhan Ahmad', email: 'farhan@pda.gov.pk', role: 'Executive', department: 'National Command Center' },
  { id: 'U011', name: 'Maryam Noor', email: 'maryam@pda.gov.pk', role: 'Auditor', department: 'Compliance' },
  { id: 'U012', name: 'Kamran Shahid', email: 'kamran@pda.gov.pk', role: 'System Admin', department: 'IT' },
];

// ──────────────────────────────────────────────
// LIVE USERS (specific passwords for Live mode)
// ──────────────────────────────────────────────
export const liveUsers: User[] = [
  { id: 'LU001', name: 'Zara Hussain',     email: 'ctlive@gov.pk',  role: 'Citizen',             department: null },
  { id: 'LU002', name: 'Omar Sheikh',       email: 'ccolive@gov.pk', role: 'Call Center Officer', department: 'Intake' },
  { id: 'LU003', name: 'Nadia Qureshi',     email: 'salive@gov.pk',  role: 'Support Agent',       department: 'Technical Support' },
  { id: 'LU004', name: 'Tariq Mahmood',     email: 'felive@gov.pk',  role: 'Field Engineer',      department: 'Field Operations' },
  { id: 'LU005', name: 'Hina Baig',         email: 'suplive@gov.pk', role: 'Supervisor',          department: 'Technical Support' },
  { id: 'LU006', name: 'Asad Mirza',        email: 'dhlive@gov.pk',  role: 'Department Head',     department: 'Operations' },
  { id: 'LU007', name: 'Farrukh Javed',     email: 'exelive@gov.pk', role: 'Executive',           department: 'National Command Center' },
  { id: 'LU008', name: 'Rabia Chaudhry',    email: 'audlive@gov.pk', role: 'Auditor',             department: 'Compliance' },
  { id: 'LU009', name: 'Sohail Afridi',     email: 'adlive@gov.pk',  role: 'System Admin',        department: 'IT' },
];

// Live user credentials (email → password)
export const liveCredentials: Record<string, string> = {
  'ctlive@gov.pk':  'ct12345',
  'ccolive@gov.pk': 'cco12345',
  'salive@gov.pk':  'sa12345',
  'felive@gov.pk':  'fe12345',
  'suplive@gov.pk': 'sup12345',
  'dhlive@gov.pk':  'dh12345',
  'exelive@gov.pk': 'exe12345',
  'audlive@gov.pk': 'aud12345',
  'adlive@gov.pk':  'ad12345',
};

// All users combined
export const allUsers: User[] = [...mockUsers, ...liveUsers];

// Departments
export const mockDepartments = [
  { id: 'D001', name: 'Technical Support', category: 'Technical' },
  { id: 'D002', name: 'Billing', category: 'Financial' },
  { id: 'D003', name: 'Field Operations', category: 'Operational' },
  { id: 'D004', name: 'Customer Service', category: 'Service' },
  { id: 'D005', name: 'Infrastructure', category: 'Technical' },
];

// ──────────────────────────────────────────────
// DEMO TICKETS
// ──────────────────────────────────────────────
function generateMockTickets(): Ticket[] {
  const tickets: Ticket[] = [];

  const ticketData = [
    {
      title: 'Road Repair Needed - Main Boulevard',
      description: 'Large pothole causing traffic issues on Main Boulevard near Gulberg intersection.',
      category: 'Infrastructure' as const,
      priority: 'High' as const,
      status: 'In Progress' as const,
      createdBy: mockUsers[0],
      assignedTo: mockUsers[3],
      department: 'Field Operations',
      hoursAgo: 2,
    },
    {
      title: 'Electricity Bill Overcharge',
      description: 'I was charged incorrect amount this month. Bill shows 50,000 units which is impossible.',
      category: 'Billing' as const,
      priority: 'Critical' as const,
      status: 'Escalated' as const,
      createdBy: mockUsers[1],
      assignedTo: mockUsers[4],
      department: 'Billing',
      hoursAgo: 6,
      escalatedHoursAgo: 3,
      escalatedBy: mockUsers[4],
      escalatedTo: mockUsers[7],
      escalationReason: 'Recurring billing error not resolved within SLA. Citizen has been incorrectly charged for 3 consecutive months. Immediate supervisor review required.',
      escalationLevel: 1,
    },
    {
      title: 'Water Supply Disruption',
      description: 'No water supply in Block B, DHA for the past 3 days.',
      category: 'Service Request' as const,
      priority: 'Critical' as const,
      status: 'Assigned' as const,
      createdBy: mockUsers[0],
      assignedTo: mockUsers[5],
      department: 'Field Operations',
      hoursAgo: 4,
    },
    {
      title: 'Street Light Not Working',
      description: 'Street light near Park has been out for 2 weeks creating safety concerns.',
      category: 'Infrastructure' as const,
      priority: 'Medium' as const,
      status: 'New' as const,
      createdBy: mockUsers[1],
      department: 'Field Operations',
      hoursAgo: 1,
    },
    {
      title: 'Document Verification Delay',
      description: 'Applied for document verification 15 days ago but no update yet.',
      category: 'General Inquiry' as const,
      priority: 'High' as const,
      status: 'In Progress' as const,
      createdBy: mockUsers[0],
      assignedTo: mockUsers[3],
      department: 'Customer Service',
      hoursAgo: 8,
    },
    {
      title: 'Gas Leakage Reported',
      description: 'Strong gas smell in residential area. Emergency attention needed.',
      category: 'Service Request' as const,
      priority: 'Critical' as const,
      status: 'Resolved' as const,
      createdBy: mockUsers[1],
      assignedTo: mockUsers[5],
      department: 'Field Operations',
      hoursAgo: 48,
    },
    {
      title: 'Online Portal Access Issue',
      description: 'Cannot access citizen portal. Getting error message.',
      category: 'Technical Issue' as const,
      priority: 'Low' as const,
      status: 'Auto-Resolved' as const,
      createdBy: mockUsers[0],
      hoursAgo: 24,
      isAIResolved: true,
    },
    {
      title: 'Trash Collection Missed',
      description: 'Garbage truck did not come this week in our street.',
      category: 'Service Request' as const,
      priority: 'Medium' as const,
      status: 'Closed' as const,
      createdBy: mockUsers[1],
      assignedTo: mockUsers[5],
      department: 'Field Operations',
      hoursAgo: 72,
    },
    {
      title: 'Building Permission Status',
      description: 'Need to check status of building permission application submitted last month.',
      category: 'General Inquiry' as const,
      priority: 'Low' as const,
      status: 'Auto-Resolved' as const,
      createdBy: mockUsers[0],
      hoursAgo: 12,
      isAIResolved: true,
    },
    {
      title: 'Tax Assessment Correction',
      description: 'Property tax assessment seems incorrect. Need review.',
      category: 'Billing' as const,
      priority: 'Medium' as const,
      status: 'Assigned' as const,
      createdBy: mockUsers[1],
      assignedTo: mockUsers[4],
      department: 'Billing',
      hoursAgo: 10,
    },
    {
      title: 'Traffic Signal Malfunction',
      description: 'Traffic light at Shahrah-e-Faisal junction not working properly.',
      category: 'Infrastructure' as const,
      priority: 'High' as const,
      status: 'In Progress' as const,
      createdBy: mockUsers[0],
      assignedTo: mockUsers[5],
      department: 'Field Operations',
      hoursAgo: 5,
    },
    {
      title: 'Birth Certificate Issuance',
      description: 'How to apply for birth certificate online?',
      category: 'General Inquiry' as const,
      priority: 'Low' as const,
      status: 'Auto-Resolved' as const,
      createdBy: mockUsers[1],
      hoursAgo: 16,
      isAIResolved: true,
    },
  ];

  ticketData.forEach((data, index) => {
    const createdAt = new Date(Date.now() - data.hoursAgo * 60 * 60 * 1000);
    const updatedAt = new Date(Date.now() - (data.hoursAgo - 0.5) * 60 * 60 * 1000);
    const slaDeadline = SLAEngine.getSLADeadline(createdAt, data.priority);
    const slaStatus = SLAEngine.calculateSLAStatus(createdAt, data.priority);

    const d = data as any;
    const ticket: Ticket = {
      id: `TCK-${String(index + 1).padStart(4, '0')}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status,
      createdBy: data.createdBy,
      assignedTo: data.assignedTo,
      department: data.department,
      createdAt,
      updatedAt,
      slaDeadline,
      slaStatus,
      attachments: [],
      tags: [data.category.replace(' ', '-').toLowerCase()],
      isAIResolved: data.isAIResolved,
      resolvedAt: data.status === 'Resolved' || data.status === 'Closed' ? updatedAt : undefined,
      closedAt: data.status === 'Closed' ? updatedAt : undefined,
      escalatedAt: d.escalatedHoursAgo
        ? new Date(Date.now() - d.escalatedHoursAgo * 60 * 60 * 1000)
        : undefined,
      escalatedBy: d.escalatedBy,
      escalatedTo: d.escalatedTo,
      escalationReason: d.escalationReason,
      escalationLevel: d.escalationLevel,
    };

    const aiResult = AIService.suggestResolution(ticket);
    ticket.aiSuggestion = aiResult.suggestion;
    ticket.aiConfidence = aiResult.confidence;

    tickets.push(ticket);
  });

  return tickets;
}

export const mockTickets = generateMockTickets();

// ──────────────────────────────────────────────
// LIVE TICKETS — complete workflow lifecycle
// Linked to live users so each role profile
// sees relevant real data
// ──────────────────────────────────────────────
function generateLiveTickets(): Ticket[] {
  const citizen      = liveUsers[0]; // LU001 - Zara Hussain
  const cco          = liveUsers[1]; // LU002 - Omar Sheikh (Call Center Officer)
  const agent        = liveUsers[2]; // LU003 - Nadia Qureshi (Support Agent)
  const engineer     = liveUsers[3]; // LU004 - Tariq Mahmood (Field Engineer)
  const supervisor   = liveUsers[4]; // LU005 - Hina Baig (Supervisor)

  const now = Date.now();
  const h = (hrs: number) => new Date(now - hrs * 60 * 60 * 1000);

  const liveTicketData = [
    // ── Stage 1: AI Analysis (just submitted by citizen)
    {
      id: 'LT-0001',
      title: 'Sewage Overflow on Main Feeder Road, F-10',
      description: 'Sewage water is overflowing onto the main road near F-10 Markaz causing health hazards and traffic blockage. Citizens are unable to use the road safely.',
      category: 'Infrastructure' as const,
      priority: 'Critical' as const,
      status: 'AI Analysis' as const,
      createdBy: citizen,
      assignedTo: undefined,
      department: 'Field Operations',
      createdAt: h(0.5),
      aiSuggestion: 'Critical infrastructure issue detected. Recommend immediate dispatch of Field Engineering team. Coordinate with WASA emergency services. Expected resolution time: 4-6 hours.',
      aiConfidence: 0.91,
      tags: ['infrastructure', 'sewage', 'emergency'],
    },
    // ── Stage 2: Assigned to Support Agent
    {
      id: 'LT-0002',
      title: 'Internet Service Disruption — Sector F-8',
      description: 'Complete internet outage in Sector F-8 since this morning. Approximately 500+ households affected. ISP has not responded to repeated calls.',
      category: 'Technical Issue' as const,
      priority: 'High' as const,
      status: 'Assigned' as const,
      createdBy: citizen,
      assignedTo: agent,
      department: 'Technical Support',
      createdAt: h(3),
      aiSuggestion: 'Network outage pattern detected for the area. Escalate to ISP coordination cell. Check if related to planned maintenance.',
      aiConfidence: 0.87,
      tags: ['technical', 'internet', 'outage'],
    },
    // ── Stage 3: In Progress by Field Engineer
    {
      id: 'LT-0003',
      title: 'Street Light Outage — G-9 Markaz (Block 4)',
      description: 'Multiple street lights not functioning in G-9 Markaz Block 4 for the past 10 days. Area is completely dark at night posing security risks.',
      category: 'Infrastructure' as const,
      priority: 'High' as const,
      status: 'In Progress' as const,
      createdBy: citizen,
      assignedTo: engineer,
      department: 'Field Operations',
      createdAt: h(18),
      aiSuggestion: 'Street lighting fault in designated area. Field engineer dispatch required. Check main distribution panel first.',
      aiConfidence: 0.82,
      tags: ['infrastructure', 'street-lights', 'safety'],
    },
    // ── Stage 4: Pending (waiting on citizen response)
    {
      id: 'LT-0004',
      title: 'Pension Payment Not Received — October 2025',
      description: 'My monthly pension of PKR 25,000 has not been credited to my account for October 2025. Bank statement confirms no deposit. I am a retired government employee (CNIC: 61101-XXXXXXX-X).',
      category: 'Billing' as const,
      priority: 'High' as const,
      status: 'Pending' as const,
      createdBy: citizen,
      assignedTo: agent,
      department: 'Technical Support',
      createdAt: h(28),
      aiSuggestion: 'Pension disbursement issue. Request citizen to provide CNIC and bank account details for verification with Finance Department.',
      aiConfidence: 0.78,
      tags: ['billing', 'pension', 'payment'],
    },
    // ── Stage 5: Escalated (supervisor involved)
    {
      id: 'LT-0005',
      title: 'Illegal Building Construction — DHA Phase 5, Street 14',
      description: 'Unauthorized construction of a commercial plaza in a residential zone at DHA Phase 5, Street 14. Construction began 2 weeks ago without visible permits. Residents have complained multiple times to local office with no action.',
      category: 'Service Request' as const,
      priority: 'Critical' as const,
      status: 'Escalated' as const,
      createdBy: citizen,
      assignedTo: agent,
      department: 'Technical Support',
      createdAt: h(48),
      escalatedAt: h(24),
      escalatedBy: agent,
      escalatedTo: supervisor,
      escalationReason: 'Multiple previous complaints with no action taken. Unauthorized construction requires immediate supervisor intervention and coordination with legal/enforcement teams.',
      escalationLevel: 1,
      aiSuggestion: 'Illegal construction complaint requires physical site inspection and legal verification. Escalation to supervisor recommended due to inaction on previous complaints.',
      aiConfidence: 0.94,
      tags: ['service-request', 'illegal-construction', 'escalated'],
    },
    // ── Stage 6: Resolved by Field Engineer
    {
      id: 'LT-0006',
      title: 'Water Supply Pipeline Burst — I-8 Sector',
      description: 'Main water supply pipeline has burst near I-8/3 junction. Water is flooding the street and entering residential properties. Immediate repair needed.',
      category: 'Service Request' as const,
      priority: 'Critical' as const,
      status: 'Resolved' as const,
      createdBy: citizen,
      assignedTo: engineer,
      department: 'Field Operations',
      createdAt: h(72),
      aiSuggestion: 'Critical water infrastructure failure. Emergency WASA team dispatch required. Isolate affected supply line.',
      aiConfidence: 0.96,
      tags: ['service-request', 'water-supply', 'emergency'],
    },
    // ── Stage 7: Client Confirmation
    {
      id: 'LT-0007',
      title: 'Property Tax Recalculation — Plot No. 145-C, Model Town',
      description: 'Property tax for my plot (145-C Model Town) has been calculated at double the rate compared to identical adjacent plots. Request immediate recalculation and refund of excess amount of PKR 45,000.',
      category: 'Billing' as const,
      priority: 'Medium' as const,
      status: 'Client Confirmation' as const,
      createdBy: citizen,
      assignedTo: agent,
      department: 'Technical Support',
      createdAt: h(96),
      aiSuggestion: 'Tax discrepancy case. Compare plot records with neighboring properties. Initiate recalculation request with revenue department.',
      aiConfidence: 0.83,
      tags: ['billing', 'property-tax', 'refund'],
    },
    // ── Stage 8: Closed (fully resolved)
    {
      id: 'LT-0008',
      title: 'Park Maintenance and Cleanup — F-6 Supermarket Area',
      description: 'The public park near F-6 Supermarket is in very poor condition. Broken benches, overgrown grass, and damaged play equipment for children. Needs urgent attention.',
      category: 'Service Request' as const,
      priority: 'Low' as const,
      status: 'Closed' as const,
      createdBy: citizen,
      assignedTo: engineer,
      department: 'Field Operations',
      createdAt: h(168),
      aiSuggestion: 'Municipal maintenance request. Schedule with Parks & Horticulture department.',
      aiConfidence: 0.72,
      tags: ['service-request', 'park', 'maintenance'],
    },
    // ── Stage 9: Auto-Resolved by AI
    {
      id: 'LT-0009',
      title: 'How to Renew Driving License Online?',
      description: 'I need to renew my driving license which expired last month. Please guide me through the online renewal process and any required documents.',
      category: 'General Inquiry' as const,
      priority: 'Low' as const,
      status: 'Auto-Resolved' as const,
      createdBy: citizen,
      assignedTo: undefined,
      department: undefined,
      createdAt: h(6),
      isAIResolved: true,
      aiSuggestion: 'Visit the NTRC (National Transport Research Centre) portal at ntrc.gov.pk. Required documents: Original expired license, CNIC copy, Passport photo (2x), Bank challan of PKR 750. Processing time: 7-10 working days.',
      aiConfidence: 0.98,
      tags: ['general-inquiry', 'driving-license'],
    },
    // ── Stage 10: New (just arrived, not yet processed)
    {
      id: 'LT-0010',
      title: 'Corruption Complaint — Land Record Office, Rawalpindi',
      description: 'Staff at the Land Record Office in Rawalpindi are demanding bribes (PKR 5,000 to 20,000) to process routine land transfer documents. I witnessed this personally and was also asked for a bribe. Other citizens in the queue confirmed the same. This is happening daily from 9 AM to 2 PM at Counter 3 and 4.',
      category: 'Corruption Report' as const,
      priority: 'Critical' as const,
      status: 'New' as const,
      createdBy: citizen,
      assignedTo: undefined,
      department: undefined,
      createdAt: h(0.1),
      aiSuggestion: 'High-priority corruption report. Forward to Anti-Corruption Establishment (ACE). Preserve complainant identity. Initiate covert verification process.',
      aiConfidence: 0.95,
      tags: ['corruption-report', 'land-record', 'critical'],
    },
  ];

  return liveTicketData.map(data => {
    const slaDeadline = SLAEngine.getSLADeadline(data.createdAt, data.priority);
    const slaStatus = SLAEngine.calculateSLAStatus(data.createdAt, data.priority);
    const isResolved = ['Resolved', 'Closed', 'Auto-Resolved', 'Client Confirmation'].includes(data.status);
    const isClosed = ['Closed', 'Auto-Resolved'].includes(data.status);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status,
      createdBy: data.createdBy,
      assignedTo: data.assignedTo,
      department: data.department,
      createdAt: data.createdAt,
      updatedAt: new Date(data.createdAt.getTime() + 30 * 60 * 1000),
      slaDeadline,
      slaStatus,
      attachments: [],
      tags: data.tags,
      aiSuggestion: data.aiSuggestion,
      aiConfidence: data.aiConfidence,
      isAIResolved: data.isAIResolved,
      resolvedAt: isResolved ? new Date(data.createdAt.getTime() + 2 * 60 * 60 * 1000) : undefined,
      closedAt: isClosed ? new Date(data.createdAt.getTime() + 4 * 60 * 60 * 1000) : undefined,
      escalatedAt: (data as any).escalatedAt,
      escalatedBy: (data as any).escalatedBy,
      escalatedTo: (data as any).escalatedTo,
      escalationReason: (data as any).escalationReason,
      escalationLevel: (data as any).escalationLevel,
    } as Ticket;
  });
}

export const liveTickets = generateLiveTickets();

// All tickets combined (demo + live)
export const allTickets: Ticket[] = [...mockTickets, ...liveTickets];

// ──────────────────────────────────────────────
// MOCK NOTIFICATIONS
// ──────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: 'N001',
    userId: 'U001',
    title: 'New Ticket Created',
    message: 'Your ticket TCK-0001 has been created successfully.',
    type: 'success',
    ticketId: 'TCK-0001',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'N002',
    userId: 'U001',
    title: 'SLA Warning',
    message: 'Ticket TCK-0003 is at risk of SLA breach.',
    type: 'warning',
    ticketId: 'TCK-0003',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'N003',
    userId: 'U002',
    title: 'Ticket Assigned',
    message: 'Ticket TCK-0008 has been assigned to you.',
    type: 'info',
    ticketId: 'TCK-0008',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'N004',
    userId: 'U001',
    title: 'Ticket Resolved',
    message: 'Your ticket TCK-0005 has been resolved.',
    type: 'success',
    ticketId: 'TCK-0005',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
  },
  // Live notifications
  {
    id: 'LN001',
    userId: 'LU001',
    title: 'Complaint Submitted',
    message: 'Your complaint LT-0001 (Sewage Overflow on Main Feeder Road) has been registered and is under AI Analysis.',
    type: 'info',
    ticketId: 'LT-0001',
    createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN002',
    userId: 'LU001',
    title: 'Agent Assigned',
    message: 'Support Agent Nadia Qureshi has been assigned to your complaint LT-0002.',
    type: 'info',
    ticketId: 'LT-0002',
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN003',
    userId: 'LU003',
    title: 'New Ticket Assigned',
    message: 'Ticket LT-0002 (Internet Service Disruption) has been assigned to you. Please review and take action.',
    type: 'info',
    ticketId: 'LT-0002',
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN004',
    userId: 'LU004',
    title: 'Field Assignment',
    message: 'Ticket LT-0003 (Street Light Outage G-9) assigned to you for on-site repair.',
    type: 'info',
    ticketId: 'LT-0003',
    createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN005',
    userId: 'LU005',
    title: 'Escalation Alert',
    message: 'Ticket LT-0005 (Illegal Building Construction) has been escalated to you for immediate review.',
    type: 'warning',
    ticketId: 'LT-0005',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN006',
    userId: 'LU001',
    title: 'Ticket Resolved',
    message: 'Your complaint LT-0006 (Water Supply Pipeline Burst) has been successfully resolved by Field Engineer Tariq Mahmood.',
    type: 'success',
    ticketId: 'LT-0006',
    createdAt: new Date(Date.now() - 68 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'LN007',
    userId: 'LU001',
    title: 'Action Required — Confirmation',
    message: 'Ticket LT-0007 (Property Tax Recalculation) is resolved. Please confirm if your issue is resolved.',
    type: 'warning',
    ticketId: 'LT-0007',
    createdAt: new Date(Date.now() - 90 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN008',
    userId: 'LU001',
    title: 'AI Auto-Resolved',
    message: 'Your query LT-0009 (Driving License Renewal) was instantly resolved by our AI assistant.',
    type: 'success',
    ticketId: 'LT-0009',
    createdAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'LN009',
    userId: 'LU007',
    title: 'Critical Report Filed',
    message: 'New Critical corruption report LT-0010 filed. Immediate review required.',
    type: 'error',
    ticketId: 'LT-0010',
    createdAt: new Date(Date.now() - 0.1 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'LN010',
    userId: 'LU002',
    title: 'New Intake — Critical Priority',
    message: 'Critical complaint LT-0010 received from citizen. Please validate and process immediately.',
    type: 'error',
    ticketId: 'LT-0010',
    createdAt: new Date(Date.now() - 0.1 * 60 * 60 * 1000),
    read: false,
  },
];

// ──────────────────────────────────────────────
// MOCK COMMENTS
// ──────────────────────────────────────────────
export const mockComments: Comment[] = [
  // Demo ticket comments
  {
    id: 'C001',
    ticketId: 'TCK-0001',
    userId: 'U004',
    userName: 'Hassan Raza',
    content: 'Site inspection scheduled for tomorrow morning. Will coordinate with Field Operations team.',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'C002',
    ticketId: 'TCK-0001',
    userId: 'U001',
    userName: 'Ahmed Khan',
    content: 'Thank you for the update. Please let me know once the repair is scheduled.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'C003',
    ticketId: 'TCK-0002',
    userId: 'U004',
    userName: 'Hassan Raza',
    content: 'Escalating to supervisor due to severity. Citizen has received incorrect billing for 3 months.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isInternal: true,
  },

  // ── Live ticket comments — showing complete workflow
  // LT-0001: AI Analysis stage
  {
    id: 'LC001',
    ticketId: 'LT-0001',
    userId: 'LU002',
    userName: 'Omar Sheikh (Call Center Officer)',
    content: 'Complaint received and registered. AI analysis initiated. Severity assessed as Critical — forwarding to Field Operations immediately.',
    createdAt: new Date(Date.now() - 0.3 * 60 * 60 * 1000),
    isInternal: false,
  },

  // LT-0002: Assigned
  {
    id: 'LC002',
    ticketId: 'LT-0002',
    userId: 'LU002',
    userName: 'Omar Sheikh (Call Center Officer)',
    content: 'Complaint validated and registered. Assigned to Technical Support team for investigation.',
    createdAt: new Date(Date.now() - 2.8 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC003',
    ticketId: 'LT-0002',
    userId: 'LU003',
    userName: 'Nadia Qureshi (Support Agent)',
    content: 'Contacted ISP coordination desk. They confirmed a fiber cable cut near F-8/2. Repair team has been dispatched. Expected restoration: within 6 hours.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC004',
    ticketId: 'LT-0002',
    userId: 'LU001',
    userName: 'Zara Hussain (Citizen)',
    content: 'Thank you for the update. Will the restoration be confirmed via SMS?',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    isInternal: false,
  },

  // LT-0003: In Progress by Field Engineer
  {
    id: 'LC005',
    ticketId: 'LT-0003',
    userId: 'LU003',
    userName: 'Nadia Qureshi (Support Agent)',
    content: 'Complaint assigned to Field Engineer Tariq Mahmood for on-site inspection and repair.',
    createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC006',
    ticketId: 'LT-0003',
    userId: 'LU004',
    userName: 'Tariq Mahmood (Field Engineer)',
    content: 'On-site inspection completed. Found: Main distribution panel tripped, 3 fuse holders damaged. Parts ordered from central stores. Repair commencing within 2 hours.',
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC007',
    ticketId: 'LT-0003',
    userId: 'LU004',
    userName: 'Tariq Mahmood (Field Engineer)',
    content: '[INTERNAL] Parts received from store. Proceeding with panel repair now. Two technicians on site.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    isInternal: true,
  },

  // LT-0004: Pending
  {
    id: 'LC008',
    ticketId: 'LT-0004',
    userId: 'LU003',
    userName: 'Nadia Qureshi (Support Agent)',
    content: 'Pension case initiated. Cross-checking with Finance Department records. Please provide your bank account number (last 4 digits) and the month you last received your pension for verification.',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC009',
    ticketId: 'LT-0004',
    userId: 'LU001',
    userName: 'Zara Hussain (Citizen)',
    content: 'Last 4 digits of account: 7823. Last received pension: September 2025.',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC010',
    ticketId: 'LT-0004',
    userId: 'LU003',
    userName: 'Nadia Qureshi (Support Agent)',
    content: '[INTERNAL] Finance Dept confirmed a batch processing error affected 127 pension accounts. Fix applied. Disbursement will process on next business day (tomorrow).',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    isInternal: true,
  },

  // LT-0005: Escalated
  {
    id: 'LC011',
    ticketId: 'LT-0005',
    userId: 'LU002',
    userName: 'Omar Sheikh (Call Center Officer)',
    content: 'Critical complaint registered. Marked as high priority due to previous unresolved complaints about the same site.',
    createdAt: new Date(Date.now() - 47 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC012',
    ticketId: 'LT-0005',
    userId: 'LU003',
    userName: 'Nadia Qureshi (Support Agent)',
    content: 'Contacted local Building Control Authority. They confirmed building permit was NOT issued for this plot. Forwarding to legal desk.',
    createdAt: new Date(Date.now() - 44 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC013',
    ticketId: 'LT-0005',
    userId: 'LU005',
    userName: 'Hina Baig (Supervisor)',
    content: 'ESCALATED: Previous complaint (3 months ago) was not actioned by local office. Taking direct oversight. Issued stop-work notice to Building Control. Legal team notified.',
    createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC014',
    ticketId: 'LT-0005',
    userId: 'LU006',
    userName: 'Asad Mirza (Department Head)',
    content: '[INTERNAL] Directed BCA Chief Officer to submit a written report within 24 hours. This case will be reviewed in next week\'s departmental meeting.',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    isInternal: true,
  },

  // LT-0006: Resolved
  {
    id: 'LC015',
    ticketId: 'LT-0006',
    userId: 'LU004',
    userName: 'Tariq Mahmood (Field Engineer)',
    content: 'Emergency response team deployed. Pipeline isolated and temporary water supply restored via tanker. Permanent repair completed in 4 hours.',
    createdAt: new Date(Date.now() - 70 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC016',
    ticketId: 'LT-0006',
    userId: 'LU001',
    userName: 'Zara Hussain (Citizen)',
    content: 'Water supply fully restored. Excellent response time! Thank you to the Field Engineering team.',
    createdAt: new Date(Date.now() - 68 * 60 * 60 * 1000),
    isInternal: false,
  },

  // LT-0007: Client Confirmation
  {
    id: 'LC017',
    ticketId: 'LT-0007',
    userId: 'LU003',
    userName: 'Nadia Qureshi (Support Agent)',
    content: 'Tax recalculation completed. Verified with Revenue Department: Your plot was erroneously categorised as commercial. Corrected to residential. Refund of PKR 45,000 has been processed and will reflect in 5-7 working days.',
    createdAt: new Date(Date.now() - 94 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC018',
    ticketId: 'LT-0007',
    userId: 'LU001',
    userName: 'Zara Hussain (Citizen)',
    content: 'I can see the refund is in process on the bank portal. Confirming this is resolved. Thank you!',
    createdAt: new Date(Date.now() - 92 * 60 * 60 * 1000),
    isInternal: false,
  },

  // LT-0008: Closed
  {
    id: 'LC019',
    ticketId: 'LT-0008',
    userId: 'LU004',
    userName: 'Tariq Mahmood (Field Engineer)',
    content: 'Park maintenance completed: All benches repaired, grass cut and trimmed, children\'s play equipment repaired and repainted. Work completed on schedule.',
    createdAt: new Date(Date.now() - 165 * 60 * 60 * 1000),
    isInternal: false,
  },
  {
    id: 'LC020',
    ticketId: 'LT-0008',
    userId: 'LU001',
    userName: 'Zara Hussain (Citizen)',
    content: 'Park looks great! Children are using the equipment again. Marking as resolved.',
    createdAt: new Date(Date.now() - 163 * 60 * 60 * 1000),
    isInternal: false,
  },

  // LT-0009: Auto-resolved
  {
    id: 'LC021',
    ticketId: 'LT-0009',
    userId: 'system',
    userName: 'AI Assistant',
    content: 'Your query has been automatically resolved. Driving license renewal process: Visit ntrc.gov.pk > Services > License Renewal. Required: Original license, CNIC, 2 photos, Bank challan PKR 750. Processing: 7-10 working days.',
    createdAt: new Date(Date.now() - 5.8 * 60 * 60 * 1000),
    isInternal: false,
  },

  // LT-0010: New critical
  {
    id: 'LC022',
    ticketId: 'LT-0010',
    userId: 'system',
    userName: 'System',
    content: 'Complaint received. Reference number LT-0010 generated. Your complaint has been flagged as Critical Priority and forwarded to the Anti-Corruption Establishment. Your identity is protected.',
    createdAt: new Date(Date.now() - 0.08 * 60 * 60 * 1000),
    isInternal: false,
  },
];

// ──────────────────────────────────────────────
// KPI & TEAM PERFORMANCE
// ──────────────────────────────────────────────
export function calculateKPIMetrics(tickets: Ticket[]): KPIMetrics {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => !['Closed', 'Auto-Resolved'].includes(t.status)).length;
  const closedTickets = tickets.filter(t => ['Closed', 'Auto-Resolved'].includes(t.status)).length;

  const resolvedTickets = tickets.filter(t => t.resolvedAt);
  const avgResolutionTime = resolvedTickets.length > 0
    ? resolvedTickets.reduce((sum, t) => {
        const duration = (t.resolvedAt!.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60);
        return sum + duration;
      }, 0) / resolvedTickets.length
    : 0;

  const slaCompliantTickets = tickets.filter(t => t.slaStatus !== 'Breached').length;
  const slaCompliance = (slaCompliantTickets / totalTickets) * 100;
  const breachCount = tickets.filter(t => t.slaStatus === 'Breached').length;
  const aiResolvedTickets = tickets.filter(t => t.isAIResolved).length;
  const aiResolutionRate = (aiResolvedTickets / totalTickets) * 100;
  const escalatedTickets = tickets.filter(t => t.status === 'Escalated').length;
  const escalationRate = (escalatedTickets / totalTickets) * 100;

  return {
    totalTickets,
    openTickets,
    closedTickets,
    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    slaCompliance: Math.round(slaCompliance * 10) / 10,
    breachCount,
    aiResolutionRate: Math.round(aiResolutionRate * 10) / 10,
    escalationRate: Math.round(escalationRate * 10) / 10,
  };
}

export function calculateTeamPerformance(tickets: Ticket[]): TeamPerformance[] {
  const agents = allUsers.filter(u => u.role === 'Support Agent' || u.role === 'Field Engineer');

  return agents.map(agent => {
    const assignedTickets = tickets.filter(t => t.assignedTo?.id === agent.id);
    const resolvedTickets = assignedTickets.filter(t => t.resolvedAt);

    const avgResolutionTime = resolvedTickets.length > 0
      ? resolvedTickets.reduce((sum, t) => {
          const duration = (t.resolvedAt!.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }, 0) / resolvedTickets.length
      : 0;

    const slaCompliantTickets = assignedTickets.filter(t => t.slaStatus !== 'Breached').length;
    const slaCompliance = assignedTickets.length > 0
      ? (slaCompliantTickets / assignedTickets.length) * 100
      : 100;

    return {
      agentId: agent.id,
      agentName: agent.name,
      assignedTickets: assignedTickets.length,
      resolvedTickets: resolvedTickets.length,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      slaCompliance: Math.round(slaCompliance * 10) / 10,
    };
  });
}
