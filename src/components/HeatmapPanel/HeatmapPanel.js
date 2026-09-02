import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArenaMap from './ArenaMap';
import Tooltip from './Tooltip';
import ZoneDetail from './ZoneDetail';
import { getPartners, getGames, getActivations, firebaseReady } from '../../data/firebase';

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
  const [games, setGames] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [hlZoneIdx, setHlZoneIdx] = useState(-1);
  const [selZoneIdx, setSelZoneIdx] = useState(-1);
  const [selAssetLabel, setSelAssetLabel] = useState('');
  const [tipData, setTipData] = useState(null);
  const [query, setQuery] = useState('');
  const [linkedGameDate, setLinkedGameDate] = useState(searchParams.get('gameDate') || TODAY_ISO);
  const requestedGameDate = searchParams.get('gameDate');

  useEffect(() => {
    async function loadData() {
      const [pData, gData, dData] = await Promise.all([
        getPartners(),
        getGames(),
        firebaseReady ? getActivations() : Promise.resolve(loadDemoDeployments()),
      ]);
      setPartners(pData);
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
    if (!requestedGameDate || searchParams.get('partnerId')) return;
    setSelZoneIdx(-1);
    setHlZoneIdx(-1);
  }, [requestedGameDate, searchParams]);

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
    setTipData({
      x: e.clientX + 12,
      y: e.clientY + 12,
      assetLabel: marker?.label || p.asset,
      partnerName: p.name,
    });
  };

  const handleZoneMove = (e) => {
    if (!e.target.closest('.arena-marker')) {
      setTipData(null);
    } else if (tipData) {
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
    const selectedGame = games.find(g => g.d === linkedGameDate);
    const recorded = deployments.filter(d => d.Game_Date === linkedGameDate);
    const recordedPartnerIds = new Set(
      recorded.flatMap(d => d.Partner_IDs || [d.Partner_ID]).map(String)
    );
    const scheduledAssets = (selectedGame?.ps || [])
      .map(idx => partners[idx])
      .filter(Boolean)
      .filter(partner => !recordedPartnerIds.has(String(partner.id)))
      .map(partner => ({
        id: `scheduled-${linkedGameDate}-${partner.id}`,
        Game_Date: linkedGameDate,
        deploymentType: 'asset',
        Asset_Name: partner.asset,
        partnerName: partner.name,
        status: 'Scheduled',
      }));
    return [...recorded, ...scheduledAssets];
  }, [deployments, games, linkedGameDate, partners]);

  const closeZoneDetail = () => {
    setSelZoneIdx(-1);
    setHlZoneIdx(-1);
    const next = new URLSearchParams(searchParams);
    next.delete('partnerId');
    setSearchParams(next, { replace: true });
  };

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
                {`All Deployments on ${linkedGameDate} (${shownDeployments.length})`}
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
          games={games}
          linkedGameDate={linkedGameDate}
          onClose={closeZoneDetail}
        />
      )}
    </div>
  );
}
