import { z } from "zod";

export const userRegisterFormSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  acceptTos: z.literal(true),
});