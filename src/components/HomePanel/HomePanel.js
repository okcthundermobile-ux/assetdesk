import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getGames, getPartners, getKPIs, getActivations, firebaseReady } from '../../data/firebase';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';
const CUSTOM_METRICS_STORAGE_KEY = 'thunder-dashboard-custom-metrics';

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
  const [customMetrics, setCustomMetrics] = useState([]);
  const [addingMetric, setAddingMetric] = useState(false);
  const [metricDraft, setMetricDraft] = useState({ label: '', value: '', subtitle: '' });
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
      setCustomMetrics(JSON.parse(localStorage.getItem(CUSTOM_METRICS_STORAGE_KEY) || '[]'));
      setLoading(false);
    }
    loadData();
  }, []);

  const updateMetricDraft = (field) => (e) => {
    const value = e.target.value;
    setMetricDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMetric = () => {
    const label = metricDraft.label.trim();
    const value = metricDraft.value.trim();
    const subtitle = metricDraft.subtitle.trim();
    if (!label || !value) return;

    const next = [{ id: `metric-${Date.now()}`, label, value, subtitle }, ...customMetrics];
    setCustomMetrics(next);
    localStorage.setItem(CUSTOM_METRICS_STORAGE_KEY, JSON.stringify(next));
    setMetricDraft({ label: '', value: '', subtitle: '' });
    setAddingMetric(false);
  };

  const removeMetric = (metricId) => {
    const next = customMetrics.filter(m => m.id !== metricId);
    setCustomMetrics(next);
    localStorage.setItem(CUSTOM_METRICS_STORAGE_KEY, JSON.stringify(next));
  };

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
        {customMetrics.map(metric => (
          <div className="m-card m-card--custom" key={metric.id}>
            <button type="button" className="custom-metric-remove" onClick={() => removeMetric(metric.id)} aria-label={`Remove ${metric.label}`}>×</button>
            <div className="m-lbl">{metric.label}</div>
            <div className="m-val">{metric.value}</div>
            {metric.subtitle && <div className="m-sub">{metric.subtitle}</div>}
          </div>
        ))}
        <div className="m-card m-card--add">
          {!addingMetric ? (
            <button type="button" className="custom-metric-add-btn" onClick={() => setAddingMetric(true)}>+ Add metric</button>
          ) : (
            <div className="custom-metric-form">
              <input className="form-input" type="text" value={metricDraft.label} onChange={updateMetricDraft('label')} placeholder="Metric label" />
              <input className="form-input" type="text" value={metricDraft.value} onChange={updateMetricDraft('value')} placeholder="Metric value" />
              <input className="form-input" type="text" value={metricDraft.subtitle} onChange={updateMetricDraft('subtitle')} placeholder="Optional note" />
              <div className="custom-metric-actions">
                <button type="button" className="deploy-submit" onClick={handleAddMetric}>Save</button>
                <button type="button" className="deploy-cancel" onClick={() => { setAddingMetric(false); setMetricDraft({ label: '', value: '', subtitle: '' }); }}>Cancel</button>
              </div>
            </div>
          )}
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
