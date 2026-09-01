import React from 'react';

export default function PartnerTabs({ partners, selPartner, onSelectPartner }) {
  return (
    <div className="partner-tabs" id="partner-tabs">
      {partners.map((p, i) => {
        const isActive = i === selPartner;
        return (
          <button 
            key={p.id}
            className={`p-btn ${isActive ? 'active' : ''}`}
            style={{
              background: isActive ? p.color : '',
              color: isActive ? '#fff' : p.color,
              borderColor: isActive ? 'transparent' : p.color
            }}
            onClick={() => onSelectPartner(i)}
          >
            {p.short}
          </button>
        );
      })}
    </div>
  );
}
