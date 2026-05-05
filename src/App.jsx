import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import VigilPage from './pages/VigilPage'
import GuardiaPage from './pages/GuardiaPage'
import ArcoPage from './pages/ArcoPage'
import './index.css'

// ─── Íconos SVG inline ───────────────────────────────────────────────────────
const IconFlame  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2c0 0-4 4-4 9a4 4 0 008 0c0-3-1.5-5-1.5-5s-.5 3-2.5 3S10 7 12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconUsers  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconMap    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" strokeLinecap="round" strokeLinejoin="round"/><line x1="9" y1="3" x2="9" y2="18" strokeLinecap="round"/><line x1="15" y1="6" x2="15" y2="21" strokeLinecap="round"/></svg>
const IconUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/></svg>

const PerfilPage = () => {
  const { profile, signOut } = useAuth()
  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="avatar-placeholder" style={{ width: 80, height: 80, fontSize: 28, margin: '0 auto 12px', borderColor: 'var(--amber)' }}>
          {profile?.name?.[0] ?? '?'}
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 22, letterSpacing: '0.08em', color: 'var(--text-bone)' }}>
          {profile?.name ?? 'Guerrero'}
        </h2>
        <p style={{ fontFamily: 'var(--font-title)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--amber)', textTransform: 'uppercase', marginTop: 4 }}>
          {profile?.archetype ?? '—'} · Nivel {profile?.level ?? 1}
        </p>
      </div>

      <div className="panel" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-dust)', fontSize: 12 }}>Experiencia (XP)</span>
          <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>
            {profile?.xp ?? 0}
          </span>
        </div>
        <div className="progress-track" style={{ marginTop: 8 }}>
          <div className="progress-fill" style={{ width: `${((profile?.xp ?? 0) % 100)}%` }} />
        </div>
      </div>

      <button className="btn-ghost" onClick={signOut} style={{ width: '100%' }}>
        Salir del sendero
      </button>
    </div>
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/vigil',       label: 'VIGIL',       Icon: IconFlame },
  { to: '/tripulacion', label: 'GUARDIA',      Icon: IconUsers },
  { to: '/arco',        label: 'ARCO',         Icon: IconMap   },
  { to: '/perfil',      label: 'YO',           Icon: IconUser  },
]

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

// ─── App Shell (protegida) ────────────────────────────────────────────────────
function AppShell() {
  const { user, profile, loading, needsOnboarding } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-title)', color: 'var(--amber)', letterSpacing: '0.15em',
        fontSize: '12px', animation: 'ember-pulse 1.5s ease-in-out infinite'
      }}>
        EL SENDERO
      </div>
    )
  }

  if (!user) return <LoginPage />
  if (needsOnboarding) return <OnboardingPage />

  return (
    <div className="app-shell">
      <div className="page-content">
        <Routes>
          <Route path="/"            element={<VigilPage />} />
          <Route path="/vigil"       element={<VigilPage />} />
          <Route path="/tripulacion" element={<GuardiaPage />} />
          <Route path="/arco"        element={<ArcoPage />} />
          <Route path="/perfil"      element={<PerfilPage />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter basename="/el-sendero">
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
