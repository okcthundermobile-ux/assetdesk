
// ═══════════════════════════ DATA ═══════════════════════════

const PARTNERS = [
  { id:'900137', name:'Arcadia Pulse Co.',     short:'Arcadia',  industry:'Consumer Tech',       asset:'Digital Courtside', color:'#4F46E5' },
  { id:'900274', name:'Bluejay Canyon Labs',   short:'Bluejay',  industry:'Research & Analytics', asset:'LED Board',         color:'#0284C7' },
  { id:'900411', name:'Cobalt Prairie Foods',  short:'Cobalt',   industry:'Food & Beverage',      asset:'Concourse Wedge',   color:'#059669' },
  { id:'900548', name:'Elevate Oak Financial', short:'Elevate',  industry:'Financial Services',   asset:'Mobile Banner',     color:'#D97706' },
  { id:'900685', name:'Flint Creek Motors',    short:'Flint',    industry:'Automotive',           asset:'Website Takeover',  color:'#DC2626' },
  { id:'900822', name:'Golden Hour Health',    short:'Golden',   industry:'Healthcare',           asset:'Jersey Patch',      color:'#7C3AED' },
  { id:'900959', name:'Horizon Kite Wireless', short:'Horizon',  industry:'Telecom',              asset:'Basket Stanchion',  color:'#0891B2' },
];

const KPI = {
  '900137': { qi:20333, imp:17271, ctr:2.1, bev:21783, mentions:181, sov:2.1,  twitterSpend:768,  fbSpend:1243, socialImp:58313,  eng:711,  contracted:'4:13', bonused:'0:30', boltPlays:107, wedgePlays:107, wr:158 },
  '900274': { qi:25667, imp:22542, ctr:2.4, bev:25567, mentions:287, sov:2.4,  twitterSpend:1037, fbSpend:1587, socialImp:71626,  eng:922,  contracted:'5:14', bonused:'0:45', boltPlays:189, wedgePlays:189, wr:234 },
  '900411': { qi:31000, imp:27600, ctr:3.3, bev:29350, mentions:180, sov:3.3,  twitterSpend:1305, fbSpend:1930, socialImp:84300,  eng:920,  contracted:'6:15', bonused:'1:00', boltPlays:58,  wedgePlays:58,  wr:320 },
  '900548': { qi:36000, imp:32871, ctr:3.6, bev:32800, mentions:286, sov:3.6,  twitterSpend:1240, fbSpend:1940, socialImp:97613,  eng:1131, contracted:'7:16', bonused:'1:15', boltPlays:140, wedgePlays:140, wr:420 },
  '900685': { qi:41333, imp:38142, ctr:4.5, bev:36583, mentions:392, sov:4.5,  twitterSpend:1508, fbSpend:2283, socialImp:110926, eng:1342, contracted:'8:17', bonused:'1:30', boltPlays:222, wedgePlays:222, wr:533 },
  '900822': { qi:46667, imp:43200, ctr:4.8, bev:40367, mentions:285, sov:4.8,  twitterSpend:1777, fbSpend:2627, socialImp:123600, eng:1340, contracted:'9:18', bonused:'1:45', boltPlays:0,   wedgePlays:0,   wr:600 },
  '900959': { qi:52000, imp:48471, ctr:5.7, bev:44150, mentions:391, sov:5.7,  twitterSpend:2045, fbSpend:2970, socialImp:136913, eng:1551, contracted:'10:19',bonused:'2:00', boltPlays:0,   wedgePlays:0,   wr:700 },
};

// 41 home games, Oct 2025–Apr 2026
// partner arrays = indices into PARTNERS[]
const GAMES = [
  {d:'2025-10-22',opp:'Memphis Grizzlies',       ps:[0,1,2,3,4]},
  {d:'2025-10-24',opp:'Houston Rockets',          ps:[0,1,3,5,6]},
  {d:'2025-10-27',opp:'Utah Jazz',                ps:[0,2,4,5,6]},
  {d:'2025-10-29',opp:'Dallas Mavericks',         ps:[0,1,2,5]},
  {d:'2025-11-01',opp:'Golden State Warriors',    ps:[0,1,2,3,4,5,6]},
  {d:'2025-11-03',opp:'San Antonio Spurs',        ps:[1,2,4,6]},
  {d:'2025-11-08',opp:'Minnesota Timberwolves',   ps:[0,1,3,4,5]},
  {d:'2025-11-10',opp:'New Orleans Pelicans',     ps:[0,2,3,5,6]},
  {d:'2025-11-14',opp:'Chicago Bulls',            ps:[1,2,3,4,5,6]},
  {d:'2025-11-17',opp:'Boston Celtics',           ps:[0,1,2,4,5,6]},
  {d:'2025-11-19',opp:'Brooklyn Nets',            ps:[0,2,4,5]},
  {d:'2025-11-24',opp:'Portland Trail Blazers',   ps:[1,3,5,6]},
  {d:'2025-11-26',opp:'Sacramento Kings',         ps:[0,1,2,3,6]},
  {d:'2025-12-01',opp:'Phoenix Suns',             ps:[0,1,3,4,5]},
  {d:'2025-12-06',opp:'Denver Nuggets',           ps:[0,1,2,3,4,5,6]},
  {d:'2025-12-08',opp:'Miami Heat',               ps:[2,3,4,6]},
  {d:'2025-12-13',opp:'LA Lakers',                ps:[0,1,2,3,4,5,6]},
  {d:'2025-12-16',opp:'LA Clippers',              ps:[0,2,4,5,6]},
  {d:'2025-12-20',opp:'Cleveland Cavaliers',      ps:[1,3,5,6]},
  {d:'2025-12-23',opp:'Indiana Pacers',           ps:[0,1,2,4,5]},
  {d:'2025-12-26',opp:'Memphis Grizzlies',        ps:[0,2,3,4,6]},
  {d:'2025-12-30',opp:'Orlando Magic',            ps:[1,2,3,5,6]},
  {d:'2026-01-03',opp:'Atlanta Hawks',            ps:[0,1,3,4,6]},
  {d:'2026-01-07',opp:'Charlotte Hornets',        ps:[0,2,3,5,6]},
  {d:'2026-01-10',opp:'Detroit Pistons',          ps:[1,2,4,5,6]},
  {d:'2026-01-14',opp:'Milwaukee Bucks',          ps:[0,1,2,3,4,5,6]},
  {d:'2026-01-17',opp:'Toronto Raptors',          ps:[0,3,4,5]},
  {d:'2026-01-21',opp:'Washington Wizards',       ps:[1,2,3,6]},
  {d:'2026-01-24',opp:'New York Knicks',          ps:[0,1,2,3,4,5,6]},
  {d:'2026-01-28',opp:'Philadelphia 76ers',       ps:[0,1,4,5,6]},
  {d:'2026-01-31',opp:'Houston Rockets',          ps:[2,3,4,5]},
  {d:'2026-02-04',opp:'Minnesota Timberwolves',   ps:[0,1,2,4,6]},
  {d:'2026-02-07',opp:'Dallas Mavericks',         ps:[0,1,3,5,6]},
  {d:'2026-02-11',opp:'Denver Nuggets',           ps:[0,2,3,4,5,6]},
  {d:'2026-02-14',opp:'Golden State Warriors',    ps:[0,1,2,3,4,5,6]},
  {d:'2026-02-21',opp:'Utah Jazz',                ps:[1,3,4,6]},
  {d:'2026-02-25',opp:'San Antonio Spurs',        ps:[0,2,4,5]},
  {d:'2026-03-01',opp:'Phoenix Suns',             ps:[0,1,2,3,6]},
  {d:'2026-03-07',opp:'Sacramento Kings',         ps:[1,2,4,5,6]},
  {d:'2026-03-11',opp:'LA Lakers',                ps:[0,1,2,3,4,5,6]},
  {d:'2026-03-14',opp:'Boston Celtics',           ps:[0,2,3,5,6]},
  {d:'2026-03-18',opp:'Miami Heat',               ps:[1,3,4,5,6]},
  {d:'2026-03-21',opp:'Chicago Bulls',            ps:[0,1,2,4,5]},
  {d:'2026-03-25',opp:'New Orleans Pelicans',     ps:[0,2,3,4,6]},
  {d:'2026-03-28',opp:'Memphis Grizzlies',        ps:[1,2,3,5,6]},
  {d:'2026-04-01',opp:'Dallas Mavericks',         ps:[0,1,2,3,4,5,6]},
  {d:'2026-04-05',opp:'Houston Rockets',          ps:[0,1,3,4,6]},
  {d:'2026-04-08',opp:'Denver Nuggets',           ps:[0,2,3,5,6]},
  {d:'2026-04-12',opp:'Utah Jazz',                ps:[1,2,3,4,5]},
];

// ═══════════════════════════ STATE ═══════════════════════════
let curYear = 2025, curMonth = 10; // Nov 2025 (0-indexed)
let selGame = null;
let selPartner = 0;
let curRole = 'cp';
let hlZoneIdx = -1;

// ═══════════════════════════ HELPERS ═══════════════════════════
const $ = id => document.getElementById(id);
const fmt$ = n => '$' + n.toLocaleString('en-US');
const fmtN = n => n.toLocaleString('en-US');
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function gameMap() {
  const m = {};
  GAMES.forEach(g => { m[g.d] = g; });
  return m;
}
const GAME_MAP = gameMap();

// ═══════════════════════════ ROLE SWITCHER ═══════════════════════════
function setRole(r, btn) {
  curRole = r;
  document.body.className = 'role-' + r;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderKPI();
}

// ═══════════════════════════ TAB SWITCHER ═══════════════════════════
function setTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  $('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// ═══════════════════════════ CALENDAR ═══════════════════════════
function shiftMonth(d) {
  curMonth += d;
  if (curMonth > 11) { curMonth = 0; curYear++; }
  if (curMonth < 0)  { curMonth = 11; curYear--; }
  renderCalendar();
}

function renderCalendar() {
  $('cal-label').textContent = MONTHS[curMonth] + ' ' + curYear;
  const grid = $('cal-grid');
  grid.innerHTML = '';
  const first = new Date(curYear, curMonth, 1).getDay();
  const days = new Date(curYear, curMonth + 1, 0).getDate();
  const today = new Date().toISOString().slice(0,10);

  for (let i = 0; i < first; i++) {
    grid.insertAdjacentHTML('beforeend', '<div class="cal-cell empty"></div>');
  }
  for (let d = 1; d <= days; d++) {
    const dateStr = `${curYear}-${String(curMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const game = GAME_MAP[dateStr];
    let cls = 'cal-cell';
    if (game) cls += ' game';
    if (dateStr === today) cls += ' today';
    if (selGame && selGame.d === dateStr) cls += ' sel';

    let inner = `<div class="cell-date">${d}</div>`;
    if (game) {
      inner += `<div class="cell-opp">${game.opp.replace(' ', ' ')}</div>`;
      inner += `<div class="cell-dots">${game.ps.map(i => `<div class="dot" style="background:${PARTNERS[i].color}"></div>`).join('')}</div>`;
    }
    const onclick = game ? `onclick="selectGame('${dateStr}')"` : '';
    grid.insertAdjacentHTML('beforeend', `<div class="${cls}" ${onclick}>${inner}</div>`);
  }

  // Legend
  const leg = $('cal-legend');
  leg.innerHTML = PARTNERS.map(p => `<div class="leg"><div class="leg-dot" style="background:${p.color}"></div>${p.short}</div>`).join('');
}

function selectGame(dateStr) {
  selGame = GAME_MAP[dateStr];
  renderCalendar();
  renderGameDetail();
}

function renderGameDetail() {
  if (!selGame) return;
  $('detail-empty').style.display = 'none';
  const cont = $('detail-content');
  cont.style.display = 'block';

  const d = new Date(selGame.d + 'T12:00:00');
  const dateLabel = d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const activations = selGame.ps.map(i => PARTNERS[i]);

  let body = `<div class="detail-header">
    <div class="detail-opp">vs. ${selGame.opp}</div>
    <div class="detail-date">🏀 ${dateLabel} · Paycom Center · 7:00 PM CT</div>
  </div>
  <div class="detail-scroll"><div class="detail-body">`;

  if (curRole === 'cp') {
    body += `<div class="sec-title" style="margin-bottom:10px">Active Partner Activations</div>`;
    activations.forEach(p => {
      const k = KPI[p.id];
      body += `<div class="act-item">
        <div class="act-avatar" style="background:${p.color}">${p.short[0]}${p.short[1]}</div>
        <div>
          <div class="act-name">${p.name}</div>
          <div class="act-asset">📍 ${p.asset} · ${p.industry}</div>
          <div class="act-metric">QI: ${fmt$(k.qi)} · ${fmtN(k.imp)} impressions · ${k.ctr}% CTR</div>
        </div>
      </div>`;
    });
  } else if (curRole === 'act') {
    body += `<div class="sec-title" style="margin-bottom:10px">Deployment Checklist</div>`;
    activations.forEach(p => {
      const k = KPI[p.id];
      body += `<div class="check-item">
        <div class="check-ico check-done">✓</div>
        <div>
          <div class="check-text" style="font-weight:700">${p.asset}</div>
          <div class="check-text" style="color:var(--muted)">${p.name} · ${k.contracted} contracted</div>
        </div>
      </div>`;
    });
    const remaining = PARTNERS.filter(p => !activations.includes(p));
    if (remaining.length) {
      body += `<div style="margin-top:10px;font-size:11px;color:var(--muted);font-weight:600">NOT ACTIVE THIS GAME</div>`;
      remaining.forEach(p => {
        body += `<div class="check-item" style="opacity:.5">
          <div class="check-ico check-pend">–</div>
          <div class="check-text">${p.asset} (${p.name})</div>
        </div>`;
      });
    }
  } else { // fan
    body += `<div class="sec-title" style="margin-bottom:10px">Fan Engagement &amp; Sweepstakes</div>`;
    activations.forEach(p => {
      const k = KPI[p.id];
      body += `<div class="act-item">
        <div class="act-avatar" style="background:${p.color}">${p.short[0]}${p.short[1]}</div>
        <div>
          <div class="act-name">${p.name}</div>
          <div class="act-asset">📣 ${p.asset}</div>
          <div class="act-metric">${fmtN(k.socialImp)} social impressions · ${fmtN(k.eng)} engagements</div>
        </div>
      </div>`;
    });
  }

  body += `</div></div>`;
  cont.innerHTML = body;
}

// ═══════════════════════════ HEATMAP ═══════════════════════════
function renderZoneList() {
  const list = $('zone-list');
  list.innerHTML = PARTNERS.map((p,i) => {
    const k = KPI[p.id];
    return `<div class="zone-item" id="zone-item-${i}" onclick="hlZone(${i})">
      <div class="zone-sq" style="background:${p.color}"></div>
      <div>
        <div class="zone-partner">${p.name}</div>
        <div class="zone-asset">${p.asset}</div>
        <div class="zone-kpi">${fmt$(k.qi)} QI · ${fmtN(k.imp)} impressions</div>
      </div>
    </div>`;
  }).join('');
}

function hlZone(i) {
  hlZoneIdx = i;
  document.querySelectorAll('.zone-item').forEach((el,j) => {
    el.classList.toggle('hl', j === i);
  });
}

function tipZone(e, i) {
  const p = PARTNERS[i], k = KPI[p.id];
  const tip = $('tip');
  tip.innerHTML = `<strong>${p.name}</strong><br>${p.asset}<br>QI: ${fmt$(k.qi)}<br>${fmtN(k.imp)} impressions`;
  tip.classList.add('vis');
  moveTip(e);
}

function moveTip(e) {
  const tip = $('tip');
  tip.style.left = (e.clientX + 12) + 'px';
  tip.style.top = (e.clientY + 12) + 'px';
}
document.addEventListener('mousemove', moveTip);
function hideTip() { $('tip').classList.remove('vis'); }

// ═══════════════════════════ KPI TAB ═══════════════════════════
function buildPartnerTabs() {
  const tabs = $('partner-tabs');
  tabs.innerHTML = PARTNERS.map((p,i) =>
    `<button class="p-btn ${i===0?'active':''}" style="${i===0?'background:'+p.color:'color:'+p.color+';border-color:'+p.color}"
      onclick="selectPartner(${i},this)">${p.short}</button>`
  ).join('');
}

function selectPartner(i, btn) {
  selPartner = i;
  document.querySelectorAll('.p-btn').forEach((b,j) => {
    b.classList.toggle('active', j === i);
    if (j === i) { b.style.background = PARTNERS[i].color; b.style.color = '#fff'; b.style.borderColor = 'transparent'; }
    else { b.style.background = ''; b.style.color = PARTNERS[j].color; b.style.borderColor = PARTNERS[j].color; }
  });
  renderKPI();
}

function renderKPI() {
  const p = PARTNERS[selPartner];
  const k = KPI[p.id];

  // CP metrics
  if ($('cp-metrics')) {
    $('cp-metrics').innerHTML = `
      <div class="m-card">
        <div class="m-lbl">QI Media Value</div>
        <div class="m-val">${fmt$(k.qi)}</div>
        <div class="m-sub">Nielsen Quality Index</div>
        <div class="m-tag tag-g">✓ Delivered</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Sponsorship Impressions</div>
        <div class="m-val">${fmtN(k.imp)}</div>
        <div class="m-sub">In-Bowl Viewership</div>
        <div class="m-tag tag-b">${k.ctr}% CTR</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Brand Exposure Value</div>
        <div class="m-val">${fmt$(k.bev)}</div>
        <div class="m-sub">Social + Signage Combined</div>
        <div class="m-tag tag-g">▲ Above Target</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Share of Voice</div>
        <div class="m-val">${k.sov}%</div>
        <div class="m-sub">${k.mentions} mentions / ${k.mentions} articles</div>
        <div class="m-tag tag-a">Competitive</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Social Impressions</div>
        <div class="m-val">${fmtN(k.socialImp)}</div>
        <div class="m-sub">Twitter + FB + Instagram</div>
        <div class="m-tag tag-b">Organic + Paid</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Social Engagements</div>
        <div class="m-val">${fmtN(k.eng)}</div>
        <div class="m-sub">Likes, shares, clicks</div>
        <div class="m-tag tag-g">Target: ${fmtN(Math.round(k.eng*0.85))}</div>
      </div>`;
  }

  // CP chart — single partner dual-bar
  if ($('cp-chart')) {
    const maxQI = 55000, maxImp = 55000;
    const qiPct = Math.round(k.qi/maxQI*100);
    const impPct = Math.round(k.imp/maxImp*100);
    $('cp-chart').innerHTML = `
      <div class="bar-row">
        <div class="bar-lbl">QI Media Value</div>
        <div class="bar-track"><div class="bar-fill" style="width:${qiPct}%;background:${p.color}"></div></div>
        <div class="bar-val">${fmt$(k.qi)}</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">Impressions</div>
        <div class="bar-track"><div class="bar-fill" style="width:${impPct}%;background:${p.color}aa"></div></div>
        <div class="bar-val">${fmtN(k.imp)}</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">Brand Exposure</div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(k.bev/maxQI*100)}%;background:#002D62"></div></div>
        <div class="bar-val">${fmt$(k.bev)}</div>
      </div>`;
  }

  // Nielsen table
  if ($('nielsen-tbl')) {
    $('nielsen-tbl').innerHTML = `<thead><tr>
      <th>Partner</th><th>Asset Type</th><th>Contracted</th><th>QI Score</th><th>Media Value</th><th>Impressions</th>
    </tr></thead><tbody><tr>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge badge-b">${p.asset}</span></td>
      <td>${k.contracted} min</td>
      <td>${(k.qi/10000).toFixed(2)}</td>
      <td><strong>${fmt$(k.qi)}</strong></td>
      <td>${fmtN(k.imp)}</td>
    </tr></tbody>`;
  }

  // Fan view
  if ($('fan-metrics')) {
    $('fan-metrics').innerHTML = `
      <div class="m-card">
        <div class="m-lbl">Social Impressions</div>
        <div class="swp-total">${fmtN(k.socialImp)}</div>
        <div class="swp-sub">Twitter + FB/IG combined</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Total Engagements</div>
        <div class="swp-total">${fmtN(k.eng)}</div>
        <div class="swp-sub">Likes, comments, shares</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">App CTR</div>
        <div class="swp-total">${k.ctr}%</div>
        <div class="swp-sub">${k.wr} clicks from ${fmtN(k.imp)} imp</div>
      </div>`;
  }

  // Social table
  if ($('social-tbl')) {
    $('social-tbl').innerHTML = `<thead><tr>
      <th>Channel</th><th>Spend</th><th>Impressions</th><th>Engagements</th><th>CPE</th>
    </tr></thead><tbody>
    <tr>
      <td>Twitter/X</td>
      <td>${fmt$(k.twitterSpend)}</td>
      <td>${fmtN(Math.round(k.socialImp * 0.35))}</td>
      <td>${fmtN(Math.round(k.eng * 0.38))}</td>
      <td>$${(k.twitterSpend/(k.eng*0.38)).toFixed(2)}</td>
    </tr>
    <tr>
      <td>Facebook / Instagram</td>
      <td>${fmt$(k.fbSpend)}</td>
      <td>${fmtN(Math.round(k.socialImp * 0.65))}</td>
      <td>${fmtN(Math.round(k.eng * 0.62))}</td>
      <td>$${(k.fbSpend/(k.eng*0.62)).toFixed(2)}</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>${fmt$(k.twitterSpend + k.fbSpend)}</strong></td>
      <td><strong>${fmtN(k.socialImp)}</strong></td>
      <td><strong>${fmtN(k.eng)}</strong></td>
      <td>$${((k.twitterSpend+k.fbSpend)/k.eng).toFixed(2)}</td>
    </tr></tbody>`;
  }

  // Activations view
  if ($('act-metrics')) {
    $('act-metrics').innerHTML = `
      <div class="m-card">
        <div class="m-lbl">Contracted Time</div>
        <div class="m-val">${k.contracted}</div>
        <div class="m-sub">Minutes committed per game</div>
        <div class="m-tag tag-b">On schedule</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Bonused Time</div>
        <div class="m-val">${k.bonused}</div>
        <div class="m-sub">Value-add bonus exposure</div>
        <div class="m-tag tag-g">+Delivered</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Fan Fest Plays</div>
        <div class="m-val">${k.boltPlays > 0 ? fmtN(k.boltPlays) : 'N/A'}</div>
        <div class="m-sub">Bolt / concourse activations</div>
      </div>
      <div class="m-card">
        <div class="m-lbl">Asset Status</div>
        <div class="m-val" style="font-size:15px;color:var(--green)">✓ Active</div>
        <div class="m-sub">${p.asset}</div>
        <div class="m-tag tag-g">Deployed</div>
      </div>`;
  }

  // Deployment table
  if ($('deploy-tbl')) {
    const gamesList = GAMES.filter(g => g.ps.includes(selPartner)).slice(0,6);
    $('deploy-tbl').innerHTML = `<thead><tr>
      <th>Game Date</th><th>Opponent</th><th>Asset</th><th>Contracted</th><th>Delivered</th><th>Status</th>
    </tr></thead><tbody>${gamesList.map(g => {
      const d = new Date(g.d + 'T12:00:00');
      const label = d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
      return `<tr>
        <td>${label}</td>
        <td>vs. ${g.opp}</td>
        <td>${p.asset}</td>
        <td>${k.contracted}</td>
        <td>${k.contracted}</td>
        <td><span class="badge badge-g">✓ Complete</span></td>
      </tr>`;
    }).join('')}</tbody>`;
  }

  // All-partner charts
  renderAllPartnerCharts();
}

function renderAllPartnerCharts() {
  const maxQI = 55000;
  $('all-qi-chart').innerHTML = PARTNERS.map(p => {
    const k = KPI[p.id];
    const pct = Math.round(k.qi / maxQI * 100);
    return `<div class="bar-row">
      <div class="bar-lbl">${p.short}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${p.color}"></div></div>
      <div class="bar-val">${fmt$(k.qi)}</div>
    </div>`;
  }).join('');

  const maxSoc = 150000;
  $('all-social-chart').innerHTML = PARTNERS.map(p => {
    const k = KPI[p.id];
    const pct = Math.round(k.socialImp / maxSoc * 100);
    return `<div class="bar-row">
      <div class="bar-lbl">${p.short}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${p.color}"></div></div>
      <div class="bar-val">${fmtN(k.socialImp)}</div>
    </div>`;
  }).join('');

  // Summary table
  $('summary-tbl').innerHTML = `<thead><tr>
    <th>Partner</th><th>Industry</th><th>QI Value</th><th>Impressions</th><th>CTR</th><th>Engagements</th>
  </tr></thead><tbody>${PARTNERS.map(p => {
    const k = KPI[p.id];
    return `<tr>
      <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span><strong>${p.short}</strong></td>
      <td style="color:var(--muted);font-size:11px">${p.industry}</td>
      <td><strong>${fmt$(k.qi)}</strong></td>
      <td>${fmtN(k.imp)}</td>
      <td><span class="badge ${k.ctr>=4?'badge-g':k.ctr>=3?'badge-b':'badge-o'}">${k.ctr}%</span></td>
      <td>${fmtN(k.eng)}</td>
    </tr>`;
  }).join('')}</tbody>`;
}