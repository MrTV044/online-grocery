import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the product has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        Stock: true,
      },
    });

    if (!product?.Stock || product.Stock.length === 0) {
      return res.status(404).json({ message: 'Stock data not found' });
    }

    if (product?.Stock[0]?.quantity < quantity) {
      return res.status(404).json({ message: 'Product out of stock' });
    }

    // Add to cart logic
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: userId,
        productId: productId,
        quantity: 1,
      },
    });

    res.status(201).json({ ok: true, data: cartItem });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}
