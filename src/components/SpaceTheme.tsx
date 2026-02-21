import React, { useEffect, useState } from 'react';
import '../styles/space-theme.css';

export function SpaceThemeBackground() {
  const [stars, setStars] = useState<Array<{x: number; y: number; opacity: number}>>([]);

  useEffect(() => {
    // Generate random stars
    const generatedStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="space-background-container">
      {/* SVG Background */}
      <div className="svg-background">
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" className="space-background">
          <defs>
            <radialGradient id="nebula1" cx="30%" cy="30%">
              <stop offset="0%" style={{ stopColor: '#6d28d9', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#0a0e27', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="nebula2" cx="70%" cy="70%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#0a0e27', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="nebula3" cx="50%" cy="50%">
              <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.15 }} />
              <stop offset="100%" style={{ stopColor: '#0a0e27', stopOpacity: 0 }} />
            </radialGradient>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="1920" height="1080" fill="#050810" />
          
          {/* Nebulas */}
          <ellipse cx="300" cy="200" rx="800" ry="600" fill="url(#nebula1)" filter="url(#blur)" />
          <ellipse cx="1600" cy="850" rx="900" ry="700" fill="url(#nebula2)" filter="url(#blur)" />
          <ellipse cx="960" cy="540" rx="600" ry="500" fill="url(#nebula3)" filter="url(#blur)" />
          
          {/* Animated elements */}
          <circle cx="200" cy="150" r="3" fill="#06b6d4" opacity="0.6" filter="url(#glow)">
            <animate attributeName="r" from="3" to="8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="1700" cy="900" r="2" fill="#ec4899" opacity="0.8" filter="url(#glow)">
            <animate attributeName="r" from="2" to="6" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Animated stars */}
      <div className="stars-background">
        {stars.map((star, idx) => (
          <div
            key={idx}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function SpaceCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-container ${className}`}>
      {children}
    </div>
  );
}

export function SpaceNavbar({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <nav className="navbar">
      <div className="gradient-text" style={{ fontSize: '24px', margin: 0 }}>
        ⚡ Zuhre
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {links.map((link) => (
          <a key={link.href} href={link.href} className="navbar-link">
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function SpaceIcon({ type }: { type: 'profile' | 'booking' | 'chat' | 'gallery' | 'settings' | 'notification' }) {
  const getIcon = () => {
    const iconMap = {
      profile: '👤',
      booking: '📅',
      chat: '💬',
      gallery: '🖼️',
      settings: '⚙️',
      notification: '🔔',
    };
    return iconMap[type];
  };

  return (
    <div className="icon-container">
      <span style={{ fontSize: '20px' }}>{getIcon()}</span>
    </div>
  );
}

export function SpaceButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={`btn-glow ${className}`}>
      {children}
    </button>
  );
}
