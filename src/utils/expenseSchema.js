import { z } from "zod";
import { isValidCategory } from "../constants/categories";
import { isISODate } from "./date";

// Form values are all strings/booleans; conversion to a number happens on submit.
export const expenseFormSchema = z
  .object({
    type: z.enum(["expense", "income"]),
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .min(2, "Title must be at least 2 characters")
      .max(80, "Title must be 80 characters or fewer"),
    amount: z
      .string()
      .trim()
      .min(1, "Amount is required")
      .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, "Amount must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    date: z
      .string()
      .min(1, "Date is required")
      .refine(isISODate, "Enter a valid date"),
    description: z.string().max(200, "Keep the note under 200 characters"),
    recurring: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.category && !isValidCategory(value.type, value.category)) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Pick a category that matches the type",
      });
    }
  });
