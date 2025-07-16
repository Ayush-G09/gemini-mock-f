import { z } from "zod";

export const formSchema = z.object({
  mobileNumber: z
    .string()
    .nonempty("Mobile number is required")
    .min(7, "Mobile number is too short")
    .max(10, "Mobile number is too long")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  country: z.object({
    name: z.string(),
    callingCode: z.string().min(1, "Country code is required"),
    flag: z.string(),
  }),
});
