import React from 'react';

export default function Tooltip({ tipData }) {

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
      Assigned: {tipData.partnerName}
    </div>
  );
}
