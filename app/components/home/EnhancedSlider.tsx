import { memo, useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { SallaSlider } from '@salla.sa/twilight-components-react/slider';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { getCdnImageSrcSet, getCdnImageUrl } from '@salla.sa/twilight-theme-engine/utils/cdn-image';
import { parseSlideVideo, youtubeEmbedUrl } from '../../lib/slideVideo';
import { useMotionAllowed } from '../../hooks/useMotionAllowed';
import { useFirstInteraction } from '../../hooks/useFirstInteraction';

/** CDN widths for a full-width slide, from phones to wide desktops. */
const SLIDE_WIDTHS = [640, 828, 1080, 1280, 1920] as const;

/**
 * A slide image resized by the CDN instead of the merchant's original upload. The poster
 * and slide 1 use the same `srcSet` and `sizes`, so the browser picks the same file for
 * both and the slider reuses the poster's download.
 */
function slideImage(src: string | undefined) {
  return {
    src: getCdnImageUrl(src, { width: 1280 }) ?? src,
    srcSet: getCdnImageSrcSet(src, SLIDE_WIDTHS),
    sizes: '100vw',
  };
}

export interface SliderBanner {
  link?: string;
  /** twilight.json `slides.url`: where the slide's button goes. */
  url?: string;
  image?: string;
  mobile_image?: string;
  video?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  btnname?: string;
  show_button?: boolean;
  direction?: string[];
  title_color?: string;
  subtitle_color?: string;
  btnname_color?: string;
  without_overlay?: boolean;
}

export interface EnhancedSliderProps {
  data: {
    slider_banner?: SliderBanner[];
    slides?: SliderBanner[];
    slider_view_height?: number;
    slider_animation_time?: number;
    slider_aniamtion_time?: number;
    slider_animation_enabled?: boolean;
    /** twilight.json `auto_play`: move to the next slide on a timer. On unless switched off. */
    auto_play?: boolean;
    position?: number;
    in_container?: boolean;
    priority?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Plays each slide video while it is on screen and pauses it otherwise, so only
 * the visible slide's video downloads and plays. Videos are found in the DOM, not
 * through refs, so the copies Swiper makes of slides for looping play too.
 */
export function useSlideVideos(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    const playIf = (video: HTMLVideoElement, visible: boolean) => {
      if (!visible) return video.pause();
      video.muted = true; // autoplay needs it, and a copied slide only keeps attributes
      video.play().catch(() => undefined);
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) =>
              entries.forEach((entry) =>
                playIf(entry.target as HTMLVideoElement, entry.isIntersecting)
              ),
            // Slides off screen sit beside the visible one, clipped by the slider.
            { threshold: 0.5 }
          );
    const watched = new WeakSet<HTMLVideoElement>();
    const watch = () =>
      element.querySelectorAll<HTMLVideoElement>('video.enhanced-slider__video').forEach((video) => {
        if (watched.has(video)) return;
        watched.add(video);
        if (observer) observer.observe(video);
        else playIf(video, true);
      });
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(element, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, [root, enabled]);
}

/** How often, and how many times, the page asks a YouTube frame to start sending events. */
const YOUTUBE_LISTEN_INTERVAL_MS = 500;
const YOUTUBE_LISTEN_TRIES = 20;

/** YouTube's player state for "playing". */
const YOUTUBE_PLAYING = 1;

/**
 * A YouTube background, hidden until YouTube reports it is playing, so the slide
 * image shows while it loads, and removed if YouTube reports an error (embedding
 * disabled, video removed). Uses the embed's postMessage events (`enablejsapi`):
 * the page says it is listening, and the frame answers with its state.
 */
function YouTubeBackground({ id }: { id: string }) {
  // The player is ~1 MB of script: it waits for the visitor's first scroll, tap or key,
  // so it stays out of the page load (the slider sits above the fold, where
  // `loading="lazy"` doesn't hold it back). The slide image shows until then.
  const interacted = useFirstInteraction();
  if (!interacted) return null;
  return <YouTubeFrame id={id} />;
}

function YouTubeFrame({ id }: { id: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'loading' | 'playing' | 'failed'>('loading');

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let heard = false;
    let tries = 0;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow) return;
      let data: { event?: string; info?: unknown } | null = null;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!data || typeof data !== 'object') return;
      heard = true;
      if (data.event === 'onError') return setState('failed');
      const playerState =
        data.event === 'onStateChange'
          ? data.info
          : (data.info as { playerState?: unknown } | null)?.playerState;
      if (playerState === YOUTUBE_PLAYING) setState('playing');
    };
    let timer: number | undefined;
    const send = () => {
      if (heard || tries >= YOUTUBE_LISTEN_TRIES) return window.clearInterval(timer);
      tries += 1;
      frame.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id, channel: 'widget' }),
        'https://www.youtube-nocookie.com'
      );
    };
    // The frame is lazy, so it may load long after mounting: the tries start then.
    const listen = () => {
      window.clearInterval(timer);
      tries = 0;
      send();
      timer = window.setInterval(send, YOUTUBE_LISTEN_INTERVAL_MS);
    };
    window.addEventListener('message', onMessage);
    frame.addEventListener('load', listen);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('message', onMessage);
      frame.removeEventListener('load', listen);
    };
  }, [id]);

  if (state === 'failed') return null;
  return (
    <iframe
      ref={ref}
      className="enhanced-slider__video enhanced-slider__video--embed"
      data-state={state}
      src={youtubeEmbedUrl(id, window.location.origin)}
      title=""
      loading="lazy"
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

/**
 * A slide's background video, over its image (which stays as the poster and the
 * fallback) and under its overlay. Rendered on the client only, and not for
 * visitors who ask for reduced motion. A video file waits for
 * {@link useSlideVideos} to play it; a YouTube embed loads lazily and plays
 * muted on its own.
 */
export function SlideVideo({ url, poster }: { url?: string; poster?: string }) {
  const video = parseSlideVideo(url);
  if (!video) return null;
  if (video.kind === 'youtube') return <YouTubeBackground id={video.id} />;
  return (
    <video
      className="enhanced-slider__video"
      src={video.src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function SlideText({ slide, poster }: { slide: SliderBanner; poster?: boolean }) {
  return (
    <div className="iqraa-hero-container container h-full relative z-10 flex items-center justify-between">
      {/* Right Column: 4 Vertical Feature Pills (Desktop) */}
      <div className="iqraa-hero-badges hidden lg:flex flex-col gap-3 shrink-0">
        <div className="iqraa-hero-badge">
          <span className="iqraa-hero-badge-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </span>
          <span className="iqraa-hero-badge-text">تقنيات تدعم العربية</span>
        </div>
        <div className="iqraa-hero-badge">
          <span className="iqraa-hero-badge-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>
          </span>
          <span className="iqraa-hero-badge-text">مناسبة للدراسة والعمل</span>
        </div>
        <div className="iqraa-hero-badge">
          <span className="iqraa-hero-badge-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          </span>
          <span className="iqraa-hero-badge-text">أجهزة أصلية وضمان محلي</span>
        </div>
        <div className="iqraa-hero-badge">
          <span className="iqraa-hero-badge-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </span>
          <span className="iqraa-hero-badge-text">شحن سريع وآمن</span>
        </div>
      </div>

      {/* Center Column: Main Headline + Subtitle + Dual CTAs */}
      <div className="iqraa-hero-main text-right max-w-xl">
        <h1 className="iqraa-hero-title iqraa-display font-bold text-iqraa-ink leading-tight mb-3">
          {slide.title && slide.title.length > 3 ? (
            slide.title
          ) : (
            <>
              اقرأ
              <span className="block text-iqraa-deep mt-1">حيث تبدأ المعرفة</span>
            </>
          )}
        </h1>
        <p className="iqraa-hero-subtitle text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6">
          {slide.description || slide.subtitle || 'اكتشف تقنيات القراءة والتعلم والإنتاجية، واختَر الجهاز الذي يناسب أسلوب حياتك.'}
        </p>
        <div className="iqraa-hero-actions flex flex-wrap items-center gap-3">
          <Link
            to={slide.url || slide.link || '/latest-products'}
            className="iqraa-hero-btn-primary"
            {...(poster && { tabIndex: -1 })}
          >
            {slide.btnname?.trim() || 'تسوق جميع الأجهزة'} &larr;
          </Link>
          <a
            href="#shop-by-need"
            className="iqraa-hero-btn-outline"
            {...(poster && { tabIndex: -1 })}
          >
            دليل اختيار الجهاز
          </a>
        </div>
      </div>

      {/* Left Column: Device Presentation & Vertical Keywords */}
      <div className="iqraa-hero-visual hidden md:flex items-center gap-6">
        <div className="iqraa-hero-device-wrapper">
          <img
            src="https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp"
            alt="BOOX Note Device"
            className="iqraa-hero-device-img"
            loading="eager"
          />
        </div>
        <div className="iqraa-hero-vertical-words">
          <span>اقرأ</span>
          <span>اكتب</span>
          <span>تعلّم</span>
          <span>ركّز</span>
          <span>أنجز</span>
        </div>
      </div>
    </div>
  );
}

export const EnhancedSlider = memo(function EnhancedSlider({ data }: EnhancedSliderProps) {
  const slides = data.slider_banner || data.slides || [];
  const position = data.position ?? 1;
  const hasMultipleSlides = slides.length > 1;
  const inContainer = Boolean(data.in_container);
  const firstImage = slides[0]?.image;
  // SSR copy of slide 1 over the slider until Swiper is up. SallaSlider renders only a
  // skeleton until hydration, so the hero image (the LCP) used to be requested late.
  const [showPoster, setShowPoster] = useState(
    Boolean(data.priority && firstImage && !inContainer)
  );
  const hidePoster = useCallback(() => {
    const image = new Image();
    const { src, srcSet, sizes } = slideImage(firstImage);
    image.sizes = sizes;
    if (srcSet) image.srcset = srcSet;
    image.src = src ?? '';
    // Wait for the (already cached) image to decode so the swap never flashes.
    Promise.resolve(image.decode?.())
      .catch(() => undefined)
      .then(() => setShowPoster(false));
  }, [firstImage]);

  const root = useRef<HTMLDivElement>(null);
  const motionAllowed = useMotionAllowed();
  const hasVideo = motionAllowed && slides.some((slide) => parseSlideVideo(slide.video));
  useSlideVideos(root, hasVideo);

  if (!slides.length) return null;

  const first = slides[0];

  return (
    <div className="enhanced-slider" ref={root}>
      <SallaSlider
        id={`main-slider-${position}`}
        // Swiper's autoplay redraws every frame for its countdown, so a single slide skips it.
        autoPlay={hasMultipleSlides && data.auto_play !== false}
        sliderConfig={{ lazy: false, watchOverflow: true }}
        showControls={hasMultipleSlides}
        pagination={hasMultipleSlides}
        type="fullwidth"
        className={inContainer ? 'in-container' : undefined}
        onAfterInit={showPoster ? hidePoster : undefined}
      >
        <div slot="items">
          {slides.map((slide, index) => (
            // The slide's ratio lives in CSS (home-blocks.scss): taller on phones.
            <div key={index} className="swiper-slide w-full bg-dark relative">
              <div
                className={`${slide.without_overlay ? '' : 'overlay-bg'} bg-cover bg-center absolute inset-0`}
              >
                {slide.image && (
                  <img
                    {...slideImage(slide.image)}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                )}
                {motionAllowed && <SlideVideo url={slide.video} poster={slide.image} />}
              </div>
              <SlideText slide={slide} />
            </div>
          ))}
        </div>
      </SallaSlider>

      {showPoster && (
        <div className="enhanced-slider__poster" aria-hidden="true">
          <div className="swiper-slide w-full bg-dark relative">
            <div
              className={`${first.without_overlay ? '' : 'overlay-bg'} absolute inset-0 overflow-hidden`}
            >
              <img
                {...slideImage(first.image)}
                alt=""
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <SlideText slide={first} poster />
          </div>
        </div>
      )}
    </div>
  );
});
