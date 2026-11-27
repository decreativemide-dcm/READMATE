
import React, { useEffect, useState } from 'react';
import {
  RefreshCw,
  X,
} from 'lucide-react';

import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [registration, setRegistration] = useState(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    immediate: true,

    onRegisteredSW(swUrl, swRegistration) {
      console.log(
        'READMATE service worker registered:',
        swUrl
      );

      if (swRegistration) {
        setRegistration(swRegistration);
      }
    },

    onRegisterError(error) {
      console.error(
        'READMATE service worker registration failed:',
        error
      );
    }
  });

  // Check periodically for new app versions
  useEffect(() => {
    if (!registration) return;

    const checkForUpdates = async () => {
      try {
        await registration.update();

        console.log('READMATE: Checked for app updates.');
      } catch (error) {
        console.error(
          'READMATE update check failed:',
          error
        );
      }
    };

    // Check once after registration
    checkForUpdates();

    // Check every 30 seconds
    const interval = setInterval(
      checkForUpdates,
      30 * 1000
    );

    return () => clearInterval(interval);
  }, [registration]);

  // Show notification when an update is available
  useEffect(() => {
    if (needRefresh) {
      setShow(true);
      console.log('READMATE: A new version is available.');
    }
  }, [needRefresh]);

  const updateApp = async () => {
    setUpdating(true);

    try {
      await updateServiceWorker(true);
    } catch (error) {
      console.error('READMATE update failed:', error);
      setUpdating(false);
    }
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button
          style={styles.close}
          onClick={() => setShow(false)}
          aria-label="Close update notification"
          disabled={updating}
        >
          <X size={19} />
        </button>

       <img
  src="/readmate-icon.svg"
  alt="READMATE"
  style={styles.appIcon}
/>

        <span style={styles.label}>
          READMATE UPDATE
        </span>

        <h3 style={styles.title}>
          A fresh reading experience awaits!
        </h3>

        <p style={styles.description}>
          We've made improvements to READMATE.
          Update now to enjoy the latest experience.
        </p>

        <button
          style={styles.updateButton}
          onClick={updateApp}
          disabled={updating}
        >
          <RefreshCw
            size={17}
            style={{
              animation: updating
                ? 'readmate-spin 1s linear infinite'
                : 'none'
            }}
          />

          {updating ? 'Updating...' : 'Update now'}
        </button>

        <button
          style={styles.later}
          onClick={() => setShow(false)}
          disabled={updating}
        >
          Update later
        </button>
      </div>

      <style>
        {`
          @keyframes readmate-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100000,
    background: 'rgba(15, 12, 25, 0.55)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },

  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 380,
    background: '#fff',
    borderRadius: 22,
    padding: '30px 25px 24px',
    textAlign: 'center',
    color: '#211b35',
    boxShadow: '0 20px 70px rgba(0,0,0,.2)'
  },

  close: {
    position: 'absolute',
    top: 15,
    right: 15,
    border: 'none',
    background: '#f3eff9',
    width: 34,
    height: 34,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    color: '#65567e'
  },

 appIcon: {
  width: 60,
  height: 60,
  margin: '0 auto 15px',
  borderRadius: 18,
  display: 'block',
  objectFit: 'contain'
  },

  label: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 2,
    color: '#7354c8'
  },

  title: {
    fontSize: 22,
    lineHeight: 1.3,
    margin: '12px 0'
  },

  description: {
    color: '#777184',
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 22
  },

  updateButton: {
    width: '100%',
    minHeight: 48,
    border: 'none',
    borderRadius: 12,
    background: '#7354c8',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    cursor: 'pointer'
  },

  later: {
    marginTop: 13,
    padding: 8,
    border: 'none',
    background: 'transparent',
    color: '#777184',
    fontWeight: 600,
    cursor: 'pointer'
  }
};
