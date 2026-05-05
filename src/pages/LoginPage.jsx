import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function LoginPage() {
  const { signInWithMagicLink } = useAuth()
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error: err } = await signInWithMagicLink(email)
    setLoading(false)
    if (err) setError('Hubo un error. Verificá el correo e intentá de nuevo.')
    else setSent(true)
  }

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-content animate-fade-up">
        {/* Logo / título */}
        <div className="login-header">
          <div className="login-emblem">⟁</div>
          <h1>El Sendero</h1>
          <p className="login-sub">El camino del guerrero</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="login-form">
            <p className="login-desc">
              El sendero comienza con un paso.<br />
              Ingresá tu correo para continuar.
            </p>

            <div>
              <label htmlFor="email" className="input-label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Entrar al Sendero'}
            </button>

            <p className="login-note">
              Sin contraseña. Te enviamos un enlace mágico a tu correo.
            </p>
          </form>
        ) : (
          <div className="login-sent animate-fade-up">
            <div className="login-sent-icon">✉</div>
            <h2>Enlace enviado</h2>
            <p>Revisá tu correo en <strong>{email}</strong> y tocá el enlace para entrar al sendero.</p>
            <button className="btn-ghost" onClick={() => setSent(false)} style={{ marginTop: '24px' }}>
              Volver
            </button>
          </div>
        )}
      </div>

      <style>{`
        .login-page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,146,42,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,46,46,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-content {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
          z-index: 1;
        }

        .login-header {
          text-align: center;
        }

        .login-emblem {
          font-size: 48px;
          color: var(--amber);
          line-height: 1;
          margin-bottom: 12px;
          filter: drop-shadow(0 0 16px rgba(200,146,42,0.4));
        }

        .login-header h1 {
          font-family: var(--font-title);
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--text-bone);
          text-transform: uppercase;
        }

        .login-sub {
          font-family: var(--font-quote);
          font-style: italic;
          color: var(--text-dust);
          font-size: 14px;
          margin-top: 4px;
          letter-spacing: 0.05em;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-desc {
          color: var(--text-stone);
          font-size: 14px;
          line-height: 1.7;
          text-align: center;
        }

        .login-error {
          color: #e05a5a;
          font-size: 13px;
          text-align: center;
        }

        .login-note {
          color: var(--text-dust);
          font-size: 12px;
          text-align: center;
          line-height: 1.5;
        }

        .login-sent {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .login-sent-icon {
          font-size: 48px;
          color: var(--amber);
          filter: drop-shadow(0 0 12px rgba(200,146,42,0.4));
        }

        .login-sent h2 {
          font-family: var(--font-title);
          font-size: 22px;
          letter-spacing: 0.08em;
          color: var(--text-bone);
        }

        .login-sent p {
          color: var(--text-stone);
          font-size: 14px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  )
}
