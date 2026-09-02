import React from 'react';

export default function Tooltip({ tipData }) {
  const fmt$ = n => '$' + n.toLocaleString('en-US');
  const fmtN = n => n.toLocaleString('en-US');

  return (
    <div 
      className="tip vis" 
      id="tip"
      style={{
        left: tipData.x + 'px',
        top: tipData.y + 'px'
      }}
    >
      <strong>{tipData.assetLabel}</strong><br/>
      Assigned: {tipData.partnerName}<br/>
      QI: {fmt$(tipData.qi)}<br/>
      {fmtN(tipData.imp)} impressions
    </div>
  );
}
