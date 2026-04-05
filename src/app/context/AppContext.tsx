// App Context - Global State Management

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, Environment, Ticket, Comment, Notification } from '../types';
import { mockUsers, allUsers as baseAllUsers, allTickets, mockComments, mockNotifications } from '../data/mock-data';
import { TicketService } from '../services/ticket-service';
import { AuditService } from '../services/audit-service';
import { EscalationEngine } from '../services/escalation-engine';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  canSwitchRoles: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  users: User[];
  addUser: (user: User) => void;
  tickets: Ticket[];
  escalateTicket: (ticketId: string, reason: string, escalatedTo: User) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  refreshTickets: () => void;
  comments: Comment[];
  addComment: (comment: Comment) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadNotificationCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ──────────────────────────────────────────────
// localStorage persistence helpers
// New tickets submitted by users and ticket
// updates (status changes, assignments) are
// persisted so they survive across logins.
// ──────────────────────────────────────────────
const USER_TICKETS_KEY  = 'ncms_user_tickets';
const TICKET_UPDATES_KEY = 'ncms_ticket_updates';
const USER_COMMENTS_KEY = 'ncms_user_comments';

function reviveDates(obj: any): any {
  if (!obj) return obj;
  const dateFields = ['createdAt', 'updatedAt', 'slaDeadline', 'resolvedAt', 'closedAt', 'escalatedAt'];
  const result = { ...obj };
  for (const field of dateFields) {
    if (result[field]) result[field] = new Date(result[field]);
  }
  return result;
}

function loadUserTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(USER_TICKETS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as any[]).map(reviveDates);
  } catch { return []; }
}

function saveUserTicket(ticket: Ticket) {
  try {
    const existing = loadUserTickets();
    const updated = [ticket, ...existing.filter(t => t.id !== ticket.id)];
    localStorage.setItem(USER_TICKETS_KEY, JSON.stringify(updated));
  } catch { /* ignore storage errors */ }
}

function loadTicketUpdates(): Record<string, Partial<Ticket>> {
  try {
    const raw = localStorage.getItem(TICKET_UPDATES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Partial<Ticket>>;
  } catch { return {}; }
}

function saveTicketUpdate(id: string, updates: Partial<Ticket>) {
  try {
    const all = loadTicketUpdates();
    all[id] = { ...all[id], ...updates };
    localStorage.setItem(TICKET_UPDATES_KEY, JSON.stringify(all));
  } catch { /* ignore storage errors */ }
}

function loadUserComments(): Comment[] {
  try {
    const raw = localStorage.getItem(USER_COMMENTS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as any[]).map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
  } catch { return []; }
}

function saveUserComment(comment: Comment) {
  try {
    const existing = loadUserComments();
    localStorage.setItem(USER_COMMENTS_KEY, JSON.stringify([...existing, comment]));
  } catch { /* ignore storage errors */ }
}

// ── User persistence ──────────────────────────
const STORED_USERS_KEY = 'ncms_stored_users';

function loadStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORED_USERS_KEY);
    return raw ? JSON.parse(raw) as User[] : [];
  } catch { return []; }
}

function saveStoredUser(user: User) {
  try {
    const existing = loadStoredUsers();
    const updated = [...existing.filter(u => u.id !== user.id), user];
    localStorage.setItem(STORED_USERS_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

function buildInitialUsers(): User[] {
  const stored = loadStoredUsers();
  const baseIds = new Set(baseAllUsers.map(u => u.id));
  return [...baseAllUsers, ...stored.filter(u => !baseIds.has(u.id))];
}

// Build the initial merged ticket list
function buildInitialTickets(): Ticket[] {
  const userTickets  = loadUserTickets();   // citizen-created tickets
  const updates      = loadTicketUpdates(); // patches keyed by ticket id
  const userIds      = new Set(userTickets.map(t => t.id));

  // Apply persisted patches to base tickets
  // Patches come from JSON, so any Date fields inside them are strings — revive them first
  const patchedBase = allTickets.map(t => {
    if (updates[t.id]) return { ...t, ...reviveDates(updates[t.id] as any) };
    return t;
  });

  // Apply persisted patches to user-created tickets too
  const patchedUser = userTickets.map(t => {
    if (updates[t.id]) return { ...t, ...reviveDates(updates[t.id] as any) };
    return t;
  });

  // User tickets first (newest), then base tickets (skip any duplicates)
  return [
    ...patchedUser,
    ...patchedBase.filter(t => !userIds.has(t.id)),
  ];
}

function buildInitialComments(): Comment[] {
  const userComments = loadUserComments();
  const existingIds  = new Set(mockComments.map(c => c.id));
  return [...mockComments, ...userComments.filter(c => !existingIds.has(c.id))];
}

// ── Notification persistence ──────────────────
const NOTIF_READ_KEY    = 'ncms_notif_read';    // Set of read notification ids
const NOTIF_DELETED_KEY = 'ncms_notif_deleted'; // Set of deleted notification ids
const USER_NOTIFS_KEY   = 'ncms_user_notifs';   // User-created notifications (from actions)

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIF_READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveReadId(id: string) {
  try {
    const s = loadReadIds();
    s.add(id);
    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...s]));
  } catch { /* ignore */ }
}

function saveAllReadIds(ids: string[]) {
  try {
    const s = loadReadIds();
    ids.forEach(id => s.add(id));
    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...s]));
  } catch { /* ignore */ }
}

function loadDeletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIF_DELETED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveDeletedId(id: string) {
  try {
    const s = loadDeletedIds();
    s.add(id);
    localStorage.setItem(NOTIF_DELETED_KEY, JSON.stringify([...s]));
  } catch { /* ignore */ }
}

function loadUserNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(USER_NOTIFS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as any[]).map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
    }));
  } catch { return []; }
}

function saveUserNotification(notif: Notification) {
  try {
    const existing = loadUserNotifications();
    const updated = [notif, ...existing.filter(n => n.id !== notif.id)];
    localStorage.setItem(USER_NOTIFS_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

function buildInitialNotifications(): Notification[] {
  const readIds    = loadReadIds();
  const deletedIds = loadDeletedIds();
  const userNotifs = loadUserNotifications();
  const baseIds    = new Set(mockNotifications.map(n => n.id));

  // Apply read state and filter deleted from base
  const base = mockNotifications
    .filter(n => !deletedIds.has(n.id))
    .map(n => readIds.has(n.id) ? { ...n, read: true } : n);

  // Add user-created notifications (from ticket actions) that aren't duplicates
  const extra = userNotifs
    .filter(n => !deletedIds.has(n.id) && !baseIds.has(n.id))
    .map(n => readIds.has(n.id) ? { ...n, read: true } : n);

  return [...extra, ...base];
}

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>('Demo');
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(buildInitialUsers);
  const [tickets, setTickets] = useState<Ticket[]>(buildInitialTickets);
  const [comments, setComments] = useState<Comment[]>(buildInitialComments);
  const [notifications, setNotifications] = useState<Notification[]>(buildInitialNotifications);

  useEffect(() => {
    TicketService.initialize(tickets);
    AuditService.initializeSampleEvents(tickets);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore logged-in user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedUser && savedAuth === 'true') {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    // Refresh all persisted data on login so changes from other sessions are loaded
    setTickets(buildInitialTickets());
    setComments(buildInitialComments());
    setNotifications(buildInitialNotifications());
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const addUser = (user: User) => {
    saveStoredUser(user);
    setUsers(prev => [...prev, user]);
  };

  const escalateTicket = (ticketId: string, reason: string, escalatedTo: User) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const level = EscalationEngine.getLevel(currentUser.role) || 1;
    const escalatedAt = new Date();

    const escalationUpdates: Partial<Ticket> = {
      status: 'Escalated',
      escalatedAt,
      escalatedBy: currentUser,
      escalatedTo,
      escalationReason: reason.trim(),
      escalationLevel: level,
    };

    saveTicketUpdate(ticketId, escalationUpdates);
    setTickets(prev =>
      prev.map(t => t.id === ticketId ? { ...t, ...escalationUpdates, updatedAt: escalatedAt } : t)
    );

    AuditService.logEvent('TicketEscalated', ticketId, currentUser, {
      escalatedTo: escalatedTo.name,
      escalatedToRole: escalatedTo.role,
      level,
      reason,
      fromStatus: ticket.status,
    });

    const escalationNotif: Notification = {
      id: `N-ESC-${Date.now()}`,
      userId: escalatedTo.id,
      title: `Escalation: ${ticket.priority} Priority Ticket`,
      message: `Ticket ${ticketId} "${ticket.title}" has been escalated to you (Level ${level}) by ${currentUser.name}. Reason: ${reason}. You have ${EscalationEngine.getTimeoutHours(ticket.priority, level)}h to resolve.`,
      type: 'warning',
      ticketId,
      createdAt: escalatedAt,
      read: false,
    };
    saveUserNotification(escalationNotif);
    setNotifications(prev => [escalationNotif, ...prev]);
  };

  const addTicket = (ticket: Ticket) => {
    // Persist to localStorage FIRST so other sessions (after login switch) see it
    saveUserTicket(ticket);
    setTickets(prev => [ticket, ...prev]);

    // Notify the submitting citizen
    const notification: Notification = {
      id: `N-${Date.now()}`,
      userId: ticket.createdBy.id,
      title: 'Complaint Submitted',
      message: `Your complaint "${ticket.title}" (${ticket.id}) has been submitted and is ${ticket.status === 'Auto-Resolved' ? 'auto-resolved by AI' : 'under review'}.`,
      type: ticket.status === 'Auto-Resolved' ? 'success' : 'info',
      ticketId: ticket.id,
      createdAt: new Date(),
      read: false,
    };
    saveUserNotification(notification);
    setNotifications(prev => [notification, ...prev]);

    // Notify Call Center Officers about new incoming ticket
    const ccoNotification: Notification = {
      id: `N-CCO-${Date.now()}`,
      userId: 'all-cco',
      title: `New ${ticket.priority} Priority Complaint`,
      message: `"${ticket.title}" (${ticket.id}) submitted by ${ticket.createdBy.name}. Category: ${ticket.category}.`,
      type: ticket.priority === 'Critical' ? 'error' : 'info',
      ticketId: ticket.id,
      createdAt: new Date(),
      read: false,
    };
    saveUserNotification(ccoNotification);
    setNotifications(prev => [ccoNotification, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    // Persist the update so it survives login switches
    saveTicketUpdate(id, updates);

    setTickets(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)
    );

    const ticket = tickets.find(t => t.id === id);
    if (ticket && updates.status && updates.status !== ticket.status) {
      AuditService.logEvent(
        'StatusChanged',
        id,
        currentUser,
        { from: ticket.status, to: updates.status }
      );
      const statusNotif: Notification = {
        id: `N-${Date.now()}-status`,
        userId: ticket.createdBy.id,
        title: updates.status === 'Resolved' ? 'Complaint Resolved' :
               updates.status === 'Assigned' ? 'Complaint Assigned to Agent' :
               updates.status === 'Closed'   ? 'Complaint Closed'   :
               updates.status === 'Escalated' ? 'Complaint Escalated' :
               updates.status === 'Client Confirmation' ? 'Confirmation Required' :
               'Complaint Status Updated',
        message: updates.status === 'Client Confirmation'
          ? `Your complaint ${id} has been resolved. Please confirm by visiting the ticket.`
          : `Complaint ${id} status updated to "${updates.status}" by ${currentUser.name}.`,
        type: ['Resolved', 'Closed', 'Auto-Resolved'].includes(updates.status) ? 'success' :
              updates.status === 'Escalated' ? 'warning' :
              updates.status === 'Client Confirmation' ? 'warning' : 'info',
        ticketId: id,
        createdAt: new Date(),
        read: false,
      };
      saveUserNotification(statusNotif);
      setNotifications(prev => [statusNotif, ...prev]);
    }
  };

  const refreshTickets = () => {
    setTickets(buildInitialTickets());
  };

  const addComment = (comment: Comment) => {
    // Persist user-added comments too
    saveUserComment(comment);
    setComments(prev => [...prev, comment]);
  };

  const addNotification = (notification: Notification) => {
    saveUserNotification(notification);
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    saveReadId(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    // Save all IDs that belong to this user as read
    const myIds = notifications
      .filter(n =>
        n.userId === currentUser.id ||
        n.userId === 'all' ||
        (n.userId === 'all-cco' && currentUser.role === 'Call Center Officer')
      )
      .map(n => n.id);
    saveAllReadIds(myIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    saveDeletedId(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Unread count — only count notifications relevant to the current user's role
  const unreadNotificationCount = notifications.filter(n => {
    if (n.read) return false;
    if (n.userId === currentUser.id) return true;
    if (n.userId === 'all') return true;
    if (n.userId === 'all-cco' && currentUser.role === 'Call Center Officer') return true;
    return false;
  }).length;

  const canSwitchRoles = environment === 'Demo';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        environment,
        setEnvironment,
        canSwitchRoles,
        isAuthenticated,
        login,
        logout,
        users,
        addUser,
        tickets,
        escalateTicket,
        addTicket,
        updateTicket,
        refreshTickets,
        comments,
        addComment,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        unreadNotificationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
