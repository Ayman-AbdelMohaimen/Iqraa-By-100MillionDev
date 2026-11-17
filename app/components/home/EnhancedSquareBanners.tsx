import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

interface BannerItem {
  image?: string;
  url?: string;
  title?: string;
  description?: string;
}

export interface EnhancedSquareBannersProps {
  data: {
    banners: BannerItem[];
    /** Optional section heading and subheading, editable in the theme editor. */
    title?: string;
    description?: string;
    position?: number;
    [key: string]: unknown;
  };
}

/**
 * Brand Guidelines v0.9: an editorial "discovery paths" gallery.
 *
 * The old block forced five photos into a centre-tall mosaic and buried their
 * captions under a dark overlay. The approved layout has no card surfaces at
 * all: the square product shot is shown whole, the caption sits below it in the
 * brand type scale, and each path has one clear CTA. Kept deliberately flat so
 * it reads as a list, not as a stack of cards beside the hero caption.
 *
 * Layout: 12 columns / 24px gap on desktop; the mobile items become a flat
 * scroll-snap rail so the section stays compact.
 */
export const EnhancedSquareBanners = memo(function EnhancedSquareBanners({
  data,
}: EnhancedSquareBannersProps) {
  const { t } = useTranslation();
  const { banners, title, description } = data;

  if (!banners.length) return null;

  const ctaLabel = t('blocks.home.discover_now', 'اكتشف الآن');
  const count = Math.min(banners.length, 5);

  return (
    <section className={`iqraa-paths iqraa-paths--${count}`} aria-label={t('blocks.discovery_paths.landmark', 'مسارات الاكتشاف')}>
      <header className="iqraa-paths__head">
        <div className="iqraa-paths__intro">
          <span className="iqraa-paths__eyebrow">
            <span className="iqraa-paths__eyebrow-mark" aria-hidden="true" />
            {t('blocks.discovery_paths.eyebrow', 'ابدأ من حيث تريد')}
          </span>
          <h2 className="iqraa-paths__title">
            {title || t('blocks.discovery_paths.title', 'مسارات الاكتشاف في اقرأ')}
          </h2>
        </div>
        <p className="iqraa-paths__desc">
          {description ||
            t(
              'blocks.discovery_paths.description',
              'خمس طرق سريعة توصلك إلى ما تبحث عنه: أجهزة، ملحقات، تركيز، وعروض.'
            )}
        </p>
      </header>

      <ol className="iqraa-paths__grid">
        {banners.slice(0, 5).map((banner, index) => (
          // A static settings list without ids; see .react-doctor/false-positives.md.
          // react-doctor-disable-next-line react-doctor/no-array-index-as-key
          <li className={`iqraa-path${index === 0 ? ' iqraa-path--lead' : ''}`} key={index}>
            <Link
              to={banner.url || '#'}
              aria-label={banner.title || (banner.description ? undefined : ctaLabel)}
              className="iqraa-path__link"
            >
              <span className="iqraa-path__stage">
                {banner.image && (
                  <img
                    className="iqraa-path__image"
                    src={banner.image}
                    alt=""
                    width="500"
                    height="500"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="iqraa-path__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>

              <span className="iqraa-path__body">
                {banner.title && <h3 className="iqraa-path__title">{banner.title}</h3>}
                {banner.description && (
                  <span className="iqraa-path__desc">{banner.description}</span>
                )}
                <span className="iqraa-path__cta">
                  {ctaLabel}
                  <i className="sicon-arrow-left" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
});
