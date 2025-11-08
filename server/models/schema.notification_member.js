import { z } from "zod";

export const NotificationMemberSchema = z.object({
  id_member: z.string(),
  id_notification: z.string(),
  read: z.boolean().default(false),
});
