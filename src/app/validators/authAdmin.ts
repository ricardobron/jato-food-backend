import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';

const schemaAuthAdmin = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z
    .string({ required_error: 'password need at least 8 characters' })
    .min(8),
});

export type IAuthAdmin = z.infer<typeof schemaAuthAdmin>;

export const authAdminValidator = validateRequest({
  body: schemaAuthAdmin,
});
