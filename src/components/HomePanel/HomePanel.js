import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getGames, getPartners, getKPIs, getActivations, firebaseReady } from '../../data/firebase';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtGameDate(d) {
  const [y, m, day] = d.split('-').map(Number);
  return `${MONTHS[m - 1]} ${day}, ${y}`;
}

export default function HomePanel() {
  const [games, setGames] = useState([]);
  const [partners, setPartners] = useState([]);
  const [kpis, setKpis] = useState({});
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [gData, pData, kData, aData] = await Promise.all([
        getGames(),
        getPartners(),
        getKPIs(),
        firebaseReady
          ? getActivations()
          : Promise.resolve(JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || '[]')),
      ]);
      setGames(gData);
      setPartners(pData);
      setKpis(kData);
      setDeployments(Array.isArray(aData) ? aData : []);
      setLoading(false);
    }
    loadData();
  }, []);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const sorted = [...games].sort((a, b) => a.d.localeCompare(b.d));
    const future = sorted.filter(g => g.d >= today);
    return (future.length > 0 ? future : sorted).slice(0, 5);
  }, [games]);

  const totals = useMemo(() => {
    const qi = Object.values(kpis).reduce((s, k) => s + (k.qi || 0), 0);
    const imp = Object.values(kpis).reduce((s, k) => s + (k.imp || 0), 0);
    return { qi, imp };
  }, [kpis]);

  if (loading) return <div className="panel active"><div style={{ padding: 40, color: 'var(--muted)' }}>Loading…</div></div>;

  return (
    <div id="panel-home" className="panel active">
      <div className="home-grid">
        <div className="m-card">
          <div className="m-lbl">Home Games</div>
          <div className="m-val">{games.length}</div>
          <div className="m-sub">2025–26 season schedule</div>
        </div>
        <div className="m-card">
          <div className="m-lbl">Active Partners</div>
          <div className="m-val">{partners.length}</div>
          <div className="m-sub">Across all asset zones</div>
        </div>
        <div className="m-card">
          <div className="m-lbl">Total QI Media Value</div>
          <div className="m-val">${totals.qi.toLocaleString('en-US')}</div>
          <div className="m-sub">Season to date</div>
        </div>
        <div className="m-card">
          <div className="m-lbl">Deployments</div>
          <div className="m-val">{deployments.length}</div>
          <div className="m-sub">Planned activations</div>
        </div>
      </div>

      <div className="home-cols">
        <div className="tbl-box">
          <div className="tbl-head"><span className="tbl-title">Upcoming Games</span></div>
          <table>
            <thead>
              <tr><th>Date</th><th>Opponent</th><th>Partners</th></tr>
            </thead>
            <tbody>
              {upcoming.map(g => (
                <tr key={g.d}>
                  <td>{fmtGameDate(g.d)}</td>
                  <td>{g.opp}</td>
                  <td>
                    <span className="cell-dots">
                      {g.ps.map(i => (
                        <span key={i} className="dot" style={{ background: partners[i]?.color }} />
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="home-actions">
          <Link to="/schedule" className="home-action-card">
            <div className="home-action-title">Game Calendar</div>
            <div className="home-action-sub">View schedule & per-game activations</div>
          </Link>
          <Link to="/arena" className="home-action-card">
            <div className="home-action-title">Arena Heatmap</div>
            <div className="home-action-sub">Paycom Center asset zones by section</div>
          </Link>
          <Link to="/reports" className="home-action-card">
            <div className="home-action-title">Reports & KPIs</div>
            <div className="home-action-sub">Partner performance across the season</div>
          </Link>
          <Link to="/deployments" className="home-action-card">
            <div className="home-action-title">Deployments</div>
            <div className="home-action-sub">Plan and track asset deployments</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
