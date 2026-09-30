import { z } from "zod";

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

export const extraSchema = z.object({
  name: z.string().trim().min(2, "Extra name must ne 2 character at least"),
});

export const SizeSchema = z.object({
  name: z.string().trim().min(2, "Size name must ne 2 character at least"),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(3, "Category name must be 3 character at least"),
});

export const updateCategorySchema = createCategorySchema;

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

export const productSizeSchema = z.object({
  id: z.string().min(1, "Size id is required"),

  price: z.coerce
    .number("Price must be a valid number")
    .nonnegative("Price must be greater than or equal to 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places")
    .default(0),
});

export const productExtraSchema = z.object({
  id: z.string().min(1, "Extra id is required"),

  price: z.coerce
    .number("Price must be a valid number")
    .nonnegative("Price must be greater than or equal to 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places")
    .default(0),
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

  sizes: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    },
    z.array(productSizeSchema).min(1, "At least one size is required"),
  ),

  extras: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }, z.array(productExtraSchema).optional()),
  isAvailable: z.preprocess((value) => value === "true", z.boolean()),
});

export const productQuerySchema = z.object({
  categories: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const orderSchema = z.object({
  paymentMethod: z.enum(["credit", "on_delivery"], {
    message: "Payment method must be either 'credit' or 'on_delivery'",
  }),

  products: z.array(
    z.object({
      productId: z.string().min(1, "Product id is required"),

      unitPrice: z.coerce
        .number("Unit price must be a valid number")
        .positive("Unit price must be greater than 0")
        .multipleOf(0.01, "Unit price can have at most 2 decimal places"),
      discount: z.coerce
        .number("Discount must be a valid number")
        .multipleOf(0.01, "Discount can have at most 2 decimal places"),

      quantity: z.coerce
        .number("Quantity must be a valid number")
        .positive("Quantity must be greater than 0")
        .int("Quantity must be an integer"),

      sizeId: z.string().min(1, "Size id is required"),

      extras: z.preprocess(
        (value) => {
          if (typeof value !== "string") return value;
          try {
            return JSON.parse(value);
          } catch (error) {
            return value;
          }
        },
        z
          .array(
            z.object({
              id: z.string().min(1, "Extra id is required"),
            }),
          )
          .optional(),
      ),
    }),
  ),
  customerPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d*$/, "Phone number must contain only numbers"),
  street: z.string().trim(),

  postalCode: z.string().trim(),

  city: z.string().trim(),

  country: z.string().trim(),
});

export const orderQuerySchema = z.object({
  status: z.preprocess(
    (value) => {
      if (typeof value !== "string") return;
      return value.toUpperCase();
    },
    z
      .enum(
        [
          "PLACED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "PACKED",
          "ASSIGNED",
        ],
        "Invalid query params",
      )
      .optional(),
  ),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const deliveryRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name must be 5 characters at least!")
    .max(20, "Name must be 20 characters at most!"),
  email: z.email("Invalid email!").transform((email) => email.toLowerCase()),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d*$/, "Phone number must contain only numbers"),
  vehicle: z.enum(["BIKE", "SCOOTER", "CAR"], "Invalid delivery vehicle"),
});

export const deliveryLoginSchema = z.object({
  email: z.email("Invalid email!").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const deliveryOrdersQuerySchema = z.object({
  status: z.enum(["active", "completed"], "Invalid order status").optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const updateOrderStatusSchema = z.object({
  newStatus: z.preprocess(
    (value: string) => {
      return value.toUpperCase();
    },
    z.enum(["PACKED", "OUT_FOR_DELIVERY"], "Invalid order status!"),
  ),
});

export const updateDeliveryPartnerStatus = z.object({
  newStatus: z.enum(["ACTIVE", "INACTIVE"], "Invalid status"),
});

export const assignDeliveryBoyToOrderSchema = z.object({
  deliveryBoyId: z.uuid("Invalid delivery boy id!"),
});

export const completeOrderSchema = z.object({
  deliveryOtp: z.coerce
    .number()
    .int("OTP must be an integer")
    .min(100000, "OTP must be 6 digits")
    .max(999999, "OTP must be 6 digits"),
});

export const checkoutSuccessSchema = z.object({
  session_id: z.string().min(1, "Checkout session ID is required"),
});
/* ******************************************** TYPES ********************************** */
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type GoogleAuthSchemaType = z.infer<typeof googleAuthSchema>;
export type ForgotSchemaType = z.infer<typeof forgotSchema>;
export type ResetSchemaType = z.infer<typeof resetSchema>;

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export type ExtraSchemaType = z.infer<typeof extraSchema>;
export type SizeSchemaType = z.infer<typeof SizeSchema>;

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;

export type UpdateUserProfileType = z.infer<typeof updateUserProfileSchema>;

export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductQuerySchemaType = z.infer<typeof productQuerySchema>;

export type OrderSchemaType = z.infer<typeof orderSchema>;
export type OrderQuerySchemaType = z.infer<typeof orderQuerySchema>;

export type DeliveryRegisterSchemaType = z.infer<typeof deliveryRegisterSchema>;
export type DeliveryLoginSchemaType = z.infer<typeof deliveryLoginSchema>;

export type DeliveryOrdersQuerySchemaType = z.infer<
  typeof deliveryOrdersQuerySchema
>;
export type UpdateOrderStatusSchemaType = z.infer<
  typeof updateOrderStatusSchema
>;
