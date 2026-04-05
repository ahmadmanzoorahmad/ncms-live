// SLA Engine - Manages SLA rules and calculations

import { TicketPriority, SLAStatus, SLARule } from '../types';

export const SLA_RULES: SLARule[] = [
  { priority: 'Critical', resolutionTimeHours: 4 },
  { priority: 'High', resolutionTimeHours: 8 },
  { priority: 'Medium', resolutionTimeHours: 24 },
  { priority: 'Low', resolutionTimeHours: 72 },
];

export class SLAEngine {
  static getSLADeadline(createdAt: Date, priority: TicketPriority): Date {
    const rule = SLA_RULES.find(r => r.priority === priority);
    if (!rule) {
      throw new Error(`No SLA rule found for priority: ${priority}`);
    }

    const deadline = new Date(createdAt);
    deadline.setHours(deadline.getHours() + rule.resolutionTimeHours);
    return deadline;
  }

  static calculateSLAStatus(createdAt: Date, priority: TicketPriority): SLAStatus {
    const deadline = this.getSLADeadline(createdAt, priority);
    const now = new Date();
    const timeRemaining = deadline.getTime() - now.getTime();
    const rule = SLA_RULES.find(r => r.priority === priority);
    
    if (!rule) return 'On Track';

    const totalTime = rule.resolutionTimeHours * 60 * 60 * 1000; // in milliseconds
    const percentRemaining = (timeRemaining / totalTime) * 100;

    if (timeRemaining < 0) {
      return 'Breached';
    } else if (percentRemaining < 25) {
      return 'At Risk';
    } else {
      return 'On Track';
    }
  }

  static getTimeRemaining(deadline: Date): {
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
  } {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const isOverdue = diff < 0;
    const absDiff = Math.abs(diff);

    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, isOverdue };
  }

  static shouldEscalate(createdAt: Date, priority: TicketPriority, currentStatus: string): boolean {
    const slaStatus = this.calculateSLAStatus(createdAt, priority);
    
    // Auto-escalate if at risk or breached and not yet escalated
    if ((slaStatus === 'At Risk' || slaStatus === 'Breached') && currentStatus !== 'Escalated') {
      return true;
    }
    
    return false;
  }

  static getSLAColor(status: SLAStatus): string {
    switch (status) {
      case 'On Track':
        return 'text-green-600';
      case 'At Risk':
        return 'text-yellow-600';
      case 'Breached':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  static getPriorityColor(priority: TicketPriority): string {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }
}
