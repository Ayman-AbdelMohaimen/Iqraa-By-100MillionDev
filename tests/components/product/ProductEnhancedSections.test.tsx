import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { ProductEnhancedSections } from '../../../app/components/product/ProductEnhancedSections';

vi.mock('../../../app/components/product/ProductMetadata', () => ({
  ProductMetadata: () => <div data-testid="product-metadata" />,
}));

const product = {
  id: 1,
  name: 'BOOX Note Air6 C',
  rating: { count: 23 },
} as unknown as Product;

const accessory = { ...product, name: 'قلم BOOX' } as Product;

const tabs = () => screen.getAllByRole('tab');

beforeEach(() => {
  // jsdom has no layout, so scrollIntoView is missing. The reviews tab uses it.
  Element.prototype.scrollIntoView = vi.fn();
});

describe('ProductEnhancedSections tabs', () => {
  it('exposes a labelled tablist wired to one panel per tab', () => {
    render(<ProductEnhancedSections product={product} />);

    expect(screen.getByRole('tablist', { name: 'تبويبات تفاصيل المنتج' })).toBeTruthy();
    expect(tabs().map((tab) => tab.textContent?.trim())).toEqual([
      'نظرة عامة',
      'المواصفات',
      'ماذا في الصندوق؟',
      'الملحقات المتوافقة',
      'المقارنة',
      'المراجعات (23)',
    ]);

    expect(tabs().map((tab) => tab.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
      'false',
      'false',
      'false',
    ]);
    // Only the active tab is in the Tab order; the rest are arrow-reachable.
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1, -1, -1]);

    const panel = screen.getByRole('tabpanel');
    expect(panel.id).toBe('pdp-panel-overview');
    expect(panel.getAttribute('aria-labelledby')).toBe('pdp-tab-overview');
    expect(tabs()[0].getAttribute('aria-controls')).toBe(panel.id);
  });

  it('switches panel and selection on click', () => {
    render(<ProductEnhancedSections product={product} />);

    fireEvent.click(screen.getByRole('tab', { name: 'المواصفات' }));

    expect(screen.getByRole('tab', { name: 'المواصفات' }).getAttribute('aria-selected')).toBe(
      'true'
    );
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-specs');
    expect(screen.getByText('المواصفات الفنية الكاملة')).toBeTruthy();
  });

  it('moves with arrow keys and jumps with Home and End', () => {
    render(<ProductEnhancedSections product={product} />);

    fireEvent.keyDown(tabs()[0], { key: 'ArrowRight' });
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-specs');
    expect(document.activeElement).toBe(tabs()[1]);

    fireEvent.keyDown(tabs()[1], { key: 'End' });
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-reviews');
    expect(document.activeElement).toBe(tabs()[5]);

    fireEvent.keyDown(tabs()[5], { key: 'ArrowRight' });
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-overview');

    fireEvent.keyDown(tabs()[0], { key: 'ArrowLeft' });
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-reviews');

    fireEvent.keyDown(tabs()[5], { key: 'Home' });
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-overview');
  });

  it('ignores unrelated keys', () => {
    render(<ProductEnhancedSections product={product} />);

    const prevented = fireEvent.keyDown(tabs()[0], { key: 'a' });

    expect(prevented).toBe(true);
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-overview');
  });

  it('drops the device-only tabs for an accessory and keeps the set in sync', () => {
    render(<ProductEnhancedSections product={accessory} />);

    expect(tabs().map((tab) => tab.getAttribute('id'))).toEqual([
      'pdp-tab-overview',
      'pdp-tab-specs',
      'pdp-tab-box',
      'pdp-tab-reviews',
    ]);
  });

  it('reports a controlled tab change without owning the selection', () => {
    const onSelectTab = vi.fn();
    const { rerender } = render(
      <ProductEnhancedSections product={product} activeTab="overview" onSelectTab={onSelectTab} />
    );

    fireEvent.click(screen.getByRole('tab', { name: 'المقارنة' }));

    expect(onSelectTab).toHaveBeenCalledWith('comparison');
    // Parent has not changed the prop yet, so the panel still follows it.
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-overview');

    rerender(
      <ProductEnhancedSections product={product} activeTab="comparison" onSelectTab={onSelectTab} />
    );
    expect(screen.getByRole('tabpanel').id).toBe('pdp-panel-comparison');
  });
});
