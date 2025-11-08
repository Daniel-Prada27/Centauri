import { z } from "zod";

export const EventSchema = z.object({
  id_team: z.string(),
  id_author: z.string(),
  name: z.string().min(3).max(50),
  description: z.string().max(400),
  due_date: z.coerce.date(),
});
