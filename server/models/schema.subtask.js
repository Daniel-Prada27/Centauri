import { z } from "zod";

export const SubtaskSchema = z.object({
  id_task: z.string(),
  name: z.string().min(3).max(50),
  status: z.enum(["pending", "in_progress", "completed"]).or(z.string().max(20)),
});
