import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { FEATURED_DEVICES, IQRA_MEGA_PANELS, url } from '../../lib/brandMenu';

function CategoryIcon({ type }: { type: string }) {
  const iconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    // Icons must follow the icon box colour: purple on the resting ivory tile,
    // white when the tile flips to primary on hover. A fixed purple stroke
    // disappears against the hover background.
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case 'discount':
      return (
        <svg {...iconProps}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
      );
    case 'reader':
      return (
        <svg {...iconProps}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><circle cx="12" cy="18" r="1"/></svg>
      );
    case 'pencil-note':
      return (
        <svg {...iconProps}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      );
    case 'palette':
      return (
        <svg {...iconProps}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>
      );
    case 'mobile':
      return (
        <svg {...iconProps}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      );
    case 'case':
      return (
        <svg {...iconProps}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M10 4v16"/></svg>
      );
    case 'pen-nib':
      return (
        <svg {...iconProps}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
      );
    case 'focus':
      return (
        <svg {...iconProps}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
      );
    case 'book':
      return (
        <svg {...iconProps}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      );
    case 'compare':
      return (
        <svg {...iconProps}><rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
      );
    case 'controls':
      return (
        <svg {...iconProps}><line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="currentColor"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="16" cy="17" r="2" fill="currentColor"/></svg>
      );
    case 'timer':
      return (
        <svg {...iconProps}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/></svg>
      );
    case 'task':
      return (
        <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l2.5 2.5L16 9"/></svg>
      );
    case 'notebook':
      return (
        <svg {...iconProps}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18"/><line x1="12" y1="8" x2="16" y2="8"/><line x1="12" y1="12" x2="16" y2="12"/></svg>
      );
    case 'bundle':
      return (
        <svg {...iconProps}><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>
      );
    case 'box':
      return (
        <svg {...iconProps}><path d="M4 8l8-4 8 4-8 4-8-4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M8 10l8 4"/></svg>
      );
    default:
      return (
        <svg {...iconProps}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      );
  }
}

function FeaturedStrip() {
  return (
    <div className="iqraa-mega-featured-strip">
      <div className="iqraa-mega-featured-header">
        <span className="iqraa-mega-featured-tag">أجهزة BOOX المميزة</span>
        <Link to={url.devices} className="iqraa-mega-featured-more">
          عرض جميع الأجهزة &larr;
        </Link>
      </div>
      <div className="iqraa-mega-featured-grid">
        {FEATURED_DEVICES.map((device) => (
          <Link key={device.name} to={device.url} className="iqraa-mega-device-card">
            <span className="iqraa-mega-device-thumb">
              <img src={device.image} alt="" loading="lazy" />
              {device.badge && <span className="iqraa-mega-device-badge">{device.badge}</span>}
            </span>
            <span className="iqraa-mega-device-info">
              <span className="iqraa-mega-device-name">{device.name}</span>
              <span className="iqraa-mega-device-spec">{device.spec}</span>
              <span className="iqraa-mega-device-price">{device.price}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** The panel attached to a root menu item; each root has its own approved columns. */
export const IqraaMegaPanel = memo(function IqraaMegaPanel({ panelId }: { panelId?: string }) {
  const panel = (panelId && IQRA_MEGA_PANELS[panelId]) || IQRA_MEGA_PANELS['iqraa-devices'];

  return (
    <div className="iqraa-mega-menu-panel">
      <div className="iqraa-mega-columns-grid">
        {panel.columns.map((column, columnIndex) => (
          <div key={`${column.title}-${columnIndex}`} className="iqraa-mega-column">
            <div className="iqraa-mega-column-header">
              <h4 className="iqraa-mega-column-title">
                <span>{column.title}</span>
              </h4>
              {column.englishTitle && (
                <span className="iqraa-mega-column-badge">{column.englishTitle}</span>
              )}
            </div>

            <ul className="iqraa-mega-links-list">
              {column.links.map((link, linkIndex) => (
                <li key={`${link.title}-${linkIndex}`}>
                  <Link to={link.url} className="iqraa-mega-link">
                    <span className="iqraa-mega-link-icon-box">
                      <CategoryIcon type={link.iconType} />
                    </span>
                    <span className="iqraa-mega-link-text">
                      <span className="iqraa-mega-link-title">{link.title}</span>
                      {link.subtitle && (
                        <span className="iqraa-mega-link-sub">[{link.subtitle}]</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {column.chips && column.chips.length > 0 && (
              <div className="iqraa-mega-chips-wrapper">
                {column.chipsLabel && (
                  <span className="iqraa-mega-chips-label">{column.chipsLabel}</span>
                )}
                <div className="iqraa-mega-chips">
                  {column.chips.map((chip) => (
                    <Link key={chip.name} to={chip.url} className="iqraa-mega-chip">
                      {chip.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {panel.featured && <FeaturedStrip />}
    </div>
  );
});
