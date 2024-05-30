import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';

const schemaCreateUser = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z
    .string({ required_error: 'password need at least 8 characters' })
    .min(8),
});

export type ICreateUser = z.infer<typeof schemaCreateUser>;

export const createUserValidator = validateRequest({
  body: schemaCreateUser,
});
