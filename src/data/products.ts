export interface ProductData {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  descriptionAr: string;
  descriptionEn: string;
  warranty: string;
  stock: number;
  specs: Record<string, string>;
  images: string[];
}

export const products: ProductData[] = [
  { id: 1, slug: "rolex-classic", nameAr: "ساعة رولكس كلاسيك", nameEn: "Rolex Classic", price: 4500, category: "watches", descriptionAr: "ساعة رولكس كلاسيكية أنيقة مصنوعة من الفولاذ المقاوم للصدأ.", descriptionEn: "Elegant classic Rolex watch made of stainless steel.", warranty: "1 year", stock: 5, specs: { brand: "Rolex", model: "Submariner", material: "Stainless steel", diameter: "40mm", waterResist: "300m" }, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800"] },
  { id: 2, slug: "rayban-wayfarer", nameAr: "نظارة راي بان", nameEn: "Ray-Ban Wayfarer", price: 850, category: "glasses", descriptionAr: "نظارة راي بان شهيرة بتصميم كلاسيكي.", descriptionEn: "Famous Ray-Ban sunglasses with classic design.", warranty: "6 months", stock: 12, specs: { brand: "Ray-Ban", model: "Wayfarer", material: "Plastic", width: "54mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800"] },
  { id: 3, slug: "omega-seamaster", nameAr: "ساعة أوميغا", nameEn: "Omega Seamaster", price: 6200, category: "watches", descriptionAr: "ساعة أوميغا سي ماستر للمحترفين.", descriptionEn: "Professional Omega Seamaster for diving.", warranty: "2 years", stock: 3, specs: { brand: "Omega", model: "Seamaster", material: "Titanium", diameter: "42mm", waterResist: "600m" }, images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800", "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800"] },
  { id: 4, slug: "gucci-sunglasses", nameAr: "نظارات شمسية غوتشي", nameEn: "Gucci Sunglasses", price: 1200, category: "sunglasses", descriptionAr: "نظارات غوتشي الشمسية الفاخرة.", descriptionEn: "Luxury Gucci sunglasses.", warranty: "1 year", stock: 8, specs: { brand: "Gucci", model: "GG", material: "Acetate", width: "56mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", "https://images.unsplash.com/photo-1574258495973-f8263bc45e47?w=800"] },
  { id: 5, slug: "casio-g-shock", nameAr: "ساعة كاسيو", nameEn: "Casio G-Shock", price: 450, category: "watches", descriptionAr: "ساعة كاسيو قوية مقاومة للصدمات.", descriptionEn: "Strong shock-resistant Casio watch.", warranty: "1 year", stock: 20, specs: { brand: "Casio", model: "G-Shock", material: "Resin", diameter: "45mm", waterResist: "200m" }, images: ["https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800", "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"] },
  { id: 6, slug: "versace-eyewear", nameAr: "نظارة فيرساتشي", nameEn: "Versace Eyewear", price: 950, category: "glasses", descriptionAr: "نظارة فيرساتشي الأنيقة.", descriptionEn: "Elegant Versace eyewear.", warranty: "6 months", stock: 10, specs: { brand: "Versace", model: "Medusa", material: "Plastic", width: "55mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=800", "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=800"] },
  { id: 7, slug: "tissot-le-locle", nameAr: "ساعة تيسو", nameEn: "Tissot Le Locle", price: 1800, category: "watches", descriptionAr: "ساعة تيسو سويسرية كلاسيكية.", descriptionEn: "Classic Swiss Tissot watch.", warranty: "2 years", stock: 6, specs: { brand: "Tissot", model: "Le Locle", material: "Steel", diameter: "39mm", waterResist: "100m" }, images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800", "https://images.unsplash.com/photo-1455541504462-57ebb2a9cec2?w=800"] },
  { id: 8, slug: "prada-sunglasses", nameAr: "نظارات شمسية برادا", nameEn: "Prada Sunglasses", price: 1500, category: "sunglasses", descriptionAr: "نظارات برادا الشمسية الفاخرة.", descriptionEn: "Luxury Prada sunglasses.", warranty: "1 year", stock: 7, specs: { brand: "Prada", model: "Symbole", material: "Acetate", width: "57mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1579303974871-d5d8e3d7b2dd?w=800", "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800"] },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
