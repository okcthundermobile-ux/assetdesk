import React from 'react';

export default function BrandLogo({ size = 34 }) {
  return (
    <img
      src="/okc-thunder-logo.png"
      alt="Oklahoma City Thunder"
      width={size}
      height={size}
    />
  );
}
