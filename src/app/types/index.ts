// Core Types for Smart Complaint & Ticket Management System

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 
  | 'New' 
  | 'AI Analysis' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Pending' 
  | 'Escalated' 
  | 'Resolved' 
  | 'Client Confirmation' 
  | 'Closed' 
  | 'On Hold' 
  | 'Auto-Resolved'
  | 'Reopened';

export type TicketCategory = 
  | 'Technical Issue'
  | 'Billing'
  | 'Feature Request'
  | 'Bug Report'
  | 'Account Issue'
  | 'General Inquiry'
  | 'Service Request'
  | 'Infrastructure'
  | 'Social Media Complaint'
  | 'Harassment'
  | 'Cybercrime'
  | 'Public Safety'
  | 'Environmental Issue'
  | 'Corruption Report'
  | 'Other';

export type UserRole = 
  | 'Citizen' 
  | 'Call Center Officer' 
  | 'Support Agent' 
  | 'Field Engineer' 
  | 'Supervisor' 
  | 'Department Head' 
  | 'Executive' 
  | 'Auditor'
  | 'System Admin';

export type SLAStatus = 'On Track' | 'At Risk' | 'Breached';

export type Environment = 'Demo' | 'Live';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  avatar?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: User;
  assignedTo?: User;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  slaDeadline: Date;
  slaStatus: SLAStatus;
  attachments: Attachment[];
  location?: Location; // GPS location for incidents like harassment
  aiSuggestion?: string;
  aiConfidence?: number;
  isDuplicate?: boolean;
  duplicateOf?: string;
  isAIResolved?: boolean;
  tags: string[];
  // Escalation tracking
  escalatedAt?: Date;
  escalatedBy?: User;
  escalatedTo?: User;
  escalationReason?: string;
  escalationLevel?: number;   // 1 = Agent→Sup, 2 = Sup→DeptHead, 3 = DeptHead→Exec
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  ticketId?: string;
  createdAt: Date;
  read: boolean;
}

// Event-based audit types (Blockchain-ready)
export type AuditEventType =
  | 'TicketCreated'
  | 'TicketAssigned'
  | 'TicketUpdated'
  | 'TicketEscalated'
  | 'TicketResolved'
  | 'TicketClosed'
  | 'TicketReopened'
  | 'StatusChanged'
  | 'PriorityChanged'
  | 'CommentAdded'
  | 'SLABreached'
  | 'AIAutoResolved';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  ticketId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata: Record<string, any>;
  // Blockchain-ready fields (not yet implemented)
  blockchainHash?: string;
  blockchainVerified?: boolean;
  blockchainTimestamp?: Date;
}

export interface SLARule {
  priority: TicketPriority;
  resolutionTimeHours: number;
}

export interface KPIMetrics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  avgResolutionTime: number; // in hours
  slaCompliance: number; // percentage
  breachCount: number;
  aiResolutionRate: number; // percentage
  escalationRate: number; // percentage
}

export interface TeamPerformance {
  agentId: string;
  agentName: string;
  assignedTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  slaCompliance: number;
}