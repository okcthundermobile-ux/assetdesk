export const PARTNERS = [
  { id:'900137', name:'Arcadia Pulse Co.',     short:'Arcadia',  industry:'Consumer Tech',       asset:'Digital Courtside', color:'#4F46E5' },
  { id:'900274', name:'Bluejay Canyon Labs',   short:'Bluejay',  industry:'Research & Analytics', asset:'LED Board',         color:'#0284C7' },
  { id:'900411', name:'Cobalt Prairie Foods',  short:'Cobalt',   industry:'Food & Beverage',      asset:'Concourse Wedge',   color:'#059669' },
  { id:'900548', name:'Elevate Oak Financial', short:'Elevate',  industry:'Financial Services',   asset:'Mobile Banner',     color:'#D97706' },
  { id:'900685', name:'Flint Creek Motors',    short:'Flint',    industry:'Automotive',           asset:'Website Takeover',  color:'#DC2626' },
  { id:'900822', name:'Golden Hour Health',    short:'Golden',   industry:'Healthcare',           asset:'Jersey Patch',      color:'#7C3AED' },
  { id:'900959', name:'Horizon Kite Wireless', short:'Horizon',  industry:'Telecom',              asset:'Basket Stanchion',  color:'#0891B2' },
];

export const KPI = {
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
export const GAMES = [
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

export const BOLT_APPEARANCES = [
  { id: 1, eventId: 201, communityOrZip: '73102 - Downtown OKC', hoursInCommunity: 3.5, milesTraveled: 12.4, fansEngaged: 420, boltETW: 1850.0 },
  { id: 2, eventId: 202, communityOrZip: '73118 - The Village', hoursInCommunity: 2.0, milesTraveled: 8.1, fansEngaged: 275, boltETW: 980.0 },
  { id: 3, eventId: 203, communityOrZip: '73013 - Edmond', hoursInCommunity: 4.0, milesTraveled: 22.7, fansEngaged: 610, boltETW: 2450.0 },
  { id: 4, eventId: 204, communityOrZip: '73120 - Nichols Hills', hoursInCommunity: 1.5, milesTraveled: 6.3, fansEngaged: 190, boltETW: 720.0 },
  { id: 5, eventId: 205, communityOrZip: '73034 - Guthrie', hoursInCommunity: 3.0, milesTraveled: 35.2, fansEngaged: 340, boltETW: 1320.0 }
];

export const BOLT_SEASON_SUMMARY = [
  { id: 1, season: '2024-25', totalEvents: 47, uniqueCommunities: 31, totalHoursInCommunity: 128.5, totalMilesTraveled: 612.8, totalFansEngaged: 14850 }
];

export const COMMUNITY_EVENTS = [
  // 1. Book Bus Visits
  { id: 101, type: 'Book Bus Visit', metrics: { students_served: 185, books_distributed: 320, schools_served: 4, reading_minutes: 540, volunteers_engaged: 12 } },
  { id: 102, type: 'Book Bus Visit', metrics: { students_served: 240, books_distributed: 410, schools_served: 6, reading_minutes: 720, volunteers_engaged: 18 } },
  // 2. Fan Fest
  { id: 103, type: 'Fan Fest', metrics: { total_attendance: 12500, fan_interactions: 3400, activity_participations: 1850, digital_engagements: 920, merchandise_giveaways: 1500 } },
  { id: 104, type: 'Fan Fest', metrics: { total_attendance: 9800, fan_interactions: 2750, activity_participations: 1420, digital_engagements: 780, merchandise_giveaways: 1100 } },
  // 3. Thunder Up Tour
  { id: 105, type: 'Thunder Up Tour', metrics: { tour_stops: 8, fans_reached: 4200, communities_visited: 7, miles_traveled: 186.5, digital_engagements: 640 } },
  { id: 106, type: 'Thunder Up Tour', metrics: { tour_stops: 5, fans_reached: 2750, communities_visited: 5, miles_traveled: 112.3, digital_engagements: 410 } },
  // 4. Thunder Up in the Park
  { id: 107, type: 'Thunder Up in the Park', metrics: { park_attendance: 1850, youth_participants: 420, basketball_participants: 180, fan_interactions: 650, giveaways_distributed: 800 } },
  { id: 108, type: 'Thunder Up in the Park', metrics: { park_attendance: 2100, youth_participants: 510, basketball_participants: 220, fan_interactions: 780, giveaways_distributed: 950 } },
  // 5. Thunder Youth Basketball Camps
  { id: 109, type: 'Youth Basketball Camp', metrics: { campers_registered: 95, campers_attended: 88, instruction_hours: 42.5, coaches_involved: 12, scholarships_awarded: 18 } },
  { id: 110, type: 'Youth Basketball Camp', metrics: { campers_registered: 120, campers_attended: 112, instruction_hours: 56.0, coaches_involved: 15, scholarships_awarded: 25 } },
  // 6. Math Hoops
  { id: 111, type: 'Math Hoops', metrics: { students_participating: 680, schools_participating: 14, classrooms_participating: 32, educators_engaged: 28, program_hours: 48.0 } },
  { id: 112, type: 'Math Hoops', metrics: { students_participating: 520, schools_participating: 11, classrooms_participating: 25, educators_engaged: 22, program_hours: 36.5 } },
  // 7. Thunder Night at the Drillers
  { id: 113, type: 'Drillers Night', metrics: { event_attendance: 6200, thunder_activation_visits: 1450, giveaways_distributed: 900, digital_engagements: 520, mascot_interactions: 380 } },
  { id: 114, type: 'Drillers Night', metrics: { event_attendance: 5800, thunder_activation_visits: 1320, giveaways_distributed: 850, digital_engagements: 480, mascot_interactions: 340 } },
  // 8. Thunder Cares Holiday Assist
  { id: 115, type: 'Holiday Assist', metrics: { families_served: 320, children_served: 580, gifts_distributed: 950, volunteers_engaged: 85, volunteer_hours: 320.5 } },
  { id: 116, type: 'Holiday Assist', metrics: { families_served: 410, children_served: 740, gifts_distributed: 1250, volunteers_engaged: 110, volunteer_hours: 412.0 } },
  // 9. Recess with Rumble
  { id: 117, type: 'Recess with Rumble', metrics: { students_participating: 340, schools_visited: 5, activity_minutes: 480, student_interactions: 290, giveaways_distributed: 420 } },
  { id: 118, type: 'Recess with Rumble', metrics: { students_participating: 275, schools_visited: 4, activity_minutes: 360, student_interactions: 230, giveaways_distributed: 350 } },
  // 10. deadCenter Film Festival
  { id: 119, type: 'deadCenter Film Festival', metrics: { festival_attendance: 4800, thunder_activation_visits: 620, screenings_supported: 8, digital_engagements: 410, community_partners_engaged: 12 } },
  { id: 120, type: 'deadCenter Film Festival', metrics: { festival_attendance: 5200, thunder_activation_visits: 710, screenings_supported: 9, digital_engagements: 480, community_partners_engaged: 15 } },
  // 11. Hoops of Fortune
  { id: 121, type: 'Hoops of Fortune', metrics: { participants: 850, games_played: 2100, prizes_awarded: 320, digital_engagements: 680, spectator_reach: 4200 } },
  { id: 122, type: 'Hoops of Fortune', metrics: { participants: 920, games_played: 2450, prizes_awarded: 380, digital_engagements: 750, spectator_reach: 4800 } },
  // 12. Women in Business Summit
  { id: 123, type: 'Women in Business Summit', metrics: { attendees: 380, organizations_represented: 95, speakers: 18, sessions_delivered: 12, networking_engagements: 520 } },
  { id: 124, type: 'Women in Business Summit', metrics: { attendees: 420, organizations_represented: 110, speakers: 22, sessions_delivered: 14, networking_engagements: 610 } }
];
