import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';

const schemaCreateProduct = z.object({
  name: z.string({ required_error: 'name is required' }),
  price: z.number({ required_error: 'price is required' }),
  active: z.boolean().default(false),
});

export type ICreateProduct = z.infer<typeof schemaCreateProduct>;

export const createProductValidator = validateRequest({
  body: schemaCreateProduct,
});
