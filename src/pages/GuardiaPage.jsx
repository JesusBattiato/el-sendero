import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../lib/AuthContext'

// Distancia en km entre dos coords (Haversine simplificado)
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const ARCHETYPE_LABEL = {
  corredor:   '🏃 Corredor',
  guerrero:   '⚔️ Guerrero',
  sabio:      '📖 Sabio',
  explorador: '🧭 Explorador',
}

export default function GuardiaPage() {
  const { user, profile } = useAuth()
  const [guardiaMembers, setGuardiaMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadGuardia()
  }, [profile])

  async function loadGuardia() {
    setLoading(true)
    try {
      // Traer todos los perfiles de Salta
      const q = query(
        collection(db, 'profiles'),
        where('city', '==', 'Salta')
      )
      const snap = await getDocs(q)
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Filtrar por radio 15km y excluir al propio usuario
      const nearby = all.filter(p => {
        if (p.id === user.uid) return false
        const km = distanceKm(profile.lat, profile.lng, p.lat, p.lng)
        return km <= 15
      })

      setGuardiaMembers(nearby)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const totalKmThisWeek = guardiaMembers.reduce((acc, m) => acc + (m.weeklyKm ?? 0), 0)

  return (
    <div className="guardia-page">

      {/* Header */}
      <div className="guardia-header">
        <div>
          <h1 className="guardia-title">LA GUARDIA</h1>
          <p className="guardia-subtitle">Salta Capital · radio 15km</p>
        </div>
        <div className="guardia-count">
          <span className="guardia-count-num">{guardiaMembers.length}</span>
          <span className="guardia-count-label">guerreros</span>
        </div>
      </div>

      {/* Stats colectivos */}
      {guardiaMembers.length > 0 && (
        <div className="guardia-stats panel">
          <div className="guardia-stat">
            <span className="guardia-stat-val">{guardiaMembers.length + 1}</span>
            <span className="guardia-stat-label">En la guardia</span>
          </div>
          <div className="guardia-stat-divider" />
          <div className="guardia-stat">
            <span className="guardia-stat-val">{(totalKmThisWeek + (profile?.weeklyKm ?? 0)).toFixed(1)}</span>
            <span className="guardia-stat-label">km esta semana</span>
          </div>
          <div className="guardia-stat-divider" />
          <div className="guardia-stat">
            <span className="guardia-stat-val">{profile?.scheduleStart ?? 20}hs</span>
            <span className="guardia-stat-label">Tu horario</span>
          </div>
        </div>
      )}

      {/* Lista de guerreros */}
      {loading ? (
        <div className="guardia-loading">
          <p>Buscando guerreros en tu zona...</p>
        </div>
      ) : guardiaMembers.length === 0 ? (
        <div className="guardia-empty panel">
          <div className="guardia-empty-icon">⟁</div>
          <h3>Sos el primero en el sendero</h3>
          <p>
            Todavía no hay otros guerreros registrados en tu zona. 
            Compartí la app y formá tu guardia.
          </p>
          <button
            className="btn-ghost"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'El Sendero',
                  text: 'Encontré algo que puede interesarte. El Sendero — running en comunidad, de noche.',
                  url: 'https://el-sendero-95bdd.web.app',
                })
              }
            }}
            style={{ marginTop: '16px' }}
          >
            Invitar guerreros
          </button>
        </div>
      ) : (
        <div className="guardia-list">
          {/* Tu propia fila primero */}
          <div className="guardia-member self panel-ember">
            <div className="avatar-placeholder" style={{ width: 48, height: 48, fontSize: '18px', flexShrink: 0 }}>
              {profile?.name?.[0] ?? '?'}
            </div>
            <div className="member-info">
              <div className="member-name">
                {profile?.name ?? 'Vos'}
                <span className="self-badge">VOS</span>
              </div>
              <div className="member-meta">
                {ARCHETYPE_LABEL[profile?.archetype] ?? '—'} · Nv.{profile?.level ?? 1}
              </div>
              <div className="member-schedule">Sale a las {profile?.scheduleStart ?? 20}:00hs</div>
            </div>
            <div className="member-xp">
              <span className="member-xp-val">{profile?.xp ?? 0}</span>
              <span className="member-xp-label">XP</span>
            </div>
          </div>

          {/* Otros guerreros */}
          {guardiaMembers.map(m => (
            <div key={m.id} className="guardia-member panel">
              <div className="avatar-placeholder" style={{ width: 48, height: 48, fontSize: '18px', flexShrink: 0 }}>
                {m.name?.[0] ?? '?'}
              </div>
              <div className="member-info">
                <div className="member-name">{m.name ?? 'Guerrero'}</div>
                <div className="member-meta">
                  {ARCHETYPE_LABEL[m.archetype] ?? '—'} · Nv.{m.level ?? 1}
                </div>
                <div className="member-schedule">Sale a las {m.scheduleStart ?? '?'}:00hs</div>
              </div>
              <div className="member-xp">
                <span className="member-xp-val">{m.xp ?? 0}</span>
                <span className="member-xp-label">XP</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .guardia-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        .guardia-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 8px 0 4px;
        }

        .guardia-title {
          font-family: var(--font-title);
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--text-bone);
        }

        .guardia-subtitle {
          font-size: 12px;
          color: var(--text-dust);
          margin-top: 2px;
          letter-spacing: 0.05em;
        }

        .guardia-count {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--amber-glow);
          border: 1px solid var(--amber-border);
          border-radius: 2px;
          padding: 8px 16px;
        }

        .guardia-count-num {
          font-family: var(--font-title);
          font-size: 28px;
          font-weight: 700;
          color: var(--amber);
          line-height: 1;
        }

        .guardia-count-label {
          font-size: 10px;
          color: var(--text-dust);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .guardia-stats {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 0;
        }

        .guardia-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .guardia-stat-val {
          font-family: var(--font-title);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-bone);
        }

        .guardia-stat-label {
          font-size: 11px;
          color: var(--text-dust);
          letter-spacing: 0.05em;
        }

        .guardia-stat-divider {
          width: 1px;
          height: 32px;
          background: var(--border-stone);
        }

        .guardia-loading {
          text-align: center;
          padding: 40px 16px;
          color: var(--text-dust);
          font-size: 13px;
          font-family: var(--font-title);
          letter-spacing: 0.1em;
        }

        .guardia-empty {
          padding: 40px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .guardia-empty-icon {
          font-size: 40px;
          color: var(--amber-dim);
          opacity: 0.5;
        }

        .guardia-empty h3 {
          font-family: var(--font-title);
          font-size: 16px;
          letter-spacing: 0.08em;
          color: var(--text-bone);
        }

        .guardia-empty p {
          font-size: 13px;
          color: var(--text-stone);
          line-height: 1.7;
          max-width: 280px;
        }

        .guardia-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .guardia-member {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
        }

        .guardia-member.self {
          border-color: var(--amber-border);
        }

        .member-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .member-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-bone);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .self-badge {
          font-family: var(--font-title);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--amber);
          border: 1px solid var(--amber-border);
          padding: 1px 6px;
          border-radius: 2px;
        }

        .member-meta {
          font-size: 12px;
          color: var(--text-stone);
        }

        .member-schedule {
          font-size: 11px;
          color: var(--text-dust);
        }

        .member-xp {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
        }

        .member-xp-val {
          font-family: var(--font-title);
          font-size: 18px;
          font-weight: 700;
          color: var(--amber);
          line-height: 1;
        }

        .member-xp-label {
          font-size: 9px;
          color: var(--text-dust);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}
