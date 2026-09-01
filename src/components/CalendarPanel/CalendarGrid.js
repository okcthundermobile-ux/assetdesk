import React from 'react';

export default function CalendarGrid({
  curYear,
  curMonth,
  GAME_MAP,
  DEPLOY_MAP = {},
  selGame,
  PARTNERS,
  query = '',
  onSelectGame
}) {
  const first = new Date(curYear, curMonth, 1).getDay();
  const days = new Date(curYear, curMonth + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);
  // Always render 6 weeks so every month is the same height.
  const rowCount = 6;

  const cells = [];
  for (let i = 0; i < first; i++) {
    cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
  }

  for (let d = 1; d <= days; d++) {
    const dateStr = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const game = GAME_MAP[dateStr];
    const dayDeployments = DEPLOY_MAP[dateStr] || [];
    
    const matches = !query || (game && game.opp.toLowerCase().includes(query.toLowerCase()));

    let cls = 'cal-cell';
    if (game) cls += ' game';
    if (game && !matches) cls += ' dim';
    if (dateStr === today) cls += ' today';
    if (selGame && selGame.d === dateStr) cls += ' sel';

    cells.push(
      <div 
        key={dateStr} 
        className={cls} 
        onClick={() => game && onSelectGame(game)}
      >
        <div className="cell-date">{d}</div>
        {game && matches && (
          <div className="cell-event">
            <span className="cell-event-title">vs {game.opp}</span>
            <span className="cell-dots">
              {game.ps.map(i => (
                <span key={i} className="dot" style={{ background: PARTNERS[i].color }}></span>
              ))}
            </span>
          </div>
        )}
        {dayDeployments.length > 0 && (
          <div className="cell-deploy-badge" title={`${dayDeployments.length} scheduled deployment(s)`}>
            🚀 {dayDeployments.length}
          </div>
        )}
      </div>
    );
  }

  // Pad trailing cells so the grid always has rowCount * 7 cells.
  const trailing = rowCount * 7 - first - days;
  for (let i = 0; i < trailing; i++) {
    cells.push(<div key={`trail-${i}`} className="cal-cell empty"></div>);
  }

  return (
    <div
      className="cal-grid"
      id="cal-grid"
      style={{ gridTemplateRows: `repeat(${rowCount}, 1fr)` }}
    >
      {cells}
    </div>
  );
}
