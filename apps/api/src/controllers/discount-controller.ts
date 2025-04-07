import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

// Fungsi untuk membuat diskon baru (Admin)
export async function createDiscount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const {
    productId,
    storeId,
    type,
    value,
    minPurchase,
    buyOneGetOne,
    maxDiscount,
  } = req.body;

  try {
    // Cek apakah diskon sudah ada untuk produk dan toko yang sama
    const existingDiscount = await prisma.discount.findFirst({
      where: { productId, storeId },
    });

    if (existingDiscount) {
      res.status(400).json({
        message: 'Discount already exists for this product and store',
      });
      return;
    }

    // Buat diskon baru
    const newDiscount = await prisma.discount.create({
      data: {
        productId,
        storeId,
        type,
        value,
        minPurchase,
        buyOneGetOne,
        maxDiscount,
      },
    });

    res.status(201).json(newDiscount);
  } catch (error) {
    console.error('Error creating discount:', error);
    next(error);
  }
}

// Fungsi untuk memperbarui diskon (Admin)
export async function updateDiscount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const discountId = parseInt(req.params.id);
  const {
    productId,
    storeId,
    type,
    value,
    minPurchase,
    buyOneGetOne,
    maxDiscount,
  } = req.body;

  try {
    // Perbarui diskon berdasarkan discountId
    const updatedDiscount = await prisma.discount.update({
      where: { id: discountId },
      data: {
        productId,
        storeId,
        type,
        value,
        minPurchase,
        buyOneGetOne,
        maxDiscount,
      },
    });

    res.status(200).json(updatedDiscount);
  } catch (error) {
    console.error('Error updating discount:', error);
    next(error);
  }
}

// Fungsi untuk menghapus diskon (Admin)
export async function deleteDiscount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const discountId = parseInt(req.params.id);

  try {
    // Hapus diskon berdasarkan discountId
    await prisma.discount.delete({
      where: { id: discountId },
    });

    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    next(error);
  }
}

// Fungsi untuk mendapatkan daftar diskon (user/admin)
export async function getDiscounts(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const discounts = await prisma.discount.findMany({
      include: {
        Product: true, // Menampilkan produk yang mendapatkan diskon
        Store: true, // Menampilkan toko yang memberikan diskon
      },
    });

    res.status(200).json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    next(error);
  }
}

// Fungsi untuk mendapatkan detail diskon berdasarkan ID (user/admin)
export async function getDiscountById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const discountId = parseInt(req.params.id);

  try {
    const discount = await prisma.discount.findUnique({
      where: { id: discountId },
      include: {
        Product: true,
        Store: true,
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    res.status(200).json(discount);
  } catch (error) {
    console.error('Error fetching discount details:', error);
    next(error);
  }
}
