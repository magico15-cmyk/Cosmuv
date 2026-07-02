import { z } from "zod";

/**
 * Sanitize text field input to prevent XSS and SQL Injection manipulation.
 * Strips dangerous HTML tags and trims whitespace.
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  
  return input
    .trim()
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    // Remove inline event handlers like onload=, onerror=, onclick=
    .replace(/\b(on\w+)=("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Convert angle brackets to prevent HTML rendering in non-escaped contexts
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Zod Schema for strong password enforcement and signup validation.
 */
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name is too long."),
  email: z
    .string()
    .email("Please provide a valid email address.")
    .refine(
      (val) => {
        const lower = val.toLowerCase().trim();
        return lower.endsWith("@gmail.com") || lower.endsWith("@googlemail.com");
      },
      { message: "We currently only accept Google email addresses (@gmail.com)." }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password must not exceed 128 characters.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character (!@#$%^&* etc.)."),
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters.")
    .max(100, "Store name is too long."),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters.")
    .max(50, "Subdomain must not exceed 50 characters.")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens."
    ),
  captchaToken: z.string().optional().nullable(),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Zod Schema for login validation.
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  captchaToken: z.string().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
