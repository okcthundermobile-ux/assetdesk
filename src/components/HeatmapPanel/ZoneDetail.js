import React from 'react';

const fmt$ = n => '$' + n.toLocaleString('en-US');
const fmtN = n => n.toLocaleString('en-US');

const fmtDate = dstr => {
  const d = new Date(dstr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export default function ZoneDetail({ partner, partnerIdx, assetLabel, kpi, games, onClose }) {
  if (!partner) return null;

  const today = new Date().toISOString().slice(0, 10);
  const all = games.filter(g => g.ps.includes(partnerIdx));
  const upcoming = all.filter(g => g.d >= today);
  const past = all.filter(g => g.d < today);
  // Off-season (demo data): fall back to showing the full season slate.
  const shown = upcoming.length > 0 ? upcoming : all;
  const shownLabel = upcoming.length > 0 ? 'Upcoming Activations' : 'Season Activations';

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-box detail-box--modal" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            <div className="detail-opp">{assetLabel}</div>
            <div className="detail-date">Assigned Partner: {partner.name} · {partner.industry}</div>
          </div>
          <button type="button" className="detail-close" onClick={onClose} aria-label="Close details">✕</button>
        </div>
        <div className="detail-scroll">
          <div className="detail-body">
            {kpi && (
              <div className="zone-detail-kpis">
                <div className="zone-detail-kpi">
                  <div className="m-lbl">QI Media Value</div>
                  <div className="m-val" style={{ fontSize: '18px' }}>{fmt$(kpi.qi)}</div>
                </div>
                <div className="zone-detail-kpi">
                  <div className="m-lbl">Impressions</div>
                  <div className="m-val" style={{ fontSize: '18px' }}>{fmtN(kpi.imp)}</div>
                </div>
                <div className="zone-detail-kpi">
                  <div className="m-lbl">CTR</div>
                  <div className="m-val" style={{ fontSize: '18px' }}>{kpi.ctr}%</div>
                </div>
              </div>
            )}

            <div className="sec-title" style={{ marginBottom: '10px' }}>
              {shownLabel} ({shown.length})
            </div>
            {shown.length === 0 && (
              <div className="act-metric" style={{ marginBottom: 10 }}>No home games scheduled for this partner.</div>
            )}
            {shown.map(g => (
              <div key={g.d} className="act-item">
                <div className="act-avatar" style={{ background: partner.color }}>🏀</div>
                <div>
                  <div className="act-name">vs. {g.opp}</div>
                  <div className="act-metric">{fmtDate(g.d)} · Paycom Center · 7:00 PM CT</div>
                </div>
              </div>
            ))}

            {past.length > 0 && upcoming.length > 0 && (
              <div className="act-metric" style={{ marginTop: 10 }}>
                + {past.length} completed activation{past.length === 1 ? '' : 's'} earlier this season
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
