import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';

import AppError from './errors/AppError';

import http from 'node:http';

import routes from './routes';

const app = express();
const server = http.createServer(app);
import { setupWebsocket } from './websocket';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

const PORT = process.env.PORT || 3333;

setupWebsocket(server);

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(
  async (err: Error, req: Request, response: Response, _: NextFunction) => {
    if ((err as unknown as AppError).statusCode) {
      return response
        .status((err as unknown as AppError).statusCode)
        .json({ ...err, message: err.message || err.name, type: 'AppError' });
    }

    console.error(err);

    return response.status(500).json({ error: 'Internal server error' });
  }
);

server.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`, new Date());
});
