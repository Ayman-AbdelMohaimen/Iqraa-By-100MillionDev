import type { MenuItem } from '@salla.sa/twilight-theme-engine/types';

/**
 * Iqraa's own main-menu tree.
 *
 * This is a brand theme built for one merchant, so the storefront keeps a
 * complete menu even before the merchant's `menus/header` is filled in (the
 * development store ships with an empty header menu, which used to leave the
 * default layout — and its mega panels — empty). As soon as the store has its
 * own header menu, that menu wins: see `HeaderMainMenu`.
 *
 * Links point at the live store's categories, matching the mega menu there.
 */
const url = {
  newArrivals: 'https://readboox.com/ar/new-arrivals/c1136262562',
  big: 'https://readboox.com/ar/قراءة-وكتابة-الكترونية-بووكس-شاشة-كبيرة/c520732342',
  medium: 'https://readboox.com/ar/قارئ-الكتروني-بووكس-شاشة-متوسطة/c50469739',
  color: 'https://readboox.com/ar/قراءة-وكتابة-الكترونية-بووكس-شاشة-ملونة/c1609926589',
  covers: 'https://readboox.com/ar/جرابات-حافظات-اجهزة-بووكس/c783571317',
  note: 'https://readboox.com/ar/جرابات-حافظات-سلسلة-بووكس-نوت/c744620036',
  tab: 'https://readboox.com/ar/جرابات-حافظات-سلسلة-بووكس-تاب/c2011139072',
  go: 'https://readboox.com/ar/جرابات-حافظات-سلسلة-بووكس-go/c1835985155',
  palma: 'https://readboox.com/ar/جرابات-حافظات-سلسلة-بووكس-palma/c2084032779',
  other: 'https://readboox.com/ar/أخرى/c753944962',
  accessories: 'https://readboox.com/ar/ملحقات-اجهزة-بووكس/c1515858480',
  pens: 'https://readboox.com/ar/اقلام-ستايلس-اجهزة-بووكس/c723067992',
  nibs: 'https://readboox.com/ar/رؤوس-اقلام-نيب-اجهزة-بووكس/c82199385',
  remotes: 'https://readboox.com/ar/اجهزة-تحكم-ريموت-اجهزة-بووكس/c547979611',
  offers: 'https://readboox.com/ar/offers',
  whatsapp: 'https://wa.me/966506558151',
};

const child = (id: string, title: string, href: string): MenuItem => ({
  id,
  title,
  url: href,
});

export const IQRA_MENU: MenuItem[] = [
  {
    id: 'devices',
    title: 'أجهزة القراءة',
    url: url.newArrivals,
    children: [
      child('new-arrivals', 'وصل حديثاً', url.newArrivals),
      child('big-screen', 'شاشة كبيرة', url.big),
      child('medium-screen', 'شاشة متوسطة', url.medium),
      child('color-screen', 'شاشة ملونة', url.color),
    ],
  },
  {
    id: 'covers',
    title: 'الحافظات والجرابات',
    url: url.covers,
    children: [
      child('note-covers', 'حافظات سلسلة Note', url.note),
      child('tab-covers', 'حافظات سلسلة Tab', url.tab),
      child('go-covers', 'حافظات سلسلة GO', url.go),
      child('palma-covers', 'حافظات سلسلة Palma', url.palma),
      child('other-covers', 'جرابات أخرى', url.other),
    ],
  },
  {
    id: 'accessories',
    title: 'الأقلام والملحقات',
    url: url.accessories,
    children: [
      child('pens', 'الأقلام', url.pens),
      child('nibs', 'رؤوس الأقلام', url.nibs),
      child('remotes', 'أجهزة التحكم', url.remotes),
      child('all-accessories', 'عرض الكل', url.accessories),
    ],
  },
  {
    id: 'offers',
    title: 'العروض',
    url: url.offers,
  },
  {
    id: 'contact',
    title: 'تواصل معنا',
    url: url.whatsapp,
    target: '_blank',
  },
];
