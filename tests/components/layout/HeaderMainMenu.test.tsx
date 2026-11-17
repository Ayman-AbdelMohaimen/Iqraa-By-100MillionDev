import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HeaderMainMenu } from '../../../app/components/layout/HeaderMainMenu';
import { IQRA_MENU, IQRA_MEGA_PANELS } from '../../../app/lib/brandMenu';

const mockUseQuery = vi.fn(() => ({ data: [] }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));
vi.mock('@salla.sa/twilight-theme-engine/api/menu', () => ({
  menu: { queries: { header: () => ({ queryKey: ['menu'] }) } },
}));
vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({
  product: { queries: { list: () => ({ queryKey: ['products'] }) } },
}));
vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => ({ theme: { settings: {} } }),
}));
vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_k: string, fb?: string) => fb ?? _k }),
}));
vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, ...rest }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock('../../../app/components/product', () => ({ ProductCard: () => null }));

const roots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(':scope > ul.main-menu > li.s-menu-root-level'));

const rootTitles = (container: HTMLElement) =>
  roots(container).map((li) => li.querySelector(':scope > a')?.textContent);

const panelOf = (container: HTMLElement, title: string) => {
  const root = roots(container).find((li) => li.querySelector(':scope > a')?.textContent === title);
  return root?.querySelector('.iqraa-mega-menu-panel');
};

beforeEach(() => {
  mockUseQuery.mockClear();
});

describe('HeaderMainMenu — final Iqraa IA', () => {
  it('renders the approved 4 sections plus B2B and the blog, in order', () => {
    const { container } = render(<HeaderMainMenu />);
    expect(rootTitles(container)).toEqual(IQRA_MENU.map((item) => item.title));
  });

  it('does not read the store menu — the theme tree is authoritative', () => {
    render(<HeaderMainMenu />);
    expect(mockUseQuery).not.toHaveBeenCalled();
  });

  it('gives only the four sections a branded mega panel', () => {
    const { container } = render(<HeaderMainMenu />);
    const all = roots(container);
    expect(all.slice(0, 4).every((li) => li.classList.contains('s-menu-mega-menu'))).toBe(true);
    expect(all.slice(4).some((li) => li.classList.contains('s-menu-mega-menu'))).toBe(false);
  });

  it('maps each root to its own panel, not one shared panel', () => {
    const { container } = render(<HeaderMainMenu />);
    const headings = IQRA_MENU.slice(0, 4).map((item) => {
      const title = item.title ?? '';
      return panelOf(container, title)?.querySelector('.iqraa-mega-column-title')?.textContent;
    });
    expect(headings).toEqual(
      ['iqraa-devices', 'iqraa-accessories', 'iqraa-focus', 'iqraa-bundles'].map(
        (id) => IQRA_MEGA_PANELS[id].columns[0].title
      )
    );
    expect(new Set(headings).size).toBe(4);
  });

  it('uses official series and smart filters instead of screen-size categories', () => {
    const { container } = render(<HeaderMainMenu />);
    const panel = panelOf(container, 'أجهزة الحبر الإلكتروني')!;
    const text = panel.textContent ?? '';
    expect(text).toContain('سلسلة BOOX Go');
    expect(text).toContain('سلسلة BOOX Note');
    expect(text).toContain('سلسلة BOOX Tab');
    expect(text).toContain('سلسلة BOOX Palma');
    expect(text).toContain('الشاشات الملونة');
    expect(text).not.toContain('شاشة كبيرة');
    expect(text).not.toContain('شاشة متوسطة');
  });

  it('offers accessory filters by device series', () => {
    const { container } = render(<HeaderMainMenu />);
    const panel = panelOf(container, 'ملحقات الحبر الإلكتروني')!;
    expect(panel.textContent).toContain('أجهزة التحكم');
    expect(Array.from(panel.querySelectorAll('.iqraa-mega-chip'), (el) => el.textContent)).toEqual([
      'Note',
      'Tab',
      'Go',
      'Palma',
    ]);
  });

  it('covers the focus and bundles sections', () => {
    const { container } = render(<HeaderMainMenu />);
    const focus = panelOf(container, 'أدوات التركيز والإنتاجية')!;
    const bundles = panelOf(container, 'الباقات والعروض')!;
    expect(focus.textContent).toContain('موقتات التركيز');
    expect(focus.textContent).toContain('مخططات المهام');
    expect(focus.textContent).toContain('دفاتر تنظيم');
    expect(bundles.textContent).toContain('منتجات مفتوحة الصندوق');
  });

  it('shows verified featured devices only in the devices panel', () => {
    const { container } = render(<HeaderMainMenu />);
    const devices = panelOf(container, 'أجهزة الحبر الإلكتروني')!;
    expect(devices.querySelectorAll('.iqraa-mega-device-card')).toHaveLength(2);
    expect(panelOf(container, 'الباقات والعروض')?.querySelector('.iqraa-mega-featured-strip')).toBeNull();
  });
});
