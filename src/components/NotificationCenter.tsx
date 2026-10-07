import React, { useState } from 'react';
import { 
  Bell, X, Check, Trash2, ArrowLeft, MessageSquare, ShoppingBag, 
  Zap, Settings, Sliders, Shield, CheckCircle2, ChevronDown, ChevronUp 
} from 'lucide-react';
import { NotificationItem } from '../types/os';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  onClose,
  onOpenSettings,
}) => {
  const [repliedId, setRepliedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const renderNotifIcon = (appIcon: string) => {
    switch (appIcon) {
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-cyan-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-pink-400" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-teal-400" />;
    }
  };

  const handleActionClick = (notifId: string, actionKey: string) => {
    if (actionKey === 'reply') {
      setRepliedId(notifId);
    } else if (actionKey === 'mark_read') {
      onDismiss(notifId);
    } else {
      onDismiss(notifId);
    }
  };

  const submitReply = (notifId: string) => {
    if (replyText.trim()) {
      onDismiss(notifId);
      setRepliedId(null);
      setReplyText('');
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950/95 backdrop-blur-3xl text-white flex flex-col font-sans select-none animate-slideDown p-4 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-base text-white">Notifications</h2>
            <p className="text-[11px] text-slate-400">TECNO Notification Shade</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold px-2 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Notification Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Notifications List */}
      <div className="flex-1 py-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 text-center text-slate-500 space-y-2">
            <Bell className="w-10 h-10 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">No new notifications</p>
            <p className="text-xs text-slate-500">Your device is running cleanly with zero clutter.</p>
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3.5 shadow-md space-y-2 relative group hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center">
                    {renderNotifIcon(item.appIcon)}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{item.appName}</span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>

                <button
                  onClick={() => onDismiss(item.id)}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded-full hover:bg-slate-800 transition"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
              </div>

              {/* Inline Quick Reply if activated */}
              {repliedId === item.id && (
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a fast reply..."
                    className="flex-1 bg-slate-950 border border-teal-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => submitReply(item.id)}
                    className="px-3 py-1.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              {item.actions && item.actions.length > 0 && repliedId !== item.id && (
                <div className="flex gap-2 pt-1 border-t border-slate-800/60">
                  {item.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(item.id, act.action)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-medium transition"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer System Status */}
      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Do Not Disturb: Off</span>
        <span className="text-teal-400">Priority Hub Active</span>
      </div>
    </div>
  );
};
