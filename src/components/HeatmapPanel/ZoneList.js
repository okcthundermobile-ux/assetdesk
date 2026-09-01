import React from 'react';

export default function ZoneList({ partners, kpis, hlZoneIdx, setHlZoneIdx, query = '' }) {
  const fmt$ = n => '$' + n.toLocaleString('en-US');
  const fmtN = n => n.toLocaleString('en-US');

  const q = query.trim().toLowerCase();
  const matches = p => !q || p.name.toLowerCase().includes(q) || p.asset.toLowerCase().includes(q);
  const visible = partners.filter(matches);

  return (
    <div className="zone-panel">
      <div className="zone-title">Partner Zones</div>
      <div id="zone-list" className="zone-grid">
        {visible.length === 0 && (
          <div className="zone-empty">No zones match “{query}”.</div>
        )}
        {visible.map((p) => {
          const i = partners.indexOf(p);
          const k = kpis[p.id];
          return (
            <div
              key={p.id}
              className={`zone-item ${hlZoneIdx === i ? 'hl' : ''}`}
              onClick={() => setHlZoneIdx(i)}
            >
              <div className="zone-sq" style={{ background: p.color }}></div>
              <div>
                <div className="zone-partner">{p.name}</div>
                <div className="zone-asset">{p.asset}</div>
                <div className="zone-kpi">{fmt$(k.qi)} QI · {fmtN(k.imp)} impressions</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
