import React from 'react';
import { MOCK_NOTIFICATIONS } from '../services/mockData';
import { Bell, ShieldAlert, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig = {
  critical: { icon: <ShieldAlert className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500' },
  warning: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500' },
  success: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-500' },
  info: { icon: <Info className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30" onClick={onClose}></div>

      {/* Panel */}
      <div className="absolute top-full right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 overflow-hidden animate-fade-in ring-1 ring-black/5">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Mark all read
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-700/50">
          {MOCK_NOTIFICATIONS.map(notification => {
            const config = typeConfig[notification.type];
            return (
              <div
                key={notification.id}
                className={`px-5 py-4 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-slate-800' : 'bg-slate-800/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-lg ${config.bg} ${config.color} shrink-0 mt-0.5`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-medium truncate ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0`}></div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                    <span className="text-xs text-slate-500 mt-1 block">{notification.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-700 bg-slate-900/50">
          <button className="w-full text-center text-xs text-slate-400 hover:text-white font-medium transition-colors py-1">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};
