import React from 'react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BackToTop } from '../../../app/components/layout/BackToTop';

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

const setScrollY = (value: number) =>
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });

/** The global jsdom stub reports `matches: true`; control it per test. */
const setReducedMotion = (matches: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? matches : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
};

let scrollTo: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  setScrollY(0);
  scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  scrollTo.mockRestore();
});

describe('BackToTop', () => {
  it('stays out of the way until the shopper has scrolled down', () => {
    const { container } = render(<BackToTop />);
    expect(container.querySelector('.iqraa-back-to-top')).toBeNull();

    setScrollY(500);
    fireEvent.scroll(window);

    expect(screen.getByRole('button', { name: 'Back to top' })).toBeTruthy();
  });

  it('hides again when the shopper returns to the top', () => {
    setScrollY(800);
    render(<BackToTop />);
    expect(screen.getByRole('button')).toBeTruthy();

    setScrollY(100);
    fireEvent.scroll(window);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('scrolls smoothly to the very top when pressed', () => {
    setReducedMotion(false);
    setScrollY(1200);
    render(<BackToTop />);

    fireEvent.click(screen.getByRole('button'));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('skips the animation when the shopper prefers reduced motion', () => {
    setReducedMotion(true);
    setScrollY(1200);
    render(<BackToTop />);

    fireEvent.click(screen.getByRole('button'));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });

  it('removes its scroll listener on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackToTop />);

    unmount();

    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
    remove.mockRestore();
  });
});
