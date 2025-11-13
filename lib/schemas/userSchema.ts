import { z } from "zod"

export const userSchema = z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),
    birthDate: z.string().refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      return birthDate < today
    }, "Birth date must be in the past"),
    gender: z.enum(["male", "female"], {
      message: "Please select a gender",
    }),
  })
  
  export type UserFormData = z.infer<typeof userSchema>
  