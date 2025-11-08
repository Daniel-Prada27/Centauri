import { z } from "zod";

export const UserProfileSchema = z.object({
  user_id: z.string(),
  occupation: z.string().max(50),
  location: z.string().max(40).optional(),
  picture: z.string().max(200).optional(),
});
