import React from 'react'
import { getTodaysWisdom } from '../lib/wisdom'
import { useAuth } from '../lib/AuthContext'

// Simulated crew data for MVP UI
const MOCK_CREW = [
  { id: 1, name: 'Lucas R.',    archetype: 'corredor',   hour: 20, isOut: true },
  { id: 2, name: 'María G.',    archetype: 'exploradora', hour: 20, isOut: true },
  { id: 3, name: 'Roberto V.',  archetype: 'guerrero',   hour: 21, isOut: false },
]

export default function VigilPage() {
  const { profile } = useAuth()
  const wisdom = getTodaysWisdom()
  const [joined, setJoined] = React.useState(false)
  const [sessionActive, setSessionActive] = React.useState(false)
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    if (!sessionActive) return
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [sessionActive])

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const goingTonight = MOCK_CREW.filter(m => m.isOut).length
  const userName = profile?.name ?? 'Guerrero'

  return (
    <div className="page-section stagger">

      {/* Frase del día */}
      <div className="wisdom-card animate-fade-up">
        <p>{wisdom.text}</p>
        <span>— {wisdom.source}</span>
      </div>

      {/* Estado de esta noche */}
      <div className="panel animate-fade-up" style={{ padding: '20px' }}>
        <div className="section-header">
          <h2 className="section-title">ESTA NOCHE</h2>
          <span className="badge badge-amber">{goingTonight} saliendo</span>
        </div>

        <div className="crew-list">
          {MOCK_CREW.map(member => (
            <div key={member.id} className="crew-member">
              <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: '14px' }}>
                {member.name[0]}
              </div>
              <div className="crew-member-info">
                <span className="crew-member-name">{member.name}</span>
                <span className="crew-member-time">{member.hour}:00hs</span>
              </div>
              <div className={`crew-status ${member.isOut ? 'going' : 'pending'}`}>
                {member.isOut ? '✓ Sale' : '— ¿?'}
              </div>
            </div>
          ))}

          {/* Fila propia */}
          <div className="crew-member crew-member-self">
            <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: '14px', borderColor: 'var(--amber)' }}>
              {userName[0]}
            </div>
            <div className="crew-member-info">
              <span className="crew-member-name">{userName} <span style={{ color: 'var(--amber)', fontSize: '10px' }}>VOS</span></span>
              <span className="crew-member-time">{profile?.schedule_start ?? 20}:00hs</span>
            </div>
            <div className={`crew-status ${joined ? 'going' : 'pending'}`}>
              {joined ? '✓ Sale' : '— ¿?'}
            </div>
          </div>
        </div>

        {/* CTA principal */}
        {!sessionActive && (
          <button
            className={`btn-primary ${joined ? 'btn-start' : ''}`}
            onClick={() => {
              if (!joined) setJoined(true)
              else setSessionActive(true)
            }}
            style={{ marginTop: '20px' }}
          >
            {!joined
              ? `↑  Yo salgo hoy — ${profile?.schedule_start ?? 20}:00hs`
              : '▶  Empezar sesión ahora'}
          </button>
        )}

        {sessionActive && (
          <div className="session-active animate-fade-up">
            <div className="session-timer">
              <span className="session-timer-label">EN CURSO</span>
              <span className="session-timer-value">{formatTime(elapsed)}</span>
            </div>
            <p className="session-note">La guardia corre con vos. Seguí adelante.</p>
            <button
              className="btn-ghost"
              onClick={() => { setSessionActive(false); setJoined(false); setElapsed(0) }}
              style={{ width: '100%', marginTop: '12px' }}
            >
              Completar sesión
            </button>
          </div>
        )}
      </div>

      {/* Misión activa */}
      <div className="panel animate-fade-up" style={{ padding: '20px' }}>
        <div className="section-header">
          <h2 className="section-title">MISIÓN ACTIVA</h2>
          <span className="badge badge-amber">Arco I</span>
        </div>
        <p className="mission-name">Corré 5km esta semana</p>
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dust)', marginBottom: '6px' }}>
            <span>Progreso</span>
            <span style={{ color: 'var(--amber)' }}>2.3 / 5 km</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '46%' }} />
          </div>
        </div>
      </div>

      <style>{`
        .page-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--text-dust);
          font-weight: 600;
        }

        .crew-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .crew-member {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .crew-member-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .crew-member-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-bone);
        }

        .crew-member-time {
          font-size: 12px;
          color: var(--text-dust);
        }

        .crew-status {
          font-family: var(--font-title);
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .crew-status.going  { color: #5aaa5a; }
        .crew-status.pending { color: var(--text-dust); }

        .crew-member-self {
          border-top: 1px solid var(--border-stone);
          padding-top: 12px;
          margin-top: 4px;
        }

        .session-active {
          margin-top: 20px;
          padding: 20px;
          background: var(--bg-ember);
          border: 1px solid var(--amber-border);
          border-radius: 2px;
          text-align: center;
        }

        .session-timer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .session-timer-label {
          font-family: var(--font-title);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--amber);
        }

        .session-timer-value {
          font-family: var(--font-title);
          font-size: 48px;
          font-weight: 700;
          color: var(--text-bone);
          letter-spacing: 0.05em;
          line-height: 1;
        }

        .session-note {
          font-family: var(--font-quote);
          font-style: italic;
          font-size: 13px;
          color: var(--text-stone);
        }

        .mission-name {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-bone);
        }
      `}</style>
    </div>
  )
}
