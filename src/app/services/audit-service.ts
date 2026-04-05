// Audit Service - Event-based logging system (Blockchain-ready)

import { AuditEvent, AuditEventType, Ticket, User } from '../types';

// In-memory audit log (in production, this would be a database)
let auditLog: AuditEvent[] = [];

export class AuditService {
  // Log an event
  static logEvent(
    eventType: AuditEventType,
    ticketId: string,
    user: User,
    metadata: Record<string, any> = {}
  ): AuditEvent {
    const event: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      ticketId,
      userId: user.id,
      userName: user.name,
      timestamp: new Date(),
      metadata,
      // Blockchain fields (placeholder for future integration)
      blockchainHash: undefined,
      blockchainVerified: undefined,
      blockchainTimestamp: undefined,
    };

    auditLog.push(event);
    
    // In production, this would trigger blockchain adapter
    // BlockchainAdapter.submitEvent(event);
    
    return event;
  }

  // Get all events for a ticket
  static getTicketEvents(ticketId: string): AuditEvent[] {
    return auditLog.filter(event => event.ticketId === ticketId);
  }

  // Get all events
  static getAllEvents(): AuditEvent[] {
    return [...auditLog].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Get events by type
  static getEventsByType(eventType: AuditEventType): AuditEvent[] {
    return auditLog.filter(event => event.eventType === eventType);
  }

  // Get recent events (last N)
  static getRecentEvents(limit: number = 50): AuditEvent[] {
    return [...auditLog]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get SLA breach events
  static getSLABreachEvents(): AuditEvent[] {
    return auditLog.filter(event => event.eventType === 'SLABreached');
  }

  // Clear log (for testing only)
  static clearLog(): void {
    auditLog = [];
  }

  // Get event statistics
  static getEventStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    recentActivity: number; // events in last hour
  } {
    const eventsByType: Record<string, number> = {};
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    let recentActivity = 0;
    
    auditLog.forEach(event => {
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      
      // Count recent
      if (event.timestamp > oneHourAgo) {
        recentActivity++;
      }
    });

    return {
      totalEvents: auditLog.length,
      eventsByType,
      recentActivity,
    };
  }

  // Generate audit report for a ticket
  static generateTicketAuditReport(ticketId: string): {
    ticketId: string;
    events: AuditEvent[];
    timeline: Array<{
      timestamp: Date;
      action: string;
      user: string;
      details: string;
    }>;
    slaBreaches: number;
  } {
    const events = this.getTicketEvents(ticketId);
    const slaBreaches = events.filter(e => e.eventType === 'SLABreached').length;

    const timeline = events.map(event => ({
      timestamp: event.timestamp,
      action: this.formatEventType(event.eventType),
      user: event.userName,
      details: this.formatEventDetails(event),
    }));

    return {
      ticketId,
      events,
      timeline,
      slaBreaches,
    };
  }

  // Helper: Format event type for display
  private static formatEventType(eventType: AuditEventType): string {
    const map: Record<AuditEventType, string> = {
      'TicketCreated': 'Ticket Created',
      'TicketAssigned': 'Ticket Assigned',
      'TicketUpdated': 'Ticket Updated',
      'TicketEscalated': 'Ticket Escalated',
      'TicketResolved': 'Ticket Resolved',
      'TicketClosed': 'Ticket Closed',
      'TicketReopened': 'Ticket Reopened',
      'StatusChanged': 'Status Changed',
      'PriorityChanged': 'Priority Changed',
      'CommentAdded': 'Comment Added',
      'SLABreached': 'SLA Breached',
      'AIAutoResolved': 'AI Auto-Resolved',
    };
    return map[eventType] || eventType;
  }

  // Helper: Format event details
  private static formatEventDetails(event: AuditEvent): string {
    const { metadata } = event;
    
    switch (event.eventType) {
      case 'StatusChanged':
        return `Changed from "${metadata.oldStatus}" to "${metadata.newStatus}"`;
      case 'PriorityChanged':
        return `Changed from "${metadata.oldPriority}" to "${metadata.newPriority}"`;
      case 'TicketAssigned':
        return `Assigned to ${metadata.assignedTo}`;
      case 'CommentAdded':
        return metadata.commentPreview || 'Comment added';
      case 'SLABreached':
        return `SLA deadline exceeded by ${metadata.breachTime}`;
      default:
        return JSON.stringify(metadata);
    }
  }

  // Initialize with some sample events (for demo)
  static initializeSampleEvents(tickets: Ticket[]): void {
    tickets.forEach(ticket => {
      // Create event
      this.logEvent('TicketCreated', ticket.id, ticket.createdBy, {
        title: ticket.title,
        category: ticket.category,
        priority: ticket.priority,
      });

      // AI Analysis event
      if (ticket.status !== 'New') {
        this.logEvent('StatusChanged', ticket.id, ticket.createdBy, {
          oldStatus: 'New',
          newStatus: 'AI Analysis',
        });
      }

      // Assigned event
      if (ticket.assignedTo) {
        this.logEvent('TicketAssigned', ticket.id, ticket.assignedTo, {
          assignedTo: ticket.assignedTo.name,
        });
      }

      // SLA breach event if applicable
      if (ticket.slaStatus === 'Breached') {
        this.logEvent('SLABreached', ticket.id, ticket.createdBy, {
          breachTime: '2 hours',
          priority: ticket.priority,
        });
      }
    });
  }
}
