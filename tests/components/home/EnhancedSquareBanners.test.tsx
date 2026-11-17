import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { EnhancedSquareBanners } from '../../../app/components/home/EnhancedSquareBanners';

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({
    to,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    to: string;
    children?: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={to} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_k: string, fb?: string) => fb ?? _k }),
}));

const banners = [
  { image: 'one.jpg', url: '/one', title: 'وصل حديثاً', description: 'أحدث الأجهزة' },
  { image: 'two.jpg', url: '/two', title: 'BOOX Go', description: 'قراءة خفيفة' },
  { image: 'three.jpg', url: '/three', title: 'BOOX Note', description: 'مساحة للملاحظات' },
  { image: 'four.jpg', url: '/four', title: 'الشاشات الملونة', description: 'وسم ذكي' },
  { image: 'five.jpg', url: '/offers', title: 'الباقات والعروض', description: 'باقة واحدة' },
];

const paths = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('.iqraa-path'));

describe('EnhancedSquareBanners — discovery paths', () => {
  it('renders nothing when the merchant has not added any paths', () => {
    const { container } = render(<EnhancedSquareBanners data={{ banners: [] }} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a flat numbered list, not the old card mosaic or photo grid', () => {
    const { container } = render(<EnhancedSquareBanners data={{ banners }} />);
    expect(container.querySelector('.enhanced-square-banners-mosaic')).toBeNull();
    expect(container.querySelector('.banner-entry')).toBeNull();
    expect(container.querySelectorAll('.iqraa-path__link')).toHaveLength(5);
    expect(paths(container).map((el) => el.querySelector('.iqraa-path__number')?.textContent)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
    ]);
  });

  it('uses the approved section heading and description from the editor, with brand fallbacks', () => {
    const { container, getByText } = render(
      <EnhancedSquareBanners
        data={{ banners, title: 'مسارات الاكتشاف', description: 'خمس طرق سريعة' }}
      />
    );
    expect(getByText('مسارات الاكتشاف').tagName).toBe('H2');
    expect(container.querySelector('.iqraa-paths__desc')?.textContent).toBe('خمس طرق سريعة');

    const fallback = render(<EnhancedSquareBanners data={{ banners }} />);
    expect(fallback.container.querySelector('.iqraa-paths__title')?.textContent).toBe(
      'مسارات الاكتشاف في اقرأ'
    );
    expect(fallback.container.querySelector('.iqraa-paths__desc')?.textContent).toContain(
      'خمس طرق سريعة'
    );
  });

  it('renders each path as a link with a contained image, caption and CTA', () => {
    const { container } = render(<EnhancedSquareBanners data={{ banners }} />);
    const first = paths(container)[0];
    expect(first.querySelector('a')?.getAttribute('href')).toBe('/one');
    const image = first.querySelector<HTMLImageElement>('.iqraa-path__image')!;
    expect(image.getAttribute('src')).toBe('one.jpg');
    expect(image.getAttribute('alt')).toBe('');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(first.querySelector('.iqraa-path__title')?.textContent).toBe('وصل حديثاً');
    expect(first.querySelector('.iqraa-path__desc')?.textContent).toBe('أحدث الأجهزة');
    expect(first.querySelector('.iqraa-path__cta')?.textContent).toContain('اكتشف الآن');
  });

  it('marks the first path as the lead and reflects the number of paths in the class', () => {
    const { container } = render(<EnhancedSquareBanners data={{ banners }} />);
    expect(container.querySelector('.iqraa-paths')?.classList.contains('iqraa-paths--5')).toBe(true);
    expect(paths(container)[0].classList.contains('iqraa-path--lead')).toBe(true);
    expect(paths(container)[1].classList.contains('iqraa-path--lead')).toBe(false);

    const two = render(<EnhancedSquareBanners data={{ banners: banners.slice(0, 2) }} />);
    expect(two.container.querySelector('.iqraa-paths')?.classList.contains('iqraa-paths--2')).toBe(
      true
    );
  });

  it('names an untitled path by its description, or by the CTA when it has no text', () => {
    const { container } = render(
      <EnhancedSquareBanners
        data={{
          banners: [
            { image: 'a.jpg', url: '/a', description: 'وصف فقط' },
            { image: 'b.jpg', url: '/b' },
          ],
        }}
      />
    );
    const [described, bare] = Array.from(container.querySelectorAll('.iqraa-path__link'));
    expect(described.hasAttribute('aria-label')).toBe(false);
    expect(bare.getAttribute('aria-label')).toBe('اكتشف الآن');
  });

  it('omits the image when the merchant has not uploaded one', () => {
    const { container } = render(
      <EnhancedSquareBanners data={{ banners: [{ url: '/a', title: 'بلا صورة' }] }} />
    );
    expect(container.querySelector('.iqraa-path__image')).toBeNull();
    expect(container.querySelector('.iqraa-path__number')?.textContent).toBe('01');
  });
});
