import React from 'react';

export default function AllPartnersChart({ PARTNERS, KPI }) {
  const fmt$ = n => '$' + n.toLocaleString('en-US');
  const fmtN = n => n.toLocaleString('en-US');

  const maxQI = 55000;
  const maxSoc = 150000;

  return (
    <div className="kpi-right">
      <div className="sec-title" style={{ marginBottom: '14px' }}>Season Overview — All Partners</div>
      
      <div className="all-partners-chart">
        <div className="apc-title">QI Media Value by Partner ($)</div>
        <div id="all-qi-chart" style={{ marginBottom: '20px' }}>
          {PARTNERS.map(p => {
            const k = KPI[p.id];
            const pct = Math.round(k.qi / maxQI * 100);
            return (
              <div key={`qi-${p.id}`} className="bar-row">
                <div className="bar-lbl">{p.short}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: p.color }}></div>
                </div>
                <div className="bar-val">{fmt$(k.qi)}</div>
              </div>
            );
          })}
        </div>

        <div className="apc-title">Total Social Impressions by Partner</div>
        <div id="all-social-chart">
          {PARTNERS.map(p => {
            const k = KPI[p.id];
            const pct = Math.round(k.socialImp / maxSoc * 100);
            return (
              <div key={`soc-${p.id}`} className="bar-row">
                <div className="bar-lbl">{p.short}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: p.color }}></div>
                </div>
                <div className="bar-val">{fmtN(k.socialImp)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: '16px' }}></div>
      
      <div className="tbl-box">
        <div className="tbl-head"><div className="tbl-title">Partner Summary — Season Totals</div></div>
        <table id="summary-tbl">
          <thead>
            <tr>
              <th>Partner</th><th>Industry</th><th>QI Value</th><th>Impressions</th><th>CTR</th><th>Engagements</th>
            </tr>
          </thead>
          <tbody>
            {PARTNERS.map(p => {
              const k = KPI[p.id];
              return (
                <tr key={p.id}>
                  <td>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: p.color, marginRight: '6px' }}></span>
                    <strong>{p.short}</strong>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '11px' }}>{p.industry}</td>
                  <td><strong>{fmt$(k.qi)}</strong></td>
                  <td>{fmtN(k.imp)}</td>
                  <td><span className={`badge ${k.ctr >= 4 ? 'badge-g' : k.ctr >= 3 ? 'badge-b' : 'badge-o'}`}>{k.ctr}%</span></td>
                  <td>{fmtN(k.eng)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
