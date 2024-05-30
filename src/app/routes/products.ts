import { Router } from 'express';

import productController from '@app/controllers/ProductController';
import is from '@app/middlewares/ensureAuthenticated';
import { createProductValidator } from '@app/validators/products';

const productRouter = Router();

productRouter.get('/', is(['ADMIN', 'USER']), productController.find);

productRouter.post(
  '/',
  is(['ADMIN']),
  createProductValidator,
  productController.create
);

productRouter.put('/:id', is(['ADMIN']), productController.update);

productRouter.delete('/:id', is(['ADMIN']), productController.delete);

export default productRouter;
