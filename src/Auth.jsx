
import React, { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() }
          }
        });

        if (error) throw error;

        setMessage('Account created successfully! Welcome to READMATE.');
        setPassword('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setMessage('Enter your email address first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: window.location.origin
        }
      );

      if (error) throw error;

      setMessage('Password reset link requested. Check your email.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liquid-auth">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .liquid-auth {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 15% 20%, #e6dcff 0%, transparent 38%),
            radial-gradient(ellipse at 85% 80%, #d6e9ff 0%, transparent 38%),
            linear-gradient(135deg, #f9f7ff, #eef1ff 55%, #f8f6ff);
          font-family: inherit;
        }

        .liquid-orb {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          filter: blur(1px);
          pointer-events: none;
          animation: liquidFloat 12s ease-in-out infinite alternate;
        }

        .liquid-orb.one {
          width: 320px;
          height: 320px;
          top: -100px;
          left: -80px;
          background: linear-gradient(135deg,
            rgba(151, 115, 225, .55),
            rgba(191, 176, 255, .12));
          box-shadow: inset -20px -20px 55px rgba(255,255,255,.6);
        }

        .liquid-orb.two {
          width: 260px;
          height: 260px;
          right: -65px;
          bottom: -65px;
          background: linear-gradient(145deg,
            rgba(106, 161, 228, .45),
            rgba(195, 218, 255, .15));
          animation-delay: -4s;
        }

        .liquid-orb.three {
          width: 110px;
          height: 110px;
          top: 18%;
          right: 17%;
          background: linear-gradient(145deg,
            rgba(196, 163, 255, .5),
            rgba(255,255,255,.35));
          animation-duration: 9s;
        }

        .liquid-auth-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          padding: 42px;
          border: 1px solid rgba(255,255,255,.8);
          border-radius: 28px;
          background: rgba(255,255,255,.57);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          box-shadow:
            0 25px 80px rgba(69, 53, 113, .12),
            inset 0 1px 1px rgba(255,255,255,.95),
            inset 0 -1px 1px rgba(255,255,255,.3);
          animation: cardAppear .7s cubic-bezier(.2,.8,.2,1) both;
        }

        .liquid-auth-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            140deg,
            rgba(255,255,255,.95),
            rgba(166,139,225,.2),
            rgba(255,255,255,.5)
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .liquid-logo {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1.8px;
          color: #302344;
          margin: 0;
        }

        .liquid-logo span {
          color: #9272cb;
        }

        .liquid-tagline {
          margin: 8px 0 30px;
          color: #81758e;
          font-size: 13px;
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .liquid-heading {
          color: #342747;
          font-size: 27px;
          letter-spacing: -1px;
          margin: 0 0 8px;
        }

        .liquid-description {
          color: #81778d;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 28px;
        }

        .liquid-field {
          display: block;
          width: 100%;
          height: 52px;
          margin-bottom: 15px;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137,116,168,.18);
          background: rgba(255,255,255,.58);
          color: #392c49;
          font-size: 14px;
          outline: none;
          transition: .25s ease;
          box-shadow: inset 0 2px 5px rgba(74,53,103,.025);
        }

        .liquid-field::placeholder {
          color: #a49bad;
        }

        .liquid-field:focus {
          border-color: #9c7bd0;
          background: rgba(255,255,255,.88);
          box-shadow: 0 0 0 4px rgba(151,117,205,.11);
        }

        .liquid-submit {
          width: 100%;
          height: 53px;
          margin-top: 8px;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 14px;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(115deg, #50386f, #8060b4 55%, #9878d0);
          box-shadow:
            0 9px 22px rgba(91,64,139,.25),
            inset 0 1px 1px rgba(255,255,255,.35);
          transition: transform .25s, box-shadow .25s, filter .25s;
        }

        .liquid-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.08);
          box-shadow: 0 13px 28px rgba(91,64,139,.32);
        }

        .liquid-submit:active:not(:disabled) {
          transform: scale(.985);
        }

        .liquid-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .liquid-reset {
          display: block;
          margin: 13px auto 0;
          padding: 6px;
          border: 0;
          background: transparent;
          color: #8063a9;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .liquid-reset:hover,
        .liquid-switch button:hover {
          color: #50386f;
          text-decoration: underline;
        }

        .liquid-message {
          padding: 12px 14px;
          margin: 17px 0 0;
          border: 1px solid rgba(145,115,193,.15);
          border-radius: 12px;
          background: rgba(237,230,250,.65);
          color: #624b83;
          font-size: 13px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .liquid-switch {
          text-align: center;
          margin: 25px 0 0;
          color: #81778d;
          font-size: 13px;
        }

        .liquid-switch button {
          padding: 0 3px;
          border: 0;
          background: transparent;
          color: #7654a6;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .liquid-footer {
          margin-top: 28px;
          text-align: center;
          color: #a097ad;
          font-size: 11px;
          letter-spacing: 1.3px;
        }

        @keyframes liquidFloat {
          from { transform: translate3d(0, 0, 0) rotate(0deg); }
          to { transform: translate3d(25px, -25px, 0) rotate(18deg); }
        }

        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(18px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 520px) {
          .liquid-auth {
            padding: 18px;
          }

          .liquid-auth-card {
            padding: 30px 23px;
            border-radius: 23px;
          }

          .liquid-heading {
            font-size: 24px;
          }

          .liquid-orb.one {
            width: 220px;
            height: 220px;
          }

          .liquid-orb.two {
            width: 190px;
            height: 190px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .liquid-orb,
          .liquid-auth-card {
            animation: none;
          }

          .liquid-submit,
          .liquid-field {
            transition: none;
          }
        }
      `}</style>

      <div className="liquid-orb one" />
      <div className="liquid-orb two" />
      <div className="liquid-orb three" />

      <form className="liquid-auth-card" onSubmit={handleSubmit}>
        <h1 className="liquid-logo">
          readmate<span>.</span>
        </h1>

        <p className="liquid-tagline">
          READ TOGETHER. GROW TOGETHER.
        </p>

        <h2 className="liquid-heading">
          {mode === 'signup' ? 'Begin your journey.' : 'Welcome back.'}
        </h2>

        <p className="liquid-description">
          {mode === 'signup'
            ? 'Create your space for ideas, growth and meaningful reading.'
            : 'Your next chapter is waiting. Pick up where you left off.'}
        </p>

        {mode === 'signup' && (
          <input
            className="liquid-field"
            required
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
        )}

        <input
          className="liquid-field"
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />

  <div className="liquid-password-wrap">
  <input
    className="liquid-field"
    required
    type={showPassword ? 'text' : 'password'}
    minLength={6}
    placeholder="Password (at least 6 characters)"
    value={password}
    onChange={e => setPassword(e.target.value)}
    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
  />

  <button
    type="button"
    className="liquid-password-toggle"
    onClick={() => setShowPassword(prev => !prev)}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? '🙈' : '👁'}
  </button>
</div>

        <button
          className="liquid-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : mode === 'signup'
              ? 'Create your account'
              : 'Sign in to READMATE'}
        </button>

        {mode === 'login' && (
          <button
            type="button"
            className="liquid-reset"
            onClick={handleReset}
            disabled={loading}
          >
            Forgot your password?
          </button>
        )}

        {message && (
          <p className="liquid-message" role="status">
            {message}
          </p>
        )}

        <p className="liquid-switch">
          {mode === 'signup'
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup');
              clearFields();
            }}
          >
            {mode === 'signup' ? 'Sign in' : 'Create account'}
          </button>
        </p>

        <div className="liquid-footer">
          YOUR SPACE. YOUR PACE. YOUR NEXT CHAPTER.
        </div>
      </form>
    </div>
  );
}
