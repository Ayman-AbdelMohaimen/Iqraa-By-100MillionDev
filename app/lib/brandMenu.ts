import type { MenuItem } from '@salla.sa/twilight-theme-engine/types';

/**
 * Iqraa final navigation structure (approved 2026-11).
 *
 * This theme is built for one merchant, so this tree is the source of truth for
 * both the desktop mega menu and the mobile drawer. Store menu items are not
 * read here: the approved four-section IA must not be replaced by an older
 * merchant menu that still classifies devices by screen size.
 *
 * Series (GO / Note / Tab / Palma) and screen technology (colour / mono) are
 * smart filters, not duplicate categories — a device appears under exactly one
 * category and is reachable from any matching filter.
 */

/** Salla's search route keeps a link useful before a new category is created. */
const search = (term: string) => `/search?q=${encodeURIComponent(term)}`;

export const url = {
  // E-readers
  devices: '/latest-products',
  readers: search('قارئ إلكتروني BOOX'),
  readWrite: search('قراءة وكتابة BOOX'),
  compare: search('مقارنة أجهزة BOOX'),

  // Official series — smart filters, not categories
  seriesGo: search('BOOX Go'),
  seriesNote: search('BOOX Note'),
  seriesTab: search('BOOX Tab'),
  seriesPalma: search('BOOX Palma'),
  colourFilter: search('شاشة ملونة BOOX'),
  monoFilter: search('شاشة أبيض وأسود BOOX'),

  // E-ink accessories
  casesCovers: 'https://readboox.com/ar/جرابات-حافظات-اجهزة-بووكس/c783571317',
  pensNibs: 'https://readboox.com/ar/اقلام-ستايلس-اجهزة-بووكس/c723067992',
  controllers: 'https://readboox.com/ar/اجهزة-تحكم-ريموت-اجهزة-بووكس/c547979611',

  // Focus and productivity tools
  focusTimers: search('موقتات التركيز'),
  taskPlanners: search('مخططات المهام'),
  organizers: search('دفاتر تنظيم'),

  // Bundles and offers
  bundles: '/offers',
  discounts: '/offers',
  openBox: search('مفتوحة الصندوق BOOX'),
  newArrivals: '/latest-products',

  // Site pages
  business: '/business',
  blog: '/blog',
};

export interface MegaColumnItem {
  title: string;
  subtitle?: string;
  url: string;
  iconType: string;
}

export interface MegaColumn {
  title: string;
  englishTitle?: string;
  url: string;
  links: MegaColumnItem[];
  chips?: { name: string; url: string }[];
  chipsLabel?: string;
}

export interface MegaPanel {
  columns: MegaColumn[];
  /** Show the featured-device strip under the columns. */
  featured?: boolean;
}

const seriesChips = [
  { name: 'Note', url: url.seriesNote },
  { name: 'Tab', url: url.seriesTab },
  { name: 'Go', url: url.seriesGo },
  { name: 'Palma', url: url.seriesPalma },
];

/** One panel per root id; the id is the contract with `HeaderMainMenu`. */
export const IQRA_MEGA_PANELS: Record<string, MegaPanel> = {
  'iqraa-devices': {
    featured: true,
    columns: [
      {
        title: 'أجهزة الحبر الإلكتروني',
        englishTitle: 'BOOX Devices',
        url: url.devices,
        links: [
          {
            title: 'أجهزة القراءة',
            subtitle: 'للقراءة اليومية الخفيفة',
            url: url.readers,
            iconType: 'reader',
          },
          {
            title: 'أجهزة القراءة والكتابة',
            subtitle: 'للملاحظات والدراسة',
            url: url.readWrite,
            iconType: 'pencil-note',
          },
          {
            title: 'المقارنة بين الأجهزة',
            subtitle: 'اختر حسب احتياجك',
            url: url.compare,
            iconType: 'compare',
          },
        ],
      },
      {
        title: 'السلاسل الرسمية',
        englishTitle: 'BOOX Series',
        url: url.devices,
        links: [
          {
            title: 'سلسلة BOOX Go',
            subtitle: 'قراءة خفيفة ومتنقلة',
            url: url.seriesGo,
            iconType: 'book',
          },
          {
            title: 'سلسلة BOOX Note',
            subtitle: 'كتابة وملاحظات',
            url: url.seriesNote,
            iconType: 'pencil-note',
          },
          {
            title: 'سلسلة BOOX Tab',
            subtitle: 'إنتاجية ومعالجات BSR',
            url: url.seriesTab,
            iconType: 'focus',
          },
          {
            title: 'سلسلة BOOX Palma',
            subtitle: 'بحجم الجيب',
            url: url.seriesPalma,
            iconType: 'mobile',
          },
        ],
      },
      {
        title: 'فلاتر ذكية',
        englishTitle: 'Smart Filters',
        url: url.devices,
        links: [
          {
            title: 'الشاشات الملونة',
            subtitle: 'وسم ذكي — لا يكرر الأقسام',
            url: url.colourFilter,
            iconType: 'palette',
          },
          {
            title: 'الشاشات الأبيض والأسود',
            subtitle: 'وسم ذكي — لا يكرر الأقسام',
            url: url.monoFilter,
            iconType: 'reader',
          },
        ],
      },
    ],
  },

  'iqraa-accessories': {
    columns: [
      {
        title: 'ملحقات الحبر الإلكتروني',
        englishTitle: 'E-Ink Accessories',
        url: url.casesCovers,
        links: [
          {
            title: 'الحافظات والأغطية',
            subtitle: 'Cases & Covers',
            url: url.casesCovers,
            iconType: 'case',
          },
          {
            title: 'الأقلام ورؤوس الاستبدال',
            subtitle: 'Stylus & Nibs',
            url: url.pensNibs,
            iconType: 'pen-nib',
          },
          {
            title: 'أجهزة التحكم',
            subtitle: 'Remotes & Controllers',
            url: url.controllers,
            iconType: 'controls',
          },
        ],
        chips: seriesChips,
        chipsLabel: 'تصفح الملحقات حسب سلسلة الجهاز',
      },
      {
        title: 'دليل التوافق',
        englishTitle: 'Compatibility Guide',
        url: url.blog,
        links: [
          {
            title: 'كيف تختار الحافظة المناسبة',
            subtitle: 'دليل سريع حسب السلسلة',
            url: url.blog,
            iconType: 'book',
          },
          {
            title: 'أنواع الأقلام ورؤوس النيب',
            subtitle: 'ما يناسب جهازك',
            url: url.blog,
            iconType: 'pen-nib',
          },
        ],
      },
    ],
  },

  'iqraa-focus': {
    columns: [
      {
        title: 'أدوات التركيز والإنتاجية',
        englishTitle: 'Focus & Productivity',
        url: url.focusTimers,
        links: [
          {
            title: 'موقتات التركيز',
            subtitle: 'لجلسات عمل متواصلة',
            url: url.focusTimers,
            iconType: 'timer',
          },
          {
            title: 'مخططات المهام',
            subtitle: 'لتخطيط الأسبوع والدراسة',
            url: url.taskPlanners,
            iconType: 'task',
          },
          {
            title: 'دفاتر تنظيم',
            subtitle: 'لترتيب الأفكار والملاحظات',
            url: url.organizers,
            iconType: 'notebook',
          },
        ],
      },
      {
        title: 'ابدأ بخطوة بسيطة',
        englishTitle: 'Getting Started',
        url: url.blog,
        links: [
          {
            title: 'بناء روتين تركيز يومي',
            subtitle: 'مقالة من مدونة اقرأ',
            url: url.blog,
            iconType: 'book',
          },
          {
            title: 'تنظيم المهام مع BOOX',
            subtitle: 'مقالة من مدونة اقرأ',
            url: url.blog,
            iconType: 'pencil-note',
          },
        ],
      },
    ],
  },

  'iqraa-bundles': {
    columns: [
      {
        title: 'الباقات والعروض',
        englishTitle: 'Bundles & Offers',
        url: url.bundles,
        links: [
          {
            title: 'الباقات',
            subtitle: 'جهاز مع ملحقاته',
            url: url.bundles,
            iconType: 'bundle',
          },
          {
            title: 'التخفيضات',
            subtitle: 'عروض محدودة',
            url: url.discounts,
            iconType: 'discount',
          },
          {
            title: 'منتجات مفتوحة الصندوق',
            subtitle: 'فحصها المتجر',
            url: url.openBox,
            iconType: 'box',
          },
        ],
      },
      {
        title: 'عروض ذات صلة',
        englishTitle: 'More to Explore',
        url: url.newArrivals,
        links: [
          {
            title: 'وصل حديثاً',
            subtitle: 'آخر الإضافات للمتجر',
            url: url.newArrivals,
            iconType: 'book',
          },
          {
            title: 'جميع الأجهزة',
            subtitle: 'تصفح كل سلاسل BOOX',
            url: url.devices,
            iconType: 'reader',
          },
        ],
      },
    ],
  },
};

export interface FeaturedDevicePreview {
  name: string;
  spec: string;
  price: string;
  image: string;
  url: string;
  badge?: string;
}

/** Only devices with a verified, reachable product image are listed here. */
export const FEATURED_DEVICES: FeaturedDevicePreview[] = [
  {
    name: 'BOOX Note Air6 C',
    spec: 'شاشة 10.3" ملونة (Kaleido 3)',
    price: '2,599 ر.س',
    image:
      'https://cdn.files.salla.network/other/1935517889/720a8394-d7f2-4fc4-a396-5aeb3690b256-original.webp',
    url: url.devices,
    badge: 'جديد',
  },
  {
    name: 'BOOX Go 7',
    spec: 'شاشة 7" خفيفة ومريحة',
    price: '999 ر.س',
    image:
      'https://cdn.salla.sa/WZNRy/bfe83fb2-ca01-4664-b692-0fa9bbea5153-1000x1000-0ZELVvaOhc8ThQKPdUlq2XrO7y5R4LJq2qCn4Hv6.jpg',
    url: url.devices,
    badge: 'مختارة للقراءة',
  },
];

/**
 * Six root links: the four approved sections, then the two site pages the
 * merchant asked to keep. The first four carry children for the mobile drawer
 * and a matching entry in `IQRA_MEGA_PANELS` for the desktop mega menu.
 */
export const IQRA_MENU: MenuItem[] = [
  {
    id: 'iqraa-devices',
    title: 'أجهزة الحبر الإلكتروني',
    url: url.devices,
    children: [
      { id: 'reading-devices', title: 'أجهزة القراءة', url: url.readers },
      { id: 'reading-writing-devices', title: 'أجهزة القراءة والكتابة', url: url.readWrite },
      { id: 'compare-devices', title: 'المقارنة بين الأجهزة', url: url.compare },
    ],
  },
  {
    id: 'iqraa-accessories',
    title: 'ملحقات الحبر الإلكتروني',
    url: url.casesCovers,
    children: [
      { id: 'cases-covers', title: 'الحافظات والأغطية', url: url.casesCovers },
      { id: 'stylus-nibs', title: 'الأقلام ورؤوس الاستبدال', url: url.pensNibs },
      { id: 'controllers', title: 'أجهزة التحكم', url: url.controllers },
    ],
  },
  {
    id: 'iqraa-focus',
    title: 'أدوات التركيز والإنتاجية',
    url: url.focusTimers,
    children: [
      { id: 'focus-timers', title: 'موقتات التركيز', url: url.focusTimers },
      { id: 'task-planners', title: 'مخططات المهام', url: url.taskPlanners },
      { id: 'organizers', title: 'دفاتر تنظيم', url: url.organizers },
    ],
  },
  {
    id: 'iqraa-bundles',
    title: 'الباقات والعروض',
    url: url.bundles,
    children: [
      { id: 'bundles', title: 'الباقات', url: url.bundles },
      { id: 'discounts', title: 'التخفيضات', url: url.discounts },
      { id: 'open-box', title: 'منتجات مفتوحة الصندوق', url: url.openBox },
    ],
  },
  {
    id: 'business',
    title: 'حلول المؤسسات B2B',
    url: url.business,
  },
  {
    id: 'blog',
    title: 'مدونة النصائح و التعليمات',
    url: url.blog,
  },
];
