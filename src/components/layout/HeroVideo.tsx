'use client';

import { useState } from 'react';

const HERO_VIDEO_SOURCES = ['https://videos.pexels.com/video-files/4010511/4010511-hd_1920_1080_25fps.mp4'];
const HERO_POSTER = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';

const BAND_VIDEO_SOURCES = ['https://www.pexels.com/download/video/1675442/'];
const BAND_POSTER = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=80';

function VideoWithFallback({ sources, poster }: { sources: string[]; poster: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <img src={poster} alt="" aria-hidden="true" className="hero-media kenburns" />;
  }
  return (
    <video className="hero-media" autoPlay muted loop playsInline preload="metadata" poster={poster} onError={() => setFailed(true)}>
      {sources.map((src) => (
        <source key={src} src={src} type="video/mp4" />
      ))}
    </video>
  );
}

export function HeroVideo() {
  return <VideoWithFallback sources={HERO_VIDEO_SOURCES} poster={HERO_POSTER} />;
}

export function BandVideo() {
  return <VideoWithFallback sources={BAND_VIDEO_SOURCES} poster={BAND_POSTER} />;
}
