import { memo } from 'react';
import type { ReactNode } from 'react';

export interface StoreFeatureItem {
  id: string;
  iconNode: ReactNode;
  title: string;
  description: string;
}

/**
 * Animated SVG Micro-Icons for Store Features
 */
const ShippingTruckIcon = () => (
  <svg
    className="store-feature-svg svg-truck"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect className="truck-body" x="1" y="4" width="14" height="12" rx="2" />
    <path className="truck-cab" d="M15 8h4.5l2.5 3.5V16h-7V8z" />
    <circle className="truck-wheel truck-wheel-1" cx="5.5" cy="18.5" r="2.5" />
    <circle className="truck-wheel truck-wheel-2" cx="18.5" cy="18.5" r="2.5" />
    <line className="truck-line truck-line-1" x1="-3" y1="7" x2="0" y2="7" />
    <line className="truck-line truck-line-2" x1="-4" y1="11" x2="-1" y2="11" />
  </svg>
);

const WarrantyShieldIcon = () => (
  <svg
    className="store-feature-svg svg-shield"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      className="shield-path"
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    />
    <path className="shield-check" d="M9 12l2 2 4-4" />
  </svg>
);

const SecurePaymentIcon = () => (
  <svg
    className="store-feature-svg svg-card"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect className="card-outline" x="2" y="5" width="20" height="14" rx="2" />
    <line className="card-strip" x1="2" y1="10" x2="22" y2="10" />
    <circle className="card-chip" cx="6" cy="14.5" r="1" fill="currentColor" />
    <path className="card-lock" d="M16 13v-1.5a1.5 1.5 0 0 1 3 0V13m-4 0h5v3.5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V13z" />
  </svg>
);

const SupportHeadsetIcon = () => (
  <svg
    className="store-feature-svg svg-headset"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      className="headset-band"
      d="M3 14h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3a6 6 0 0 0 6 6h4"
    />
    <path d="M21 14h-2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6" />
    <circle className="headset-mic" cx="14" cy="18" r="1.5" fill="currentColor" />
    {/* Sound waves */}
    <path className="soundwave soundwave-1" d="M1 9a11 11 0 0 1 22 0" />
    <path className="soundwave soundwave-2" d="M5 9a7 7 0 0 1 14 0" />
  </svg>
);

const IQRAA_FEATURES: StoreFeatureItem[] = [
  {
    id: 'shipping',
    iconNode: <ShippingTruckIcon />,
    title: 'شحن مجاني',
    description: 'على الطلبات المؤهلة',
  },
  {
    id: 'warranty',
    iconNode: <WarrantyShieldIcon />,
    title: 'ضمان رسمي',
    description: 'من الوكيل',
  },
  {
    id: 'payment',
    iconNode: <SecurePaymentIcon />,
    title: 'دفع آمن',
    description: 'ومتعدد الوسائل',
  },
  {
    id: 'support',
    iconNode: <SupportHeadsetIcon />,
    title: 'دعم فني عربي',
    description: 'قبل وبعد الشراء',
  },
];

export interface StoreFeaturesProps {
  className?: string;
  data?: any;
  priority?: boolean;
}

/**
 * Iqraa Store Features (`store-features`).
 *
 * Compact single-line features bar with custom animated SVG micro-animations.
 * 4 cards on desktop, 2 per row on mobile.
 */
export const StoreFeatures = memo(function StoreFeatures({
  className = '',
}: StoreFeaturesProps) {
  return (
    <div className={`store-features-container container ${className}`.trim()}>
      <div className="store-features-grid">
        {IQRAA_FEATURES.map((feature) => (
          <div
            key={feature.id}
            className={`store-feature-card store-feature-${feature.id}`}
          >
            <div className="store-feature-icon-box">
              {feature.iconNode}
            </div>
            <div className="store-feature-content">
              <span className="store-feature-title">{feature.title}</span>
              <span className="store-feature-desc">{feature.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
