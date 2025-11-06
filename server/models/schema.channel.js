import { z } from "zod";

export const ChannelSchema = z.object({
  id_team: z.string(),
});
