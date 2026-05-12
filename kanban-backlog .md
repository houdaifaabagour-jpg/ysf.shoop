# ysf.shoop — Kanban Backlog

لوحة Kanban هذه مخصصة لتنفيذ متجر **ysf.shoop** كسوق إلكتروني للساعات والنظارات.

## Legend

- **P0**: حرج ويجب إنجازه قبل أي توسع.
- **P1**: أساسي للإطلاق.
- **P2**: تحسينات بعد الإطلاق.

## Todo

- [ ] **T48 — P1** تحسين SEO: metadata, sitemap, product schema، Deliverable: SEO readiness.
- [ ] **T49 — P1** تحسين الصور والأداء، Deliverable: سرعة أفضل.
- [ ] **T51 — P1** اختبار responsive كامل، Deliverable: جودة على الهاتف والكمبيوتر.
- [ ] **T52 — P1** إعداد emails أو رسائل الطلب والتأكيد، Deliverable: رسائل تشغيلية.
- [ ] **T53 — P1** ربط الدومين والنشر النهائي، Deliverable: إطلاق فعلي.
- [ ] **T57 — P2** abandoned cart tracking، Deliverable: استرجاع عربات.
- [ ] **T63 — P2** audit logs للإدارة، Deliverable: مراقبة التعديلات.

## In Progress

- [ ] لا توجد مهام حالية قيد التنفيذ.

## Blocked

- [ ] لا توجد مهام محجوبة حاليًا.

## Done — P0 (Setup & Infrastructure)

- [x] **T01** إنشاء مشروع Next.js App Router + TypeScript
- [x] **T02** إعداد Tailwind و design tokens الأساسية
- [x] **T03** إنشاء مشروع Supabase وربط env محليًا
- [x] **T04** تصميم schema أولي: products, variants, categories, carts, orders, users
- [x] **T05** تنفيذ migrations + seed data أولي
- [x] **T06** إعداد Auth للمشرفين والمستخدمين (Supabase Auth + SSR)
- [x] **T07** تفعيل RLS على جميع الجداول العامة (مع إصلاح recursion)
- [x] **T08** إعداد layout عام: header, footer, nav, mobile nav
- [x] **T09** إعداد routing الأساسي للصفحات
- [x] **T10** تعريف أنواع البيانات TypeScript + طبقة lib/db

## Done — P1 (Catalog)

- [x] **T11** بناء الصفحة الرئيسية مع featured/new arrivals
- [x] **T12** بناء صفحة المتجر مع pagination
- [x] **T13** بناء التصنيفات والفلاتر عبر URL params
- [x] **T14** بناء product card reusable
- [x] **T15** بناء صفحة المنتج الكاملة (gallery, specs, price, variants)
- [x] **T16** دعم variants (اللون/الموديل/المقاس)
- [x] **T17** ربط الصور عبر Supabase Storage
- [x] **T18** منطق stock availability على صفحة المنتج
- [x] **T19** بحث أساسي في المنتجات (API route + search page)
- [x] **T20** إضافة related products / recently viewed

## Done — P1 (Cart & Checkout)

- [x] **T21** إنشاء cart model في DB + server actions
- [x] **T22** بناء add to cart / update quantity / remove item
- [x] **T23** إنشاء صفحة cart مع subtotal و shipping
- [x] **T24** إنشاء draft order قبل الدفع
- [x] **T25** validation لأسعار المنتجات قبل إنشاء checkout
- [x] **T27** بناء نموذج Checkout COD (مع locale-aware form)
- [x] **T28** التحقق من السعر والمخزون والشحن على السيرفر
- [x] **T29** إنشاء صفحة تأكيد الطلب مع orderId
- [x] **T30** تعريف حالات الطلب التشغيلية لـ COD
- [x] **T31** تحديث حالة الطلب والمخزون حسب سير COD
- [x] **T32** بناء صفحة تتبع الطلب /track-order/[orderId] مع timeline
- [x] **T33** إضافة نقاط تواصل لتأكيد COD
- [x] **T34** دعم رفض الطلب أو إرجاعه وتحديث المخزون

## Done — P1 (Account & Admin)

- [x] **T26** بناء account basics: profile + my orders (Supabase data)
- [x] **T35** admin route guard (server-side role check)
- [x] **T36** dashboard overview: orders, revenue, low stock (charts + stats)
- [x] **T37** CRUD للمنتجات
- [x] **T38** رفع وإدارة صور المنتجات
- [x] **T39** CRUD للتصنيفات
- [x] **T40** إدارة variants والمخزون
- [x] **T41** إدارة الطلبات وتحديث حالاتها
- [x] **T41A** إدارة مناطق الشحن والأسعار حسب البلد
- [x] **T42** basic coupon management + RPC increment_coupon_usage
- [x] **T43** إدارة إعدادات المتجر العامة

## Done — P1 (Deployment & Security)

- [x] **T44** إعداد Vercel وربط GitHub (CI/CD)
- [x] **T45** إعداد متغيرات البيئة للإنتاج
- [x] **T46** مراجعة RLS وسياسات الجداول
- [x] **T47** تقييد service role key للسيرفر فقط
- [x] **T50** إعداد صفحات 404/empty/error states

## Done — P2 (Features)

- [x] **T54** wishlist / favorites (add/remove/toggle + count badge)
- [x] **T55** reviews & ratings (submit, approve, display, star rating)
- [x] **T56** advanced analytics dashboard (sales by month, top products, etc.)
- [x] **T58** multilingual support (EN, AR, FR, ES — 225 keys لكل لغة)
- [x] **T59** محرك بحث أقوى (API route + debounced search page)
- [x] **T60** coupons rules متقدمة (fixed/percentage, date window, usage limit)
- [x] **T61** shipping zones & rates (country-based في store_settings)
- [x] **T62** order timeline for customer (tracking page + status flow)
- [x] **T64** نظام تقييمات وآراء العملاء
- [x] **T65** نظام Wishlist
- [x] **T66** كوبونات وعروض متقدمة
- [x] **T67** دعم لغات متعددة (RTL + 4 لغات)
- [x] **T68** محرك بحث أقوى
- [x] **T69** تحليلات مبيعات ورسوم بيانية

## Definition of Done

- الكود يعمل محليًا وبدون أخطاء كسر أساسية.
- المهمة مربوطة ببيانات حقيقية أو seed data واضحة.
- تم اختبار السيناريو الرئيسي يدويًا مرة واحدة على الأقل.
- تم رفع التغيير إلى Git مع commit واضح.
