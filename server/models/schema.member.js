import { z } from "zod";

export const MemberSchema = z.object({
  id_user: z.string(),
  id_team: z.string(),
  role: z.string().max(30),
});

export const MemberInviteSchema = z.object({
  id_user: z.string(),
  id_team: z.string(),
});
