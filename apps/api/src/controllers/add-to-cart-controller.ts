import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if the product has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        Stock: true,
      },
    });

    if (!product?.Stock || product.Stock.length === 0) {
      res.status(404).json({ message: 'Stock data not found' });
      return;
    }

    if (product?.Stock[0]?.quantity < quantity) {
      res.status(404).json({ message: 'Product out of stock' });
      return;
    }

    // Add to cart logic
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: userId,
        productId: productId,
        quantity: 1,
      },
    });

    res
      .status(201)
      .json({ ok: true, data: cartItem, message: 'Product added to cart' });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};
