import React from 'react';

export default function ArenaSvg({ hlZoneIdx, setHlZoneIdx, onHover }) {
  const handleMouseEnter = (e, idx) => onHover(e, idx);
  const handleMouseLeave = () => onHover(null, -1);
  const handleClick = (idx) => setHlZoneIdx(idx);

  const getStyle = (idx, defaultOpacity) => ({
    opacity: defaultOpacity,
    cursor: 'pointer',
    filter: hlZoneIdx === idx ? 'brightness(1.5) drop-shadow(0 0 4px currentColor)' : 'none',
    strokeWidth: hlZoneIdx === idx ? 2 : (idx === 5 ? 2.5 : 0),
    stroke: hlZoneIdx === idx ? 'currentColor' : (idx === 5 ? '#7C3AED' : 'none')
  });

  return (
    <svg id="arena-svg" viewBox="0 0 700 500" style={{ width: '100%', maxWidth: '680px', height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
      {/* Arena bowl outer */}
      <ellipse cx="350" cy="250" rx="330" ry="235" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2"/>
      {/* Concourse ring */}
      <ellipse cx="350" cy="250" rx="285" ry="197" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1"/>
      {/* Seating bowl */}
      <ellipse cx="350" cy="250" rx="245" ry="168" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5"/>
      {/* Court */}
      <rect x="178" y="165" width="344" height="170" rx="8" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5"/>
      {/* Court center circle */}
      <circle cx="350" cy="250" r="30" fill="none" stroke="#EF3B24" strokeWidth="1.5" strokeDasharray="4,3"/>
      {/* Paint areas */}
      <rect x="178" y="195" width="68" height="110" rx="4" fill="rgba(0,125,197,0.12)" stroke="#007DC5" strokeWidth="1"/>
      <rect x="454" y="195" width="68" height="110" rx="4" fill="rgba(0,125,197,0.12)" stroke="#007DC5" strokeWidth="1"/>
      {/* Thunder logo text at center */}
      <text x="350" y="247" textAnchor="middle" fontSize="11" fontWeight="900" fill="#002D62" fontFamily="sans-serif">OKC</text>
      <text x="350" y="261" textAnchor="middle" fontSize="8" fontWeight="700" fill="#EF3B24" fontFamily="sans-serif">THUNDER</text>

      {/* ZONE 1: Digital Courtside (Arcadia Pulse) — sideline banners */}
      <rect x="182" y="153" width="336" height="11" rx="4" fill="#4F46E5" style={getStyle(0, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 0)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(0)}/>
      <rect x="182" y="336" width="336" height="11" rx="4" fill="#4F46E5" style={getStyle(0, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 0)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(0)}/>
      <text x="350" y="148" textAnchor="middle" fontSize="8" fill="#4F46E5" fontWeight="700" pointerEvents="none">DIGITAL COURTSIDE</text>

      {/* ZONE 2: LED Board (Bluejay Canyon) — ring around seating bowl */}
      <rect x="107" y="82" width="18" height="336" rx="5" fill="#0284C7" style={getStyle(1, .8)}
        onMouseEnter={(e) => handleMouseEnter(e, 1)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(1)}/>
      <rect x="575" y="82" width="18" height="336" rx="5" fill="#0284C7" style={getStyle(1, .8)}
        onMouseEnter={(e) => handleMouseEnter(e, 1)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(1)}/>
      <text x="96" y="254" textAnchor="middle" fontSize="8" fill="#0284C7" fontWeight="700" transform="rotate(-90,96,254)" pointerEvents="none">LED BOARD</text>

      {/* ZONE 3: Concourse Wedge (Cobalt Prairie) — concourse sections */}
      <rect x="113" y="425" width="100" height="32" rx="6" fill="#059669" style={getStyle(2, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 2)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(2)}/>
      <rect x="487" y="425" width="100" height="32" rx="6" fill="#059669" style={getStyle(2, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 2)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(2)}/>
      <text x="163" y="447" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700" pointerEvents="none">CONCOURSE WEDGE</text>
      <text x="537" y="447" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700" pointerEvents="none">CONCOURSE WEDGE</text>

      {/* ZONE 4: Mobile Banner (Elevate Oak) — scoreboard areas */}
      <rect x="300" y="52" width="100" height="24" rx="5" fill="#D97706" style={getStyle(3, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 3)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(3)}/>
      <text x="350" y="68" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700" pointerEvents="none">MOBILE BANNER / SCOREBOARD</text>

      {/* ZONE 5: Website Takeover (Flint Creek) — digital display corners */}
      <rect x="130" y="52" width="80" height="22" rx="5" fill="#DC2626" style={getStyle(4, .8)}
        onMouseEnter={(e) => handleMouseEnter(e, 4)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(4)}/>
      <rect x="490" y="52" width="80" height="22" rx="5" fill="#DC2626" style={getStyle(4, .8)}
        onMouseEnter={(e) => handleMouseEnter(e, 4)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(4)}/>
      <text x="170" y="67" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700" pointerEvents="none">WEB / DIGITAL</text>
      <text x="530" y="67" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700" pointerEvents="none">WEB / DIGITAL</text>

      {/* ZONE 6: Jersey Patch (Golden Hour Health) — center court */}
      <circle cx="350" cy="250" r="26" fill="#7C3AED" style={getStyle(5, .2)}
        onMouseEnter={(e) => handleMouseEnter(e, 5)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(5)}/>
      <circle cx="350" cy="250" r="26" fill="none" strokeDasharray="5,3" style={getStyle(5, 1)}
        onMouseEnter={(e) => handleMouseEnter(e, 5)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(5)}/>
      <text x="350" y="288" textAnchor="middle" fontSize="8" fill="#7C3AED" fontWeight="700" pointerEvents="none">JERSEY PATCH</text>

      {/* ZONE 7: Basket Stanchion (Horizon Kite) — basket areas */}
      <circle cx="213" cy="250" r="16" fill="#0891B2" style={getStyle(6, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 6)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(6)}/>
      <circle cx="487" cy="250" r="16" fill="#0891B2" style={getStyle(6, .85)}
        onMouseEnter={(e) => handleMouseEnter(e, 6)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(6)}/>
      <text x="213" y="278" textAnchor="middle" fontSize="8" fill="#0891B2" fontWeight="700" pointerEvents="none">STANCHION</text>
      <text x="487" y="278" textAnchor="middle" fontSize="8" fill="#0891B2" fontWeight="700" pointerEvents="none">STANCHION</text>

      {/* Compass / orientation */}
      <text x="660" y="490" textAnchor="end" fontSize="9" fill="#94A3B8" pointerEvents="none">PAYCOM CENTER · OKC · SECTION VIEW</text>
    </svg>
  );
}
