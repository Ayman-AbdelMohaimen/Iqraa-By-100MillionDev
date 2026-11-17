import { memo, useState, type FormEvent } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';

interface SectorDevice {
  name: string;
  specs: string;
  image: string;
  tag: string;
}

const SECTOR_DEVICES: Record<string, SectorDevice[]> = {
  schools: [
    {
      name: 'BOOX Go 10.3',
      specs: 'شاشة حبر إلكتروني بيضاء بدقة 300PPI ووزن خفيف',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'مناسب للطلاب',
    },
    {
      name: 'BOOX Go Color 7',
      specs: 'شاشة ألوان Kaleido 3 محمولة لمطالعة الكتب التعليمية المصورة',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'ألوان حية',
    },
  ],
  universities: [
    {
      name: 'BOOX Note Air4 C',
      specs: 'شاشة 10.3 بوصة ملونة مع معالج BSR وكتابة بالقلم للأبحاث والمذكرات',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'مناسب للجامعات',
    },
    {
      name: 'BOOX Note Max',
      specs: 'شاشة عملاقة 13.3" A4 تماثل الورقة الحقيقية لمطالعة رسائل الماجستير والـ PDF',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'حجم A4 كامل',
    },
  ],
  centers: [
    {
      name: 'BOOX Palma 2 Pro',
      specs: 'قارئ بحجم الجيب مع كاميرا لمسح المستندات',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'حجم الجيب',
    },
    {
      name: 'BOOX Go 10.3',
      specs: 'شاشة بدون وهج لدعم القراءة والتركيز',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'شاشة بدون وهج',
    },
  ],
  companies: [
    {
      name: 'BOOX Tab Ultra C Pro',
      specs: 'معالج ثماني النواة مع كاميرا مسح ولوحة مفاتيح تاتش باد مدمجة للإنتاجية',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'محطة عمل متنقلة',
    },
    {
      name: 'BOOX Note Air4 C',
      specs: 'إدارة وتوقيع العقود الرقمية وتدوين محاضر مجالس الإدارة بسلاسة',
      image: 'https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp',
      tag: 'لرجال الأعمال',
    },
  ],
};

export const BusinessPage = memo(function BusinessPage() {
  const [activeTab, setActiveTab] = useState<'schools' | 'universities' | 'centers' | 'companies'>('schools');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    orgType: 'مدرسة',
    phone: '',
    email: '',
    products: '',
    quantity: '',
    notes: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `مرحباً منصة اقرأ، أود الاستفسار عن حلول المؤسسات وعروض الأسعار للكميات.\nالجهة: ${formData.orgName || 'مؤسسة'}\nمسؤول التواصل: ${formData.contactName || '-'}`
  );

  return (
    <div className="iqraa-business-page">
      {/* 1. Hero Section */}
      <section className="business-hero">
        <div className="business-hero__container">
          <div className="business-hero__content">
            <span className="business-hero__eyebrow">Business Solutions</span>
            <h1 className="business-hero__title">حلول المؤسسات</h1>
            <p className="business-hero__desc">
              أجهزة قراءة وكتابة إلكترونية تدعم التعليم والعمل وتناسب مختلف الجهات. نوفر باقات مخصصة وتوريد بالكميات مع الدعم الفني الكامل.
            </p>
            <div className="business-hero__actions">
              <a href="#quote-form" className="btn-primary-b2b">
                اطلب عرض سعر
              </a>
              <a
                href={`https://wa.me/966506558151?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-b2b"
              >
                تواصل معنا
              </a>
            </div>
          </div>
          <div className="business-hero__media">
            <img
              src="https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp"
              alt="حلول المؤسسات منصة اقرأ"
              className="business-hero__img"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip (5 Badges) */}
      <section className="business-props">
        <div className="business-props__container">
          <div className="business-prop-card">
            <span className="business-prop-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </span>
            <div className="business-prop-text">
              <strong>أسعار خاصة</strong>
              <span>للشراء بالكميات</span>
            </div>
          </div>

          <div className="business-prop-card">
            <span className="business-prop-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            </span>
            <div className="business-prop-text">
              <strong>دعم فني مخصص</strong>
              <span>للمؤسسات والجهات</span>
            </div>
          </div>

          <div className="business-prop-card">
            <span className="business-prop-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </span>
            <div className="business-prop-text">
              <strong>حلول مرنة</strong>
              <span>حسب احتياج الجهة</span>
            </div>
          </div>

          <div className="business-prop-card">
            <span className="business-prop-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </span>
            <div className="business-prop-text">
              <strong>شحن وتجهيز</strong>
              <span>لكافة مناطق المملكة</span>
            </div>
          </div>

          <div className="business-prop-card">
            <span className="business-prop-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/></svg>
            </span>
            <div className="business-prop-text">
              <strong>إمكانية التخصيص</strong>
              <span>والشراكات الرسمية</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Target Sectors (الفئات المستهدفة) */}
      <section className="business-sectors">
        <div className="business-section-header text-center">
          <h2 className="business-section-title">الفئات المستهدفة</h2>
          <p className="business-section-subtitle">نقدم حلولاً مصممة لتلبية احتياجات مختلف القطاعات</p>
        </div>

        <div className="business-sectors__grid">
          <div className="sector-card">
            <div className="sector-card__thumb">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
                alt="المدارس"
                loading="lazy"
              />
            </div>
            <div className="sector-card__body">
              <h3 className="sector-card__title">المدارس</h3>
              <p className="sector-card__desc">
                توفير المقررات والكتب المدرسية رقمياً مع شاشات صحية خالية من الضوء الأزرق لراحة الطلاب والمعلمين.
              </p>
              <a href="#quote-form" className="sector-card__link">
                تعرف أكثر &larr;
              </a>
            </div>
          </div>

          <div className="sector-card">
            <div className="sector-card__thumb">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                alt="الجامعات"
                loading="lazy"
              />
            </div>
            <div className="sector-card__body">
              <h3 className="sector-card__title">الجامعات</h3>
              <p className="sector-card__desc">
                أجهزة شاشات كبيرة 10.3" و 13.3" لقراءة الأبحاث والرسائل العلمية وتدوين الملاحظات والمحاضرات.
              </p>
              <a href="#quote-form" className="sector-card__link">
                تعرف أكثر &larr;
              </a>
            </div>
          </div>

          <div className="sector-card">
            <div className="sector-card__thumb">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"
                alt="المراكز التعليمية"
                loading="lazy"
              />
            </div>
            <div className="sector-card__body">
              <h3 className="sector-card__title">المراكز التعليمية ومراكز التربية الخاصة</h3>
              <p className="sector-card__desc">
                بيئة قراءة وكتابة إلكترونية خالية من المشتتات تدعم التركيز والتعلم المستمر لذوي الاحتياجات.
              </p>
              <a href="#quote-form" className="sector-card__link">
                تعرف أكثر &larr;
              </a>
            </div>
          </div>

          <div className="sector-card">
            <div className="sector-card__thumb">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                alt="الشركات"
                loading="lazy"
              />
            </div>
            <div className="sector-card__body">
              <h3 className="sector-card__title">الشركات</h3>
              <p className="sector-card__desc">
                تدوين الملاحظات وتوقيع المستندات إلكترونياً واجتماعات مجالس الإدارة دون الحاجة للورق.
              </p>
              <a href="#quote-form" className="sector-card__link">
                تعرف أكثر &larr;
              </a>
            </div>
          </div>

          <div className="sector-card">
            <div className="sector-card__thumb">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                alt="الجهات الحكومية"
                loading="lazy"
              />
            </div>
            <div className="sector-card__body">
              <h3 className="sector-card__title">الجهات الحكومية</h3>
              <p className="sector-card__desc">
                حلول رقمية متوافقة مع متطلبات الخصوصية والأمان ورقمنة بيئات العمل واللجان الوزارية.
              </p>
              <a href="#quote-form" className="sector-card__link">
                تعرف أكثر &larr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Showcase & Advantages */}
      <section className="business-dual">
        <div className="business-dual__container">
          {/* Right Column: استخدامات الأجهزة في المؤسسات */}
          <div className="business-dual__col">
            <h3 className="business-dual__title">استخدامات الأجهزة في المؤسسات</h3>
            <div className="business-usage-box">
              <div className="business-usage-img">
                <img
                  src="https://cdn.files.salla.network/other/1935517889/77ef714f-cec6-4030-b79e-1834d356604b-original.webp"
                  alt="استخدامات الأجهزة"
                  loading="lazy"
                />
              </div>
              <ul className="business-checklist">
                <li><span className="check-icon">&#10003;</span> تعزيز مهارات القراءة والكتابة</li>
                <li><span className="check-icon">&#10003;</span> توفير محتوى تعليمي وتدريبي رقمي</li>
                <li><span className="check-icon">&#10003;</span> تدوين الملاحظات في الاجتماعات والتدريب</li>
                <li><span className="check-icon">&#10003;</span> دعم الطلاب والموظفين بأحدث التقنيات</li>
                <li><span className="check-icon">&#10003;</span> تقليل استخدام وتكاليف الورق والطباعة</li>
                <li><span className="check-icon">&#10003;</span> مناسب للبرامج التعليمية والمهنية المعتمدة</li>
              </ul>
            </div>
          </div>

          {/* Left Column: لماذا تختار منصة اقرأ؟ */}
          <div className="business-dual__col">
            <h3 className="business-dual__title">لماذا تختار منصة اقرأ؟</h3>
            <div className="business-why-grid">
              <div className="why-card">
                <span className="why-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                <div>
                  <h4>أجهزة معتمدة وموثوقة</h4>
                  <p>وكيل وموزع رسمي لأجهزة BOOX العالمية مع ضمان سنتين.</p>
                </div>
              </div>

              <div className="why-card">
                <span className="why-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                </span>
                <div>
                  <h4>دعم فني وخدمة ما بعد البيع</h4>
                  <p>فريق فني عربي متخصص لمساعدة منسوبيكم وتدريبهم.</p>
                </div>
              </div>

              <div className="why-card">
                <span className="why-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </span>
                <div>
                  <h4>تجربة قراءة محسنة بالعربية</h4>
                  <p>دعم كامل للخطوط والمكتبات وتطبيقات المحتوى العربي.</p>
                </div>
              </div>

              <div className="why-card">
                <span className="why-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </span>
                <div>
                  <h4>حلول متكاملة للجهات</h4>
                  <p>تجهيز الأجهزة بالتطبيقات والملحقات المطلوبة مسبقاً.</p>
                </div>
              </div>

              <div className="why-card">
                <span className="why-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </span>
                <div>
                  <h4>مرونة في الطلب والتوريد</h4>
                  <p>عقود توريد مرنة وتسهيلات سداد للمؤسسات والجهات الحكومية.</p>
                </div>
              </div>

              <div className="why-card">
                <span className="why-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <div>
                  <h4>مناسب للتعليم والعمل</h4>
                  <p>تكامل تام مع بيئات Google Workspace وMicrosoft 365.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Devices per Sector */}
      <section className="business-showcase">
        <div className="business-section-header text-center">
          <h2 className="business-section-title">أجهزة مناسبة لكل قطاع</h2>
          <p className="business-section-subtitle">اختر القطاع لاستعراض الأجهزة الموصى بها</p>
        </div>

        <div className="business-tabs">
          <button
            type="button"
            className={`b2b-tab ${activeTab === 'schools' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('schools')}
          >
            للمدارس
          </button>
          <button
            type="button"
            className={`b2b-tab ${activeTab === 'universities' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('universities')}
          >
            للجامعات
          </button>
          <button
            type="button"
            className={`b2b-tab ${activeTab === 'centers' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('centers')}
          >
            للمراكز التعليمية
          </button>
          <button
            type="button"
            className={`b2b-tab ${activeTab === 'companies' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            للشركات
          </button>
        </div>

        <div className="business-devices-grid">
          {SECTOR_DEVICES[activeTab]?.map((device, idx) => (
            <div key={`${device.name}-${idx}`} className="b2b-device-card">
              <div className="b2b-device-card__thumb">
                <span className="b2b-device-tag">{device.tag}</span>
                <img src={device.image} alt={device.name} loading="lazy" />
              </div>
              <div className="b2b-device-card__info">
                <h4>{device.name}</h4>
                <p>{device.specs}</p>
                <a href="#quote-form" className="b2b-device-btn">
                  طلب تسعير لهذا الجهاز &larr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Quote Form Section */}
      <section id="quote-form" className="business-quote-section">
        <div className="business-quote-container">
          <div className="business-quote-header text-center">
            <h2 className="business-quote-title">اطلب عرض سعر</h2>
            <p className="business-quote-desc">سعداء بالتواصل معكم لتقديم عرض مخصص لاحتياجات جهتكم.</p>
          </div>

          {submitted ? (
            <div className="b2b-success-box">
              <span className="b2b-success-icon">&#10003;</span>
              <h3>تم إرسال طلبكم بنجاح!</h3>
              <p>شكراً لاهتمامكم. سيتواصل معكم ممثل مبيعات المؤسسات في منصة اقرأ خلال ساعات العمل الرسمية عبر رقم الجوال المسجل.</p>
              <button
                type="button"
                className="btn-primary-b2b mt-4"
                onClick={() => setSubmitted(false)}
              >
                إرسال طلب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="b2b-form">
              <div className="b2b-form-grid">
                <div className="b2b-form-group">
                  <label htmlFor="orgName">اسم الجهة / المؤسسة *</label>
                  <input
                    id="orgName"
                    type="text"
                    required
                    placeholder="مثال: مدارس الرياض الأهلية"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  />
                </div>

                <div className="b2b-form-group">
                  <label htmlFor="contactName">اسم مسؤول التواصل *</label>
                  <input
                    id="contactName"
                    type="text"
                    required
                    placeholder="الاسم الكامل"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>

                <div className="b2b-form-group">
                  <label htmlFor="orgType">نوع الجهة *</label>
                  <select
                    id="orgType"
                    value={formData.orgType}
                    onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                  >
                    <option value="مدرسة">مدرسة</option>
                    <option value="جامعة">جامعة</option>
                    <option value="مركز تعليمي / تدريبي">مركز تعليمي / تدريبي</option>
                    <option value="شركة خاصة">شركة خاصة</option>
                    <option value="جهة حكومية">جهة حكومية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div className="b2b-form-group">
                  <label htmlFor="phone">رقم الجوال *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="b2b-form-group">
                  <label htmlFor="email">البريد الإلكتروني *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@organization.sa"
                    dir="ltr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="b2b-form-group">
                  <label htmlFor="quantity">الكمية التقريبية المطلوبة *</label>
                  <input
                    id="quantity"
                    type="text"
                    required
                    placeholder="مثال: 20 جهاز، 50 جهاز..."
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>

                <div className="b2b-form-group col-span-full">
                  <label htmlFor="products">الأجهزة والملحقات المطلوبة</label>
                  <input
                    id="products"
                    type="text"
                    placeholder="مثال: BOOX Note Air4 C مع أقلام وحافظات مغناطيسية"
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  />
                </div>

                <div className="b2b-form-group col-span-full">
                  <label htmlFor="notes">ملاحظات أو متطلبات إضافية</label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="أي متطلبات تخص التجهيز المسبق أو الشحن أو التدريب..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="b2b-form-actions">
                <button type="submit" className="btn-primary-b2b">
                  إرسال الطلب
                </button>
                <a
                  href={`https://wa.me/966506558151?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-b2b"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  تواصل عبر واتساب
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
});
