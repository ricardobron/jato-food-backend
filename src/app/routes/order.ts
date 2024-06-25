import { Router } from 'express';

import orderController from '@app/controllers/OrderController';
import is from '@app/middlewares/ensureAuthenticated';

const orderRouter = Router();

orderRouter.get('/', is(['USER', 'ADMIN']), orderController.find);
orderRouter.post('/', is(['USER', 'ADMIN']), orderController.create);
orderRouter.put('/:id', is(['ADMIN']), orderController.update);

export default orderRouter;
