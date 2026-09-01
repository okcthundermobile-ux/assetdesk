import React from 'react';
import { useRole } from '../../context/RoleContext';

const fmt$ = n => '$' + n.toLocaleString('en-US');
const fmtN = n => n.toLocaleString('en-US');

export default function RoleViews({ partner, kpi, GAMES, selPartner }) {
  const { curRole } = useRole();

  return (
    <>
      {curRole === 'cp' && (
        <div className="cp-view">
          <div className="metric-grid">
            <div className="m-card">
              <div className="m-lbl">QI Media Value</div>
              <div className="m-val">{fmt$(kpi.qi)}</div>
              <div className="m-sub">Nielsen Quality Index</div>
              <div className="m-tag tag-g">✓ Delivered</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Sponsorship Impressions</div>
              <div className="m-val">{fmtN(kpi.imp)}</div>
              <div className="m-sub">In-Bowl Viewership</div>
              <div className="m-tag tag-b">{kpi.ctr}% CTR</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Brand Exposure Value</div>
              <div className="m-val">{fmt$(kpi.bev)}</div>
              <div className="m-sub">Social + Signage Combined</div>
              <div className="m-tag tag-g">▲ Above Target</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Share of Voice</div>
              <div className="m-val">{kpi.sov}%</div>
              <div className="m-sub">{kpi.mentions} mentions / {kpi.mentions} articles</div>
              <div className="m-tag tag-a">Competitive</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Social Impressions</div>
              <div className="m-val">{fmtN(kpi.socialImp)}</div>
              <div className="m-sub">Twitter + FB + Instagram</div>
              <div className="m-tag tag-b">Organic + Paid</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Social Engagements</div>
              <div className="m-val">{fmtN(kpi.eng)}</div>
              <div className="m-sub">Likes, shares, clicks</div>
              <div className="m-tag tag-g">Target: {fmtN(Math.round(kpi.eng*0.85))}</div>
            </div>
          </div>

          <div className="chart-box">
            <div className="chart-title">QI Media Value vs. Sponsorship Impressions</div>
            <div className="bar-row">
              <div className="bar-lbl">QI Media Value</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(kpi.qi/55000*100)}%`, background: partner.color }}></div></div>
              <div className="bar-val">{fmt$(kpi.qi)}</div>
            </div>
            <div className="bar-row">
              <div className="bar-lbl">Impressions</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(kpi.imp/55000*100)}%`, background: partner.color + 'aa' }}></div></div>
              <div className="bar-val">{fmtN(kpi.imp)}</div>
            </div>
            <div className="bar-row">
              <div className="bar-lbl">Brand Exposure</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(kpi.bev/55000*100)}%`, background: '#002D62' }}></div></div>
              <div className="bar-val">{fmt$(kpi.bev)}</div>
            </div>
          </div>

          <div className="tbl-box">
            <div className="tbl-head"><div className="tbl-title">In-Bowl Signage — Nielsen Report</div></div>
            <table>
              <thead><tr>
                <th>Partner</th><th>Asset Type</th><th>Contracted</th><th>QI Score</th><th>Media Value</th><th>Impressions</th>
              </tr></thead>
              <tbody><tr>
                <td><strong>{partner.name}</strong></td>
                <td><span className="badge badge-b">{partner.asset}</span></td>
                <td>{kpi.contracted} min</td>
                <td>{(kpi.qi/10000).toFixed(2)}</td>
                <td><strong>{fmt$(kpi.qi)}</strong></td>
                <td>{fmtN(kpi.imp)}</td>
              </tr></tbody>
            </table>
          </div>
        </div>
      )}

      {curRole === 'fan' && (
        <div className="fan-view">
          <div className="role-note">📣 Fan Dev View — engagement & sweepstakes data only</div>
          <div className="fan-grid">
            <div className="m-card">
              <div className="m-lbl">Social Impressions</div>
              <div className="swp-total">{fmtN(kpi.socialImp)}</div>
              <div className="swp-sub">Twitter + FB/IG combined</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Total Engagements</div>
              <div className="swp-total">{fmtN(kpi.eng)}</div>
              <div className="swp-sub">Likes, comments, shares</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">App CTR</div>
              <div className="swp-total">{kpi.ctr}%</div>
              <div className="swp-sub">{kpi.wr} clicks from {fmtN(kpi.imp)} imp</div>
            </div>
          </div>

          <div className="tbl-box">
            <div className="tbl-head"><div className="tbl-title">Social Media Breakdown</div></div>
            <table>
              <thead><tr>
                <th>Channel</th><th>Spend</th><th>Impressions</th><th>Engagements</th><th>CPE</th>
              </tr></thead>
              <tbody>
                <tr>
                  <td>Twitter/X</td>
                  <td>{fmt$(kpi.twitterSpend)}</td>
                  <td>{fmtN(Math.round(kpi.socialImp * 0.35))}</td>
                  <td>{fmtN(Math.round(kpi.eng * 0.38))}</td>
                  <td>${(kpi.twitterSpend/(kpi.eng*0.38)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Facebook / Instagram</td>
                  <td>{fmt$(kpi.fbSpend)}</td>
                  <td>{fmtN(Math.round(kpi.socialImp * 0.65))}</td>
                  <td>{fmtN(Math.round(kpi.eng * 0.62))}</td>
                  <td>${(kpi.fbSpend/(kpi.eng*0.62)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{fmt$(kpi.twitterSpend + kpi.fbSpend)}</strong></td>
                  <td><strong>{fmtN(kpi.socialImp)}</strong></td>
                  <td><strong>{fmtN(kpi.eng)}</strong></td>
                  <td>${((kpi.twitterSpend+kpi.fbSpend)/kpi.eng).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {curRole === 'act' && (
        <div className="act-view">
          <div className="role-note">🛠 Activations View — deployment logs &amp; asset timing</div>
          <div className="metric-grid">
            <div className="m-card">
              <div className="m-lbl">Contracted Time</div>
              <div className="m-val">{kpi.contracted}</div>
              <div className="m-sub">Minutes committed per game</div>
              <div className="m-tag tag-b">On schedule</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Bonused Time</div>
              <div className="m-val">{kpi.bonused}</div>
              <div className="m-sub">Value-add bonus exposure</div>
              <div className="m-tag tag-g">+Delivered</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Fan Fest Plays</div>
              <div className="m-val">{kpi.boltPlays > 0 ? fmtN(kpi.boltPlays) : 'N/A'}</div>
              <div className="m-sub">Bolt / concourse activations</div>
            </div>
            <div className="m-card">
              <div className="m-lbl">Asset Status</div>
              <div className="m-val" style={{ fontSize: '15px', color: 'var(--green)' }}>✓ Active</div>
              <div className="m-sub">{partner.asset}</div>
              <div className="m-tag tag-g">Deployed</div>
            </div>
          </div>

          <div className="tbl-box">
            <div className="tbl-head"><div className="tbl-title">Asset Deployment Log</div></div>
            <table>
              <thead><tr>
                <th>Game Date</th><th>Opponent</th><th>Asset</th><th>Contracted</th><th>Delivered</th><th>Status</th>
              </tr></thead>
              <tbody>
                {GAMES.filter(g => g.ps.includes(selPartner)).slice(0,6).map(g => {
                  const d = new Date(g.d + 'T12:00:00');
                  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <tr key={g.d}>
                      <td>{label}</td>
                      <td>vs. {g.opp}</td>
                      <td>{partner.asset}</td>
                      <td>{kpi.contracted}</td>
                      <td>{kpi.contracted}</td>
                      <td><span className="badge badge-g">✓ Complete</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
