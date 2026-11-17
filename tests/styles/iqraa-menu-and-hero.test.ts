// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import * as sass from 'sass';

const stylesDir = fileURLToPath(new URL('../../app/styles/04-components/', import.meta.url));
const collapsed = (css: string) => css.replace(/\s+/g, ' ');

describe('Iqraa mega menu columns', () => {
  it('allocates one track per column instead of wrapping the last two onto a tiny row', () => {
    const css = collapsed(sass.compile(`${stylesDir}iqraa-mega-menu.scss`).css);
    expect(css).toContain(
      'grid-template-columns: repeat(var(--iqraa-mega-columns, 3), minmax(0, 1fr))'
    );
    expect(css).not.toContain('auto-fit');
  });

  it('shows the featured device photos whole in a large portrait stage', () => {
    const css = collapsed(sass.compile(`${stylesDir}iqraa-mega-menu.scss`).css);
    expect(css).toContain('.iqraa-mega-product-media {');
    expect(css).toContain('object-fit: contain');
    expect(css).not.toContain('.iqraa-mega-device-thumb');
  });
});

describe('hero side list', () => {
  it('aligns each feature row to the inline start, which is the right edge in RTL', () => {
    const source = collapsed(readFileSync(`${stylesDir}home-blocks.scss`, 'utf8'));
    expect(source).toContain('@apply flex items-center justify-start gap-2 text-right;');
    expect(source).not.toContain('@apply flex items-center justify-end gap-2 text-right;');
  });
});

describe('back-to-top control', () => {
  it('is imported globally and positioned with logical insets below the sheets', () => {
    const appScss = readFileSync(
      fileURLToPath(new URL('../../app/styles/app.scss', import.meta.url)),
      'utf8'
    );
    expect(appScss).toContain("@import './04-components/back-to-top';");

    const css = collapsed(sass.compile(`${stylesDir}back-to-top.scss`).css);
    expect(css).toContain('inset-inline-end: 1.25rem');
    // Below the sheets (210) and mobile bottom bar (220).
    expect(css).toContain('z-index: 150');
  });
});
