import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../lib/AuthContext'

const ARCHETYPES = [
  { id: 'corredor',   icon: '🏃', name: 'CORREDOR',   desc: 'La velocidad es tu arma. El asfalto, tu dojo.' },
  { id: 'guerrero',   icon: '⚔️', name: 'GUERRERO',   desc: 'La fuerza se forja, no se hereda.' },
  { id: 'sabio',      icon: '📖', name: 'SABIO',      desc: 'El cuerpo y la mente son el mismo sendero.' },
  { id: 'explorador', icon: '🧭', name: 'EXPLORADOR', desc: 'Cada calle desconocida es una aventura.' },
]

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8)

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth()
  const [step, setStep]           = useState(0)
  const [name, setName]           = useState('')
  const [archetype, setArchetype] = useState(null)
  const [hour, setHour]           = useState(20)
  const [locStatus, setLocStatus] = useState('idle')
  const [coords, setCoords]       = useState(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const steps = ['nombre', 'arquetipo', 'horario', 'ubicacion', 'listo']

  function requestLocation() {
    setLocStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus('done')
      },
      () => {
        // Fallback: Salta Capital
        setCoords({ lat: -24.7821, lng: -65.4232 })
        setLocStatus('denied')
      },
      { timeout: 10000 }
    )
  }

  async function finishOnboarding() {
    setSaving(true)
    setError('')
    try {
      await setDoc(doc(db, 'profiles', user.uid), {
        id:             user.uid,
        name:           name.trim(),
        email:          user.email,
        archetype,
        scheduleStart:  hour,
        scheduleEnd:    hour + 2,
        lat:            coords?.lat ?? -24.7821,
        lng:            coords?.lng ?? -65.4232,
        city:           'Salta',
        level:          1,
        xp:             0,
        crewId:         null,
        createdAt:      new Date().toISOString(),
      })
      await refreshProfile()
    } catch (e) {
      console.error(e)
      setError('Error al guardar. Intentá de nuevo.')
      setSaving(false)
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-bg" />

      <div className="onboarding-steps">
        {steps.map((s, i) => (
          <div key={s} className={`onboarding-step-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>

      <div className="onboarding-content animate-fade-up">

        {step === 0 && (
          <div className="onboarding-step">
            <div className="onboarding-icon">⟁</div>
            <h2>El sendero comienza<br />con un nombre</h2>
            <p className="onboarding-desc">¿Cómo te llamás, guerrero?</p>
            <input
              type="text"
              className="input"
              placeholder="Tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              autoFocus
            />
            <button className="btn-primary" disabled={!name.trim()} onClick={() => setStep(1)}>
              Continuar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-step">
            <h2>Elegí tu arquetipo</h2>
            <p className="onboarding-desc">Define tu camino dentro del Sendero.</p>
            <div className="archetype-grid">
              {ARCHETYPES.map(a => (
                <button
                  key={a.id}
                  className={`archetype-card ${archetype === a.id ? 'selected' : ''}`}
                  onClick={() => setArchetype(a.id)}
                >
                  <span className="archetype-icon">{a.icon}</span>
                  <span className="archetype-name">{a.name}</span>
                  <span className="archetype-desc">{a.desc}</span>
                </button>
              ))}
            </div>
            <div className="onboarding-nav">
              <button className="btn-ghost" onClick={() => setStep(0)}>Atrás</button>
              <button className="btn-primary" disabled={!archetype} onClick={() => setStep(2)} style={{ flex: 1 }}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <div className="onboarding-icon">🕗</div>
            <h2>¿A qué hora entrás<br />en guardia?</h2>
            <p className="onboarding-desc">Usamos este horario para encontrarte una guardia de compañeros disponibles.</p>
            <div className="hour-selector">
              {HOURS.map(h => (
                <button key={h} className={`hour-btn ${hour === h ? 'selected' : ''}`} onClick={() => setHour(h)}>
                  {h}:00
                </button>
              ))}
            </div>
            <p className="onboarding-note">Seleccionado: <strong>{hour}:00 – {hour + 2}:00hs</strong></p>
            <div className="onboarding-nav">
              <button className="btn-ghost" onClick={() => setStep(1)}>Atrás</button>
              <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 1 }}>Continuar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <div className="onboarding-icon">📍</div>
            <h2>Activá el GPS</h2>
            <p className="onboarding-desc">El Sendero usa tu ubicación para agruparte con guerreros de tu zona y sincronizarse durante las salidas.</p>

            {locStatus === 'idle' && (
              <button className="btn-primary" onClick={requestLocation}>Activar ubicación</button>
            )}
            {locStatus === 'loading' && <p className="onboarding-note">Obteniendo ubicación...</p>}
            {locStatus === 'done' && (
              <div className="loc-ok">
                <span>✓</span>
                <p>Ubicación obtenida. Tu guardia será en un radio de 15km.</p>
              </div>
            )}
            {locStatus === 'denied' && (
              <div className="loc-denied">
                <p>Permiso denegado. Usaremos Salta Capital como referencia. Podés cambiarlo después en Configuración.</p>
              </div>
            )}

            <div className="onboarding-nav" style={{ marginTop: '24px' }}>
              <button className="btn-ghost" onClick={() => setStep(2)}>Atrás</button>
              <button
                className="btn-primary"
                disabled={locStatus === 'idle' || locStatus === 'loading'}
                onClick={() => setStep(4)}
                style={{ flex: 1 }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-step onboarding-final">
            <div className="onboarding-final-glow" />
            <div className="onboarding-icon final">⟁</div>
            <h2>El viaje comienza,<br />{name}</h2>
            <p className="quote-text" style={{ textAlign: 'center', fontSize: '15px' }}>
              "El camino se hace al andar. No al pensar, no al planear. Al andar."
            </p>
            <p className="onboarding-note" style={{ marginTop: '8px' }}>— El Sendero</p>
            {error && <p style={{ color: '#e05a5a', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            <button className="btn-primary animate-ember" onClick={finishOnboarding} disabled={saving}>
              {saving ? 'Preparando el sendero...' : 'Empezar el sendero'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .onboarding-page { min-height:100dvh; display:flex; flex-direction:column; align-items:center; padding:24px; position:relative; overflow:hidden; }
        .onboarding-bg { position:absolute; inset:0; background:radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,146,42,0.1) 0%, transparent 60%); pointer-events:none; }
        .onboarding-steps { display:flex; gap:8px; margin-bottom:40px; margin-top:16px; z-index:1; }
        .onboarding-step-dot { width:24px; height:3px; background:var(--bg-surface); border-radius:2px; transition:background 0.3s ease; }
        .onboarding-step-dot.active { background:var(--amber); }
        .onboarding-content { width:100%; max-width:400px; z-index:1; }
        .onboarding-step { display:flex; flex-direction:column; gap:20px; }
        .onboarding-step h2 { font-family:var(--font-title); font-size:26px; font-weight:700; letter-spacing:0.06em; color:var(--text-bone); line-height:1.3; }
        .onboarding-desc { color:var(--text-stone); font-size:14px; line-height:1.7; }
        .onboarding-icon { font-size:40px; color:var(--amber); filter:drop-shadow(0 0 12px rgba(200,146,42,0.4)); }
        .onboarding-icon.final { font-size:64px; text-align:center; }
        .onboarding-note { color:var(--text-dust); font-size:12px; text-align:center; }
        .onboarding-nav { display:flex; gap:12px; align-items:center; }
        .archetype-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .archetype-card { background:var(--bg-stone); border:1px solid var(--border-stone); border-radius:2px; padding:16px 12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; transition:all 0.2s ease; }
        .archetype-card:hover { border-color:var(--amber-border); background:var(--bg-ember); }
        .archetype-card.selected { border-color:var(--amber); background:var(--amber-glow); box-shadow:0 0 16px rgba(200,146,42,0.15); }
        .archetype-icon { font-size:28px; }
        .archetype-name { font-family:var(--font-title); font-size:11px; letter-spacing:0.12em; color:var(--text-bone); }
        .archetype-desc { font-size:11px; color:var(--text-dust); line-height:1.4; }
        .hour-selector { display:flex; flex-wrap:wrap; gap:8px; }
        .hour-btn { padding:10px 14px; background:var(--bg-surface); border:1px solid var(--border-stone); border-radius:2px; color:var(--text-stone); font-family:var(--font-title); font-size:13px; cursor:pointer; transition:all 0.2s ease; }
        .hour-btn:hover { border-color:var(--amber-border); }
        .hour-btn.selected { background:var(--amber-glow); border-color:var(--amber); color:var(--amber); }
        .loc-ok { display:flex; align-items:flex-start; gap:12px; padding:16px; background:rgba(40,80,40,0.15); border:1px solid rgba(60,120,60,0.3); border-radius:2px; }
        .loc-ok span { font-size:20px; color:#5aaa5a; }
        .loc-ok p { font-size:13px; color:var(--text-stone); line-height:1.5; }
        .loc-denied { padding:16px; background:var(--crimson-dim); border:1px solid rgba(139,46,46,0.3); border-radius:2px; font-size:13px; color:var(--text-stone); line-height:1.5; }
        .onboarding-final { text-align:center; position:relative; }
        .onboarding-final-glow { position:absolute; width:200px; height:200px; background:radial-gradient(circle, rgba(200,146,42,0.15), transparent 70%); top:-40px; left:50%; transform:translateX(-50%); pointer-events:none; }
      `}</style>
    </div>
  )
}
