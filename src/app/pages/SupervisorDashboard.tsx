// Supervisor / Department Head Dashboard

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import type { Ticket } from '../types';
import { calculateTeamPerformance } from '../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Users, AlertCircle, CheckCircle2,
  ArrowUpCircle, UserCheck, Target, ArrowRight, Clock, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { EscalationEngine } from '../services/escalation-engine';

export default function SupervisorDashboard() {
  const { currentUser, tickets, updateTicket, escalateTicket, users } = useApp();
  const navigate = useNavigate();
  const [escalateTicketObj, setEscalateTicketObj] = useState<Ticket | null>(null);
  const [escalateReason, setEscalateReason] = useState('');

  // Show all tickets for dept head, or dept-specific for supervisor
  const departmentTickets = currentUser.role === 'Department Head'
    ? tickets
    : tickets.filter(t => t.department === currentUser.department);

  const teamMembers = users.filter(u =>
    (u.role === 'Support Agent' || u.role === 'Field Engineer') &&
    (currentUser.role === 'Department Head' || u.department === currentUser.department)
  );

  const activeTickets = departmentTickets.filter(t => !['Closed', 'Auto-Resolved', 'Resolved'].includes(t.status));
  const escalatedTickets = departmentTickets.filter(t => t.status === 'Escalated');
  const slaAtRisk = departmentTickets.filter(t => t.slaStatus === 'At Risk');
  const slaBreached = departmentTickets.filter(t => t.slaStatus === 'Breached');

  const teamPerformance = calculateTeamPerformance(departmentTickets);

  const slaCompliance = departmentTickets.length > 0
    ? Math.round((departmentTickets.filter(t => t.slaStatus !== 'Breached').length / departmentTickets.length) * 100)
    : 100;

  const openEscalateModal = (ticket: Ticket) => {
    setEscalateTicketObj(ticket);
    setEscalateReason('');
  };

  const handleConfirmEscalate = () => {
    if (!escalateTicketObj) return;
    if (!escalateReason.trim()) { toast.error('Please provide a reason for escalation.'); return; }
    const target = EscalationEngine.findTarget(currentUser, users, escalateTicketObj);
    if (!target) { toast.error('No escalation target found for your role.'); return; }
    escalateTicket(escalateTicketObj.id, escalateReason, target);
    toast.warning(`Ticket escalated to ${target.name} (${target.role})`);
    setEscalateTicketObj(null);
    setEscalateReason('');
  };

  const handleApproveClose = (ticketId: string) => {
    updateTicket(ticketId, { status: 'Closed', closedAt: new Date() });
    toast.success(`Ticket ${ticketId} closed successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {currentUser.role === 'Department Head' ? 'Department Head Dashboard' : 'Supervisor Dashboard'}
            </h1>
            <p className="text-white/90 mt-1">
              {currentUser.role === 'Department Head' ? 'ڈیپارٹمنٹ ہیڈ' : 'سپروائزر ڈیش بورڈ'} • Team Management
            </p>
            <p className="text-sm text-white/70 mt-1">
              {currentUser.name} • {currentUser.department || 'All Departments'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-white/80">Team Size</p>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-white/80">Active Cases</p>
              <p className="text-2xl font-bold">{activeTickets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Team Members', value: teamMembers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Escalated', value: escalatedTickets.length, icon: ArrowUpCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'SLA Issues', value: slaAtRisk.length + slaBreached.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
          { label: 'SLA Compliance', value: `${slaCompliance}%`, icon: Target, color: 'text-green-600', bg: 'bg-green-100' },
        ].map(stat => (
          <Card key={stat.label} className="border-[#01411C]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#01411C]">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="bg-[#DFF5E1]">
          <TabsTrigger value="team" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Team Performance
          </TabsTrigger>
          <TabsTrigger value="escalated" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Escalated ({escalatedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="workload" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Workload
          </TabsTrigger>
          <TabsTrigger value="sla" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            SLA Monitoring ({slaAtRisk.length + slaBreached.length})
          </TabsTrigger>
        </TabsList>

        {/* Team Performance */}
        <TabsContent value="team">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Team Member Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No team members in this department.</p>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map(member => {
                    const performance = teamPerformance.find(p => p.agentId === member.id);
                    const memberTickets = tickets.filter(t => t.assignedTo?.id === member.id);
                    const activeCount = memberTickets.filter(t => !['Closed', 'Auto-Resolved', 'Resolved'].includes(t.status)).length;
                    return (
                      <div key={member.id} className="p-4 border border-[#01411C]/20 rounded-xl bg-gradient-to-r from-white to-[#DFF5E1]/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center">
                              <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#01411C]">{member.name}</h4>
                              <p className="text-sm text-gray-500">{member.role} • {member.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xl font-bold text-[#01411C]">{activeCount}</p>
                              <p className="text-xs text-gray-500">Active</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold text-green-600">{performance?.resolvedTickets || 0}</p>
                              <p className="text-xs text-gray-500">Resolved</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold text-purple-600">{performance?.avgResolutionTime || 0}h</p>
                              <p className="text-xs text-gray-500">Avg Time</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              (performance?.slaCompliance || 0) >= 90 ? 'bg-green-500' :
                              (performance?.slaCompliance || 0) >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${performance?.slaCompliance || 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">SLA Compliance: {performance?.slaCompliance || 0}%</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escalated Cases */}
        <TabsContent value="escalated">
          {escalatedTickets.length === 0 ? (
            <Card className="border-[#01411C]/20">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#01411C] mb-2">No Escalated Cases</h3>
                <p className="text-gray-600">Team is handling all cases well.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Escalation Summary Header */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Escalation Log</h3>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300 border ml-auto">
                    {escalatedTickets.length} Active Escalation{escalatedTickets.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-sm text-orange-700">
                  Escalated tickets require your immediate review and action. Overdue escalations are marked in red.
                </p>
              </div>

              {escalatedTickets.map(ticket => {
                const isOverdue = EscalationEngine.isOverdue(ticket);
                const deadline = EscalationEngine.getDeadline(ticket);
                const timeSince = ticket.escalatedAt ? EscalationEngine.timeSinceEscalation(ticket.escalatedAt) : 'N/A';
                return (
                  <Card key={ticket.id} className={`border-2 ${isOverdue ? 'border-red-500 bg-red-50/60' : 'border-orange-300 bg-orange-50/40'}`}>
                    <CardContent className="p-5">
                      {/* Top row: badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className={`border ${isOverdue ? 'bg-red-200 text-red-900 border-red-400' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                          {isOverdue ? '⚠ OVERDUE ESCALATION' : '↑ ESCALATED'}
                        </Badge>
                        <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                        <Badge variant="outline" className={
                          ticket.priority === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                          ticket.priority === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                          'border-blue-400 text-blue-700'
                        }>{ticket.priority}</Badge>
                        <span className="ml-auto text-xs text-gray-400">Level {ticket.escalationLevel ?? 1} Escalation</span>
                      </div>

                      <h3 className="font-semibold text-lg text-[#01411C] mb-2">{ticket.title}</h3>

                      {/* Escalation metadata grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Escalated By</p>
                          <p className="font-semibold text-gray-800">{ticket.escalatedBy?.name ?? ticket.assignedTo?.name ?? 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{ticket.escalatedBy?.role ?? ''} • {ticket.escalatedBy?.department ?? ''}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Escalated To</p>
                          <p className="font-semibold text-blue-800">{ticket.escalatedTo?.name ?? 'Supervisor'}</p>
                          <p className="text-xs text-blue-600">{ticket.escalatedTo?.role ?? ''} • {ticket.escalatedTo?.department ?? ''}</p>
                        </div>
                      </div>

                      {/* Escalation reason */}
                      {ticket.escalationReason && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-yellow-700 mb-1">Escalation Reason</p>
                          <p className="text-sm text-yellow-900">{ticket.escalationReason}</p>
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="flex items-center gap-4 text-sm flex-wrap mb-3">
                        {ticket.escalatedAt && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Escalated: <strong>{EscalationEngine.formatDateTime(ticket.escalatedAt)}</strong></span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Time Elapsed: <strong>{timeSince}</strong></span>
                        </div>
                        {deadline && (
                          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Deadline: <strong>{EscalationEngine.formatDateTime(deadline)}</strong>{isOverdue && ' — OVERDUE'}</span>
                          </div>
                        )}
                      </div>

                      {/* Action row */}
                      <div className="flex gap-2 justify-end flex-wrap">
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/ticket/${ticket.id}`)}>
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-700 hover:bg-green-50"
                          onClick={() => handleApproveClose(ticket.id)}
                        >
                          Approve Close
                        </Button>
                        {EscalationEngine.canEscalate(currentUser.role) && (
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => openEscalateModal(ticket)}
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Re-Escalate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Workload Distribution */}
        <TabsContent value="workload">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Team Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => {
                  const memberTickets = tickets.filter(t => t.assignedTo?.id === member.id);
                  const activeCount = memberTickets.filter(t => !['Closed', 'Auto-Resolved', 'Resolved'].includes(t.status)).length;
                  const maxWorkload = 15;
                  const pct = Math.min((activeCount / maxWorkload) * 100, 100);
                  return (
                    <div key={member.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#01411C]">{member.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{activeCount}/{maxWorkload}</span>
                          <Badge variant="outline" className={
                            pct >= 80 ? 'border-red-500 text-red-700' :
                            pct >= 60 ? 'border-yellow-500 text-yellow-700' :
                            'border-green-500 text-green-700'
                          }>{Math.round(pct)}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Monitoring */}
        <TabsContent value="sla">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">SLA Risk Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {slaAtRisk.length + slaBreached.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">All tickets are within SLA compliance.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...slaBreached, ...slaAtRisk].map(ticket => (
                    <div
                      key={ticket.id}
                      className={`p-4 rounded-xl border-2 ${
                        ticket.slaStatus === 'Breached' ? 'border-red-500 bg-red-50' : 'border-orange-400 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-sm text-gray-700">{ticket.id}</span>
                            <Badge variant="outline" className={
                              ticket.slaStatus === 'Breached'
                                ? 'border-red-600 text-red-700 bg-red-100'
                                : 'border-orange-600 text-orange-700 bg-orange-100'
                            }>
                              {ticket.slaStatus}
                            </Badge>
                          </div>
                          <p className="font-semibold text-gray-900">{ticket.title}</p>
                          <p className="text-sm text-gray-500">
                            Assigned to: {ticket.assignedTo?.name || 'Unassigned'} • Dept: {ticket.department || 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {ticket.status !== 'Escalated' ? (
                            <Button
                              size="sm"
                              className={ticket.slaStatus === 'Breached' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
                              onClick={() => openEscalateModal(ticket)}
                            >
                              <ArrowUpCircle className="w-3 h-3 mr-1" />
                              Escalate
                            </Button>
                          ) : (
                            <div className="text-xs font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded px-2 py-1 text-center">
                              ↑ Escalated
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/ticket/${ticket.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Escalation Modal ── */}
      {escalateTicketObj && (() => {
        const target = EscalationEngine.findTarget(currentUser, users, escalateTicketObj);
        const level = EscalationEngine.getLevel(currentUser.role);
        const timeout = target ? EscalationEngine.getTimeoutHours(escalateTicketObj.priority, level || 1) : 0;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border-t-4 border-orange-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <ArrowUpCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Escalate Ticket</h2>
                    <p className="text-sm text-gray-500">{EscalationEngine.getMatrixLabel(currentUser.role)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4 border">
                  <p className="text-xs text-gray-500 mb-1">Ticket</p>
                  <p className="font-semibold text-[#01411C]">{escalateTicketObj.id} — {escalateTicketObj.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{escalateTicketObj.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${escalateTicketObj.slaStatus === 'Breached' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      SLA {escalateTicketObj.slaStatus}
                    </span>
                  </div>
                </div>

                {target ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Escalating To</p>
                    <p className="font-semibold text-blue-800">{target.name}</p>
                    <p className="text-xs text-blue-600">{target.role} • {target.department}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <p className="text-xs text-blue-600">{timeout}h resolution window ({escalateTicketObj.priority} priority, Level {level})</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                    No escalation target found for your role.
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Escalation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3}
                    placeholder="Describe why this ticket needs escalation..."
                    value={escalateReason}
                    onChange={e => setEscalateReason(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => { setEscalateTicketObj(null); setEscalateReason(''); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                    onClick={handleConfirmEscalate}
                    disabled={!target || !escalateReason.trim()}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Confirm Escalation
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
