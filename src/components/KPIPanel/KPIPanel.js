import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PartnerTabs from './PartnerTabs';
import RoleViews from './RoleViews';
import AllPartnersChart from './AllPartnersChart';
import { getPartners, getKPIs, getGames, getActivations, firebaseReady } from '../../data/firebase.js';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';
const TODAY_ISO = new Date().toISOString().slice(0, 10);

const DEFAULT_KPI = {
  qi: 0,
  imp: 0,
  ctr: 0,
  bev: 0,
  mentions: 0,
  sov: 0,
  socialImp: 0,
  eng: 0,
  twitterSpend: 0,
  fbSpend: 0,
  contracted: '0:00',
  bonused: '0:00',
  boltPlays: 0,
  wedgePlays: 0,
  wr: 0,
};

function loadDemoDeployments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const fmt$ = (n) => '$' + Number(n || 0).toLocaleString('en-US');
const fmtN = (n) => Number(n || 0).toLocaleString('en-US');

export default function KPIPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [partners, setPartners] = useState([]);
  const [kpis, setKpis] = useState({});
  const [games, setGames] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [selPartner, setSelPartner] = useState(0);
  const [linkedGameDate, setLinkedGameDate] = useState(searchParams.get('gameDate') || TODAY_ISO);
  const [reportType, setReportType] = useState(searchParams.get('reportType') === 'partner' ? 'partner' : 'game');

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
    setReportType(searchParams.get('reportType') === 'partner' ? 'partner' : 'game');
    const requestedPartnerId = searchParams.get('partnerId');
    if (requestedPartnerId && partners.length > 0) {
      const idx = partners.findIndex(p => String(p.id) === String(requestedPartnerId));
      if (idx >= 0) setSelPartner(idx);
    }
  }, [partners, searchParams]);

  useEffect(() => {
    if (searchParams.get('gameDate') || !linkedGameDate) return;
    const next = new URLSearchParams(searchParams);
    next.set('gameDate', linkedGameDate);
    if (!next.get('reportType')) next.set('reportType', reportType);
    if (partners[selPartner]) next.set('partnerId', partners[selPartner].id);
    setSearchParams(next, { replace: true });
  }, [linkedGameDate, partners, reportType, searchParams, selPartner, setSearchParams]);

  const selectedGame = useMemo(
    () => games.find(g => g.d === linkedGameDate) || null,
    [games, linkedGameDate]
  );

  const dayRows = useMemo(() => {
    if (!selectedGame) return [];
    return selectedGame.ps
      .map((idx) => partners[idx])
      .filter(Boolean)
      .map((partner) => ({ partner, kpi: kpis[partner.id] || DEFAULT_KPI }));
  }, [kpis, partners, selectedGame]);

  const dayTotals = useMemo(() => {
    const totals = dayRows.reduce(
      (acc, row) => ({
        qi: acc.qi + Number(row.kpi.qi || 0),
        imp: acc.imp + Number(row.kpi.imp || 0),
        eng: acc.eng + Number(row.kpi.eng || 0),
        socialImp: acc.socialImp + Number(row.kpi.socialImp || 0),
        ctr: acc.ctr + Number(row.kpi.ctr || 0),
      }),
      { qi: 0, imp: 0, eng: 0, socialImp: 0, ctr: 0 }
    );
    return {
      ...totals,
      avgCtr: dayRows.length > 0 ? (totals.ctr / dayRows.length) : 0,
    };
  }, [dayRows]);

  const dayDeployments = useMemo(
    () => deployments.filter(d => d.Game_Date === linkedGameDate),
    [deployments, linkedGameDate]
  );

  if (partners.length === 0) return <div>Loading...</div>;

  const partner = partners[selPartner];
  const kpi = kpis[partner.id] || DEFAULT_KPI;

  return (
    <div id="panel-kpi" className="panel active">
      {reportType === 'partner' ? (
        <div className="kpi-wrap">
          <div className="kpi-left">
            <div className="sec-title" style={{ marginBottom: '14px' }}>Partner KPI Report</div>
            <PartnerTabs
              partners={partners}
              selPartner={selPartner}
              onSelectPartner={(idx) => {
                setSelPartner(idx);
                const next = new URLSearchParams(searchParams);
                next.set('partnerId', partners[idx].id);
                if (linkedGameDate) next.set('gameDate', linkedGameDate);
                setSearchParams(next);
              }}
            />
            <RoleViews
              partner={partner}
              kpi={kpi}
              GAMES={games}
              selPartner={selPartner}
            />
          </div>
          <AllPartnersChart PARTNERS={partners} KPI={kpis} />
        </div>
      ) : (
        <div className="kpi-day-wrap">
          <div className="sec-title">Game Report</div>
          <div className="role-note" style={{ marginBottom: 14 }}>
            {selectedGame
              ? `${linkedGameDate} · vs. ${selectedGame.opp} · ${dayRows.length} active partner${dayRows.length === 1 ? '' : 's'}`
              : `${linkedGameDate || 'No game selected'} · No scheduled game data`}
          </div>
          <div className="game-report-grid">
            <div>
              <div className="metric-grid day-metric-grid">
                <div className="m-card day-metric-card">
                  <div className="m-lbl">Active Partners</div>
                  <div className="m-val">{dayRows.length}</div>
                  <div className="m-sub">Scheduled for this game date</div>
                </div>
                <div className="m-card day-metric-card">
                  <div className="m-lbl">Total QI Media Value</div>
                  <div className="m-val">{fmt$(dayTotals.qi)}</div>
                  <div className="m-sub">Across all active partners</div>
                </div>
                <div className="m-card day-metric-card">
                  <div className="m-lbl">Total Impressions</div>
                  <div className="m-val">{fmtN(dayTotals.imp)}</div>
                  <div className="m-sub">Estimated in-bowl + digital reach</div>
                </div>
                <div className="m-card day-metric-card">
                  <div className="m-lbl">Average CTR</div>
                  <div className="m-val">{dayTotals.avgCtr.toFixed(2)}%</div>
                  <div className="m-sub">Mean partner CTR for this date</div>
                </div>
              </div>

              <div className="tbl-box">
                <div className="tbl-head"><div className="tbl-title">Per-Partner Game KPIs</div></div>
                <table>
                  <thead>
                    <tr>
                      <th>Partner</th><th>Asset</th><th>QI Value</th><th>Impressions</th><th>CTR</th><th>Engagements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayRows.length === 0 ? (
                      <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>No active partners for this date.</td></tr>
                    ) : (
                      dayRows.map(({ partner: rowPartner, kpi: rowKpi }) => (
                        <tr key={rowPartner.id}>
                          <td><strong>{rowPartner.name}</strong></td>
                          <td style={{ color: 'var(--muted)' }}>{rowPartner.asset}</td>
                          <td><strong>{fmt$(rowKpi.qi)}</strong></td>
                          <td>{fmtN(rowKpi.imp)}</td>
                          <td>{rowKpi.ctr}%</td>
                          <td>{fmtN(rowKpi.eng)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="game-report-insights">
              <div className="chart-box">
                <div className="chart-title">QI Media Value by Partner</div>
                {dayRows.length === 0 ? (
                  <div className="m-sub">No partner activity for this date.</div>
                ) : (
                  dayRows.map(({ partner: rowPartner, kpi: rowKpi }) => (
                    <div key={rowPartner.id} className="bar-row">
                      <div className="bar-lbl">{rowPartner.short}</div>
                      <div className="bar-track"><div className="bar-fill" style={{ width: `${dayTotals.qi ? Math.round((rowKpi.qi / dayTotals.qi) * 100) : 0}%`, background: rowPartner.color }} /></div>
                      <div className="bar-val">{fmt$(rowKpi.qi)}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="tbl-box">
                <div className="tbl-head"><div className="tbl-title">Scheduled Deployments</div></div>
                <div className="game-deployment-list">
                  {dayDeployments.length === 0 ? (
                    <div className="m-sub">No deployments found for this game.</div>
                  ) : (
                    dayDeployments.map((d) => (
                      <div key={d.id ?? `${d.Asset_Name}-${d.Partner_ID}-${d.Game_Date}`} className="game-deployment-item">
                        <strong>{d.Asset_Name}</strong>
                        <span>{d.deploymentType === 'campaign' ? 'Campaign' : 'Asset'} · {d.status || 'Scheduled'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
