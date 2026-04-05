// Ticket Management Service - Handles ticket creation, updates, and storage

import { Ticket, TicketCategory, User, Location } from '../types';
import { SLAEngine } from './sla-engine';
import { AIService } from './ai-service';
import { AuditService } from './audit-service';

class TicketManagementService {
  private tickets: Ticket[] = [];
  private ticketCounter: number = 1;

  // Initialize with existing tickets
  initialize(existingTickets: Ticket[]) {
    this.tickets = [...existingTickets];
    this.ticketCounter = existingTickets.length + 1;
  }

  // Create a new ticket
  createTicket(data: {
    title: string;
    description: string;
    category: TicketCategory;
    createdBy: User;
    location?: Location;
    attachments?: File[];
  }): Ticket {
    // Validate user object
    if (!data.createdBy || !data.createdBy.id || !data.createdBy.name) {
      throw new Error('Invalid user object. User must have id and name.');
    }
    
    const now = new Date();
    const ticketId = `TCK-${String(this.ticketCounter).padStart(4, '0')}`;
    
    // Determine priority based on category
    const priority = this.determinePriority(data.category);
    
    // Calculate SLA
    const slaDeadline = SLAEngine.getSLADeadline(now, priority);
    const slaStatus = SLAEngine.calculateSLAStatus(now, priority);
    
    // Create ticket object
    const ticket: Ticket = {
      id: ticketId,
      title: data.title,
      description: data.description,
      category: data.category,
      priority,
      status: 'New',
      createdBy: data.createdBy,
      department: this.assignDepartment(data.category),
      createdAt: now,
      updatedAt: now,
      slaDeadline,
      slaStatus,
      attachments: [],
      location: data.location,
      tags: [data.category.replace(/\s+/g, '-').toLowerCase()],
    };

    // Get AI suggestion
    const aiResult = AIService.suggestResolution(ticket);
    ticket.aiSuggestion = aiResult.suggestion;
    ticket.aiConfidence = aiResult.confidence;
    ticket.status = 'AI Analysis';

    // Auto-assign if confidence is high
    if (aiResult.confidence > 0.85) {
      ticket.isAIResolved = true;
      ticket.status = 'Auto-Resolved';
      ticket.resolvedAt = now;
    }

    // Add to collection
    this.tickets.push(ticket);
    this.ticketCounter++;

    // Log audit event
    AuditService.logEvent(
      'TicketCreated',
      ticket.id,
      data.createdBy,
      {
        category: data.category,
        priority,
        hasLocation: !!data.location,
      }
    );

    return ticket;
  }

  // Get all tickets
  getAllTickets(): Ticket[] {
    return [...this.tickets];
  }

  // Get ticket by ID
  getTicketById(id: string): Ticket | undefined {
    return this.tickets.find(t => t.id === id);
  }

  // Get tickets by user
  getTicketsByUser(userId: string): Ticket[] {
    return this.tickets.filter(t => t.createdBy.id === userId);
  }

  // Update ticket
  updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    this.tickets[index] = {
      ...this.tickets[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.tickets[index];
  }

  // Determine priority based on category
  private determinePriority(category: TicketCategory): 'Critical' | 'High' | 'Medium' | 'Low' {
    const criticalCategories: TicketCategory[] = ['Harassment', 'Cybercrime', 'Public Safety', 'Corruption Report'];
    const highCategories: TicketCategory[] = ['Social Media Complaint', 'Infrastructure', 'Environmental Issue'];
    const mediumCategories: TicketCategory[] = ['Service Request', 'Billing', 'Technical Issue'];
    
    if (criticalCategories.includes(category)) return 'Critical';
    if (highCategories.includes(category)) return 'High';
    if (mediumCategories.includes(category)) return 'Medium';
    return 'Low';
  }

  // Assign department based on category
  private assignDepartment(category: TicketCategory): string {
    const departmentMap: Record<string, string> = {
      'Technical Issue': 'Technical Support',
      'Billing': 'Billing',
      'Service Request': 'Field Operations',
      'Infrastructure': 'Field Operations',
      'Social Media Complaint': 'Cyber Monitoring',
      'Harassment': 'Public Safety',
      'Cybercrime': 'Cyber Crime Unit',
      'Public Safety': 'Public Safety',
      'Environmental Issue': 'Environmental Department',
      'Corruption Report': 'Anti-Corruption',
    };

    return departmentMap[category] || 'Customer Service';
  }

  // Check if location is required for category
  isLocationRequired(category: TicketCategory): boolean {
    return ['Harassment', 'Public Safety', 'Infrastructure', 'Environmental Issue'].includes(category);
  }
}

// Export singleton instance
export const TicketService = new TicketManagementService();