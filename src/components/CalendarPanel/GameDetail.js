import React from 'react';
import { useRole } from '../../context/RoleContext';

export default function GameDetail({ selGame, PARTNERS, KPI, DEPLOYMENTS = [], onClose }) {
  const { curRole } = useRole();

  if (!selGame) return null;

  const d = new Date(selGame.d + 'T12:00:00');
  const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const activations = selGame.ps.map(i => PARTNERS[i]);

  const fmt$ = n => '$' + n.toLocaleString('en-US');
  const fmtN = n => n.toLocaleString('en-US');

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-box detail-box--modal" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
        <div>
          <div className="detail-opp">vs. {selGame.opp}</div>
          <div className="detail-date">🏀 {dateLabel} · Paycom Center · 7:00 PM CT</div>
        </div>
        {onClose && (
          <button type="button" className="detail-close" onClick={onClose} aria-label="Close details">✕</button>
        )}
      </div>
      <div className="detail-scroll">
        <div className="detail-body">
          {DEPLOYMENTS.length > 0 && (
            <>
              <div className="sec-title" style={{ marginBottom: '10px' }}>Scheduled Deployments</div>
              {DEPLOYMENTS.map(d => (
                <div key={d.id ?? `${d.Partner_ID}-${d.Game_Date}`} className="act-item">
                  <div className="act-avatar" style={{ background: 'var(--navy)' }}>🚀</div>
                  <div>
                    <div className="act-name">{d.Asset_Name} — {d.partnerName || d.Partner_ID}</div>
                    <div className="act-metric">
                      Status: {d.status} · Owner: {d.owner}
                    </div>
                    {d.notes && <div className="act-metric">{d.notes}</div>}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0 14px' }} />
            </>
          )}
          {curRole === 'cp' && (
            <>
              <div className="sec-title" style={{ marginBottom: '10px' }}>Active Partner Activations</div>
              {activations.map(p => {
                const k = KPI[p.id];
                return (
                  <div key={p.id} className="act-item">
                    <div className="act-avatar" style={{ background: p.color }}>{p.short[0]}{p.short[1]}</div>
                    <div>
                      <div className="act-name">{p.name}</div>
                      <div className="act-asset">📍 {p.asset} · {p.industry}</div>
                      <div className="act-metric">QI: {fmt$(k.qi)} · {fmtN(k.imp)} impressions · {k.ctr}% CTR</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {curRole === 'act' && (
            <>
              <div className="sec-title" style={{ marginBottom: '10px' }}>Deployment Checklist</div>
              {activations.map(p => {
                const k = KPI[p.id];
                return (
                  <div key={p.id} className="check-item">
                    <div className="check-ico check-done">✓</div>
                    <div>
                      <div className="check-text" style={{ fontWeight: 700 }}>{p.asset}</div>
                      <div className="check-text" style={{ color: 'var(--muted)' }}>{p.name} · {k.contracted} contracted</div>
                    </div>
                  </div>
                );
              })}
              
              {PARTNERS.filter(p => !activations.includes(p)).length > 0 && (
                <>
                  <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                    NOT ACTIVE THIS GAME
                  </div>
                  {PARTNERS.filter(p => !activations.includes(p)).map(p => (
                    <div key={p.id} className="check-item" style={{ opacity: .5 }}>
                      <div className="check-ico check-pend">–</div>
                      <div className="check-text">{p.asset} ({p.name})</div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {curRole === 'fan' && (
            <>
              <div className="sec-title" style={{ marginBottom: '10px' }}>Fan Engagement &amp; Sweepstakes</div>
              {activations.map(p => {
                const k = KPI[p.id];
                return (
                  <div key={p.id} className="act-item">
                    <div className="act-avatar" style={{ background: p.color }}>{p.short[0]}{p.short[1]}</div>
                    <div>
                      <div className="act-name">{p.name}</div>
                      <div className="act-asset">📣 {p.asset}</div>
                      <div className="act-metric">{fmtN(k.socialImp)} social impressions · {fmtN(k.eng)} engagements</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
