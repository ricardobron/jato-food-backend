import { Router } from 'express';

import authRouter from '@app/routes/auth';
import userRouter from '@app/routes/user';
import orderRouter from '@app/routes/order';
import productRouter from '@app/routes/products';
import tableRouter from '@app/routes/table';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/order', orderRouter);
routes.use('/product', productRouter);
// routes.use('/user', userRouter);
routes.use('/table', tableRouter);

export default routes;
