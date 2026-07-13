'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CruiseLineLogoProps {
  logoUrl?: string;
  name: string;
  className?: string;
}

export default function CruiseLineLogo({ logoUrl, name, className }: CruiseLineLogoProps) {
  const [failed, setFailed] = useState(false);

  if (logoUrl && !failed) {
    return (
      <span className={`relative inline-block h-6 w-28 shrink-0 ${className ?? ''}`} title={name}>
        <Image src={logoUrl} alt={name} fill sizes="112px" className="object-contain object-left" onError={() => setFailed(true)} />
      </span>
    );
  }

  return (
    <span className={`bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded text-xs ${className ?? ''}`}>
      {name}
    </span>
  );
}
