# ysf.shoop — Kanban Backlog

لوحة Kanban هذه مخصصة لتنفيذ متجر **ysf.shoop** كسوق إلكتروني للساعات والنظارات باستخدام Next.js وSupabase وVercel مع اعتماد الدفع عند الاستلام في المرحلة الحالية، وهو مسار مناسب لبناء متجر حديث مع واجهة شراء ولوحة إدارة وتدفق طلبات قابل للتوسع لاحقًا.[cite:54][cite:43][cite:81]

## طريقة الاستخدام

- انقل المهام من **Todo** إلى **In Progress** ثم **Done**.
- استخدم **Blocked** فقط عندما تكون المهمة متوقفة بسبب اعتماد مفقود أو قرار لم يُحسم بعد.
- لا تبدأ أي مهمة دفع أو إدارة قبل إغلاق مهام الـ schema وRLS والمصادقة، لأن هذه الطبقات تؤثر مباشرة على أمان الطلبات وسلامة البيانات.[cite:43][cite:56][cite:53]

## Legend

- **P0**: حرج ويجب إنجازه قبل أي توسع.
- **P1**: أساسي للإطلاق.
- **P2**: تحسينات بعد الإطلاق.
- **Depends on**: المهام التي يجب إنهاؤها أولًا.

## Todo

- [ ] **T01 — P0** إنشاء مشروع Next.js App Router + TypeScript، Depends on: لا شيء، Deliverable: مشروع أساسي يعمل محليًا.[cite:54]
- [ ] **T02 — P0** إعداد Tailwind وdesign tokens الأساسية، Depends on: T01، Deliverable: نظام ألوان ومسافات وخطوط أولي.
- [ ] **T03 — P0** إنشاء مشروع Supabase وربط env محليًا، Depends on: T01، Deliverable: اتصال قاعدة البيانات والتخزين.[cite:43]
- [ ] **T04 — P0** تصميم schema أولي: products, variants, categories, carts, orders, users، Depends on: T03، Deliverable: SQL schema v1.[cite:43][cite:56]
- [ ] **T05 — P0** تنفيذ migrations + seed data أولي، Depends on: T04، Deliverable: قاعدة بيانات قابلة للاختبار.
- [ ] **T06 — P0** إعداد Auth للمشرفين والمستخدمين، Depends on: T03، Deliverable: تسجيل دخول أساسي.
- [ ] **T07 — P0** تفعيل RLS على جميع الجداول العامة، Depends on: T04, T06، Deliverable: أمان أساسي للإنتاج.[cite:43][cite:56]
- [ ] **T08 — P0** إعداد layout عام: header, footer, nav, mobile nav، Depends on: T01, T02، Deliverable: هيكل واجهة موحد.
- [ ] **T09 — P0** إعداد routing الأساسي للصفحات، Depends on: T08، Deliverable: Home / Shop / Product / Cart / Checkout / Admin.
- [ ] **T10 — P0** تعريف أنواع البيانات TypeScript + طبقة lib/db، Depends on: T04، Deliverable: عقود بيانات موحدة.
- [ ] **T11 — P1** بناء الصفحة الرئيسية مع featured/new arrivals، Depends on: T08, T10، Deliverable: Home page.[cite:54]
- [ ] **T12 — P1** بناء صفحة المتجر مع pagination أو load more، Depends on: T09, T10، Deliverable: Shop listing.[cite:54]
- [ ] **T13 — P1** بناء التصنيفات والفلاتر عبر URL params، Depends on: T12، Deliverable: Category/filter UX.[cite:57]
- [ ] **T14 — P1** بناء product card reusable، Depends on: T02, T10، Deliverable: مكون موحد للمنتجات.
- [ ] **T15 — P1** بناء صفحة المنتج الكاملة، Depends on: T10, T14، Deliverable: PDP فيها gallery/specs/price.[cite:54]
- [ ] **T16 — P1** دعم variants مثل اللون/الموديل/المقاس، Depends on: T04, T15، Deliverable: اختيار variant صحيح.
- [ ] **T17 — P1** ربط الصور عبر Supabase Storage، Depends on: T03, T15، Deliverable: صور منتجات حقيقية.[cite:43]
- [ ] **T18 — P1** منطق stock availability على صفحة المنتج، Depends on: T04, T16، Deliverable: منع شراء غير المتاح.
- [ ] **T19 — P1** بحث أساسي في المنتجات، Depends on: T12, T10، Deliverable: search bar usable.
- [ ] **T20 — P1** إضافة related products / recently viewed، Depends on: T15، Deliverable: تحسين الاكتشاف.
- [ ] **T21 — P1** إنشاء cart model في DB أو hybrid state، Depends on: T04، Deliverable: بنية سلة واضحة.
- [ ] **T22 — P1** بناء add to cart / update quantity / remove item، Depends on: T15, T21، Deliverable: سلة تعمل.
- [ ] **T23 — P1** إنشاء صفحة cart مع subtotal وshipping placeholder، Depends on: T22، Deliverable: Cart page.
- [ ] **T24 — P1** إنشاء draft order قبل الدفع، Depends on: T04, T23، Deliverable: order draft.
- [ ] **T25 — P1** validation لأسعار المنتجات قبل إنشاء checkout، Depends on: T24، Deliverable: حماية من التلاعب.
- [ ] **T26 — P1** بناء account basics: profile + my orders، Depends on: T06, T24، Deliverable: حساب مستخدم أساسي.
- [ ] **- [ ] **T27 — P1** بناء نموذج Checkout خاص بالدفع عند الاستلام، Depends on: T24, T25، Deliverable: COD checkout form.[cite:81][cite:82]
- [ ] **T28 — P1** التحقق من السعر والمخزون والشحن على السيرفر قبل إنشاء الطلب، Depends on: T24, T27، Deliverable: order validation flow.[cite:81][cite:94]
- [ ] **T29 — P1** إنشاء صفحة تأكيد الطلب بعد إرسال COD، Depends on: T27، Deliverable: order confirmation page.
- [ ] **T30 — P1** تعريف حالات الطلب التشغيلية لـ COD، Depends on: T24، Deliverable: pending/confirmed/packed/shipped/delivered/refused/returned.[cite:85]
- [ ] **T31 — P1** تحديث حالة الطلب والمخزون حسب سير COD، Depends on: T30, T18، Deliverable: operational order flow.[cite:83][cite:85]
- [ ] **T32 — P1** بناء صفحة تتبع الطلب للعميل، Depends on: T31, T26، Deliverable: customer order tracking.[cite:83][cite:85]
- [ ] **T33 — P1** إضافة رسائل أو نقاط تواصل لتأكيد COD، Depends on: T29، Deliverable: confirmation communication rules.[cite:82]
- [ ] **T34 — P1** دعم رفض الطلب أو إرجاعه وتحديث المخزون، Depends on: T31، Deliverable: refusal/return handling.[cite:85]
- [ ] **T35 — P1** admin route guard، Depends on: T06, T07، Deliverable: حماية صفحات الإدارة.
- [ ] **T36 — P1** dashboard overview: orders, revenue, low stock، Depends on: T35, T32، Deliverable: لوحة مؤشرات.
- [ ] **T37 — P1** CRUD للمنتجات، Depends on: T35, T04، Deliverable: إدارة المنتجات.
- [ ] **T38 — P1** رفع وإدارة صور المنتجات، Depends on: T17, T37، Deliverable: media management.
- [ ] **T39 — P1** CRUD للتصنيفات، Depends on: T35, T04، Deliverable: categories management.
- [ ] **T40 — P1** إدارة variants والمخزون، Depends on: T37, T16، Deliverable: inventory editing.
- [ ] **T41 — P1** إدارة الطلبات وتحديث حالاتها، Depends on: T35, T31، Deliverable: orders operations.
- [ ] **T41A — P1** إدارة مناطق الشحن والأسعار حسب البلد، Depends on: T35, T43، Deliverable: country-based shipping rates.[cite:94]
- [ ] **T42 — P1** basic coupon management، Depends on: T04, T35، Deliverable: كوبونات أساسية.
- [ ] **T43 — P1** إدارة إعدادات المتجر العامة، Depends on: T35، Deliverable: اسم، شعار، شحن، سياسة.
- [ ] **T44 — P1** إعداد Vercel وربط GitHub، Depends on: T01، Deliverable: CI/CD أولي.[cite:54]
- [ ] **T45 — P1** إعداد متغيرات البيئة للإنتاج، Depends on: T44, T27, T03، Deliverable: env production.[cite:43]
- [ ] **T46 — P1** مراجعة RLS وسياسات الجداول، Depends on: T07, T35، Deliverable: أمان إنتاجي.[cite:43][cite:56]
- [ ] **T47 — P1** تقييد service role key للسيرفر فقط، Depends on: T45، Deliverable: عدم تسريب مفاتيح.[cite:43]
- [ ] **T48 — P1** تحسين SEO: metadata, sitemap, product schema، Depends on: T11, T12, T15، Deliverable: SEO readiness.
- [ ] **T49 — P1** تحسين الصور والأداء، Depends on: T17، Deliverable: سرعة أفضل.[cite:54]
- [ ] **T50 — P1** إعداد صفحات 404/empty/error states، Depends on: T08، Deliverable: UX أكثر نضجًا.
- [ ] **T51 — P1** اختبار responsive كامل، Depends on: T11-T43، Deliverable: جودة على الهاتف والكمبيوتر.
- [ ] **T52 — P1** إعداد emails أو رسائل الطلب والتأكيد، Depends on: T31, T33، Deliverable: رسائل تشغيلية.[cite:82]
- [ ] **T53 — P1** ربط الدومين والنشر النهائي، Depends on: T44-T52، Deliverable: إطلاق فعلي.[cite:43]
- [ ] **T54 — P2** wishlist / favorites، Depends on: T06, T15، Deliverable: حفظ المنتجات.
- [ ] **T55 — P2** reviews & ratings، Depends on: T06, T15، Deliverable: social proof.
- [ ] **T56 — P2** advanced analytics dashboard، Depends on: T36، Deliverable: تحليلات أعمق.
- [ ] **T57 — P2** abandoned cart tracking، Depends on: T21, T52، Deliverable: استرجاع عربات.
- [ ] **T58 — P2** multilingual support، Depends on: T08، Deliverable: دعم لغات.
- [ ] **T59 — P2** محرك بحث أقوى، Depends on: T19، Deliverable: بحث محسّن.
- [ ] **T60 — P2** coupons rules متقدمة، Depends on: T42، Deliverable: عروض متقدمة.
- [ ] **T61 — P2** shipping zones & rates، Depends on: T43, T24، Deliverable: شحن أدق.
- [ ] **T62 — P2** order timeline for customer، Depends on: T41, T26، Deliverable: تتبع العميل.
- [ ] **T63 — P2** audit logs للإدارة، Depends on: T35، Deliverable: مراقبة التعديلات.

## In Progress

- [ ] لا توجد مهام حالية قيد التنفيذ.

## Blocked

- [ ] لا توجد مهام محجوبة حاليًا.

## Done

- [ ] لا توجد مهام مكتملة بعد.

## Suggested First Sprint

ابدأ بهذا التسلسل لأنه يمثل المسار الحرج للوصول إلى MVP فعلي بسرعة وبدون إعادة عمل كبيرة لاحقًا.[cite:54][cite:43][cite:58]

1. T01
2. T02
3. T03
4. T04
5. T05
6. T06
7. T07
8. T08
9. T09
10. T10
11. T12
12. T14
13. T15
14. T16
15. T17
16. T21
17. T22
18. T23
19. T24
20. T25
21. T27
22. T28
23. T30
24. T31

## Definition of Done

- الكود يعمل محليًا وبدون أخطاء كسر أساسية.
- المهمة مربوطة ببيانات حقيقية أو seed data واضحة.
- تم اختبار السيناريو الرئيسي يدويًا مرة واحدة على الأقل.
- تم رفع التغيير إلى Git مع commit واضح.
- أي مهمة تخص الدفع أو الأمان لا تعتبر مكتملة قبل اختبار webhook أو policy فعليًا.[cite:58][cite:43][cite:56]

- [ ] **T64 — P2** نظام تقييمات وآراء العملاء، Depends on: T26, T15، Deliverable: reviews and ratings.[cite:90]
- [ ] **T65 — P2** نظام Wishlist، Depends on: T26, T15، Deliverable: saved products and wishlist management.[cite:87][cite:93]
- [ ] **T66 — P2** كوبونات وعروض متقدمة، Depends on: T42، Deliverable: advanced discount rules.[cite:67]
- [ ] **T67 — P2** دعم لغات متعددة، Depends on: T08, T11، Deliverable: locale-aware storefront and translated UI.[cite:86][cite:92]
- [ ] **T68 — P2** محرك بحث أقوى، Depends on: T19، Deliverable: improved search relevance.[cite:86]
- [ ] **T69 — P2** تحليلات مبيعات ورسوم بيانية، Depends on: T36, T65، Deliverable: analytics dashboard and charts.[cite:87][cite:93]
