import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type User = z.infer<typeof userSchema>;