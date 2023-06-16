import { z } from "zod";

export const signUpFormSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  acceptTos: z.boolean(),
});