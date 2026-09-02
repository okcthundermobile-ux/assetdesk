import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getPartners,
  addPartner,
  getGames,
  getActivations,
  addActivation,
  updateActivation,
  deleteActivation,
  firebaseReady
} from '../../data/firebase';
import { useAuth } from '../../context/AuthContext';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';
const OWNER_NOTIFICATIONS_KEY = 'thunder-owner-notifications';
const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'On Hold'];
const CAMPAIGN_CHANNEL_OPTIONS = ['In-Arena', 'Social', 'Digital', 'Mixed'];
const STEP_COUNT = 4;

function loadDemoDeployments() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function loadOwnerNotifications() {
  try {
    return JSON.parse(localStorage.getItem(OWNER_NOTIFICATIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function buildPartnerId() {
  return `z-${Date.now()}`;
}

export default function DeploymentsPanel() {
  const { userProfile } = useAuth();
  const [searchParams] = useSearchParams();

  const [partners, setPartners] = useState([]);
  const [games, setGames] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [step, setStep] = useState(1);
  const [flowChosen, setFlowChosen] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    short: '',
    industry: '',
    asset: '',
    color: '#007AC1',
  });

  const [form, setForm] = useState({
    deploymentType: 'asset',
    Partner_ID: '',
    Additional_Partner_IDs: [],
    sponsorName: '',
    itemName: '',
    gameSource: 'existing',
    gameDate: '',
    gameTitle: '',
    campaignChannel: 'In-Arena',
    campaignObjective: '',
    campaignStartDate: '',
    campaignEndDate: '',
    campaignPrimaryGameDate: '',
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

        const targetGameDate = searchParams.get('gameDate') || '';
        if (pData.length > 0) {
          setForm(f => ({
            ...f,
            Partner_ID: f.Partner_ID || String(pData[0].id),
            sponsorName: f.sponsorName || pData[0].name,
            itemName: f.itemName || pData[0].asset,
            gameDate: f.gameDate || targetGameDate,
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
  }, [searchParams]);

  useEffect(() => {
    if (!form.gameDate || form.gameSource !== 'existing') return;
    const game = games.find(g => g.d === form.gameDate);
    if (!game) return;
    setForm(f => ({ ...f, gameTitle: game.opp }));
  }, [form.gameDate, form.gameSource, games]);

  const selectedPartnerIds = useMemo(() => {
    const base = [String(form.Partner_ID), ...(form.Additional_Partner_IDs || []).map(String)];
    return [...new Set(base.filter(Boolean))];
  }, [form.Partner_ID, form.Additional_Partner_IDs]);

  const selectedPartners = useMemo(
    () => selectedPartnerIds.map(id => partners.find(p => String(p.id) === id)).filter(Boolean),
    [partners, selectedPartnerIds]
  );

  const selectedGame = useMemo(
    () => games.find(g => g.d === form.gameDate) || null,
    [games, form.gameDate]
  );

  const startDeploymentFlow = (deploymentType) => {
    setError('');
    setNotice('');
    setEditingId(null);
    setStep(1);
    setFlowChosen(true);
    setForm((f) => {
      const primary = partners.find(x => String(x.id) === String(f.Partner_ID)) || partners[0];
      const next = {
        ...f,
        deploymentType,
        itemName: '',
      };
      if (primary && !f.Partner_ID) {
        next.Partner_ID = String(primary.id);
        next.sponsorName = primary.name;
      }
      if (deploymentType === 'asset') {
        next.gameSource = 'existing';
        next.campaignChannel = 'In-Arena';
        next.campaignObjective = '';
        next.campaignStartDate = '';
        next.campaignEndDate = '';
        next.campaignPrimaryGameDate = '';
      } else {
        next.gameSource = 'manual';
        next.gameDate = '';
        next.gameTitle = '';
      }
      return next;
    });
  };

  const update = (field) => (e) => {
    const value = e.target.value;
    setError('');
    setForm(f => {
      const next = { ...f, [field]: value };
      if (field === 'Partner_ID') {
        const prevPartner = partners.find(x => String(x.id) === String(f.Partner_ID));
        const partner = partners.find(x => String(x.id) === String(value));
        if (partner) {
          next.itemName = f.deploymentType === 'asset' ? partner.asset : f.itemName;
          next.Additional_Partner_IDs = (f.Additional_Partner_IDs || []).filter(id => String(id) !== String(value));
          if (!f.sponsorName.trim() || f.sponsorName === prevPartner?.name) {
            next.sponsorName = partner.name;
          }
        }
      }
      if (field === 'deploymentType') {
        if (value === 'asset') {
          const partner = partners.find(x => String(x.id) === String(f.Partner_ID));
          if (!f.itemName.trim() && partner?.asset) {
            next.itemName = partner.asset;
          }
        }
        if (value === 'campaign') {
          next.gameSource = 'manual';
        }
      }
      if (field === 'gameSource' && value === 'existing') {
        const matched = games.find(g => g.d === f.gameDate || g.opp === f.gameTitle);
        next.gameDate = matched?.d || '';
        next.gameTitle = matched?.opp || '';
      }
      if (field === 'gameDate' && next.gameSource === 'existing') {
        const game = games.find(g => g.d === value);
        next.gameTitle = game?.opp || '';
      }
      if (field === 'campaignPrimaryGameDate') {
        const game = games.find(g => g.d === value);
        next.gameTitle = game?.opp || next.gameTitle;
      }
      return next;
    });
  };

  const updateNewPartner = (field) => (e) => {
    const value = e.target.value;
    setError('');
    setNewPartner(prev => ({ ...prev, [field]: value }));
  };

  const toggleAdditionalPartner = (partnerId) => {
    setError('');
    setForm(f => {
      const id = String(partnerId);
      const current = (f.Additional_Partner_IDs || []).map(String);
      const has = current.includes(id);
      return {
        ...f,
        Additional_Partner_IDs: has ? current.filter(x => x !== id) : [...current, id],
      };
    });
  };

  const persistDemo = (next) => {
    setDeployments(next);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
  };

  const queueOwnerNotification = (record) => {
    if (!record.owner || record.owner === 'Unassigned') return;
    const nextNotification = {
      id: `owner-${Date.now()}`,
      owner: record.owner,
      gameDate: record.Game_Date,
      assetName: record.Asset_Name,
      sponsorName: record.partnerName,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const current = loadOwnerNotifications();
    localStorage.setItem(OWNER_NOTIFICATIONS_KEY, JSON.stringify([nextNotification, ...current]));
    window.dispatchEvent(new CustomEvent('owner-notifications-updated'));
  };

  const getDeploymentPartnerLabel = (deployment) => {
    if (Array.isArray(deployment.partnerNames) && deployment.partnerNames.length > 0) {
      return deployment.partnerNames.join(', ');
    }
    if (deployment.partnerName) return deployment.partnerName;
    if (Array.isArray(deployment.Partner_IDs) && deployment.Partner_IDs.length > 0) {
      return deployment.Partner_IDs.join(', ');
    }
    return deployment.Partner_ID;
  };

  const addNewPartner = async () => {
    const name = newPartner.name.trim();
    if (!name || !newPartner.asset.trim()) {
      setError('New partner needs at least a name and a primary asset.');
      return;
    }

    const short = (newPartner.short.trim() || name).slice(0, 12);
    const created = {
      id: buildPartnerId(),
      name,
      short,
      industry: newPartner.industry.trim() || 'Sponsorship',
      asset: newPartner.asset.trim(),
      color: newPartner.color,
    };

    try {
      await addPartner(created);
      const next = [...partners, created];
      setPartners(next);
      setForm(f => ({
        ...f,
        Partner_ID: String(created.id),
        sponsorName: created.name,
        itemName: f.deploymentType === 'asset' ? created.asset : f.itemName,
      }));
      setShowAddPartner(false);
      setNewPartner({ name: '', short: '', industry: '', asset: '', color: '#007AC1' });
      setNotice('New partner added.');
    } catch (err) {
      console.error('[Add partner error]', err);
      setError('Could not add new partner.');
    }
  };

  const validateStep = (targetStep) => {
    if (targetStep === 1) {
      if (!flowChosen) {
        setError('Choose deployment type to begin.');
        return false;
      }
      if (!form.Partner_ID || selectedPartnerIds.length === 0) {
        setError('Choose at least one partner.');
        return false;
      }
      if (!form.sponsorName.trim()) {
        setError('Sponsor / details is required.');
        return false;
      }
    }

    if (targetStep === 2 && form.deploymentType === 'asset') {
      if (!form.itemName.trim()) {
        setError('Asset item name is required.');
        return false;
      }
      if (!form.gameDate) {
        setError('Game date is required.');
        return false;
      }
      if (form.gameSource === 'manual' && !form.gameTitle.trim()) {
        setError('Game title is required when entering data manually.');
        return false;
      }
      if (form.gameSource === 'existing' && !selectedGame) {
        setError('Please choose an existing game.');
        return false;
      }
    }

    if (targetStep === 2 && form.deploymentType === 'campaign') {
      if (!form.itemName.trim()) {
        setError('Campaign name is required.');
        return false;
      }
      if (!form.campaignObjective.trim()) {
        setError('Campaign objective is required.');
        return false;
      }
      if (!form.campaignStartDate || !form.campaignEndDate) {
        setError('Campaign start and end date are required.');
        return false;
      }
      if (form.campaignEndDate < form.campaignStartDate) {
        setError('Campaign end date must be after the start date.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    setError('');
    if (!validateStep(step)) return;
    setStep(s => Math.min(STEP_COUNT, s + 1));
  };

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(1, s - 1));
  };

  const handleCancelFlow = () => {
    if (!window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      return;
    }
    resetForm();
    setNotice('Deployment flow cancelled.');
  };

  const resetForm = () => {
    setEditingId(null);
    setStep(1);
    setFlowChosen(false);
    setShowAddPartner(false);
    setNewPartner({ name: '', short: '', industry: '', asset: '', color: '#007AC1' });
    setForm(f => ({
      deploymentType: 'asset',
      Partner_ID: partners[0] ? String(partners[0].id) : f.Partner_ID,
      Additional_Partner_IDs: [],
      sponsorName: partners[0]?.name ?? '',
      itemName: '',
      gameSource: 'existing',
      gameDate: searchParams.get('gameDate') || '',
      gameTitle: '',
      campaignChannel: 'In-Arena',
      campaignObjective: '',
      campaignStartDate: '',
      campaignEndDate: '',
      campaignPrimaryGameDate: '',
      status: 'Scheduled',
      owner: '',
      notes: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!validateStep(1) || !validateStep(2)) return;

    const existing = editingId ? deployments.find(d => d.id === editingId) : null;
    const selectedPartnerNames = selectedPartners.map(p => p.name);
    const sponsor = form.sponsorName.trim() || selectedPartnerNames.join(', ');

    const resolvedGameDate = form.deploymentType === 'asset'
      ? form.gameDate
      : (form.campaignPrimaryGameDate || form.campaignStartDate);
    const resolvedGameTitle = form.deploymentType === 'asset'
      ? (form.gameSource === 'existing' ? (games.find(g => g.d === form.gameDate)?.opp || form.gameTitle.trim()) : form.gameTitle.trim())
      : (games.find(g => g.d === form.campaignPrimaryGameDate)?.opp || 'Campaign Window');

    const record = {
      deploymentType: form.deploymentType,
      Partner_ID: form.Partner_ID,
      Partner_IDs: selectedPartnerIds,
      partnerNames: selectedPartnerNames,
      partnerName: sponsor,
      Game_Date: resolvedGameDate,
      Game_Title: resolvedGameTitle,
      Asset_Name: form.itemName.trim(),
      Campaign_Channel: form.deploymentType === 'campaign' ? form.campaignChannel : '',
      Campaign_Objective: form.deploymentType === 'campaign' ? form.campaignObjective.trim() : '',
      Campaign_Start_Date: form.deploymentType === 'campaign' ? form.campaignStartDate : '',
      Campaign_End_Date: form.deploymentType === 'campaign' ? form.campaignEndDate : '',
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
        queueOwnerNotification(record);
        setNotice('Deployment updated.');
      } else if (firebaseReady) {
        const id = await addActivation(record);
        setDeployments(prev => [{ id, ...record }, ...prev]);
        queueOwnerNotification(record);
        setNotice('Deployment saved to Firestore.');
      } else {
        const id = `demo-${Date.now()}`;
        persistDemo([{ id, ...record }, ...deployments]);
        queueOwnerNotification(record);
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
    const scheduledMatch = games.find(g => g.d === d.Game_Date || g.opp === d.Game_Title);
    const basePartnerId = String(d.Partner_ID || d.Partner_IDs?.[0] || '');
    setEditingId(d.id);
    setStep(1);
    setFlowChosen(true);
    setError('');
    setNotice('');
    setForm({
      deploymentType: d.deploymentType || 'asset',
      Partner_ID: basePartnerId,
      Additional_Partner_IDs: (d.Partner_IDs || []).map(String).filter(id => id !== basePartnerId),
      sponsorName: d.partnerName || '',
      itemName: d.Asset_Name ?? '',
      gameSource: scheduledMatch ? 'existing' : 'manual',
      gameDate: d.deploymentType === 'campaign' ? '' : (scheduledMatch?.d || d.Game_Date || ''),
      gameTitle: d.deploymentType === 'campaign' ? '' : (scheduledMatch?.opp || d.Game_Title || ''),
      campaignChannel: d.Campaign_Channel || 'In-Arena',
      campaignObjective: d.Campaign_Objective || '',
      campaignStartDate: d.Campaign_Start_Date || '',
      campaignEndDate: d.Campaign_End_Date || '',
      campaignPrimaryGameDate: d.deploymentType === 'campaign' ? (d.Game_Date || '') : '',
      status: d.status ?? 'Scheduled',
      owner: d.owner ?? '',
      notes: d.notes ?? '',
    });
  };

  const handleDelete = async (d) => {
    const label = `${d.Asset_Name ?? 'deployment'} for ${getDeploymentPartnerLabel(d)} on ${d.Game_Date}`;
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
  const stepLabels = form.deploymentType === 'campaign'
    ? ['Partner', 'Campaign Plan', 'Operations', 'Review']
    : ['Partner', 'Game + Asset', 'Operations', 'Review'];

  if (loading) return <div className="panel active"><div style={{ padding: 40, color: 'var(--muted)' }}>Loading…</div></div>;

  return (
    <div id="panel-deploy" className="panel active">
      <div className="deploy-flow">
        <div className="deploy-card">
          <div className="sec-title">{editingId ? 'Edit Deployment' : 'New Deployment'}</div>
          <p className="deploy-hint">
            {flowChosen
              ? `You are creating a ${form.deploymentType === 'asset' ? 'deploy asset' : 'deploy campaign'} record.`
              : 'Choose deployment type first, then complete the guided flow.'}
            {!firebaseReady && ' Running in demo mode — entries are stored in this browser only.'}
          </p>

          {error && <div className="deploy-alert deploy-alert--error" role="alert">{error}</div>}
          {notice && <div className="deploy-alert deploy-alert--ok" role="status">{notice}</div>}

          {!flowChosen ? (
            <div className="deploy-form">
              <div className="deploy-question-title">Start by choosing what you are creating</div>
              <div className="deploy-type-grid">
                <button type="button" className="deploy-type-btn" onClick={() => startDeploymentFlow('asset')}>
                  Deploy Asset
                </button>
                <button type="button" className="deploy-type-btn" onClick={() => startDeploymentFlow('campaign')}>
                  Deploy Campaign
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="deploy-form" noValidate>
              <div className="deploy-stepper">
                {stepLabels.map((label, idx) => {
                  const stepNum = idx + 1;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`deploy-step-btn${step === stepNum ? ' active' : ''}${step > stepNum ? ' done' : ''}`}
                      onClick={() => {
                        if (stepNum < step || validateStep(step)) setStep(stepNum);
                      }}
                    >
                      <span>{stepNum}</span> {label}
                    </button>
                  );
                })}
              </div>

              {step === 1 && (
                <>
                  <div className="deploy-question-title">Who is this for?</div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-partner">Primary Partner</label>
                    <select id="dep-partner" className="form-input" value={form.Partner_ID} onChange={update('Partner_ID')} required>
                      {partners.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button type="button" className="deploy-inline-link" onClick={() => setShowAddPartner(v => !v)}>
                      {showAddPartner ? 'Hide new partner form' : '+ Add new physical partner'}
                    </button>
                  </div>

                  {showAddPartner && (
                    <div className="deploy-new-partner">
                      <div className="deploy-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="new-partner-name">Partner Name</label>
                          <input id="new-partner-name" className="form-input" type="text" value={newPartner.name} onChange={updateNewPartner('name')} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="new-partner-short">Short Name</label>
                          <input id="new-partner-short" className="form-input" type="text" value={newPartner.short} onChange={updateNewPartner('short')} placeholder="e.g. Acme" />
                        </div>
                      </div>
                      <div className="deploy-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="new-partner-industry">Industry</label>
                          <input id="new-partner-industry" className="form-input" type="text" value={newPartner.industry} onChange={updateNewPartner('industry')} placeholder="e.g. Retail" />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="new-partner-asset">Primary Asset</label>
                          <input id="new-partner-asset" className="form-input" type="text" value={newPartner.asset} onChange={updateNewPartner('asset')} placeholder="e.g. LED Board Ring" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="new-partner-color">Color</label>
                        <input id="new-partner-color" className="form-input" type="color" value={newPartner.color} onChange={updateNewPartner('color')} />
                      </div>
                      <div className="deploy-actions">
                        <button type="button" className="deploy-submit" onClick={addNewPartner}>Save Partner</button>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Additional Partners</label>
                    <div className="deploy-partner-options">
                      {partners
                        .filter(p => String(p.id) !== String(form.Partner_ID))
                        .map(p => (
                          <label key={p.id} className="deploy-partner-option">
                            <input
                              type="checkbox"
                              checked={(form.Additional_Partner_IDs || []).map(String).includes(String(p.id))}
                              onChange={() => toggleAdditionalPartner(p.id)}
                            />
                            <span>{p.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-sponsor">Sponsor / Details</label>
                    <input id="dep-sponsor" className="form-input" type="text" value={form.sponsorName} onChange={update('sponsorName')} placeholder="e.g. Thunder Fan Dev, Activations" required />
                  </div>
                </>
              )}

              {step === 2 && form.deploymentType === 'asset' && (
                <>
                  <div className="deploy-question-title">Set the asset and game details</div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-item-name">Asset Item</label>
                    <input
                      id="dep-item-name"
                      className="form-input"
                      type="text"
                      value={form.itemName}
                      onChange={update('itemName')}
                      placeholder="e.g. LED Board Ring"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-game-source">How do you want to enter game info?</label>
                    <select id="dep-game-source" className="form-input" value={form.gameSource} onChange={update('gameSource')}>
                      <option value="existing">Choose existing game</option>
                      <option value="manual">Enter data manually</option>
                    </select>
                  </div>

                  <div className="deploy-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-game">Game Date</label>
                      {form.gameSource === 'existing' ? (
                        <select id="dep-game" className="form-input" value={form.gameDate} onChange={update('gameDate')} required>
                          <option value="" disabled>Select game date…</option>
                          {games.map(g => <option key={g.d} value={g.d}>{g.d}</option>)}
                        </select>
                      ) : (
                        <input id="dep-game" className="form-input" type="date" value={form.gameDate} onChange={update('gameDate')} required />
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-game-title">Game Title</label>
                      {form.gameSource === 'existing' ? (
                        <select id="dep-game-title" className="form-input" value={form.gameDate} onChange={update('gameDate')} required>
                          <option value="" disabled>Select game title…</option>
                          {games.map(g => <option key={`${g.d}-${g.opp}`} value={g.d}>vs. {g.opp} — {g.d}</option>)}
                        </select>
                      ) : (
                        <input id="dep-game-title" className="form-input" type="text" value={form.gameTitle} onChange={update('gameTitle')} placeholder="e.g. vs. Dallas Mavericks" required />
                      )}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && form.deploymentType === 'campaign' && (
                <>
                  <div className="deploy-question-title">Set the campaign plan</div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-item-name">Campaign Name</label>
                    <input
                      id="dep-item-name"
                      className="form-input"
                      type="text"
                      value={form.itemName}
                      onChange={update('itemName')}
                      placeholder="e.g. Thunder App Check-In Campaign"
                      required
                    />
                  </div>
                  <div className="deploy-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-campaign-channel">Campaign Channel</label>
                      <select id="dep-campaign-channel" className="form-input" value={form.campaignChannel} onChange={update('campaignChannel')}>
                        {CAMPAIGN_CHANNEL_OPTIONS.map(channel => <option key={channel} value={channel}>{channel}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-campaign-objective">Campaign Objective</label>
                      <input id="dep-campaign-objective" className="form-input" type="text" value={form.campaignObjective} onChange={update('campaignObjective')} placeholder="e.g. Increase app check-ins and fan opt-ins" />
                    </div>
                  </div>
                  <div className="deploy-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-campaign-start">Campaign Start Date</label>
                      <input id="dep-campaign-start" className="form-input" type="date" value={form.campaignStartDate} onChange={update('campaignStartDate')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-campaign-end">Campaign End Date</label>
                      <input id="dep-campaign-end" className="form-input" type="date" value={form.campaignEndDate} onChange={update('campaignEndDate')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-campaign-game">Optional anchor game</label>
                    <select id="dep-campaign-game" className="form-input" value={form.campaignPrimaryGameDate} onChange={update('campaignPrimaryGameDate')}>
                      <option value="">No specific game</option>
                      {games.map(g => <option key={g.d} value={g.d}>{g.d} — vs. {g.opp}</option>)}
                    </select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="deploy-question-title">{form.deploymentType === 'asset' ? 'Who owns this asset deployment?' : 'Who owns this campaign deployment?'}</div>
                  <div className="deploy-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-status">Status</label>
                      <select id="dep-status" className="form-input" value={form.status} onChange={update('status')}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dep-owner">Owner</label>
                      <input id="dep-owner" className="form-input" type="text" value={form.owner} onChange={update('owner')} placeholder="Who is responsible on game day?" />
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="deploy-question-title">Review and finalize</div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dep-notes">Notes</label>
                    <textarea id="dep-notes" className="form-input deploy-notes" value={form.notes} onChange={update('notes')} placeholder="Setup instructions, run-of-show cues, escalation contacts…" />
                  </div>
                  <div className="deploy-review">
                    <div><strong>Type:</strong> {form.deploymentType === 'asset' ? 'Deploy Asset' : 'Deploy Campaign'}</div>
                    <div><strong>Partners:</strong> {selectedPartners.map(p => p.name).join(', ') || '—'}</div>
                    <div><strong>Sponsor / Details:</strong> {form.sponsorName || '—'}</div>
                    <div><strong>{form.deploymentType === 'asset' ? 'Asset Item' : 'Campaign Name'}:</strong> {form.itemName || '—'}</div>
                    {form.deploymentType === 'asset' && <div><strong>Game:</strong> {form.gameDate || '—'} {form.gameTitle ? `· vs. ${form.gameTitle}` : ''}</div>}
                    {form.deploymentType === 'campaign' && <div><strong>Campaign Window:</strong> {form.campaignStartDate || '—'} to {form.campaignEndDate || '—'}</div>}
                    {form.deploymentType === 'campaign' && <div><strong>Campaign Channel:</strong> {form.campaignChannel}</div>}
                    {form.deploymentType === 'campaign' && <div><strong>Campaign Objective:</strong> {form.campaignObjective || '—'}</div>}
                    <div><strong>Status:</strong> {form.status}</div>
                    <div><strong>Owner:</strong> {form.owner || userProfile?.name || 'Unassigned'}</div>
                  </div>
                </>
              )}

              <div className="deploy-actions">
                {step > 1 && (
                  <button type="button" className="deploy-cancel" onClick={handleBack}>Back</button>
                )}
                {step < STEP_COUNT ? (
                  <button type="button" className="deploy-submit" onClick={handleNext}>Next</button>
                ) : (
                  <button type="submit" className="deploy-submit" disabled={saving}>
                    {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Deployment'}
                  </button>
                )}
                <button type="button" className="deploy-cancel" onClick={handleCancelFlow}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div className="deploy-card">
          <div className="sec-title">Scheduled Deployments ({upcomingDeployments.length})</div>
          {upcomingDeployments.length === 0 ? (
            <div className="deploy-empty">No deployments yet — create one with the form.</div>
          ) : (
            <div className="deploy-list deploy-list--stacked">
              {upcomingDeployments.map(d => (
                <div key={d.id ?? `${d.Partner_ID}-${d.Game_Date}`} className={`deploy-item${editingId === d.id ? ' editing' : ''}`}>
                  <div className="deploy-item-head">
                    <span className="deploy-item-asset">{d.Asset_Name}</span>
                    <span className={`deploy-status deploy-status--${String(d.status).toLowerCase().replace(/\s+/g, '-')}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="deploy-item-meta">
                    {(d.deploymentType === 'campaign' ? 'Campaign' : 'Asset')} · {getDeploymentPartnerLabel(d)} · 🏀 {d.Game_Date} · {d.Game_Title || games.find(g => g.d === d.Game_Date)?.opp || 'Game Title N/A'} · Owner: {d.owner}
                  </div>
                  {d.Campaign_Objective && <div className="deploy-item-notes">Objective: {d.Campaign_Objective}</div>}
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
  );
}
