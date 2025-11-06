import { z } from "zod";

export const GroupMessageSchema = z.object({
  id_channel: z.string(),
  id_message: z.string(),
  content: z.string().min(1),
  created_at: z.coerce.date(),
});
