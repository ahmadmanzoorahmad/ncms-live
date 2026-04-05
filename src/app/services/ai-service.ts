// AI Service - Simulates AI-powered automation for ticket processing

import { Ticket, TicketPriority, TicketCategory, TicketStatus } from '../types';

// Simulated knowledge base of known issues
const KNOWN_ISSUES = [
  {
    keywords: ['login', 'password', 'access', 'cant sign in'],
    category: 'Account Issue' as TicketCategory,
    priority: 'High' as TicketPriority,
    solution: 'Reset your password using the "Forgot Password" link on the login page. Check your email for the reset link.',
    confidence: 0.95,
  },
  {
    keywords: ['slow', 'performance', 'loading', 'lag'],
    category: 'Technical Issue' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    solution: 'Clear your browser cache and cookies. Try using a different browser or update your current browser to the latest version.',
    confidence: 0.88,
  },
  {
    keywords: ['payment', 'charge', 'invoice', 'billing'],
    category: 'Billing' as TicketCategory,
    priority: 'High' as TicketPriority,
    solution: 'Please check your billing history in Account Settings. If the issue persists, our billing team will review your account within 24 hours.',
    confidence: 0.92,
  },
  {
    keywords: ['error', 'crash', 'broken', 'not working'],
    category: 'Bug Report' as TicketCategory,
    priority: 'High' as TicketPriority,
    solution: 'Our technical team has been notified. Please provide additional details such as browser version, operating system, and steps to reproduce.',
    confidence: 0.75,
  },
  {
    keywords: ['feature', 'suggest', 'add', 'improvement'],
    category: 'Feature Request' as TicketCategory,
    priority: 'Low' as TicketPriority,
    solution: 'Thank you for your suggestion! Our product team reviews all feature requests regularly. You can track the status in our roadmap.',
    confidence: 0.90,
  },
];

export class AIService {
  // Classify ticket category based on title and description
  static classifyTicket(title: string, description: string): {
    category: TicketCategory;
    priority: TicketPriority;
    confidence: number;
  } {
    const text = `${title} ${description}`.toLowerCase();
    
    // Find matching known issue
    for (const issue of KNOWN_ISSUES) {
      const matchCount = issue.keywords.filter(keyword => 
        text.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        return {
          category: issue.category,
          priority: issue.priority,
          confidence: issue.confidence,
        };
      }
    }
    
    // Default classification
    return {
      category: 'General Inquiry',
      priority: 'Medium',
      confidence: 0.6,
    };
  }

  // Detect if ticket is a duplicate
  static detectDuplicate(
    ticket: Ticket,
    existingTickets: Ticket[]
  ): { isDuplicate: boolean; duplicateOf?: string; confidence: number } {
    const ticketText = `${ticket.title} ${ticket.description}`.toLowerCase();
    
    for (const existing of existingTickets) {
      if (existing.id === ticket.id) continue;
      
      const existingText = `${existing.title} ${existing.description}`.toLowerCase();
      
      // Simple similarity check (in production, use proper NLP)
      const similarity = this.calculateSimilarity(ticketText, existingText);
      
      if (similarity > 0.7) {
        return {
          isDuplicate: true,
          duplicateOf: existing.id,
          confidence: similarity,
        };
      }
    }
    
    return { isDuplicate: false, confidence: 0 };
  }

  // Suggest resolution based on ticket content
  static suggestResolution(ticket: Ticket): {
    suggestion: string;
    confidence: number;
    shouldAutoResolve: boolean;
  } {
    const text = `${ticket.title} ${ticket.description}`.toLowerCase();
    
    // Find matching known issue
    for (const issue of KNOWN_ISSUES) {
      const matchCount = issue.keywords.filter(keyword => 
        text.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0 && issue.confidence > 0.85) {
        // High confidence - suggest auto-resolve
        return {
          suggestion: issue.solution,
          confidence: issue.confidence,
          shouldAutoResolve: true,
        };
      } else if (matchCount > 0) {
        // Medium confidence - suggest but require human review
        return {
          suggestion: issue.solution,
          confidence: issue.confidence,
          shouldAutoResolve: false,
        };
      }
    }
    
    // No match found
    return {
      suggestion: 'This ticket requires human review. Please assign to an appropriate team member.',
      confidence: 0.5,
      shouldAutoResolve: false,
    };
  }

  // Determine if ticket should be auto-resolved
  static shouldAutoResolve(ticket: Ticket, existingTickets: Ticket[]): boolean {
    // Check if it's a simple/repeated issue
    const { shouldAutoResolve } = this.suggestResolution(ticket);
    
    // Don't auto-resolve critical tickets
    if (ticket.priority === 'Critical') {
      return false;
    }
    
    // Check if similar tickets were resolved successfully
    const similarResolved = existingTickets.filter(t => 
      t.status === 'Closed' && 
      t.category === ticket.category &&
      t.isAIResolved === true
    );
    
    if (shouldAutoResolve && similarResolved.length > 3) {
      return true;
    }
    
    return false;
  }

  // Predict next status based on current state
  static predictNextStatus(ticket: Ticket): TicketStatus {
    switch (ticket.status) {
      case 'New':
        return 'AI Analysis';
      case 'AI Analysis':
        if (ticket.priority === 'Critical') {
          return 'Assigned';
        }
        return ticket.isAIResolved ? 'Auto-Resolved' : 'Assigned';
      case 'Assigned':
        return 'In Progress';
      case 'In Progress':
        return 'Resolved';
      case 'Resolved':
        return 'Client Confirmation';
      case 'Client Confirmation':
        return 'Closed';
      default:
        return ticket.status;
    }
  }

  // AI Chatbot response
  static getChatbotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('status') || lowerMessage.includes('ticket')) {
      return 'I can help you check your ticket status. Please provide your ticket ID, or I can show you all your active tickets.';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m your AI assistant. How can I help you today? You can ask about ticket status, create a new complaint, or get help with common issues.';
    }
    
    if (lowerMessage.includes('help')) {
      return 'I can assist with:\n• Creating new tickets\n• Checking ticket status\n• Common technical issues\n• Billing questions\n• Feature requests\n\nWhat would you like help with?';
    }
    
    // Check for known issues
    for (const issue of KNOWN_ISSUES) {
      const matchCount = issue.keywords.filter(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        return `I can help with that! ${issue.solution}\n\nWould you like me to create a ticket for further assistance?`;
      }
    }
    
    return 'I understand you need help. Let me create a ticket for you, and one of our team members will assist you shortly.';
  }

  // Helper: Calculate text similarity (simple version)
  private static calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    const commonWords = words1.filter(word => 
      words2.includes(word) && word.length > 3
    );
    
    return (commonWords.length * 2) / (words1.length + words2.length);
  }
}
