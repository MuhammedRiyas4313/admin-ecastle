import { z } from "zod";

export const productSchema = z.object({
  title: z.string().nonempty("Title is required!"),
  description: z.string().optional(),
  price: z.number().min(1, { message: "Price must be greater than 0!" }),
  category: z.string().optional(),
  image: z.string().optional(),
}).strict();

export type ProductFormValues = z.infer<typeof productSchema>;
