import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Valid phone number required"),
  address: z.string().min(5, "Street address required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  deliveryNotes: z.string().optional(),
});

export const productSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const couponSchema = z.object({
  code: z.string().min(1),
  type: z.enum(["fixed", "percentage"]),
  value: z.number().min(0.01),
  minOrderAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const imageFileSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "Image must be under 5MB"),
  type: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"], {
    errorMap: () => ({ message: "Allowed types: JPEG, PNG, WebP, AVIF" }),
  }),
});

export const imageUrlSchema = z.string().url("Must be a valid URL").startsWith("https", "Only HTTPS URLs are allowed");

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
