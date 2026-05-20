export interface CategoryData {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
}

export const categories: Record<string, CategoryData> = {
  watches: { nameAr: "الساعات", nameEn: "Watches", descriptionAr: "مجموعة فاخرة من الساعات العالمية", descriptionEn: "A luxury collection of international watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" },
  glasses: { nameAr: "النظارات", nameEn: "Glasses", descriptionAr: "نظارات أنيقة من أفضل العلامات", descriptionEn: "Elegant eyewear from top brands", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600" },
  sunglasses: { nameAr: "نظارات شمسية", nameEn: "Sunglasses", descriptionAr: "نظارات شمسية فاخرة للحماية والأناقة", descriptionEn: "Luxury sunglasses for protection and style", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600" },
};
