import React, { useState, useEffect, useMemo } from 'react';
import CalendarGrid from './CalendarGrid';
import GameDetail from './GameDetail';
import { getGames, getPartners, getKPIs, getActivations, firebaseReady } from '../../data/firebase';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPanel() {
  const [curYear, setCurYear] = useState(2025);
  const [curMonth, setCurMonth] = useState(10); // Nov 2025 (0-indexed)
  const [selGame, setSelGame] = useState(null);
  const [query, setQuery] = useState('');
  
  const [games, setGames] = useState([]);
  const [partners, setPartners] = useState([]);
  const [kpis, setKpis] = useState({});
  const [deployments, setDeployments] = useState([]);

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
    }
    loadData();
  }, []);

  const gameMap = useMemo(() => {
    const m = {};
    games.forEach(g => { m[g.d] = g; });
    return m;
  }, [games]);

  const deploymentMap = useMemo(() => {
    const m = {};
    deployments.forEach(d => {
      if (!d.Game_Date) return;
      (m[d.Game_Date] = m[d.Game_Date] || []).push(d);
    });
    return m;
  }, [deployments]);

  const shiftMonth = (d) => {
    let newMonth = curMonth + d;
    let newYear = curYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0)  { newMonth = 11; newYear--; }
    setCurMonth(newMonth);
    setCurYear(newYear);
  };

  if (partners.length === 0) return <div>Loading...</div>;

  return (
    <div id="panel-cal" className="panel active">
      <div className="cal-wrap">
        <div className="cal-box">
          <div className="cal-nav">
            <div className="cal-month-lbl" id="cal-label">{MONTHS[curMonth]} {curYear}</div>
            <div className="cal-controls">
              <div className="panel-search">
                <input
                  type="text"
                  className="panel-search-input"
                  placeholder="Search games..."
                  aria-label="Search games"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <span className="panel-search-icon" aria-hidden="true">🔍</span>
              </div>
              <div className="nav-btns">
                <button className="nav-btn" onClick={() => shiftMonth(-1)}>‹</button>
                <button className="today-btn" onClick={() => { const n = new Date(); setCurYear(n.getFullYear()); setCurMonth(n.getMonth()); }}>Today</button>
                <button className="nav-btn" onClick={() => shiftMonth(1)}>›</button>
              </div>
              <div className="seg-control" role="group" aria-label="Calendar view">
                <button className="seg-btn active" type="button">Month</button>
                <button className="seg-btn" type="button" disabled title="Coming soon">Week</button>
                <button className="seg-btn" type="button" disabled title="Coming soon">Day</button>
              </div>
            </div>
          </div>
          <div className="dow-row">
            <div className="dow">SUN</div><div className="dow">MON</div><div className="dow">TUE</div>
            <div className="dow">WED</div><div className="dow">THU</div><div className="dow">FRI</div><div className="dow">SAT</div>
          </div>

          <CalendarGrid
            curYear={curYear}
            curMonth={curMonth}
            GAME_MAP={gameMap}
            DEPLOY_MAP={deploymentMap}
            selGame={selGame}
            PARTNERS={partners}
            query={query}
            onSelectGame={setSelGame}
          />

        </div>
      </div>

      {selGame && (
        <GameDetail
          selGame={selGame}
          PARTNERS={partners}
          KPI={kpis}
          DEPLOYMENTS={deploymentMap[selGame.d] || []}
          onClose={() => setSelGame(null)}
        />
      )}
    </div>
  );
}
