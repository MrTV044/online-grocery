import './configs/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import express, { Application, Request, Response } from 'express';

import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import adminRouter from '../src/routers/admin-router.js';

import addToCart from './routers/carting-router.js';
import showAllCartItems from './routers/carting-router.js';
import deleteCartItem from './routers/carting-router.js';

import productRouter from '../src/routers/product-router.js';
import inventoryRouter from '../src/routers/inventory-router.js';
import discountRouter from './routers/discount-router.js';

import { VerifyToken } from './middlewares/admin-middleware.js';

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/v1/', addToCart);
app.use('/api/v1/', showAllCartItems);
app.use('/api/v1/', deleteCartItem);

// routes admin
app.use('/api/v1/admin', VerifyToken, adminRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/discount', discountRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});

export default app;
