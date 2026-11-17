import { memo, useEffect, useState } from 'react';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

/** Scroll distance after which the control is worth showing. */
const SHOW_AFTER = 400;

/**
 * Global "back to top" control. Mounted once in `ThemeLayout`, outside
 * `.app-inner`, so it is present on every storefront page (including the
 * business route) and is never clipped by a page section's stacking context.
 *
 * Deliberately theme-owned and dependency-free: a passive scroll listener and
 * one `scrollTo`. The button unmounts when the shopper is already at the top,
 * so it can never hold focus or cover the header.
 */
export const BackToTop = memo(function BackToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Passive: scrolling must never wait on a React state update.
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="iqraa-back-to-top"
      aria-label={t('common.actions.back_to_top', 'Back to top')}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20V4" />
        <path d="M5 11l7-7 7 7" />
      </svg>
    </button>
  );
});
