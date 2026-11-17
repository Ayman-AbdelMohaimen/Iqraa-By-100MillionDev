import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { HeaderNav } from '../../../app/components/layout/HeaderNav';
import { IQRA_MENU } from '../../../app/lib/brandMenu';

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({
    t: (_k: string, fb?: string) => fb ?? _k,
    languageName: 'English',
    isRTL: false,
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => ({
    store: { name: 'Store', url: '/', logo: '/logo.png', settings: {} },
    currency: { code: 'SAR' },
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, className, onClick, target, rel }: Record<string, unknown>) => (
    <a
      href={String(to)}
      className={className as string}
      onClick={onClick as () => void}
      target={target as string | undefined}
      rel={rel as string | undefined}
    >
      {children as React.ReactNode}
    </a>
  ),
  Image: ({ src, alt }: Record<string, unknown>) => <img src={src as string} alt={alt as string} />,
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const roots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.site-nav-drawer__panel:first-child .site-nav-drawer__list > li'));

describe('HeaderNav — final Iqraa IA', () => {
  it('renders nothing while closed', () => {
    const { container } = render(<HeaderNav open={false} onClose={() => {}} />);
    expect(container.querySelector('.site-nav-drawer')).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it('uses the approved tree, not a store menu: six roots, four with children', () => {
    const { container } = render(<HeaderNav open onClose={() => {}} />);
    expect(container.querySelectorAll('.site-nav-drawer__panel')).toHaveLength(1);
    const items = roots(container);
    expect(items.map((li) => li.textContent?.trim())).toEqual(IQRA_MENU.map((i) => i.title));
    expect(container.querySelectorAll('.site-nav-drawer__link--parent')).toHaveLength(4);
  });

  it('drills into a section, then returns to the root column when reopened', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const onClose = () => {};
    const { container, getByText, rerender } = render(<HeaderNav open onClose={onClose} />);

    fireEvent.click(getByText('أجهزة الحبر الإلكتروني'));
    expect(container.querySelectorAll('.site-nav-drawer__panel')).toHaveLength(2);
    expect(container.querySelectorAll('.site-nav-drawer__link')).toHaveLength(
      IQRA_MENU.length + (IQRA_MENU[0].children?.length ?? 0)
    );
    expect(getByText('أجهزة القراءة')).toBeTruthy();
    expect(getByText('المقارنة بين الأجهزة')).toBeTruthy();
    expect(container.querySelector('.site-nav-drawer__browse-all')?.textContent).toContain(
      'أجهزة الحبر الإلكتروني'
    );

    rerender(<HeaderNav open={false} onClose={onClose} />);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(container.querySelector('.site-nav-drawer')).toBeNull();

    rerender(<HeaderNav open onClose={onClose} />);
    expect(container.querySelectorAll('.site-nav-drawer__panel')).toHaveLength(1);
    expect(container.querySelector('.site-nav-drawer__browse-all')).toBeNull();
  });

  it('locks body scroll while open', () => {
    render(<HeaderNav open onClose={() => {}} />);
    expect(document.body.classList.contains('menu-opened')).toBe(true);
  });

  it('names the logo link by the store name and uses the official wordmark', () => {
    const { container } = render(<HeaderNav open onClose={() => {}} />);
    const brand = container.querySelector('.site-nav-drawer__brand')!;
    const logo = brand.querySelector<HTMLImageElement>('.iqraa-brand-logo__image')!;
    expect(brand.querySelector('.iqraa-brand-logo')?.getAttribute('aria-hidden')).toBe('true');
    expect(logo.getAttribute('alt')).toBe('');
    expect(logo.getAttribute('src')).toContain('/logo/iqraa-');
    expect(brand.querySelector('.sr-only')?.textContent).toBe('Store');
  });

  it('does not reserve an image slot: the approved tree has no menu images', () => {
    const { container } = render(<HeaderNav open onClose={() => {}} />);
    expect(container.querySelector('.site-nav-drawer__link-img-placeholder')).toBeNull();
    expect(container.querySelector('.site-nav-drawer__link-img')).toBeNull();
    expect(container.querySelector('.site-nav-drawer__label')).toBeNull();
  });

  it('marks the open section as expanded and closes when a leaf is chosen', () => {
    const onClose = vi.fn();
    const { container, getByText } = render(<HeaderNav open onClose={onClose} />);
    const trigger = container.querySelector<HTMLButtonElement>('.site-nav-drawer__link--parent')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(getByText('أجهزة القراءة'));
    expect(onClose).toHaveBeenCalled();
  });
});
