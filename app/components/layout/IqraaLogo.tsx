import { memo } from 'react';

export interface IqraaLogoProps {
  className?: string;
  width?: number;
  height?: number;
  /** Official SVG to render. Non-Iqraa merchant URLs are ignored by design. */
  src?: string | null;
  /** Wordmark + approved tagline (used where there is room, e.g. the footer). */
  withTagline?: boolean;
}

const DEFAULT_WORDMARK = '/logo/iqraa-logo-ar-horizontal-fullcolor.svg';
const TAGLINE_WORDMARK = '/logo/iqraa-logo-ar-with-tagline.svg';

/**
 * Iqraa wordmark — Brand Guidelines v0.9 official SVG assets.
 *
 * The Arabic horizontal fullcolor mark is the default. The with-tagline variant
 * is used where there is room. Both are pure vector paths (no text/fonts), so
 * they render identically on every device. A merchant logo URL is deliberately
 * ignored unless it points at an official `/logo/iqraa-*` asset — the store's
 * pre-brand logo must not leak into the header/footer.
 *
 * The mark is decorative: every host already names its link with the store
 * name in an sr-only/aria-label sibling, so `aria-hidden` keeps one name.
 */
export const IqraaLogo = memo(function IqraaLogo({
  className = '',
  width = 120,
  height = 40,
  src,
  withTagline = false,
}: IqraaLogoProps) {
  const officialSrc =
    src && /\/logo\/iqraa-/i.test(src) ? src : withTagline ? TAGLINE_WORDMARK : DEFAULT_WORDMARK;

  return (
    <div
      className={`iqraa-brand-logo flex items-center justify-center leading-none select-none ${className}`.trim()}
      style={{ minWidth: '72px' }}
      aria-hidden="true"
    >
      <img
        src={officialSrc}
        alt=""
        width={width}
        height={height}
        className="iqraa-brand-logo__image h-auto w-full max-w-full object-contain"
        decoding="async"
      />
    </div>
  );
});
