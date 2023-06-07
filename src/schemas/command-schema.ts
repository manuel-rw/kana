import { z } from "zod";

export const commandSchema = z.object({
  command: z.enum(["ipconfig", "hostname", "ls"]),
  parameters: z.string().optional(),
  useSanetization: z.boolean(),
});