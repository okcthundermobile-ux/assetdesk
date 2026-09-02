import React, { useEffect, useMemo, useRef, useState } from 'react';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const toIso = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseIso = (isoDate) => new Date(`${isoDate}T12:00:00`);

export default function GameDatePicker({ games = [], value = '', onChange, label = 'Game date' }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  const gameSet = useMemo(() => new Set(games.map(g => g.d)), [games]);
  const selectedDate = useMemo(() => {
    if (value) {
      const parsed = parseIso(value);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [value]);

  const [monthDate, setMonthDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    setMonthDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (!pickerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const days = useMemo(() => {
    const firstDow = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
    const count = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDow; i++) {
      cells.push({ empty: true, key: `e-${i}` });
    }
    for (let d = 1; d <= count; d++) {
      const iso = toIso(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
      cells.push({ day: d, iso, hasGame: gameSet.has(iso), selected: iso === value, key: iso });
    }
    while (cells.length < 42) {
      cells.push({ empty: true, key: `t-${cells.length}` });
    }
    return cells;
  }, [gameSet, monthDate, value]);

  return (
    <div className="game-date-picker" ref={pickerRef}>
      <button type="button" className="game-date-trigger" onClick={() => setOpen(v => !v)} aria-label={label}>
        <span>{value || 'Select game date'}</span>
        <span aria-hidden="true">📅</span>
      </button>
      {open && (
        <div className="game-date-popover" role="dialog" aria-label={`${label} calendar`}>
          <div className="game-date-head">
            <button
              type="button"
              className="nav-btn game-date-nav"
              onClick={() => setMonthDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="game-date-month">{MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}</div>
            <button
              type="button"
              className="nav-btn game-date-nav"
              onClick={() => setMonthDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="game-date-grid game-date-grid--head">
            {DOW.map((dow, idx) => <div key={`${dow}-${idx}`} className="game-date-dow">{dow}</div>)}
          </div>
          <div className="game-date-grid">
            {days.map((cell) => {
              if (cell.empty) return <div key={cell.key} className="game-date-cell empty" />;
              return (
                <button
                  key={cell.key}
                  type="button"
                  className={`game-date-cell${cell.hasGame ? ' has-game' : ''}${cell.selected ? ' selected' : ''}`}
                  disabled={!cell.hasGame}
                  onClick={() => {
                    onChange?.(cell.iso);
                    setOpen(false);
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
          <div className="game-date-legend">
            <span className="dot-game" aria-hidden="true" /> Red dates have games
          </div>
        </div>
      )}
    </div>
  );
}
