import { z } from "zod";

export const CommentSchema = z.object({
  id_task: z.string(),
  id_author: z.string(),
  name: z.string().max(50),
  edited: z.boolean().default(false),
  content: z.string().max(300),
});
