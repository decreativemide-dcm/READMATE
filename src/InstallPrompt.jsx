
import React, { useEffect, useState } from 'react';
import { Download, X, BookOpen, Smartphone } from 'lucide-react';

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isInstalled) return;

    const dismissedUntil = Number(
      localStorage.getItem('readmate-install-dismissed') || 0
    );

    if (Date.now() < dismissedUntil) return;

    const handleInstallAvailable = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
    };

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    window.addEventListener(
      'beforeinstallprompt',
      handleInstallAvailable
    );

    window.addEventListener('appinstalled', handleInstalled);

    // iOS does not support the automatic install prompt.
    if (isIOS) {
      const timer = setTimeout(() => setVisible(true), 2500);

      return () => {
        clearTimeout(timer);
        window.removeEventListener(
          'beforeinstallprompt',
          handleInstallAvailable
        );
        window.removeEventListener('appinstalled', handleInstalled);
      };
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleInstallAvailable
      );
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismissPopup = () => {
    localStorage.setItem(
      'readmate-install-dismissed',
      String(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    setVisible(false);
  };

  const installApp = async () => {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }

    await installEvent.prompt();

    const result = await installEvent.userChoice;

    if (result.outcome === 'accepted') {
      setVisible(false);
    }

    setInstallEvent(null);
  };

  if (!visible) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button
          onClick={dismissPopup}
          style={styles.close}
          aria-label="Close installation popup"
        >
          <X size={20} />
        </button>

        <div style={styles.icon}>
          <BookOpen size={34} />
        </div>

        <div style={styles.tag}>READMATE APP</div>

        <h2 style={styles.heading}>
          Take your reading experience everywhere.
        </h2>

        <p style={styles.description}>
          Install READMATE on your device and enjoy your
          personal reading space, connect with reading buddies
          and keep your reading journey close.
        </p>

        {showInstructions ? (
          <div style={styles.instructions}>
            <strong>How to install READMATE</strong>

            {isIOS ? (
              <p>
                1. Tap the Share button in Safari.
                <br />
                2. Select Add to Home Screen.
                <br />
                3. Tap Add.
              </p>
            ) : (
              <p>
                Open your browser menu and select
                <strong> Install READMATE </strong>
                or <strong>Add to Home screen</strong>.
              </p>
            )}
          </div>
        ) : (
          <button onClick={installApp} style={styles.installButton}>
            <Download size={19} />
            Install READMATE
          </button>
        )}

        <button
          onClick={dismissPopup}
          style={styles.laterButton}
        >
          Maybe later
        </button>

        <div style={styles.footer}>
          <Smartphone size={15} />
          <span>Available on supported devices</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    background: 'rgba(15, 12, 25, 0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  popup: {
    position: 'relative',
    width: '100%',
    maxWidth: '410px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px 25px 24px',
    textAlign: 'center',
    boxShadow: '0 20px 70px rgba(0,0,0,0.2)',
    color: '#211b35'
  },
  close: {
    position: 'absolute',
    right: '16px',
    top: '16px',
    border: 'none',
    background: '#f2eff8',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    color: '#5c5270'
  },
  icon: {
    width: '72px',
    height: '72px',
    borderRadius: '22px',
    background: '#eee8ff',
    color: '#7354c8',
    display: 'grid',
    placeItems: 'center',
    margin: '5px auto 17px'
  },
  tag: {
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '2px',
    color: '#7354c8',
    marginBottom: '12px'
  },
  heading: {
    fontSize: '25px',
    lineHeight: 1.25,
    fontWeight: 800,
    margin: '0 0 13px'
  },
  description: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#777184',
    marginBottom: '24px'
  },
  installButton: {
    width: '100%',
    minHeight: '50px',
    border: 'none',
    borderRadius: '13px',
    background: '#7354c8',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  laterButton: {
    border: 'none',
    background: 'transparent',
    color: '#777184',
    fontSize: '13px',
    fontWeight: 600,
    marginTop: '15px',
    padding: '8px 15px',
    cursor: 'pointer'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '7px',
    color: '#9993a5',
    fontSize: '11px',
    marginTop: '18px'
  },
  instructions: {
    background: '#f5f1ff',
    borderRadius: '13px',
    padding: '15px',
    textAlign: 'left',
    fontSize: '13px',
    lineHeight: 1.8,
    color: '#51436f'
  }
};
