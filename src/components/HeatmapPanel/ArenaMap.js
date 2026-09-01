import React from 'react';

// Approximate marker positions (percent of image width/height) for each
// partner zone on the Paycom Center seating chart.
const MARKERS = [
  { x: 50, y: 61, label: 'Digital Courtside', type: 'courtside' },
  { x: 89, y: 46, label: 'LED Board Ring', type: 'led' },
  { x: 15, y: 80, label: 'Concourse Wedge', type: 'billboard' },
  { x: 50, y: 9,  label: 'Scoreboard / Mobile Banner', type: 'mobile' },
  { x: 86, y: 15, label: 'Web / Digital Display', type: 'web' },
  { x: 50, y: 47, label: 'Center Court / Jersey Patch', type: 'jersey' },
  { x: 41, y: 47, label: 'Basket Stanchion', type: 'hoop' },
];

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };

// White glyphs depicting each advertisement placement type.
const ICONS = {
  // Courtside digital board: wide display on a stand
  courtside: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="2" y="5" width="20" height="10" rx="2" />
      <path d="M7 9h4M7 12h7" />
      <path d="M9 19h6M12 15v4" />
    </svg>
  ),
  // LED board ring: vertical panel with LED dots
  led: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M10.5 6h3M10.5 10h3M10.5 14h3M10.5 18h3" />
    </svg>
  ),
  // Concourse billboard: sign on two posts
  billboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="4" width="18" height="11" rx="2" />
      <path d="M7 8h6M7 11h9" />
      <path d="M8 15v5M16 15v5" />
    </svg>
  ),
  // Scoreboard / mobile banner: smartphone with a banner
  mobile: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M10 5h4" />
      <path d="M9.5 10h5v4h-5z" />
      <path d="M11 18.5h2" />
    </svg>
  ),
  // Web / digital display: globe
  web: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.7 2.6 4 5.6 4 9s-1.3 6.4-4 9c-2.7-2.6-4-5.6-4-9s1.3-6.4 4-9z" />
    </svg>
  ),
  // Jersey patch: basketball jersey
  jersey: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M9 3 5.5 5 3 9l3 1.5L7 8v12h10V8l1 2.5L21 9l-2.5-4L15 3c0 1.7-1.3 3-3 3S9 4.7 9 3z" />
      <path d="M10 13h4" />
    </svg>
  ),
  // Basket stanchion: backboard and hoop
  hoop: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="5" y="2" width="14" height="10" rx="1.5" />
      <rect x="9.5" y="6" width="5" height="4" />
      <path d="M9 12l1 6h4l1-6" />
    </svg>
  ),
};

export default function ArenaMap({ partners, hlZoneIdx, onSelectZone, onHover, query = '' }) {
  const q = query.trim().toLowerCase();
  const matches = p => !q || p.name.toLowerCase().includes(q) || p.asset.toLowerCase().includes(q);

  return (
    <div className="arena-map">
      <img
        src="/paycom-center-map.png"
        alt="Paycom Center seating chart"
        className="arena-map-img"
        draggable="false"
      />
      {MARKERS.map((m, i) => {
        const p = partners[i];
        if (!p) return null;
        const active = hlZoneIdx === i;
        const dim = !matches(p);
        return (
          <button
            key={i}
            type="button"
            className={`arena-marker arena-marker--${m.type}${active ? ' active' : ''}${dim ? ' dim' : ''}`}
            style={{ left: `${m.x}%`, top: `${m.y}%`, background: p.color }}
            title={`${p.name} — ${m.label}`}
            aria-label={`${p.name} — ${m.label}`}
            onClick={() => onSelectZone(i)}
            onMouseEnter={(e) => onHover(e, i)}
            onMouseLeave={() => onHover(null, -1)}
          >
            {ICONS[m.type]}
            <span className="arena-marker-pulse" style={{ borderColor: p.color }} />
          </button>
        );
      })}
    </div>
  );
}
