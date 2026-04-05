// Ticket Card Component

import { Link } from 'react-router';
import { Ticket } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { SLATimer } from './SLATimer';
import { 
  Clock, 
  User, 
  MessageSquare, 
  Bot,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { SLAEngine } from '../services/sla-engine';
import { Button } from './ui/button';

interface TicketCardProps {
  ticket: Ticket;
  showAssignee?: boolean;
  compact?: boolean;
}

export function TicketCard({ ticket, showAssignee = true, compact = false }: TicketCardProps) {
  const priorityColor = SLAEngine.getPriorityColor(ticket.priority);

  const getStatusIcon = () => {
    switch (ticket.status) {
      case 'Closed':
      case 'Auto-Resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Escalated':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (ticket.status) {
      case 'Closed':
      case 'Auto-Resolved':
        return 'bg-green-100 text-[#28A745] border-[#28A745]/30';
      case 'Escalated':
        return 'bg-red-100 text-[#DC3545] border-[#DC3545]/30';
      case 'In Progress':
        return 'bg-[#DFF5E1] text-[#0B5D1E] border-[#0B5D1E]/30';
      case 'Resolved':
        return 'bg-green-50 text-[#28A745] border-[#28A745]/30';
      case 'New':
        return 'bg-amber-50 text-[#FFC107] border-[#FFC107]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-[#01411C]/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
                <div className={`w-2 h-2 rounded-full ${priorityColor}`} title={ticket.priority} />
                {ticket.isAIResolved && (
                  <Badge variant="outline" className="text-xs flex items-center space-x-1 border-[#6F42C1] text-[#6F42C1]">
                    <Bot className="w-3 h-3" />
                    <span>AI Resolved</span>
                  </Badge>
                )}
              </div>
              <Link to={`/ticket/${ticket.id}`}>
                <h3 className="font-semibold text-[#01411C] hover:text-[#0B5D1E] line-clamp-1">
                  {ticket.title}
                </h3>
              </Link>
              {!compact && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {ticket.description}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge className={`${getStatusColor()} border flex items-center space-x-1 font-medium`}>
              {getStatusIcon()}
              <span>{ticket.status}</span>
            </Badge>
            <Badge variant="outline" className="text-xs border-[#01411C]/30 text-gray-700">
              {ticket.category}
            </Badge>
            <Badge variant="outline" className={`text-xs ${priorityColor.replace('bg-', 'text-')} border-current font-medium`}>
              {ticket.priority}
            </Badge>
          </div>

          {/* SLA Timer */}
          {!['Closed', 'Auto-Resolved'].includes(ticket.status) && (
            <SLATimer 
              deadline={ticket.slaDeadline} 
              slaStatus={ticket.slaStatus}
              compact={compact}
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{ticket.createdBy.name}</span>
              </div>
              {showAssignee && ticket.assignedTo && (
                <div className="flex items-center space-x-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>{ticket.assignedTo.name}</span>
                </div>
              )}
            </div>
            <Link to={`/ticket/${ticket.id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-[#01411C] hover:bg-[#DFF5E1] hover:text-[#0B5D1E]"
              >
                View Details
              </Button>
            </Link>
          </div>

          {/* AI Suggestion (if available) */}
          {ticket.aiSuggestion && ticket.aiConfidence && ticket.aiConfidence > 0.8 && (
            <div className="mt-2 p-2 bg-purple-50 border border-[#6F42C1]/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <Bot className="w-4 h-4 text-[#6F42C1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#6F42C1]">AI Suggestion (مصنوعی ذہانت)</p>
                  <p className="text-xs text-gray-700 mt-0.5 line-clamp-2">{ticket.aiSuggestion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}