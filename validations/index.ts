import { z } from "zod";

// AUTH

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required!"),
  lastName: z.string().min(2, "Last name is required!"),
  email: z.email("Invalid email!").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email!").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required!"),
});

export const forgotSchema = z.object({
  email: z.email("Invalid email!").transform((email) => email.toLowerCase()),
});

export const resetSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type GoogleAuthSchemaType = z.infer<typeof googleAuthSchema>;
export type ForgotSchemaType = z.infer<typeof forgotSchema>;
export type ResetSchemaType = z.infer<typeof resetSchema>;

// PROFILE

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),

  lastName: z.string().trim().min(2, "Last name is required"),

  email: z.email("Invalid email address"),

  primaryPhone: z
    .string()
    .regex(/^\d*$/, "Phone number must contain only numbers")
    .optional(),

  secondaryPhone: z
    .string()
    .regex(/^\d*$/, "Phone number must contain only numbers")
    .optional(),

  street: z.string().trim().optional(),

  postalCode: z.string().trim().optional(),

  city: z.string().trim().optional(),

  country: z.string().trim().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    error: "Passwords must be different!",
    path: ["newPassword"],
  });

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

// EXTRAS

export const extraSchema = z.object({
  name: z.string().trim().min(2, "Extra name must ne 2 character at least"),
});

export type ExtraSchemaType = z.infer<typeof extraSchema>;

// SIZES

export const SizeSchema = z.object({
  name: z.string().trim().min(2, "Size name must ne 2 character at least"),
});

export type SizeSchemaType = z.infer<typeof SizeSchema>;

// Categories
export const createCategorySchema = z.object({
  name: z.string().trim().min(3, "Category name must be 3 character at least"),
  extraIds: z.preprocess((value) => {
    if (typeof value === "string") {
      return JSON.parse(value);
    }
    return value;
  }, z.array(z.uuid()).optional()),

  sizeIds: z.preprocess((value) => {
    if (typeof value === "string") {
      return JSON.parse(value);
    }
    return value;
  }, z.array(z.uuid()).optional()),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(3, "Category name must be 3 character at least"),
  sizeIds: z.preprocess((value) => {
    if (typeof value === "string") {
      return JSON.parse(value);
    }
    return value;
  }, z.array(z.uuid()).optional()),
  extraIds: z.preprocess((value) => {
    if (typeof value === "string") {
      return JSON.parse(value);
    }
    return value;
  }, z.array(z.uuid()).optional()),
});
export type CreateCategoryType = z.infer<typeof createCategorySchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;

// ADMIN
export const updateUserProfileSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),

  lastName: z.string().trim().min(2, "Last name is required"),

  email: z.email("Invalid email address"),

  primaryPhone: z
    .string()
    .regex(/^\d*$/, "Phone number must contain only numbers")
    .optional(),

  secondaryPhone: z
    .string()
    .regex(/^\d*$/, "Phone number must contain only numbers")
    .optional(),

  street: z.string().trim().optional(),

  postalCode: z.string().trim().optional(),

  city: z.string().trim().optional(),

  country: z.string().trim().optional(),
  isAdmin: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }, z.boolean()),
});

export type UpdateUserProfileType = z.infer<typeof updateUserProfileSchema>;

// PRODUCT
const productSizeSchema = z.object({
  id: z.string().min(1, "Size id is required"),

  price: z.coerce
    .number("Price must be a valid number")
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),
});

const productExtraSchema = z.object({
  id: z.string().min(1, "Extra id is required"),

  price: z.coerce
    .number("Price must be a valid number")
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),
});

export const ProductSchema = z.object({
  name: z.string().trim().min(4, "Name must be 4 characters at least!"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be between 20 and 240 characters!")
    .max(240, "Description must be between 20 and 240 characters!"),

  price: z.coerce
    .number("Price must be a valid number")
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),

  discount: z.coerce
    .number("Discount must be a valid number")
    .min(0, "Discount must be greater than or equal 0")
    .max(100, "Discount cannot be greater than 100"),

  category: z.string().min(1, "Please select a category"),

  sizes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }, z.array(productSizeSchema).min(1, "At least one size is required").optional()),

  extras: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }, z.array(productExtraSchema).min(1, "At least one extra is required").optional()),
  isAvailable: z.preprocess((value) => value === "true", z.boolean()),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

export const productQuerySchema = z.object({
  category: z.string().optional(),
});

export type ProductQuerySchemaType = z.infer<typeof productQuerySchema>;
