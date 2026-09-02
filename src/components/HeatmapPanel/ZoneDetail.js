import React from 'react';

const fmtDate = dstr => {
  const d = new Date(dstr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export default function ZoneDetail({ partner, partnerIdx, assetLabel, games, linkedGameDate, onClose }) {
  if (!partner) return null;

  const selectedGame = games.find(g => g.d === linkedGameDate) || null;
  const activeForSelectedGame = selectedGame?.ps.includes(partnerIdx);

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
            <div className="sec-title" style={{ marginBottom: '10px' }}>
              Deployment for Selected Game
            </div>
            {!selectedGame && (
              <div className="act-metric" style={{ marginBottom: 10 }}>Choose a scheduled game date to view this asset's deployment.</div>
            )}
            {selectedGame && !activeForSelectedGame && (
              <div className="act-metric" style={{ marginBottom: 10 }}>This asset is not scheduled for the selected game.</div>
            )}
            {selectedGame && activeForSelectedGame && (
              <div className="act-item">
                <div className="act-avatar" style={{ background: partner.color }}>🏀</div>
                <div>
                  <div className="act-name">vs. {selectedGame.opp}</div>
                  <div className="act-metric">{fmtDate(selectedGame.d)} · Paycom Center · 7:00 PM CT</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
