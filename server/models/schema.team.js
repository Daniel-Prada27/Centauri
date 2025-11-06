import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(400),
});
