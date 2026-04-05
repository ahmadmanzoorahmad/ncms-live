// Notification Panel Component — connected to AppContext

import { Bell, Check, X, AlertCircle, Info, CheckCircle, XCircle, Ticket } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useApp();

  // Show notifications relevant to this user based on role
  const isCCO = currentUser.role === 'Call Center Officer';
  const myNotifications = notifications
    .filter(n => {
      if (n.userId === currentUser.id) return true;
      if (n.userId === 'all') return true;
      if (n.userId === 'all-cco' && isCCO) return true;
      return false;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = myNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error':   return <XCircle className="w-5 h-5 text-red-500" />;
      default:        return <Info className="w-5 h-5 text-[#01411C]" />;
    }
  };

  const getBorderColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50 border-gray-200';
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'error':   return 'bg-red-50 border-red-200';
      default:        return 'bg-[#DFF5E1] border-[#01411C]/20';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 border-l-4 border-[#01411C] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2">{unreadCount}</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70 flex-1">{currentUser.name} · {currentUser.role}</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsRead}
                className="text-white hover:bg-white/10 text-xs h-7 px-3"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {myNotifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Activity on your tickets will appear here
                </p>
              </div>
            ) : (
              myNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border-2 transition-all ${getBorderColor(notification.type, notification.read)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className={`font-semibold text-sm leading-tight ${notification.read ? 'text-gray-700' : 'text-[#01411C]'}`}>
                          {notification.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 flex-shrink-0 -mt-0.5"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 leading-snug">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {notification.ticketId && (
                            <Link to={`/ticket/${notification.ticketId}`} onClick={onClose}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-[#01411C] hover:bg-[#DFF5E1] px-2"
                              >
                                <Ticket className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </Link>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-[#01411C] hover:bg-[#DFF5E1] px-2"
                              onClick={() => markNotificationRead(notification.id)}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {myNotifications.length > 0 && (
          <div className="border-t border-gray-100 p-3 flex-shrink-0 bg-gray-50">
            <p className="text-xs text-center text-gray-400">
              {myNotifications.length} notification{myNotifications.length !== 1 ? 's' : ''} · {unreadCount} unread
            </p>
          </div>
        )}
      </div>
    </>
  );
}
