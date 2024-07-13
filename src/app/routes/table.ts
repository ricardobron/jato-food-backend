import { Router } from 'express';

import tableController from '@app/controllers/TableController';
import is from '@app/middlewares/ensureAuthenticated';

const tableRouter = Router();

tableRouter.get('/showPin', is(['ADMIN']), tableController.showPin);

export default tableRouter;
