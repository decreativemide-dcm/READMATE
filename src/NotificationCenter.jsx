
import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  MessageCircle,
  Users,
  X,
  Inbox
} from 'lucide-react';
import { supabase } from './lib/supabase';

export default function NotificationCenter({ userId, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      const items = data || [];

      setNotifications(items);
      setUnreadCount(items.filter(item => !item.read_at).length);
    } catch (error) {
      console.error('Notification loading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();

    const channel = supabase
      .channel(`readmate-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .is('read_at', null);

    if (error) {
      console.error('Unable to mark notification as read:', error);
      return false;
    }

    setNotifications(previous =>
      previous.map(item =>
        item.id === notificationId
          ? { ...item, read_at: new Date().toISOString() }
          : item
      )
    );

    setUnreadCount(previous => Math.max(0, previous - 1));

    return true;
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0) return;

    const now = new Date().toISOString();

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: now })
      .eq('user_id', userId)
      .is('read_at', null);

    if (error) {
      console.error('Unable to mark all notifications as read:', error);
      return;
    }

    setNotifications(previous =>
      previous.map(item => ({
        ...item,
        read_at: item.read_at || now
      }))
    );

    setUnreadCount(0);
  };

  const handleNotificationClick = async (item) => {
    if (!item.read_at) {
      await markAsRead(item.id);
    }

    setIsOpen(false);

    if (item.type === 'new_message') {
      onNavigate?.('messages');
    } else if (
      item.type === 'buddy_request' ||
      item.type === 'buddy_accepted'
    ) {
      onNavigate?.('connect');
    }
  };

  const formatTime = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getIcon = (type) => {
    if (type === 'new_message') {
      return <MessageCircle size={18} />;
    }

    return <Users size={18} />;
  };

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      <button
        type="button"
        onClick={() => setIsOpen(previous => !previous)}
        aria-label="Notifications"
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          border: '1px solid #eee8f4',
          background: '#fff',
          color: '#69547e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 19,
              height: 19,
              padding: '0 4px',
              borderRadius: 20,
              background: '#e45c72',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: -1
            }}
          />

          <section
            style={{
              position: 'absolute',
              top: 52,
              right: 0,
              width: 'min(360px, calc(100vw - 32px))',
              background: '#fff',
              border: '1px solid #eee8f4',
              borderRadius: 17,
              boxShadow: '0 15px 45px rgba(40,25,55,.14)',
              overflow: 'hidden',
              color: '#30263b'
            }}
          >
            <div
              style={{
                padding: '17px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f0ebf5'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>
                  Notifications
                </h3>
                <small style={{ color: '#968aa1' }}>
                  {unreadCount} unread
                </small>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    style={{
                      border: 0,
                      background: 'transparent',
                      color: '#8065a7',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCheck size={19} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: '#968aa1',
                    cursor: 'pointer'
                  }}
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div style={{ maxHeight: 390, overflowY: 'auto' }}>
              {loading && notifications.length === 0 ? (
                <div style={{
                  padding: 30,
                  textAlign: 'center',
                  color: '#968aa1'
                }}>
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{
                  padding: 35,
                  textAlign: 'center',
                  color: '#968aa1'
                }}>
                  <Inbox size={28} style={{ marginBottom: 10 }} />
                  <p style={{ margin: 0, fontSize: 13 }}>
                    You're all caught up.
                  </p>
                </div>
              ) : (
                notifications.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    style={{
                      width: '100%',
                      padding: '15px 17px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      textAlign: 'left',
                      border: 0,
                      borderBottom: '1px solid #f4f0f7',
                      background: item.read_at ? '#fff' : '#faf7ff',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      style={{
                        width: 37,
                        height: 37,
                        flexShrink: 0,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0eafa',
                        color: '#8065a7'
                      }}
                    >
                      {getIcon(item.type)}
                    </span>

                    <span style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{
                        display: 'block',
                        fontSize: 13,
                        color: '#40334c',
                        marginBottom: 4
                      }}>
                        {item.title}
                      </strong>

                      <span style={{
                        display: 'block',
                        fontSize: 12,
                        lineHeight: 1.55,
                        color: '#82758f'
                      }}>
                        {item.body}
                      </span>

                      <small style={{
                        display: 'block',
                        marginTop: 6,
                        fontSize: 10,
                        color: '#a398af'
                      }}>
                        {formatTime(item.created_at)}
                      </small>
                    </span>

                    {!item.read_at && (
                      <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#8065a7',
                        marginTop: 6,
                        flexShrink: 0
                      }} />
                    )}
                  </button>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
