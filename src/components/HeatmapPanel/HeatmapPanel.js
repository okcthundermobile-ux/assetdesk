import React, { useState, useEffect } from 'react';
import ArenaMap from './ArenaMap';
import Tooltip from './Tooltip';
import ZoneDetail from './ZoneDetail';
import { getPartners, getKPIs, getGames } from '../../data/firebase';

export default function HeatmapPanel() {
  const [partners, setPartners] = useState([]);
  const [kpis, setKpis] = useState({});
  const [games, setGames] = useState([]);
  const [hlZoneIdx, setHlZoneIdx] = useState(-1);
  const [selZoneIdx, setSelZoneIdx] = useState(-1);
  const [tipData, setTipData] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      const [pData, kData, gData] = await Promise.all([getPartners(), getKPIs(), getGames()]);
      setPartners(pData);
      setKpis(kData);
      setGames(gData);
    }
    loadData();
  }, []);

  const handleZoneHover = (e, idx) => {
    if (idx === -1) {
      setTipData(null);
      return;
    }
    const p = partners[idx];
    const k = kpis[p.id];
    setTipData({
      x: e.clientX + 12,
      y: e.clientY + 12,
      partnerName: p.name,
      asset: p.asset,
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

  const handleSelectZone = (idx) => {
    setHlZoneIdx(idx);
    setSelZoneIdx(idx);
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
                placeholder="Search zones or partners..."
                aria-label="Search zones or partners"
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
          <div className="arena-note">Click a placement on the map to see the partner and their upcoming game activations. Hover for a quick KPI preview.</div>
        </div>
      </div>

      {tipData && (
        <Tooltip tipData={tipData} />
      )}

      {selZoneIdx >= 0 && partners[selZoneIdx] && (
        <ZoneDetail
          partner={partners[selZoneIdx]}
          partnerIdx={selZoneIdx}
          kpi={kpis[partners[selZoneIdx].id]}
          games={games}
          onClose={() => setSelZoneIdx(-1)}
        />
      )}
    </div>
  );
}
