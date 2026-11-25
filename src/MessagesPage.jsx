
import React, { useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  UserRound,
  Clock3,
  Check,
  CheckCheck
} from 'lucide-react';

import corporateMaleAvatar from './avatar/corporate-male.png';
import corporateFemaleAvatar from './avatar/corporate-female.png';
import casualMaleAvatar from './avatar/casual-male.png';
import casualFemaleAvatar from './avatar/casual-female.png';

const avatarImages = {
  'corporate-male': corporateMaleAvatar,
  'corporate-female': corporateFemaleAvatar,
  'casual-male': casualMaleAvatar,
  'casual-female': casualFemaleAvatar
};

export default function MessagesPage({
  buddy,
  userId,
  messages,
  loading,
  sending,
  messageText,
  setMessageText,
  onSend,
  onConnect
}) {
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (messageText.trim() && !sending) {
      onSend();
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

  const buddyAvatar = buddy?.avatar_id
    ? avatarImages[buddy.avatar_id]
    : null;

  if (!buddy) {
    return (
      <div className="page-stack">
        <div className="empty-hint">
          <MessageCircle size={22} />
          <span>
            You need an accepted reading buddy before you can start a private conversation.
          </span>
        </div>

        <button className="primary-button" onClick={onConnect}>
          <UserRound size={16} />
          Find a reading buddy
        </button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Your conversations</h2>
          <p>Good conversations make learning better.</p>
        </div>
      </div>

      <section
        style={{
          background: '#fff',
          border: '1px solid rgba(150,120,180,.15)',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '540px',
          boxShadow: '0 8px 30px rgba(50,35,70,.04)'
        }}
      >
        {/* Conversation header */}
        <div
          style={{
            padding: '17px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid #f0ebf5',
            background: '#fff'
          }}
        >
          <div
            className="partner-avatar"
            style={{
              width: 44,
              height: 44,
              flexShrink: 0,
              fontSize: 17,
              overflow: 'hidden'
            }}
          >
            {buddyAvatar ? (
              <img
                src={buddyAvatar}
                alt={`${buddy.display_name || 'Reading buddy'} avatar`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '50%'
                }}
              />
            ) : (
              (buddy.display_name || 'R').charAt(0).toUpperCase()
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <b
              style={{
                color: '#30263b',
                display: 'block',
                fontSize: 14
              }}
            >
              {buddy.display_name || 'Your reading buddy'}
            </b>

            <small
              style={{
                color: '#9586a2',
                fontSize: 11
              }}
            >
              @{buddy.username || 'reader'} · Reading buddy
            </small>
          </div>

          <div
            style={{
              marginLeft: 'auto',
              color: '#806b91',
              background: '#f7f3fb',
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <MessageCircle size={18} />
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            overflowY: 'auto',
            minHeight: '350px',
            maxHeight: '520px',
            background: '#fbfaff'
          }}
        >
          {loading ? (
            <div className="empty-hint">
              <Clock3 size={18} />
              <span>Loading your conversation...</span>
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                margin: 'auto',
                textAlign: 'center',
                maxWidth: '290px',
                color: '#92849f'
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 20,
                  background: '#f0eafa',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 14px'
                }}
              >
                <MessageCircle size={26} color="#8065a7" />
              </div>

              <h3
                style={{
                  color: '#51415f',
                  margin: '0 0 8px',
                  fontSize: 16
                }}
              >
                Start the conversation
              </h3>

              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7
                }}
              >
                Share something interesting you've read or simply say hello.
              </p>
            </div>
          ) : (
            messages.map(message => {
              const mine = message.sender_id === userId;

              return (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: mine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '78%',
                      minWidth: '90px',
                      padding: '12px 15px',
                      borderRadius: mine
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      background: mine ? '#8065a7' : '#fff',
                      color: mine ? '#fff' : '#51415f',
                      border: mine ? 'none' : '1px solid #eee8f4',
                      boxShadow: '0 3px 10px rgba(50,35,70,.035)'
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.65,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {message.body}
                    </p>

                    <div
                      style={{
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10,
                        opacity: 0.78
                      }}
                    >
                      <span>{formatTime(message.created_at)}</span>

                      {mine && (
                        message.read_at
                          ? <CheckCheck size={13} />
                          : <Check size={13} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        {/* Message composer */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '15px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
            borderTop: '1px solid #f0ebf5',
            background: '#fff'
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Write a message..."
              rows={1}
              maxLength={5000}
              disabled={sending}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px 14px',
                border: '1px solid #e8e0ef',
                borderRadius: '12px',
                outline: 'none',
                font: 'inherit',
                fontSize: 13,
                color: '#51415f',
                background: '#fdfcff'
              }}
            />

            <div
              style={{
                textAlign: 'right',
                fontSize: 10,
                color: '#a398ad',
                marginTop: 4
              }}
            >
              {messageText.length}/5000
            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={!messageText.trim() || sending}
            style={{
              minHeight: '44px',
              padding: '0 16px',
              opacity: !messageText.trim() || sending ? 0.55 : 1
            }}
          >
            <Send size={16} />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </div>
  );
}
