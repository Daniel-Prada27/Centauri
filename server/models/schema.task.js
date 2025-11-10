import { z } from "zod";

export const TaskSchema = z.object({
  id_team: z.string(),
  id_responsible: z.string(),
  name: z.string().min(3).max(50),
  status: z.enum(["pending", "in_progress", "completed"]).or(z.string().max(20)), // por si manejas valores custom
  priority: z.enum(["low", "medium", "high"]).or(z.string().max(20)),
  type: z.string().max(30),
  due_date: z.coerce.date(),
});

export const TaskCreationSchema = z.object({
  id_team: z.string(),
  id_responsible: z.string(),
  name: z.string().min(3).max(50),
  priority: z.enum(["low", "medium", "high"]).or(z.string().max(20)),
  type: z.string().max(30),
  due_date: z.coerce.date(),
  status: z.enum(["pending", "in_progress", "completed"])
           .default("pending"),
});