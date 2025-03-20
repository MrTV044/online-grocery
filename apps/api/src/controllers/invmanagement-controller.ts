import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

export async function createStock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { productId, storeId, quantity } = req.body;

  try {
    // Membuat stok baru untuk produk di toko tertentu
    const newStock = await prisma.stock.create({
      data: {
        productId,
        storeId,
        quantity,
      },
    });

    // Mengembalikan data stok yang baru dibuat
    res.status(201).json(newStock);
  } catch (error) {
    next(error);
  }
}

export async function updateStock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { stockId, quantityChange, reason } = req.body;

  try {
    // Mengambil stok yang ada
    const stock = await prisma.stock.findUnique({
      where: { id: stockId },
    });

    if (!stock) {
      res.status(404).json({ message: 'Stock not found' });
      return;
    }

    // Membuat jurnal perubahan stok
    const stockLog = await prisma.stockLog.create({
      data: {
        stockId,
        change: quantityChange,
        reason,
      },
    });

    // Memperbarui stok berdasarkan perubahan yang dihitung
    const updatedStock = await prisma.stock.update({
      where: { id: stockId },
      data: {
        quantity: stock.quantity + quantityChange,
      },
    });

    // Mengembalikan stok yang telah diperbarui dan jurnal perubahan stok
    res.status(200).json({ updatedStock, stockLog });
  } catch (error) {
    next(error);
  }
}

export async function deleteStock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { stockId } = req.params;

  try {
    // Mengambil stok yang akan dihapus
    const stock = await prisma.stock.findUnique({
      where: { id: parseInt(stockId) },
    });

    if (!stock) {
      res.status(404).json({ message: 'Stock not found' });
      return;
    }

    // Menghapus stok
    await prisma.stock.delete({
      where: { id: parseInt(stockId) },
    });

    // Mengembalikan respons sukses
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function selectStoreForStockUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.body;

  try {
    // Mencari toko yang dikelola oleh admin utama
    const stores = await prisma.store.findMany({
      where: { userId: userId }, // Admin utama dapat mengelola beberapa toko
    });

    if (stores.length === 0) {
      res.status(404).json({ message: 'No stores found for this admin' });
      return;
    }

    res.status(200).json({ stores });
  } catch (error) {
    next(error);
  }
}

export async function updateStockForStoreAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { storeId, productId, quantityChange, reason } = req.body;

  try {
    // Mengambil stok yang ada di toko yang dipilih
    const stock = await prisma.stock.findFirst({
      where: { storeId, productId },
    });

    if (!stock) {
      res
        .status(404)
        .json({ message: 'Stock not found for this store and product' });
      return;
    }

    // Membuat jurnal perubahan stok
    const stockLog = await prisma.stockLog.create({
      data: {
        stockId: stock.id,
        change: quantityChange,
        reason,
      },
    });

    // Memperbarui stok
    const updatedStock = await prisma.stock.update({
      where: { id: stock.id },
      data: {
        quantity: stock.quantity + quantityChange,
      },
    });

    res.status(200).json({ updatedStock, stockLog });
  } catch (error) {
    next(error);
  }
}
