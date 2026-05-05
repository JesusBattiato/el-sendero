import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

// Arco de la semana actual — hardcodeado para MVP, luego vendrá de Firestore
const ARCO_ACTUAL = {
  numero: 1,
  titulo: 'La Isla del Primer Kilómetro',
  semana: 'Semana del 5 al 11 de Mayo · 2026',
  lore: `En el comienzo de todo viaje hay un momento de duda.

El hobbit dudó antes de salir de su casa. El guerrero de la luz duda antes de cada batalla. Vos también dudaste.

Pero acá estás.

Esta primera isla no te pide que seas rápido ni que seas el mejor. Te pide una sola cosa: que salgas. Que pongas un pie delante del otro en la oscuridad, aunque no veas el camino completo.

El sendero se revela kilómetro a kilómetro. Nunca de golpe.`,
  pruebas: [
    { id: 'run5', tipo: 'run',      titulo: 'Corré 5km esta semana',       meta: 5,  unidad: 'km',  xp: 100 },
    { id: 'sal3', tipo: 'sessions', titulo: 'Salí 3 noches esta semana',    meta: 3,  unidad: 'noches', xp: 75 },
    { id: 'med1', tipo: 'meditate', titulo: 'Meditá 10 minutos una vez',    meta: 10, unidad: 'min', xp: 50 },
  ]
}

// Progreso simulado — luego vendrá de Firestore
const MOCK_PROGRESO = {
  run5: 2.3,
  sal3: 1,
  med1: 0,
}

const TIPO_ICON = {
  run:      '🏃',
  sessions: '🌙',
  meditate: '🧘',
  read:     '📖',
  lift:     '💪',
}

export default function ArcoPage() {
  const { profile } = useAuth()
  const [loreExpanded, setLoreExpanded] = useState(false)

  const pruebasDone  = ARCO_ACTUAL.pruebas.filter(p => (MOCK_PROGRESO[p.id] ?? 0) >= p.meta).length
  const pruebasTotal = ARCO_ACTUAL.pruebas.length
  const arcoProgress = (pruebasDone / pruebasTotal) * 100

  return (
    <div className="arco-page">

      {/* Header del arco */}
      <div className="arco-header">
        <div className="arco-numero">ARCO {ARCO_ACTUAL.numero}</div>
        <h1 className="arco-titulo">{ARCO_ACTUAL.titulo}</h1>
        <p className="arco-semana">{ARCO_ACTUAL.semana}</p>

        {/* Barra progreso del arco */}
        <div className="arco-progress-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dust)', marginBottom: '8px' }}>
            <span>{pruebasDone} de {pruebasTotal} pruebas completadas</span>
            <span style={{ color: 'var(--amber)' }}>{Math.round(arcoProgress)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${arcoProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Lore */}
      <div className="arco-lore panel-ember">
        <div className="arco-lore-label">EL RELATO</div>
        <div className={`arco-lore-text ${loreExpanded ? 'expanded' : ''}`}>
          {ARCO_ACTUAL.lore.split('\n\n').map((párrafo, i) => (
            <p key={i} className="quote-text" style={{ fontSize: '14px', marginBottom: i < 3 ? '12px' : 0 }}>
              {párrafo}
            </p>
          ))}
        </div>
        {!loreExpanded && (
          <button
            className="arco-lore-more"
            onClick={() => setLoreExpanded(true)}
          >
            Leer más ↓
          </button>
        )}
      </div>

      {/* Pruebas */}
      <div className="arco-pruebas-header">
        <span className="section-title">LAS PRUEBAS</span>
        <span className="badge badge-amber">{pruebasDone}/{pruebasTotal}</span>
      </div>

      <div className="arco-pruebas-list">
        {ARCO_ACTUAL.pruebas.map(prueba => {
          const current  = MOCK_PROGRESO[prueba.id] ?? 0
          const done     = current >= prueba.meta
          const pct      = Math.min((current / prueba.meta) * 100, 100)

          return (
            <div key={prueba.id} className={`arco-prueba panel ${done ? 'done' : ''}`}>
              <div className="prueba-top">
                <div className="prueba-icon">{TIPO_ICON[prueba.tipo] ?? '⚡'}</div>
                <div className="prueba-info">
                  <div className="prueba-titulo">{prueba.titulo}</div>
                  <div className="prueba-meta">
                    {current} / {prueba.meta} {prueba.unidad}
                    <span className="prueba-xp">+{prueba.xp} XP</span>
                  </div>
                </div>
                {done && (
                  <div className="prueba-check">✓</div>
                )}
              </div>
              <div className="progress-track" style={{ marginTop: '10px' }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: done ? 'var(--amber)' : undefined }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recompensa del arco */}
      <div className="arco-reward panel">
        <div className="arco-reward-icon">🏆</div>
        <div>
          <div className="arco-reward-title">Recompensa del Arco</div>
          <div className="arco-reward-desc">
            Completar todas las pruebas: <strong style={{ color: 'var(--amber)' }}>+225 XP</strong> · Título "Iniciado del Sendero"
          </div>
        </div>
      </div>

      <style>{`
        .arco-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        .arco-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 0;
        }

        .arco-numero {
          font-family: var(--font-title);
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--amber);
          text-transform: uppercase;
        }

        .arco-titulo {
          font-family: var(--font-title);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-bone);
          line-height: 1.25;
        }

        .arco-semana {
          font-size: 11px;
          color: var(--text-dust);
          letter-spacing: 0.05em;
        }

        .arco-progress-wrap {
          margin-top: 12px;
        }

        .arco-lore {
          padding: 20px;
          position: relative;
        }

        .arco-lore-label {
          font-family: var(--font-title);
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--amber-dim);
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .arco-lore-text {
          overflow: hidden;
          max-height: 90px;
          mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          transition: max-height 0.4s ease, mask-image 0.4s ease;
        }

        .arco-lore-text.expanded {
          max-height: 600px;
          mask-image: none;
        }

        .arco-lore-more {
          background: none;
          border: none;
          color: var(--amber);
          font-family: var(--font-title);
          font-size: 11px;
          letter-spacing: 0.1em;
          cursor: pointer;
          margin-top: 12px;
          padding: 0;
          text-transform: uppercase;
        }

        .arco-pruebas-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--text-dust);
          font-weight: 600;
        }

        .arco-pruebas-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .arco-prueba {
          padding: 16px;
          transition: border-color 0.3s ease;
        }

        .arco-prueba.done {
          border-color: var(--amber-border);
          background: var(--amber-glow);
        }

        .prueba-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .prueba-icon { font-size: 22px; line-height: 1; }

        .prueba-info { flex: 1; }

        .prueba-titulo {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-bone);
          line-height: 1.4;
        }

        .prueba-meta {
          font-size: 12px;
          color: var(--text-dust);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .prueba-xp {
          font-family: var(--font-title);
          font-size: 10px;
          color: var(--amber);
          letter-spacing: 0.05em;
        }

        .prueba-check {
          font-size: 18px;
          color: var(--amber);
          font-weight: 700;
          line-height: 1;
        }

        .arco-reward {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }

        .arco-reward-icon { font-size: 28px; }

        .arco-reward-title {
          font-family: var(--font-title);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--text-dust);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .arco-reward-desc {
          font-size: 13px;
          color: var(--text-stone);
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
