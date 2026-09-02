import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CalendarGrid from './CalendarGrid';
import GameDetail from './GameDetail';
import { getGames, getPartners, getKPIs, getActivations, firebaseReady } from '../../data/firebase';

const DEMO_STORAGE_KEY = 'thunder-demo-deployments';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const makeIsoDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseIsoDate = (isoDate) => new Date(`${isoDate}T12:00:00`);

export default function CalendarPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const [curYear, setCurYear] = useState(now.getFullYear());
  const [curMonth, setCurMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState('month');
  const [focusDate, setFocusDate] = useState(makeIsoDate(now));
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

  useEffect(() => {
    const requestedGameDate = searchParams.get('gameDate');
    if (!requestedGameDate) return;
    const requestedDate = parseIsoDate(requestedGameDate);
    if (Number.isNaN(requestedDate.getTime())) return;
    setFocusDate(requestedGameDate);
    setCurYear(requestedDate.getFullYear());
    setCurMonth(requestedDate.getMonth());
  }, [searchParams]);

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

  useEffect(() => {
    const requestedGameDate = searchParams.get('gameDate');
    if (!requestedGameDate) return;
    if (gameMap[requestedGameDate]) {
      setSelGame(gameMap[requestedGameDate]);
    }
  }, [gameMap, searchParams]);

  const shiftMonth = (d) => {
    let newMonth = curMonth + d;
    let newYear = curYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0)  { newMonth = 11; newYear--; }
    setCurMonth(newMonth);
    setCurYear(newYear);
  };

  const shiftYear = (delta) => {
    const nextYear = curYear + delta;
    setCurYear(nextYear);
    if (viewMode !== 'month') {
      const focus = parseIsoDate(focusDate);
      const nextFocus = new Date(focus);
      nextFocus.setFullYear(nextYear);
      setFocusDate(makeIsoDate(nextFocus));
    }
  };

  const shiftView = (delta) => {
    if (viewMode === 'month') {
      shiftMonth(delta);
      return;
    }

    const focus = parseIsoDate(focusDate);
    const next = new Date(focus);
    next.setDate(focus.getDate() + (viewMode === 'week' ? 7 * delta : delta));
    setFocusDate(makeIsoDate(next));
    setCurYear(next.getFullYear());
    setCurMonth(next.getMonth());
  };

  const viewLabel = useMemo(() => {
    if (viewMode === 'month') return `${MONTHS[curMonth]} ${curYear}`;

    const focus = parseIsoDate(focusDate);
    if (viewMode === 'week') {
      const start = new Date(focus);
      start.setDate(focus.getDate() - focus.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const startMonth = MONTHS[start.getMonth()];
      const endMonth = MONTHS[end.getMonth()];
      if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
        return `${startMonth} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${startMonth} ${start.getDate()}, ${start.getFullYear()}–${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
    }

    return focus.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [curMonth, curYear, focusDate, viewMode]);

  const visibleDow = useMemo(() => {
    if (viewMode === 'day') {
      const day = parseIsoDate(focusDate).getDay();
      return [DAYS[day]];
    }
    return DAYS;
  }, [focusDate, viewMode]);

  const yearOptions = useMemo(() => {
    const fromGames = games.map(g => Number(g.d.slice(0, 4))).filter(Boolean);
    const dynamic = [curYear - 2, curYear - 1, curYear, curYear + 1, curYear + 2];
    return [...new Set([...fromGames, ...dynamic])].sort((a, b) => a - b);
  }, [curYear, games]);

  if (partners.length === 0) return <div>Loading...</div>;

  return (
    <div id="panel-cal" className="panel active">
      <div className="cal-wrap">
        <div className="cal-box">
          <div className="cal-nav">
            <div className="cal-month-lbl" id="cal-label">{viewLabel}</div>
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
                <button className="nav-btn" onClick={() => shiftYear(-1)} title="Previous year">«</button>
                <button className="nav-btn" onClick={() => shiftView(-1)}>‹</button>
                <button className="today-btn" onClick={() => {
                  const n = new Date();
                  setCurYear(n.getFullYear());
                  setCurMonth(n.getMonth());
                  setFocusDate(makeIsoDate(n));
                }}>Today</button>
                <button className="nav-btn" onClick={() => shiftView(1)}>›</button>
                <button className="nav-btn" onClick={() => shiftYear(1)} title="Next year">»</button>
                <select
                  className="year-select"
                  aria-label="Select year"
                  value={curYear}
                  onChange={(e) => {
                    const nextYear = Number(e.target.value);
                    setCurYear(nextYear);
                    if (viewMode !== 'month') {
                      const focus = parseIsoDate(focusDate);
                      const nextFocus = new Date(focus);
                      nextFocus.setFullYear(nextYear);
                      setFocusDate(makeIsoDate(nextFocus));
                    }
                  }}
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="seg-control" role="group" aria-label="Calendar view">
                <button className={`seg-btn${viewMode === 'month' ? ' active' : ''}`} type="button" onClick={() => setViewMode('month')}>Month</button>
                <button className={`seg-btn${viewMode === 'week' ? ' active' : ''}`} type="button" onClick={() => setViewMode('week')}>Week</button>
                <button className={`seg-btn${viewMode === 'day' ? ' active' : ''}`} type="button" onClick={() => setViewMode('day')}>Day</button>
              </div>
            </div>
          </div>
          <div className={`dow-row${viewMode === 'day' ? ' dow-row--day' : ''}`}>
            {visibleDow.map(day => <div key={day} className="dow">{day}</div>)}
          </div>

          <CalendarGrid
            curYear={curYear}
            curMonth={curMonth}
            viewMode={viewMode}
            focusDate={focusDate}
            GAME_MAP={gameMap}
            DEPLOY_MAP={deploymentMap}
            selGame={selGame}
            PARTNERS={partners}
            query={query}
            onSelectDate={(date) => {
              setFocusDate(date);
              const next = new URLSearchParams(searchParams);
              next.set('gameDate', date);
              setSearchParams(next);
            }}
            onSelectGame={(game) => {
              setSelGame(game);
              const next = new URLSearchParams(searchParams);
              next.set('gameDate', game.d);
              setSearchParams(next);
            }}
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
