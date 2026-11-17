import { memo, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { ProductMetadata } from './ProductMetadata';

export interface ProductEnhancedSectionsProps {
  product: Product;
  reviewCount?: number;
  /** Controlled tab, used by the "check compatibility" link above the buy box. */
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const ProductEnhancedSections = memo(function ProductEnhancedSections({
  product,
  reviewCount = 23,
  activeTab: controlledTab,
  onSelectTab,
}: ProductEnhancedSectionsProps) {
  const [internalTab, setInternalTab] = useState<string>('overview');
  const activeTab = controlledTab ?? internalTab;

  const handleTabChange = (tab: string) => {
    if (controlledTab === undefined) setInternalTab(tab);
    onSelectTab?.(tab);
    if (tab === 'reviews') {
      const el = document.querySelector('salla-comments') || document.querySelector('.s-block--comments');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAccessory = useMemo(() => {
    const name = (product.name || '').toLowerCase();
    return (
      name.includes('قلم') ||
      name.includes('حافظة') ||
      name.includes('كفر') ||
      name.includes('رأس') ||
      name.includes('شاشة حماية') ||
      name.includes('كابل') ||
      name.includes('لوحة مفاتيح') ||
      name.includes('case') ||
      name.includes('pen') ||
      name.includes('nib') ||
      name.includes('cover')
    );
  }, [product.name]);

  // Dynamic Highlights based on product name/type
  const highlights = useMemo(() => {
    if (isAccessory) {
      return [
        {
          title: 'خامات ومقاسات واضحة',
          subtitle: 'راجع المواصفات قبل الطلب',
          icon: 'shield',
        },
        {
          title: 'توافق حسب الطراز',
          subtitle: 'راجع قائمة الأجهزة المتوافقة',
          icon: 'check',
        },
        {
          title: 'حماية وتجربة متكاملة',
          subtitle: 'حماية الشاشة وسلاسة الاستخدام',
          icon: 'star',
        },
        {
          title: 'ضمان رسمي أصلي',
          subtitle: 'معتمد من الوكيل الرسمي',
          icon: 'award',
        },
      ];
    }

    const isColor = (product.name || '').includes('Color') || (product.name || '').includes('ملون') || (product.name || '').includes('C');
    const isPalma = (product.name || '').toLowerCase().includes('palma');
    const isNote = (product.name || '').toLowerCase().includes('note');
    const isTab = (product.name || '').toLowerCase().includes('tab');

    return [
      {
        title: 'أداء سريع ومعالج قوي',
        subtitle: isTab ? 'معالج متقدم ثماني النواة مع BSR' : 'معالج سلس لتصفح مستندات الـ PDF الثقيلة',
        icon: 'cpu',
      },
      {
        title: 'Android 16 مع دعم Google',
        subtitle: 'تحقق من توافق تطبيقاتك قبل الشراء',
        icon: 'android',
      },
      {
        title: isPalma ? 'حجم مدمج للجيب 6.13"' : 'BOOX Pen3 مع كتابة طبيعية',
        subtitle: isPalma ? 'سهولة الحمل والتنقل في أي مكان' : 'حساسية ضغط 4096 مستوى للكتابة والملاحظات',
        icon: isPalma ? 'mobile' : 'pen',
      },
      {
        title: isColor ? 'شاشة ملونة Kaleido 3' : 'شاشة Carta 1200 النقية',
        subtitle: isColor ? 'شاشة ملونة بدقة 300PPI' : 'شاشة Carta بدقة 300PPI، راجع المواصفات',
        icon: 'screen',
      },
    ];
  }, [product.name, isAccessory]);

  // Target audience checklist
  const audienceList = useMemo(() => {
    return [
      'الطلاب والباحثون والمحاضرون',
      'المهنيون والمدراء الذين يدونون الملاحظات اليومية',
      'محبو القراءة والمحتوى الرقمي الطويل',
      'من يبحث عن جهاز واحد متكامل للقراءة والكتابة والإنتاجية',
    ];
  }, []);

  // Box contents
  const boxContents = useMemo(() => {
    if (isAccessory) {
      return [
        'المنتج الأصلي المعتمد',
        'دليل الاستخدام السريع',
        'بطاقة الضمان الرسمي',
      ];
    }
    return [
      'جهاز ' + product.name,
      'قلم الكتابة الذكي BOOX Stylus Pen',
      'كابل الشحن ونقل البيانات السريع USB-C',
      'دليل البدء السريع وإرشادات التشغيل بالعربية',
      'بطاقة الضمان الرسمي المعتمد من الوكيل',
    ];
  }, [product.name, isAccessory]);

  const totalReviews = product.rating?.count ?? reviewCount;

  // One source of truth for the headers: the panels below match these ids, and
  // the two device-only tabs disappear for accessories instead of leading to an
  // empty panel.
  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'نظرة عامة' },
      { id: 'specs', label: 'المواصفات' },
      { id: 'box', label: 'ماذا في الصندوق؟' },
      ...(!isAccessory
        ? [
            { id: 'accessories', label: 'الملحقات المتوافقة' },
            { id: 'comparison', label: 'المقارنة' },
          ]
        : []),
      { id: 'reviews', label: `المراجعات (${totalReviews})` },
    ],
    [isAccessory, totalReviews]
  );

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** WAI-ARIA tab keyboard pattern: arrows move between tabs, Home/End jump. */
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;

    event.preventDefault();
    handleTabChange(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div id="product-compatibility" className="iqraa-pdp-sections mt-12 w-full">
      {/* 1. Trust Badges Strip (4 Pillars) */}
      <div className="pdp-trust-strip mb-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:divide-x sm:divide-gray-100 rtl:sm:divide-x-reverse">
          <div className="pdp-trust-item flex flex-col items-center justify-center p-2">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-iqraa-ivory text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </span>
            <strong className="text-sm font-bold text-gray-900">شحن مجاني</strong>
            <span className="text-xs text-gray-500">على الأجهزة المؤهلة</span>
          </div>

          <div className="pdp-trust-item flex flex-col items-center justify-center p-2">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-iqraa-ivory text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <strong className="text-sm font-bold text-gray-900">ضمان رسمي</strong>
            <span className="text-xs text-gray-500">من الوكيل المعتمد</span>
          </div>

          <div className="pdp-trust-item flex flex-col items-center justify-center p-2">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-iqraa-ivory text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            </span>
            <strong className="text-sm font-bold text-gray-900">دعم فني عربي</strong>
            <span className="text-xs text-gray-500">قبل وبعد الشراء</span>
          </div>

          <div className="pdp-trust-item flex flex-col items-center justify-center p-2">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-iqraa-ivory text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <strong className="text-sm font-bold text-gray-900">دفع آمن</strong>
            <span className="text-xs text-gray-500">ومتعدد الوسائل</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs Bar */}
      <div
        className="pdp-tabs-nav mb-8 flex border-b border-gray-200 overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="تبويبات تفاصيل المنتج"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              id={`pdp-tab-${tab.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`pdp-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`pdp-tab-btn relative text-sm font-bold whitespace-nowrap transition-colors ${
                selected ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {selected && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      <div className="pdp-tab-content">
        {/* TAB 1: نظرة عامة (Overview) */}
        {activeTab === 'overview' && (
          <div
            className="pdp-overview-view space-y-10"
            id="pdp-panel-overview"
            role="tabpanel"
            aria-labelledby="pdp-tab-overview"
            tabIndex={0}
          >
            {/* Highlights Section */}
            <section className="pdp-highlights">
              <h2 className="mb-6 text-xl font-bold text-gray-900">أبرز المميزات</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-iqraa-ivory text-primary">
                      {item.icon === 'cpu' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
                      )}
                      {item.icon === 'android' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                      )}
                      {item.icon === 'pen' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                      )}
                      {item.icon === 'screen' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      )}
                      {item.icon === 'mobile' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                      )}
                      {item.icon === 'shield' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      )}
                      {item.icon === 'check' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {item.icon === 'star' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      )}
                      {item.icon === 'award' && (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                      )}
                    </div>
                    <strong className="text-base font-bold text-gray-900">{item.title}</strong>
                    <span className="mt-1 text-xs text-gray-500 leading-relaxed">{item.subtitle}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Split Row: "مناسب لمن؟" Checklist & Benefit Box */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Checklist: مناسب لمن؟ */}
              <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <h3 className="mb-6 text-xl font-bold text-gray-900">مناسب لمن؟</h3>
                <ul className="space-y-4">
                  {audienceList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefit Box with Image */}
              <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:flex-row">
                <div className="w-full md:w-1/2 p-7 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    قراءة، كتابة، وإنتاجية في جهاز واحد
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-600">
                    شاشة ملونة عالية الوضوح، مع دعم كامل لتطبيقات Android، مما يتيح لك قراءة الكتب، تدوين الملاحظات، وممارسة مهامك اليومية بكل سهولة.
                  </p>
                </div>
                <div className="w-full md:w-1/2 bg-gray-50 min-h-[220px]">
                  <img
                    src="https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp"
                    alt="BOOX in use"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* Comparison Banner */}
            {!isAccessory && (
              <section className="pdp-comparison-banner flex flex-col items-center justify-between gap-6 rounded-2xl bg-iqraa-ivory border border-iqraa-lavender p-6 sm:flex-row sm:p-8">
                <div className="flex items-center gap-5">
                  <div className="hidden h-20 w-32 shrink-0 items-center justify-center sm:flex">
                    <img
                      src="https://cdn.files.salla.network/other/1935517889/720a8394-d7f2-4fc4-a396-5aeb3690b256-original.webp"
                      alt="مقارنة أجهزة بوكس"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">قارن بين أجهزة BOOX</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      اكتشف الفروق بين الموديلات واختر الأنسب لأسلوب استخدامك.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('comparison')}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-primary bg-white px-6 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white shadow-sm"
                >
                  عرض المقارنة
                </button>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: المواصفات (Specifications) */}
        {activeTab === 'specs' && (
          <div
            className="pdp-specs-view rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            id="pdp-panel-specs"
            role="tabpanel"
            aria-labelledby="pdp-tab-specs"
            tabIndex={0}
          >
            <h3 className="mb-6 text-xl font-bold text-gray-900">المواصفات الفنية الكاملة</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="w-1/3 py-3.5 font-bold text-gray-800">اسم المنتج</td>
                    <td className="py-3.5 text-gray-600">{product.name}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">العلامة التجارية</td>
                    <td className="py-3.5 text-gray-600">{product.brand?.name || 'BOOX (أونيكس بوكس)'}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">نوع الشاشة</td>
                    <td className="py-3.5 text-gray-600">E-Ink Kaleido 3 / Carta 1200 حبر إلكتروني عالي الدقة</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">نظام التشغيل</td>
                    <td className="py-3.5 text-gray-600">نظام Android مفتوح مع دعم متجر Google Play</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">دعم القلم والكتابة</td>
                    <td className="py-3.5 text-gray-600">يدعم قلم Wacom المتقدم مع استجابة فورية وحساسية 4096 مستوى</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">الإضاءة الأمامية</td>
                    <td className="py-3.5 text-gray-600">إضاءة مدمجة مع تعديل درجات الدفء والسطوع (Moon Light 2)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">الاتصال والمنافذ</td>
                    <td className="py-3.5 text-gray-600">Wi-Fi ثنائي النطاق (2.4GHz + 5GHz) + Bluetooth 5.0 + USB-C OTG</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-800">اللغات المدعومة</td>
                    <td className="py-3.5 text-gray-600">دعم كامل ومحسّن للغة العربية قراءةً وكتابةً وتصفحاً</td>
                  </tr>
                  {product.sku && (
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-gray-800">رمز المنتج (SKU)</td>
                      <td className="py-3.5 text-gray-600">{product.sku}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {product.has_metadata && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <ProductMetadata />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ماذا في الصندوق؟ (What's in the box?) */}
        {activeTab === 'box' && (
          <div
            className="pdp-box-view rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            id="pdp-panel-box"
            role="tabpanel"
            aria-labelledby="pdp-tab-box"
            tabIndex={0}
          >
            <h3 className="mb-6 text-xl font-bold text-gray-900">محتويات العبوة الأصلية</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boxContents.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition-all hover:bg-white hover:shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-iqraa-lavender text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: الملحقات المتوافقة (Accessories) */}
        {activeTab === 'accessories' && (
          <div
            className="pdp-accessories-view rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            id="pdp-panel-accessories"
            role="tabpanel"
            aria-labelledby="pdp-tab-accessories"
            tabIndex={0}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">الملحقات المتوافقة مع هذا الجهاز</h3>
                <p className="mt-1 text-sm text-gray-500">
                  حافظات ذكية، رؤوس أقلام إضافية، وشواحن سريعة لتعزيز تجربة الاستخدام.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm">
                <img
                  src="https://cdn.salla.sa/WZNRy/41aefe65-2eb9-4a3b-a241-d448cdb97f92-1000x1000-jNAHmJD9Ki1X7cKOMPIyVA3N1gpd0Ifl2TiqeVog.jpg"
                  alt="حافظة مغناطيسية"
                  className="mx-auto h-36 w-36 object-contain mb-3"
                />
                <h4 className="text-sm font-bold text-gray-800">حافظة ذكية مغناطيسية</h4>
                <span className="mt-1 block text-sm font-bold text-primary">189 ر.س</span>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm">
                <img
                  src="https://cdn.salla.sa/WZNRy/bfe83fb2-ca01-4664-b692-0fa9bbea5153-1000x1000-0ZELVvaOhc8ThQKPdUlq2XrO7y5R4LJq2qCn4Hv6.jpg"
                  alt="رؤوس أقلام استبدال"
                  className="mx-auto h-36 w-36 object-contain mb-3"
                />
                <h4 className="text-sm font-bold text-gray-800">رؤوس استبدال Wacom (طقم 5 قطع)</h4>
                <span className="mt-1 block text-sm font-bold text-primary">99 ر.س</span>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm">
                <img
                  src="https://cdn.salla.sa/WZNRy/bnT0UNz6FoIsg1CBUuIE3KCq8AS5B8DWjGTcSi9U.jpg"
                  alt="لوحة مفاتيح بلوتوث"
                  className="mx-auto h-36 w-36 object-contain mb-3"
                />
                <h4 className="text-sm font-bold text-gray-800">لوحة مفاتيح خفيفة مع تاتش باد</h4>
                <span className="mt-1 block text-sm font-bold text-primary">249 ر.س</span>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm">
                <img
                  src="https://cdn.files.salla.network/other/1935517889/720a8394-d7f2-4fc4-a396-5aeb3690b256-original.webp"
                  alt="شاحن سريع"
                  className="mx-auto h-36 w-36 object-contain mb-3"
                />
                <h4 className="text-sm font-bold text-gray-800">شاحن سريع GaN مع كابل تايب سي</h4>
                <span className="mt-1 block text-sm font-bold text-primary">129 ر.س</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: المقارنة (Comparison) */}
        {activeTab === 'comparison' && (
          <div
            className="pdp-comparison-view rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            id="pdp-panel-comparison"
            role="tabpanel"
            aria-labelledby="pdp-tab-comparison"
            tabIndex={0}
          >
            <h3 className="mb-6 text-xl font-bold text-gray-900">مقارنة موديلات أجهزة BOOX</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="py-4 px-4 text-start font-bold text-gray-800">الميزة / المواصفة</th>
                    <th className="py-4 px-4 font-bold text-primary">Note Air4 C / Air6 C</th>
                    <th className="py-4 px-4 font-bold text-gray-800">BOOX Go 10.3</th>
                    <th className="py-4 px-4 font-bold text-gray-800">BOOX Palma 2 Pro</th>
                    <th className="py-4 px-4 font-bold text-gray-800">Tab Ultra C Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3.5 px-4 text-start font-bold text-gray-700">حجم الشاشة</td>
                    <td className="py-3.5 px-4 font-bold text-primary">10.3 إنش</td>
                    <td className="py-3.5 px-4 text-gray-600">10.3 إنش</td>
                    <td className="py-3.5 px-4 text-gray-600">6.13 إنش (جيب)</td>
                    <td className="py-3.5 px-4 text-gray-600">10.3 إنش</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-start font-bold text-gray-700">تقنية الشاشة</td>
                    <td className="py-3.5 px-4 font-bold text-primary">Kaleido 3 ملونة</td>
                    <td className="py-3.5 px-4 text-gray-600">Carta 1200 (أبيض وأسود)</td>
                    <td className="py-3.5 px-4 text-gray-600">Carta 1200 عالية الدقة</td>
                    <td className="py-3.5 px-4 text-gray-600">Kaleido 3 ملونة + BSR</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-start font-bold text-gray-700">الكتابة بالقلم</td>
                    <td className="py-3.5 px-4 font-bold text-primary">نعم (قلم مغناطيسي)</td>
                    <td className="py-3.5 px-4 text-gray-600">نعم (4096 مستوى ضغط)</td>
                    <td className="py-3.5 px-4 text-gray-600">قراءة وتصفح فقط</td>
                    <td className="py-3.5 px-4 text-gray-600">نعم + كيبورد اختياري</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-start font-bold text-gray-700">أفضل استخدام</td>
                    <td className="py-3.5 px-4 font-bold text-primary">دراسة، قراءة وكتابة ملونة</td>
                    <td className="py-3.5 px-4 text-gray-600">قراءة كتب وملاحظات ورقية</td>
                    <td className="py-3.5 px-4 text-gray-600">قراءة يومية وتنقل سريع</td>
                    <td className="py-3.5 px-4 text-gray-600">إنتاجية وتطبيقات ثقيلة</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: المراجعات (Reviews) */}
        {activeTab === 'reviews' && (
          <div
            className="pdp-reviews-view rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            id="pdp-panel-reviews"
            role="tabpanel"
            aria-labelledby="pdp-tab-reviews"
            tabIndex={0}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">تقييمات ومراجعات العملاء</h3>
                <p className="mt-1 text-sm text-gray-500">
                  آراء وتجارب حقيقية من مشتري أجهزة BOOX عبر منصة اقرأ.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-iqraa-ivory p-6 text-center">
              <span className="text-3xl font-black text-primary">4.8</span>
              <span className="text-sm font-bold text-gray-700 block mt-1">من 5 نجوم</span>
              <span className="text-xs text-gray-500 block mt-1">بناءً على {totalReviews} تقييم موثق</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
