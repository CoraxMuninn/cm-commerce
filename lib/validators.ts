import { numberFormatToDecimal } from "@/lib/utils";
import z from "zod";

// Schema for inserting products

export const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(numberFormatToDecimal(Number(value))),
    "Prices must have exactly two places",
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least 1 image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  rating: z.coerce
    .number()
    .min(1)
    .max(5)
    .refine((n) => Number.isInteger(n * 10), "At most one decimal place"),
});

// schema for singing users in
export const singingImFormSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(4, "pass must be 4 characters"),
});

// schema for singing users in
export const singUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address."),
    password: z.string().min(4, "Password must be 4 characters"),
    confirmPassword: z.string().min(4, "Confirm pass must be 4 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Cart Schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "NAme is required"),
  slug: z.string().min(1, "Slug is required"),
  gty: z.number().int().nonnegative("Quantity must be positive number."),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shoppingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required."),
  userId: z.string().optional().nullable(),
});
