import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

/** One benefit in the business-solutions section; authored by the merchant. */
export interface BusinessFeature {
  icon?: string;
  title?: string;
  text?: string;
  __hidden?: string;
}

export interface BusinessSolutionsProps {
  data: {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    features?: BusinessFeature[];
    cta_title?: string;
    cta_note?: string;
    cta_label?: string;
    cta_url?: string | null;
    position?: number;
    [key: string]: unknown;
  };
}

/**
 * `business-solutions` home block (`s-block--business-solutions`).
 *
 * The "Business Solutions" section from the approved design (`media/image6.png`):
 * a small Latin eyebrow, the Arabic heading and description, the section photo,
 * the benefits and the wide primary call-to-action bar.
 *
 * Everything is authored in the block so the same section renders in the preview
 * store (whose catalog and pages hold demo content) and in the live store.
 *
 * Styling: `04-components/business-solutions.scss`.
 */
export const BusinessSolutions = memo(function BusinessSolutions({
  data,
}: BusinessSolutionsProps) {
  const { t } = useTranslation();

  const features = (data.features ?? []).filter((item) => !item.__hidden && item.title);
  const hasContent = data.title || data.description || data.image;

  if (!hasContent) return null;

  return (
    <div className="business-solutions">
      <div className="business-solutions__grid">
        <div className="business-solutions__intro">
          {(data.eyebrow || data.title) && (
            <div className="business-solutions__head">
              {data.eyebrow && (
                <span className="business-solutions__eyebrow">{data.eyebrow}</span>
              )}
              {data.title && <h2 className="business-solutions__title">{data.title}</h2>}
            </div>
          )}

          {data.description && <p className="business-solutions__desc">{data.description}</p>}

          {features.length > 0 && (
            <ul className="business-solutions__features">
              {features.map((feature, index) => (
                <li className="business-solution" key={`${feature.title}-${index}`}>
                  {feature.icon && (
                    <span className="business-solution__icon">
                      <i className={feature.icon} aria-hidden="true"></i>
                    </span>
                  )}
                  <div className="business-solution__body">
                    <h3 className="business-solution__title">{feature.title}</h3>
                    {feature.text && <p className="business-solution__text">{feature.text}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {data.image && (
          <div className="business-solutions__media">
            <img src={data.image} alt="" loading="lazy" />
          </div>
        )}
      </div>

      {(data.cta_title || data.cta_note || data.cta_url) && (
        <div className="business-solutions__cta">
          <div className="business-solutions__cta-text">
            <strong className="business-solutions__cta-label">
              {data.cta_title || t('blocks.business_solutions.cta_title', 'هل تبحث عن حل لمؤسستك؟')}
            </strong>
            {data.cta_note && <span className="business-solutions__cta-note">{data.cta_note}</span>}
          </div>

          {data.cta_url && (
            <Link to={data.cta_url} className="business-solutions__cta-button">
              {data.cta_label || t('blocks.business_solutions.cta', 'تواصل مع فريق الأعمال')}
              <i className="sicon-arrow-left" aria-hidden="true"></i>
            </Link>
          )}
        </div>
      )}
    </div>
  );
});
