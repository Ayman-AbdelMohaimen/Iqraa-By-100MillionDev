import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

export interface BundleItem {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: string;
  badge?: string;
  url?: string;
  productId?: string | number;
}

export interface BundlesProps {
  data?: {
    title?: string;
    display_all_url?: string;
    bundles?: BundleItem[];
    [key: string]: unknown;
  };
}

const DEFAULT_BUNDLES: BundleItem[] = [
  {
    id: 'bundle-daily-reading',
    name: 'باقة القراءة اليومية',
    description: 'جهاز خفيف مع ملحقات أساسية لتحسين تجربة القراءة',
    image: 'https://cdn.salla.sa/WZNRy/bfe83fb2-ca01-4664-b692-0fa9bbea5153-1000x1000-0ZELVvaOhc8ThQKPdUlq2XrO7y5R4LJq2qCn4Hv6.jpg',
    price: '2,999 ر.س',
    badge: 'مختارة للقراءة',
    url: '/latest-products',
  },
  {
    id: 'bundle-study-learning',
    name: 'باقة الدراسة والتعلّم',
    description: 'جهاز مع قلم وملحقات للملاحظات والمحاضرات',
    image: 'https://cdn.files.salla.network/other/1935517889/720a8394-d7f2-4fc4-a396-5aeb3690b256-original.webp',
    price: '3,999 ر.س',
    url: '/latest-products',
  },
  {
    id: 'bundle-work-productivity',
    name: 'باقة العمل والإنتاجية',
    description: 'جهاز مع لوحة مفاتيح وملحقات لإنجاز العمل',
    image: 'https://cdn.salla.sa/WZNRy/bnT0UNz6FoIsg1CBUuIE3KCq8AS5B8DWjGTcSi9U.jpg',
    price: '4,499 ر.س',
    url: '/latest-products',
  },
  {
    id: 'bundle-travel-mobile',
    name: 'باقة التنقل',
    description: 'جهاز مدمج مع الحافظة وإكسسوارات السفر',
    image: 'https://cdn.salla.sa/WZNRy/41aefe65-2eb9-4a3b-a241-d448cdb97f92-1000x1000-jNAHmJD9Ki1X7cKOMPIyVA3N1gpd0Ifl2TiqeVog.jpg',
    price: '1,999 ر.س',
    url: '/latest-products',
  },
];

/**
 * Bundles component (الباقات)
 * Matches exact reference design from media_1794428329572_a3eb8a73.jpg
 */
export const Bundles = memo(function Bundles({ data }: BundlesProps) {
  const { t } = useTranslation();
  const title = data?.title || 'الباقات';
  const displayAllUrl = data?.display_all_url || '/latest-products';
  const bundles = data?.bundles && data.bundles.length > 0 ? data.bundles : DEFAULT_BUNDLES;

  return (
    <div className="iqraa-bundles-block">
      <div className="iqraa-bundles-block__head">
        <div className="iqraa-bundles-block__badge">
          <span>{title}</span>
        </div>
        <Link to={displayAllUrl} className="iqraa-bundles-block__all">
          <span>عرض جميع الباقات</span>
          <i className="sicon-arrow-left rtl:inline-block ltr:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <div className="iqraa-bundles-grid">
        {bundles.map((bundle) => (
          <article className="bundle-card" key={bundle.id || bundle.name}>
            <div className="bundle-card__media">
              {bundle.badge && <span className="bundle-card__badge">{bundle.badge}</span>}
              <Link to={bundle.url || '/latest-products'} aria-label={bundle.name} className="bundle-card__img-link">
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  loading="lazy"
                  className="bundle-card__img"
                />
              </Link>
            </div>

            <div className="bundle-card__body">
              <h3 className="bundle-card__title">
                <Link to={bundle.url || '/latest-products'}>{bundle.name}</Link>
              </h3>
              <p className="bundle-card__desc">{bundle.description}</p>
              <div className="bundle-card__price">{bundle.price}</div>
              <Link
                to={bundle.url || '/latest-products'}
                className="bundle-card__cta"
              >
                أضف إلى السلة
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
});
