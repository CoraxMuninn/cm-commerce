import { PAYMENT_METHODS } from "@/lib/constants/index";
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
  qty: z.number().int().nonnegative("Quantity must be positive number."),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required."),
  userId: z.string().nullable().optional(),
});

// schema for shipping address
export const shippingAddressSchema = z.object({
  fullname: z.string().min(3, "FullName must be at least 3 characters "),
  streetAddress: z
    .string()
    .min(3, "shippingAddress must be at least 3 characters "),
  city: z.string().min(3, "city must be at least 3 characters "),
  postalCode: z.string().min(3, "postalCode must be at least 3 characters "),
  country: z.string().min(3, "country must be at least 3 characters "),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});
