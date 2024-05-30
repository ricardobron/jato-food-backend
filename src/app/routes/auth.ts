import { Router } from 'express';

import authController from '@app/controllers/AuthController';
import { authAdminValidator } from '@app/validators/authAdmin';
import { authClientValidator } from '@app/validators/authClient';

const authRouter = Router();

authRouter.post('/admin', authAdminValidator, authController.admin);
authRouter.post('/client', authClientValidator, authController.client);

export default authRouter;
