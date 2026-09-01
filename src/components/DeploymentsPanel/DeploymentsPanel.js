import React, { useState, useEffect, useMemo } from 'react';
import { getPartners, getGames, getActivations, addActivation, updateActivation, deleteActivation, firebaseReady } from '../../data/firebase';
import { useAuth } from '../../context/AuthContext';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';

const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'On Hold'];

function loadDemoDeployments() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function DeploymentsPanel() {
  const { userProfile } = useAuth();

  const [partners, setPartners] = useState([]);
  const [games, setGames] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    Partner_ID: '',
    gameDate: '',
    asset: '',
    status: 'Scheduled',
    owner: '',
    notes: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, gData, aData] = await Promise.all([
          getPartners(),
          getGames(),
          firebaseReady ? getActivations() : Promise.resolve(loadDemoDeployments()),
        ]);
        setPartners(pData);
        setGames(gData);
        setDeployments(Array.isArray(aData) ? aData : []);
        if (pData.length > 0) {
          setForm(f => ({
            ...f,
            Partner_ID: String(pData[0].id),
            asset: pData[0].asset,
          }));
        }
      } catch (err) {
        console.error('[Deployments load error]', err);
        setError('Could not load partners and games.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedPartner = useMemo(
    () => partners.find(p => String(p.id) === String(form.Partner_ID)) || null,
    [partners, form.Partner_ID]
  );

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm(f => {
      const next = { ...f, [field]: value };
      if (field === 'Partner_ID') {
        const p = partners.find(x => String(x.id) === String(value));
        if (p) next.asset = p.asset;
      }
      return next;
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(f => ({
      Partner_ID: partners[0] ? String(partners[0].id) : f.Partner_ID,
      asset: partners[0]?.asset ?? f.asset,
      gameDate: '',
      status: 'Scheduled',
      owner: '',
      notes: '',
    }));
  };

  const persistDemo = (next) => {
    setDeployments(next);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!form.Partner_ID || !form.gameDate || !form.asset.trim()) {
      return setError('Partner, game date, and asset are required.');
    }

    const existing = editingId ? deployments.find(d => d.id === editingId) : null;

    const record = {
      Partner_ID: form.Partner_ID,
      partnerName: selectedPartner?.name ?? '',
      Game_Date: form.gameDate,
      Asset_Name: form.asset.trim(),
      status: form.status,
      owner: form.owner.trim() || userProfile?.name || 'Unassigned',
      notes: form.notes.trim(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    setSaving(true);
    try {
      if (editingId) {
        if (firebaseReady) {
          await updateActivation(editingId, record);
        }
        const next = deployments.map(d => d.id === editingId ? { id: editingId, ...record } : d);
        if (firebaseReady) setDeployments(next); else persistDemo(next);
        setNotice('Deployment updated.');
      } else if (firebaseReady) {
        const id = await addActivation(record);
        setDeployments(prev => [{ id, ...record }, ...prev]);
        setNotice('Deployment saved to Firestore.');
      } else {
        const id = `demo-${Date.now()}`;
        persistDemo([{ id, ...record }, ...deployments]);
        setNotice('Saved locally (demo mode). Connect Firebase to persist for everyone.');
      }
      resetForm();
    } catch (err) {
      console.error('[Deployment save error]', err);
      setError('Could not save the deployment. Check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setError('');
    setNotice('');
    setForm({
      Partner_ID: String(d.Partner_ID),
      gameDate: d.Game_Date,
      asset: d.Asset_Name ?? '',
      status: d.status ?? 'Scheduled',
      owner: d.owner ?? '',
      notes: d.notes ?? '',
    });
  };

  const handleDelete = async (d) => {
    const label = `${d.Asset_Name ?? 'deployment'} for ${d.partnerName || d.Partner_ID} on ${d.Game_Date}`;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;

    setError('');
    setNotice('');
    try {
      if (firebaseReady) {
        await deleteActivation(d.id);
      }
      const next = deployments.filter(x => x.id !== d.id);
      if (firebaseReady) setDeployments(next); else persistDemo(next);
      if (editingId === d.id) resetForm();
      setNotice('Deployment deleted.');
    } catch (err) {
      console.error('[Deployment delete error]', err);
      setError('Could not delete the deployment. Check the console for details.');
    }
  };

  const upcomingDeployments = useMemo(
    () => [...deployments].sort((a, b) => String(a.Game_Date).localeCompare(String(b.Game_Date))),
    [deployments]
  );

  if (loading) return <div className="panel active"><div style={{ padding: 40, color: 'var(--muted)' }}>Loading…</div></div>;

  return (
    <div id="panel-deploy" className="panel active">
      <div className="deploy-wrap">
        <div className="deploy-card">
          <div className="sec-title">{editingId ? 'Edit Deployment' : 'New Deployment'}</div>
          <p className="deploy-hint">
            Schedule a partner asset activation for an upcoming home game.
            {!firebaseReady && ' Running in demo mode — entries are stored in this browser only.'}
          </p>

          {error && <div className="deploy-alert deploy-alert--error" role="alert">{error}</div>}
          {notice && <div className="deploy-alert deploy-alert--ok" role="status">{notice}</div>}

          <form onSubmit={handleSubmit} className="deploy-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="dep-partner">Partner</label>
              <select id="dep-partner" className="form-input" value={form.Partner_ID} onChange={update('Partner_ID')} required>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dep-asset">Asset / Zone</label>
              <input
                id="dep-asset"
                className="form-input"
                type="text"
                value={form.asset}
                onChange={update('asset')}
                placeholder="e.g. Digital Courtside"
                required
              />
            </div>

            <div className="deploy-row">
              <div className="form-group">
                <label className="form-label" htmlFor="dep-game">Game Date</label>
                <select id="dep-game" className="form-input" value={form.gameDate} onChange={update('gameDate')} required>
                  <option value="" disabled>Select a game…</option>
                  {games.map(g => (
                    <option key={g.d} value={g.d}>{g.d} — vs. {g.opp}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dep-status">Status</label>
                <select id="dep-status" className="form-input" value={form.status} onChange={update('status')}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dep-owner">Owner</label>
              <input
                id="dep-owner"
                className="form-input"
                type="text"
                value={form.owner}
                onChange={update('owner')}
                placeholder="Who is responsible on game day?"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dep-notes">Notes</label>
              <textarea
                id="dep-notes"
                className="form-input deploy-notes"
                value={form.notes}
                onChange={update('notes')}
                placeholder="Setup instructions, run-of-show cues, escalation contacts…"
              />
            </div>

            <div className="deploy-actions">
              <button type="submit" className="deploy-submit" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Deployment'}
              </button>
              {editingId && (
                <button type="button" className="deploy-cancel" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="deploy-side">
          <div className="deploy-card">
            <div className="sec-title">Scheduled Deployments ({upcomingDeployments.length})</div>
            {upcomingDeployments.length === 0 ? (
              <div className="deploy-empty">No deployments yet — create one with the form.</div>
            ) : (
              <div className="deploy-list">
                {upcomingDeployments.map(d => (
                  <div key={d.id ?? `${d.Partner_ID}-${d.Game_Date}`} className={`deploy-item${editingId === d.id ? ' editing' : ''}`}>
                    <div className="deploy-item-head">
                      <span className="deploy-item-asset">{d.Asset_Name}</span>
                      <span className={`deploy-status deploy-status--${String(d.status).toLowerCase().replace(/\s+/g, '-')}`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="deploy-item-meta">
                      {d.partnerName || d.Partner_ID} · 🏀 {d.Game_Date} · Owner: {d.owner}
                    </div>
                    {d.notes && <div className="deploy-item-notes">{d.notes}</div>}
                    <div className="deploy-item-actions">
                      <button type="button" className="deploy-mini-btn" onClick={() => handleEdit(d)}>Edit</button>
                      <button type="button" className="deploy-mini-btn deploy-mini-btn--danger" onClick={() => handleDelete(d)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
