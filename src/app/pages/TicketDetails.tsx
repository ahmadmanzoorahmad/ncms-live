// Ticket Details Page - Full Functionality

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { AuditService } from '../services/audit-service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SLATimer } from '../components/SLATimer';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft,
  User,
  MessageSquare,
  Bot,
  Shield,
  CheckCircle,
  Clock,
  ChevronDown,
  AlertTriangle,
  UserCheck,
  Send,
  Lock,
  ArrowUpCircle,
  Calendar,
} from 'lucide-react';
import { SLAEngine } from '../services/sla-engine';
import { EscalationEngine } from '../services/escalation-engine';
import { useApp } from '../context/AppContext';
import type { TicketStatus } from '../types';
import { toast } from 'sonner';

const ALL_STATUSES: TicketStatus[] = [
  'New', 'AI Analysis', 'Assigned', 'In Progress', 'Pending',
  'Escalated', 'Resolved', 'Client Confirmation', 'Closed', 'On Hold', 'Reopened',
];

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, currentUser, updateTicket, comments, addComment, users } = useApp();

  const ticket = tickets.find(t => t.id === id);
  const ticketComments = comments.filter(c => c.ticketId === id);
  const auditReport = ticket ? AuditService.generateTicketAuditReport(ticket.id) : null;

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Ticket Not Found</h2>
        <p className="text-gray-600 mt-2">The ticket you're looking for doesn't exist.</p>
        <Link to="/">
          <Button className="mt-4 bg-[#01411C] hover:bg-[#0B5D1E]">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const priorityColor = SLAEngine.getPriorityColor(ticket.priority);
  const isClosed = ['Closed', 'Auto-Resolved'].includes(ticket.status);
  const isCitizen = currentUser.role === 'Citizen';
  // Only staff roles can update status or reassign
  const canChangeStatus = !isCitizen && !isClosed;
  const canReassign = ['Call Center Officer', 'Supervisor', 'Department Head', 'Executive', 'System Admin'].includes(currentUser.role) && !isClosed;
  // Citizens can only confirm resolution
  const canConfirmResolution = isCitizen && ticket.status === 'Client Confirmation' && ticket.createdBy.id === currentUser.id;

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket(ticket.id, {
      status: newStatus,
      resolvedAt: ['Resolved', 'Auto-Resolved'].includes(newStatus) ? new Date() : ticket.resolvedAt,
      closedAt: newStatus === 'Closed' ? new Date() : ticket.closedAt,
    });
    setShowStatusDropdown(false);
    toast.success(`Status updated to "${newStatus}"`);
  };

  const handleReassign = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateTicket(ticket.id, { assignedTo: user, status: 'Assigned' });
      setShowReassignModal(false);
      toast.success(`Ticket reassigned to ${user.name}`);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    setTimeout(() => {
      addComment({
        id: `C-${Date.now()}`,
        ticketId: ticket.id,
        userId: currentUser.id,
        userName: currentUser.name,
        content: commentText.trim(),
        createdAt: new Date(),
        isInternal: isInternalNote,
      });
      setCommentText('');
      setIsInternalNote(false);
      setIsSubmittingComment(false);
      toast.success(isInternalNote ? 'Internal note added' : 'Comment posted');
    }, 400);
  };

  const handleApplySuggestion = () => {
    if (ticket.aiSuggestion) {
      updateTicket(ticket.id, { status: 'Resolved', resolvedAt: new Date() });
      toast.success('AI suggestion applied — ticket marked as Resolved');
    }
  };

  const agents = users.filter(u =>
    ['Support Agent', 'Field Engineer'].includes(u.role)
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Resolved': case 'Closed': case 'Auto-Resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'Client Confirmation': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Escalated': return 'bg-red-100 text-red-800 border-red-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'New': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center space-x-2 text-[#01411C]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
            <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
            <Badge variant="outline" className={`text-xs font-semibold border ${priorityColor.replace('bg-', 'border-')}`}>
              {ticket.priority}
            </Badge>
            {ticket.isAIResolved && (
              <Badge variant="outline" className="flex items-center space-x-1 border-purple-400 text-purple-700">
                <Bot className="w-3 h-3" />
                <span>AI Resolved</span>
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{ticket.title}</h1>
          <p className="text-gray-600 mt-2">{ticket.description}</p>
        </div>

        <div className="flex space-x-2 flex-shrink-0">
            {/* Citizen: Confirm Resolution — sets to Resolved so staff can close */}
            {canConfirmResolution && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={() => {
                  updateTicket(ticket.id, { status: 'Resolved', resolvedAt: new Date() });
                  toast.success('Thank you! Your confirmation has been recorded. The authorities will now close the ticket.');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm Resolved
              </Button>
            )}

            {/* Staff: Close Ticket — only available after citizen confirmed (status = Resolved) */}
            {!isCitizen && ticket.status === 'Resolved' && (
              <Button
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold"
                onClick={() => {
                  updateTicket(ticket.id, { status: 'Closed', closedAt: new Date() });
                  toast.success('Ticket closed successfully.');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Close Ticket
              </Button>
            )}

            {/* Staff only: Reassign */}
            {canReassign && (
              <Button
                variant="outline"
                className="border-[#01411C]/30 text-[#01411C] hover:bg-[#DFF5E1]"
                onClick={() => setShowReassignModal(true)}
              >
                <UserCheck className="w-4 h-4 mr-1" />
                Reassign
              </Button>
            )}

            {/* Staff only: Update Status Dropdown */}
            {canChangeStatus && (
              <div className="relative">
                <Button
                  className="bg-[#01411C] hover:bg-[#0B5D1E] text-white flex items-center gap-2"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  Update Status
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#01411C]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium px-2">Set Status</p>
                    </div>
                    {ALL_STATUSES.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#DFF5E1] transition-colors flex items-center justify-between ${
                          ticket.status === status ? 'bg-[#DFF5E1] font-semibold text-[#01411C]' : 'text-gray-700'
                        }`}
                      >
                        {status}
                        {ticket.status === status && <CheckCircle className="w-3 h-3 text-[#01411C]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#01411C]">Reassign Ticket</h3>
              <p className="text-sm text-gray-500 mt-1">Select an agent to assign this ticket to</p>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              {agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => handleReassign(agent.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 hover:border-[#01411C] hover:bg-[#DFF5E1] transition-all ${
                    ticket.assignedTo?.id === agent.id
                      ? 'border-[#01411C] bg-[#DFF5E1]'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-[#DFF5E1] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#01411C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.role} • {agent.department}</p>
                    </div>
                    {ticket.assignedTo?.id === agent.id && (
                      <CheckCircle className="w-4 h-4 text-[#01411C] ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowReassignModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Ticket Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <Badge className={`text-sm border font-medium ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge variant="outline" className="border-[#01411C]/30 text-gray-700">{ticket.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm font-medium text-gray-900">{ticket.department || 'Unassigned'}</span>
                </div>
                {!isClosed && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">SLA Countdown</p>
                    <SLATimer deadline={ticket.slaDeadline} slaStatus={ticket.slaStatus} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Escalation Trail */}
          {ticket.status === 'Escalated' && ticket.escalatedAt && (
            <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <ArrowUpCircle className="w-5 h-5" />
                  Escalation Details
                  {EscalationEngine.isOverdue(ticket) && (
                    <Badge className="bg-red-600 text-white ml-2">OVERDUE</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Escalation chain row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-white rounded-lg px-3 py-2 border border-orange-200 text-center min-w-[120px]">
                    <p className="text-xs text-gray-500">Escalated By</p>
                    <p className="font-semibold text-gray-800 text-sm">{ticket.escalatedBy?.name ?? ticket.assignedTo?.name ?? '—'}</p>
                    <p className="text-xs text-gray-500">{ticket.escalatedBy?.role}</p>
                  </div>
                  <div className="text-orange-400 font-bold text-xl">→</div>
                  <div className="bg-orange-100 rounded-lg px-3 py-2 border-2 border-orange-400 text-center min-w-[120px]">
                    <p className="text-xs text-gray-500">Escalated To</p>
                    <p className="font-semibold text-orange-900 text-sm">{ticket.escalatedTo?.name ?? 'Supervisor'}</p>
                    <p className="text-xs text-orange-600">{ticket.escalatedTo?.role}</p>
                  </div>
                  {ticket.escalationLevel && (
                    <div className="ml-auto bg-orange-600 text-white rounded-lg px-3 py-2 text-center">
                      <p className="text-xs opacity-80">Escalation</p>
                      <p className="font-bold text-sm">Level {ticket.escalationLevel}</p>
                    </div>
                  )}
                </div>

                {/* Reason */}
                {ticket.escalationReason && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Reason</p>
                    <p className="text-sm text-yellow-900">{ticket.escalationReason}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Escalated On</p>
                      <p className="font-medium">{EscalationEngine.formatDateTime(ticket.escalatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Time Elapsed</p>
                      <p className="font-medium">{EscalationEngine.timeSinceEscalation(ticket.escalatedAt)}</p>
                    </div>
                  </div>
                  {(() => {
                    const deadline = EscalationEngine.getDeadline(ticket);
                    const overdue = EscalationEngine.isOverdue(ticket);
                    if (!deadline) return null;
                    return (
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 flex-shrink-0 ${overdue ? 'text-red-500' : 'text-green-500'}`} />
                        <div>
                          <p className="text-xs text-gray-400">Resolution Deadline</p>
                          <p className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                            {EscalationEngine.formatDateTime(deadline)}
                            {overdue && ' ⚠'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Suggestion */}
          {ticket.aiSuggestion && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-900">
                  <Bot className="w-5 h-5" />
                  <span>AI Suggestion</span>
                  <Badge className="bg-purple-600 text-white">
                    {Math.round((ticket.aiConfidence || 0) * 100)}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 leading-relaxed">{ticket.aiSuggestion}</p>
                {canChangeStatus && (
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white" onClick={handleApplySuggestion}>
                      Apply Suggestion
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-300 text-purple-700" onClick={() => toast.info('Feedback recorded. Thank you!')}>
                      Not Helpful
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="comments" className="space-y-4">
            <TabsList className="bg-white border border-[#01411C]/20">
              <TabsTrigger value="comments" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-1" />
                Comments ({ticketComments.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
                Activity
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-1" />
                Audit Trail
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              {/* Add Comment */}
              <Card className="border-[#01411C]/20">
                <CardHeader>
                  <CardTitle className="text-sm text-[#01411C]">Add Comment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Type your comment here..."
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="border-[#01411C]/20 focus:border-[#01411C]"
                  />
                  <div className="flex justify-between items-center">
                    {/* Internal Note toggle — staff only */}
                    {!isCitizen ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsInternalNote(!isInternalNote)}
                        className={`border-[#01411C]/30 ${isInternalNote ? 'bg-amber-50 border-amber-400 text-amber-700' : 'text-[#01411C]'}`}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        {isInternalNote ? 'Internal Note (ON)' : 'Internal Note'}
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">Your message will be visible to staff handling this complaint.</span>
                    )}
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="bg-[#01411C] hover:bg-[#0B5D1E] text-white"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {isSubmittingComment ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              {ticketComments.length === 0 ? (
                <Card className="border-[#01411C]/20">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No comments yet — be the first to comment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {ticketComments.map(comment => (
                    <Card key={comment.id} className={`border ${comment.isInternal ? 'border-amber-200 bg-amber-50' : 'border-[#01411C]/10'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${comment.isInternal ? 'bg-amber-200' : 'bg-[#DFF5E1]'}`}>
                            <User className={`w-4 h-4 ${comment.isInternal ? 'text-amber-700' : 'text-[#01411C]'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900">{comment.userName}</span>
                              <span className="text-xs text-gray-400">{comment.createdAt.toLocaleString()}</span>
                              {comment.isInternal && (
                                <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-300 border">
                                  <Lock className="w-2.5 h-2.5 mr-1" />
                                  Internal
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity">
              <Card className="border-[#01411C]/20">
                <CardHeader>
                  <CardTitle className="text-[#01411C]">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-[#01411C]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Ticket Created</p>
                        <p className="text-xs text-gray-500">{ticket.createdAt.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-0.5">By: {ticket.createdBy.name}</p>
                      </div>
                    </div>
                    {ticket.assignedTo && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Assigned to {ticket.assignedTo.name}</p>
                          <p className="text-xs text-gray-500">{ticket.updatedAt.toLocaleString()}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{ticket.assignedTo.department}</p>
                        </div>
                      </div>
                    )}
                    {ticket.isAIResolved && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">AI Auto-Resolved</p>
                          <p className="text-xs text-gray-500">System automatically resolved this ticket</p>
                        </div>
                      </div>
                    )}
                    {ticket.resolvedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Ticket Resolved</p>
                          <p className="text-xs text-gray-500">{ticket.resolvedAt.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    {ticket.closedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Ticket Closed</p>
                          <p className="text-xs text-gray-500">{ticket.closedAt.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    {ticket.slaStatus !== 'On Track' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">SLA {ticket.slaStatus}</p>
                          <p className="text-xs text-gray-500">Requires immediate attention</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card className="border-[#01411C]/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-[#01411C]">
                    <Shield className="w-5 h-5" />
                    <span>Audit Trail (Blockchain-Ready)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4 flex items-center justify-between">
                    <p className="text-xs text-blue-700 font-medium">
                      All actions are cryptographically logged in an immutable audit chain
                    </p>
                    <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">Ready</Badge>
                  </div>
                  {auditReport ? (
                    <div className="space-y-2">
                      {auditReport.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-gray-900">{item.action}</span>
                              <span className="text-xs text-gray-400 whitespace-nowrap">{item.timestamp.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-600">By: {item.user}</p>
                            {item.details && (
                              <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-8">No audit events recorded yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-4">
          {/* People */}
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-sm text-[#01411C]">People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Reported By</p>
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-[#DFF5E1] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#01411C]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{ticket.createdBy.name}</p>
                    <p className="text-xs text-gray-500">{ticket.createdBy.email}</p>
                  </div>
                </div>
              </div>
              {ticket.assignedTo ? (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Assigned To</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{ticket.assignedTo.name}</p>
                      <p className="text-xs text-gray-500">{ticket.assignedTo.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 italic">Not yet assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-sm text-[#01411C]">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900 font-medium">{ticket.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-900 font-medium">{ticket.updatedAt.toLocaleDateString()}</span>
              </div>
              {ticket.resolvedAt && (
                <div className="flex items-center justify-between text-green-700">
                  <span>Resolved</span>
                  <span className="font-medium">{ticket.resolvedAt.toLocaleDateString()}</span>
                </div>
              )}
              {ticket.closedAt && (
                <div className="flex items-center justify-between text-gray-500">
                  <span>Closed</span>
                  <span className="font-medium">{ticket.closedAt.toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {ticket.location && (
            <Card className="border-[#01411C]/20">
              <CardHeader>
                <CardTitle className="text-sm text-[#01411C]">Location</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-gray-700">{ticket.location.address || `${ticket.location.latitude.toFixed(4)}, ${ticket.location.longitude.toFixed(4)}`}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-sm text-[#01411C]">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-[#DFF5E1] text-[#01411C]">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
