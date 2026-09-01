import React, { useState, useEffect } from 'react';
import PartnerTabs from './PartnerTabs';
import RoleViews from './RoleViews';
import AllPartnersChart from './AllPartnersChart';
import { getPartners, getKPIs, getGames } from '../../data/firebase.js';

export default function KPIPanel() {
  const [partners, setPartners] = useState([]);
  const [kpis, setKpis] = useState({});
  const [games, setGames] = useState([]);
  const [selPartner, setSelPartner] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [pData, kData, gData] = await Promise.all([getPartners(), getKPIs(), getGames()]);
      setPartners(pData);
      setKpis(kData);
      setGames(gData);
    }
    loadData();
  }, []);

  if (partners.length === 0) return <div>Loading...</div>;

  const partner = partners[selPartner];
  const kpi = kpis[partner.id];

  return (
    <div id="panel-kpi" className="panel active">
      <div className="kpi-wrap">
        <div className="kpi-left">
          <div className="sec-title" style={{ marginBottom: '14px' }}>Partner KPI Report</div>
          <PartnerTabs 
            partners={partners} 
            selPartner={selPartner} 
            onSelectPartner={setSelPartner} 
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
    </div>
  );
}
