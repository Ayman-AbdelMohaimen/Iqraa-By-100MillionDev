import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';

/** One card in the showcase; every value is authored by the merchant. */
export interface DeviceShowcaseItem {
  name?: string;
  image?: string;
  spec?: string;
  price?: number | string | null;
  old_price?: number | string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  badge?: string;
  url?: string;
  __hidden?: string;
}

export interface DeviceShowcaseProps {
  data: {
    title?: string;
    description?: string;
    display_all_url?: string | null;
    cta_label?: string;
    devices: DeviceShowcaseItem[];
    position?: number;
    [key: string]: unknown;
  };
}

/**
 * `device-showcase` home block (`s-block--device-showcase`).
 *
 * The five-device row from the approved design: a lavender product stage, the
 * device name, its screen size, the price, the store rating and a solid CTA.
 * Content is authored in the block, not read from the catalog, so the row shows
 * the same curated devices in the preview store (whose catalog holds demo
 * products) and in the live store.
 *
 * Styling: `04-components/device-showcase.scss`.
 */
export const DeviceShowcase = memo(function DeviceShowcase({ data }: DeviceShowcaseProps) {
  const { t } = useTranslation();
  const money = useMoney();

  const devices = (data.devices ?? []).filter((item) => !item.__hidden && item.name);
  if (!devices.length) return null;

  const ctaLabel = data.cta_label || t('blocks.device_showcase.cta', 'تسوّق الآن');

  return (
    <div className="device-showcase">
      {(data.title || data.description || data.display_all_url) && (
        <div className="device-showcase__head">
          <div className="device-showcase__intro">
            {data.title && <h2 className="device-showcase__title">{data.title}</h2>}
            {data.description && <p className="device-showcase__desc">{data.description}</p>}
          </div>
          {data.display_all_url && (
            <Link to={data.display_all_url} className="device-showcase__all">
              {t('blocks.home.display_all', 'عرض الكل')}
              <i className="sicon-arrow-left" aria-hidden="true"></i>
            </Link>
          )}
        </div>
      )}

      <div className="device-showcase__grid">
        {devices.map((device, index) => {
          const price = device.price === '' || device.price == null ? null : device.price;
          const oldPrice =
            device.old_price === '' || device.old_price == null ? null : device.old_price;

          return (
            <article className="device-card" key={`${device.name}-${index}`}>
              <div className="device-card__media">
                {device.url ? (
                  <Link to={device.url} aria-label={device.name}>
                    {device.image && <img src={device.image} alt="" loading="lazy" />}
                  </Link>
                ) : (
                  device.image && <img src={device.image} alt="" loading="lazy" />
                )}
                {device.badge && <span className="device-card__badge">{device.badge}</span>}
              </div>

              <div className="device-card__body">
                <h3 className="device-card__name">
                  {device.url ? <Link to={device.url}>{device.name}</Link> : device.name}
                </h3>

                {device.spec && <p className="device-card__spec">{device.spec}</p>}

                <div className="device-card__meta">
                  {price !== null && (
                    <span className="device-card__price">{money.format(price, { type: 'product' })}</span>
                  )}
                  {oldPrice !== null && (
                    <s className="device-card__old-price">{money.format(oldPrice, { type: 'product' })}</s>
                  )}
                  {device.rating != null && device.rating !== '' && (
                    <span
                      className="device-card__rating"
                      title={t('blocks.device_showcase.rating', 'تقييم العملاء')}
                    >
                      <i className="sicon-star2" aria-hidden="true"></i>
                      <span className="device-card__rating-value">{device.rating}</span>
                      {device.reviews != null && device.reviews !== '' && (
                        <span className="device-card__reviews">({device.reviews})</span>
                      )}
                    </span>
                  )}
                </div>

                {device.url && (
                  <Link to={device.url} className="device-card__cta">
                    {ctaLabel}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
});
