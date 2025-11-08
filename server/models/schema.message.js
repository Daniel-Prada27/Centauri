import { z } from "zod";

export const MessageSchema = z.object({
  id_from: z.string(),
  id_to: z.string(),
  content: z.string().min(1),
  created_at: z.coerce.date(),
});
