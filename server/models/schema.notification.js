import { z } from "zod";

export const NotificationSchema = z.object({
  id_team: z.string(),
  type: z.string().max(30),
  title: z.string().max(50),
  message: z.string().max(300),
  creation_date: z.coerce.date(),
  read: z.boolean().default(false),
});
