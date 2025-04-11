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
        quantity: quantity,
      },
    });

    res
      .status(201)
      .json({ ok: true, data: cartItem, message: 'Product added to cart' });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

export const showAllCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const cartItems = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        CartItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    res.status(200).json({ ok: true, data: cartItems });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

export const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const finditem = await prisma.cartItem.findFirst({
      where: {
        cartId: userId,
        productId: productId,
      },
    });

    if (!finditem) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    if (finditem.quantity <= 1) {
      // If quantity is 1 or less, delete the cart item
      const deletedCartItem = await prisma.cartItem.delete({
        where: {
          id: finditem.id,
        },
      });

      res.status(200).json({
        ok: true,
        data: deletedCartItem,
        message: 'Product removed from cart',
      });
    } else {
      const deletedCartItem = await prisma.cartItem.update({
        where: {
          id: finditem.id,
        },
        data: {
          quantity: finditem.quantity - 1,
        },
      });
      res.status(200).json({
        ok: true,
        data: deletedCartItem,
        message: 'Product removed from cart',
      });
    }
  } catch (error) {
    next(error);
  }
};
