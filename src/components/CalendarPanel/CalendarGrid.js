import React from 'react';

export default function CalendarGrid({
  curYear,
  curMonth,
  viewMode = 'month',
  focusDate,
  GAME_MAP,
  DEPLOY_MAP = {},
  selGame,
  PARTNERS,
  query = '',
  onSelectGame,
  onSelectDate
}) {
  const makeIsoDate = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parseIsoDate = (isoDate) => new Date(`${isoDate}T12:00:00`);

  const buildDayCell = (dateStr, dayNumber, isEmpty = false) => {
    if (isEmpty) {
      return <div key={`empty-${dateStr}-${dayNumber}`} className="cal-cell empty"></div>;
    }

    const game = GAME_MAP[dateStr];
    const dayDeployments = DEPLOY_MAP[dateStr] || [];
    const matches = !query || (game && game.opp.toLowerCase().includes(query.toLowerCase()));

    let cls = 'cal-cell';
    if (game) cls += ' game';
    if (game && !matches) cls += ' dim';
    if (dateStr === today) cls += ' today';
    if (selGame && selGame.d === dateStr) cls += ' sel';

    return (
      <div
        key={dateStr}
        className={cls}
        onClick={() => {
          onSelectDate?.(dateStr);
          if (game) onSelectGame(game);
        }}
      >
        <div className="cell-date">{dayNumber}</div>
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
  };

  const first = new Date(curYear, curMonth, 1).getDay();
  const days = new Date(curYear, curMonth + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  const cells = [];
  let rowCount = 1;
  let gridTemplateColumns = 'repeat(7, minmax(0, 1fr))';

  if (viewMode === 'month') {
    // Always render 6 weeks so every month is the same height.
    rowCount = 6;
    for (let i = 0; i < first; i++) {
      cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
    }

    for (let d = 1; d <= days; d++) {
      const dateStr = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push(buildDayCell(dateStr, d));
    }

    const trailing = rowCount * 7 - first - days;
    for (let i = 0; i < trailing; i++) {
      cells.push(<div key={`trail-${i}`} className="cal-cell empty"></div>);
    }
  } else if (viewMode === 'week') {
    const focus = parseIsoDate(focusDate || today);
    const weekStart = new Date(focus);
    weekStart.setDate(focus.getDate() - focus.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dateStr = makeIsoDate(d);
      cells.push(buildDayCell(dateStr, d.getDate()));
    }
  } else {
    rowCount = 1;
    gridTemplateColumns = 'minmax(0, 1fr)';
    const focus = parseIsoDate(focusDate || today);
    const dateStr = makeIsoDate(focus);
    cells.push(buildDayCell(dateStr, focus.getDate()));
  }

  return (
    <div
      className={`cal-grid cal-grid--${viewMode}`}
      id="cal-grid"
      style={{ gridTemplateRows: `repeat(${rowCount}, 1fr)`, gridTemplateColumns }}
    >
      {cells}
    </div>
  );
}
