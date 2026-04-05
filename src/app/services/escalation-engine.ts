// Escalation Engine — NCMS Pakistan Government
// Defines who escalates to whom, at what SLA threshold,
// and how long the escalation target has to resolve before re-escalation.

import type { User, Ticket, TicketPriority, UserRole } from '../types';

// ─────────────────────────────────────────────────────────
// Escalation Matrix
// ─────────────────────────────────────────────────────────

export const ESCALATION_MATRIX: Record<
  string,
  { targetRole: UserRole; level: number; label: string }
> = {
  'Call Center Officer': { targetRole: 'Supervisor',       level: 1, label: 'Level 1 → Supervisor'      },
  'Support Agent':       { targetRole: 'Supervisor',       level: 1, label: 'Level 1 → Supervisor'      },
  'Field Engineer':      { targetRole: 'Supervisor',       level: 1, label: 'Level 1 → Supervisor'      },
  'Supervisor':          { targetRole: 'Department Head',  level: 2, label: 'Level 2 → Department Head' },
  'Department Head':     { targetRole: 'Executive',        level: 3, label: 'Level 3 → Executive'       },
};

// SLA % elapsed that triggers auto-escalation recommendation
export const SLA_ESCALATION_THRESHOLD: Record<string, number> = {
  agentToSupervisor:    75,  // At Risk  (75 % elapsed)
  supervisorToDeptHead: 100, // Breached (100 % elapsed)
};

// Hours given to the escalation target to resolve before re-escalation is flagged
export const ESCALATION_RESOLUTION_TIMEOUT: Record<TicketPriority, Record<number, number>> = {
  Critical: { 1: 1,  2: 2,  3: 4  },
  High:     { 1: 2,  2: 4,  3: 8  },
  Medium:   { 1: 6,  2: 12, 3: 24 },
  Low:      { 1: 12, 2: 24, 3: 48 },
};

// ─────────────────────────────────────────────────────────
// Escalation Engine
// ─────────────────────────────────────────────────────────

export class EscalationEngine {

  /** Returns the escalation level for the given role (0 = cannot escalate) */
  static getLevel(role: string): number {
    return ESCALATION_MATRIX[role]?.level ?? 0;
  }

  /** Returns the role the given role escalates to, or null if N/A */
  static getTargetRole(role: string): UserRole | null {
    return ESCALATION_MATRIX[role]?.targetRole ?? null;
  }

  /** Returns a human-readable label like "Level 1 → Supervisor" */
  static getMatrixLabel(role: string): string {
    return ESCALATION_MATRIX[role]?.label ?? 'N/A';
  }

  /**
   * Finds the best User to escalate to, based on:
   * 1. Same department (preferred)
   * 2. Any user with the target role (fallback)
   */
  static findTarget(fromUser: User, users: User[], ticket: Ticket): User | null {
    const targetRole = this.getTargetRole(fromUser.role);
    if (!targetRole) return null;

    const dept = ticket.department || fromUser.department;

    // Try same-department first
    const sameDept = users.find(u => u.role === targetRole && u.department === dept);
    if (sameDept) return sameDept;

    // For Department Head → Executive, any executive works
    return users.find(u => u.role === targetRole) ?? null;
  }

  /** Hours the target has to resolve before overdue flag appears */
  static getTimeoutHours(priority: TicketPriority, level: number): number {
    return ESCALATION_RESOLUTION_TIMEOUT[priority]?.[level] ?? 24;
  }

  /** Returns Date when the escalation resolution is due */
  static getDeadline(ticket: Ticket): Date | null {
    if (!ticket.escalatedAt || !ticket.escalationLevel) return null;
    // Coerce to Date in case it was revived from JSON as a string
    const escalatedAt = ticket.escalatedAt instanceof Date
      ? ticket.escalatedAt
      : new Date(ticket.escalatedAt as unknown as string);
    if (isNaN(escalatedAt.getTime())) return null;
    const hrs = this.getTimeoutHours(ticket.priority, ticket.escalationLevel);
    return new Date(escalatedAt.getTime() + hrs * 3_600_000);
  }

  /** Whether the escalation resolution deadline has passed without resolution */
  static isOverdue(ticket: Ticket): boolean {
    if (ticket.status !== 'Escalated') return false;
    const deadline = this.getDeadline(ticket);
    if (!deadline) return false;
    return new Date() > deadline;
  }

  /**
   * Should auto-escalation be triggered?
   * Returns { should: boolean; reason: string }
   */
  static shouldAutoEscalate(ticket: Ticket): { should: boolean; reason: string } {
    if (['Escalated', 'Resolved', 'Closed', 'Auto-Resolved'].includes(ticket.status)) {
      return { should: false, reason: '' };
    }
    if (ticket.slaStatus === 'Breached') {
      return { should: true, reason: 'SLA deadline has been breached' };
    }
    if (ticket.slaStatus === 'At Risk') {
      return { should: true, reason: 'SLA is at risk (>75% of time elapsed)' };
    }
    return { should: false, reason: '' };
  }

  /** Human-readable time since escalation */
  static timeSinceEscalation(escalatedAt: Date | string): string {
    const d = escalatedAt instanceof Date ? escalatedAt : new Date(escalatedAt);
    const ms = Date.now() - d.getTime();
    const totalMins = Math.floor(ms / 60_000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days}d ${hrs % 24}h`;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  /** Format a Date as "Apr 4, 2026 14:32" */
  static formatDateTime(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('en-PK', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  /** All roles that CAN escalate (used for permission checks) */
  static canEscalate(role: string): boolean {
    return role in ESCALATION_MATRIX;
  }
}
