import { Router } from 'express';

import userController from '@app/controllers/UserController';
import { createUserValidator } from '@app/validators/createUser';

const userRouter = Router();

userRouter.post('/', createUserValidator, userController.create);

export default userRouter;
