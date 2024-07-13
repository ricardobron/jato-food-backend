import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';

import validator from 'validator';

const schemaAuthClient = z.object({
  phone_number: z
    .string({
      required_error: 'Phone number is required',
    })
    .refine((value) => validator.isMobilePhone(value, 'pt-PT'), {
      message: 'Insert valid phone number ',
    }),
  table: z.number({ message: 'Table number is required' }),
  pin_table: z
    .string()
    .min(4, { message: 'Must have at least 4 characters' })
    .max(8, { message: 'Can only have a maximum of 8 characters' }),
});

export type IAuthClient = z.infer<typeof schemaAuthClient>;

export const authClientValidator = validateRequest({
  body: schemaAuthClient,
});
