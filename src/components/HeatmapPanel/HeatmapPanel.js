import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArenaMap from './ArenaMap';
import Tooltip from './Tooltip';
import ZoneDetail from './ZoneDetail';
import { getPartners, getKPIs, getGames, getActivations, firebaseReady } from '../../data/firebase';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';
const TODAY_ISO = new Date().toISOString().slice(0, 10);

function loadDemoDeployments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function HeatmapPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [partners, setPartners] = useState([]);
  const [kpis, setKpis] = useState({});
  const [games, setGames] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [hlZoneIdx, setHlZoneIdx] = useState(-1);
  const [selZoneIdx, setSelZoneIdx] = useState(-1);
  const [selAssetLabel, setSelAssetLabel] = useState('');
  const [tipData, setTipData] = useState(null);
  const [query, setQuery] = useState('');
  const [linkedGameDate, setLinkedGameDate] = useState(searchParams.get('gameDate') || TODAY_ISO);
  const [showAllDeployments, setShowAllDeployments] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [pData, kData, gData, dData] = await Promise.all([
        getPartners(),
        getKPIs(),
        getGames(),
        firebaseReady ? getActivations() : Promise.resolve(loadDemoDeployments()),
      ]);
      setPartners(pData);
      setKpis(kData);
      setGames(gData);
      setDeployments(Array.isArray(dData) ? dData : []);
    }
    loadData();
  }, []);

  useEffect(() => {
    const gameDate = searchParams.get('gameDate');
    if (gameDate) setLinkedGameDate(gameDate);

    const partnerId = searchParams.get('partnerId');
    if (partnerId && partners.length > 0) {
      const idx = partners.findIndex(p => String(p.id) === String(partnerId));
      if (idx >= 0) {
        setHlZoneIdx(idx);
        setSelZoneIdx(idx);
      }
    }
  }, [partners, searchParams]);

  useEffect(() => {
    if (searchParams.get('gameDate') || !linkedGameDate) return;
    const next = new URLSearchParams(searchParams);
    next.set('gameDate', linkedGameDate);
    if (partners[selZoneIdx]) next.set('partnerId', String(partners[selZoneIdx].id));
    setSearchParams(next, { replace: true });
  }, [linkedGameDate, partners, searchParams, selZoneIdx, setSearchParams]);

  const handleZoneHover = (e, idx, marker) => {
    if (idx === -1) {
      setTipData(null);
      return;
    }
    const p = partners[idx];
    if (!p) return;
    const k = kpis[p.id] || { qi: 0, imp: 0 };
    setTipData({
      x: e.clientX + 12,
      y: e.clientY + 12,
      assetLabel: marker?.label || p.asset,
      partnerName: p.name,
      qi: k.qi,
      imp: k.imp
    });
  };

  const handleZoneMove = (e) => {
    if (tipData) {
      setTipData({
        ...tipData,
        x: e.clientX + 12,
        y: e.clientY + 12,
      });
    }
  };

  const handleSelectZone = (idx, marker) => {
    setHlZoneIdx(idx);
    setSelZoneIdx(idx);
    setSelAssetLabel(marker?.label || '');
    const next = new URLSearchParams(searchParams);
    next.set('partnerId', String(partners[idx]?.id || ''));
    if (linkedGameDate) next.set('gameDate', linkedGameDate);
    setSearchParams(next);
  };

  const shownDeployments = useMemo(() => {
    if (showAllDeployments) return deployments;
    return deployments.filter(d => d.Game_Date === linkedGameDate);
  }, [deployments, linkedGameDate, showAllDeployments]);

  if (partners.length === 0) return <div>Loading...</div>;

  return (
    <div id="panel-heat" className="panel active" onMouseMove={handleZoneMove}>
      <div className="heatmap-wrap">
        <div className="arena-box">
          <div className="arena-head">
            <div className="arena-title sec-title" style={{ marginBottom: 0 }}>Paycom Center — Asset Zone Map</div>
            <div className="panel-search">
              <input
                type="text"
                className="panel-search-input"
                placeholder="Search assets or partners..."
                aria-label="Search assets or partners"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <span className="panel-search-icon" aria-hidden="true">🔍</span>
            </div>
            <label className="deploy-partner-option" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={showAllDeployments}
                onChange={(e) => setShowAllDeployments(e.target.checked)}
              />
              <span>All deployments (all dates)</span>
            </label>
          </div>
          <ArenaMap
            partners={partners}
            hlZoneIdx={hlZoneIdx}
            onSelectZone={handleSelectZone}
            onHover={handleZoneHover}
            query={query}
          />
          <div className="arena-note">Click an asset item to view placement details, assigned partner, and linked game insights.</div>
          <div className="tbl-box" style={{ marginTop: 14 }}>
            <div className="tbl-head">
              <div className="tbl-title">
                {showAllDeployments ? `All Deployments Across All Dates (${shownDeployments.length})` : `Deployments on ${linkedGameDate} (${shownDeployments.length})`}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Type</th><th>Name</th><th>Partner(s)</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shownDeployments.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--muted)' }}>No deployments in this view.</td>
                  </tr>
                ) : (
                  shownDeployments
                    .slice()
                    .sort((a, b) => String(a.Game_Date).localeCompare(String(b.Game_Date)))
                    .map((d) => (
                      <tr key={d.id ?? `${d.Asset_Name}-${d.Partner_ID}-${d.Game_Date}`}>
                        <td>{d.Game_Date || '—'}</td>
                        <td>{d.deploymentType === 'campaign' ? 'Campaign' : 'Asset'}</td>
                        <td><strong>{d.Asset_Name}</strong></td>
                        <td>{Array.isArray(d.partnerNames) && d.partnerNames.length > 0 ? d.partnerNames.join(', ') : d.partnerName || d.Partner_ID}</td>
                        <td>{d.status || 'Scheduled'}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {tipData && (
        <Tooltip tipData={tipData} />
      )}

      {selZoneIdx >= 0 && partners[selZoneIdx] && (
        <ZoneDetail
          partner={partners[selZoneIdx]}
          partnerIdx={selZoneIdx}
          assetLabel={selAssetLabel || partners[selZoneIdx]?.asset}
          kpi={kpis[partners[selZoneIdx].id]}
          games={games}
          onClose={() => setSelZoneIdx(-1)}
        />
      )}
    </div>
  );
}
