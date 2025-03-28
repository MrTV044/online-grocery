import { PrismaClient, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed untuk tabel Store
  await prisma.store.createMany({
    data: Array.from({ length: 100 }).map((_, index) => ({
      name: `Store ${index + 1}`,
      userId: 1,
      address: `Address ${index + 1}`,
      latitude: 40.7128 + index * 0.01,
      longitude: -74.006 + index * 0.01,
      maxDistance: 50.0,
    })),
  });

  // Seed untuk tabel Category
  await prisma.category.createMany({
    data: Array.from({ length: 10 }).map((_, index) => ({
      name: `Category ${index + 1}`,
    })),
  });

  // Seed untuk tabel Product
  await prisma.product.createMany({
    data: Array.from({ length: 200 }).map((_, index) => ({
      name: `Product ${index + 1}`,
      description: `Description for Product ${index + 1}`,
      price: parseFloat((Math.random() * 1000).toFixed(2)),
      categoryId: (index % 10) + 1, // Assign product to category (1-10)
      storeId: (index % 100) + 1, // Assign product to store (1-100)
    })),
  });

  // Seed untuk tabel Stock
  await prisma.stock.createMany({
    data: Array.from({ length: 200 }).map((_, index) => ({
      productId: (index % 200) + 1, // Assign stock to product (1-200)
      storeId: (index % 100) + 1, // Assign stock to store (1-100)
      quantity: Math.floor(Math.random() * 100) + 1, // Random quantity between 1 and 100
    })),
  });

  // Seed untuk tabel Discount
  await prisma.discount.createMany({
    data: Array.from({ length: 100 }).map((_, index) => ({
      productId: (index % 200) + 1, // Assign discount to product (1-200)
      storeId: (index % 100) + 1, // Assign discount to store (1-100)
      type:
        index % 2 === 0 ? DiscountType.PERCENTAGE : DiscountType.FIXED_AMOUNT,
      value: Math.random() * 50 + 5, // Random discount value between 5 and 50
      minPurchase: Math.random() * 500 + 50, // Random min purchase between 50 and 500
      buyOneGetOne: Math.random() > 0.5, // Random BuyOneGetOne flag
      maxDiscount: (Math.random() * 100).toFixed(2),
    })),
  });

  // Seed untuk tabel SalesReport
  await prisma.salesReport.createMany({
    data: Array.from({ length: 1000 }).map((_, index) => ({
      storeId: (index % 100) + 1, // Assign sales report to store (1-100)
      productId: (index % 200) + 1, // Assign sales report to product (1-200)
      Quantity: Math.floor(Math.random() * 50) + 1, // Random quantity between 1 and 50
      total: Math.floor(Math.random() * 1000) + 50, // Random total value between 50 and 1000
      month: Math.floor(Math.random() * 12) + 1, // Random month between 1 and 12
      year: 2025, // Hardcoded year
    })),
  });

  // Seed untuk tabel StockReport
  await prisma.stockReport.createMany({
    data: Array.from({ length: 500 }).map((_, index) => ({
      storeId: (index % 100) + 1, // Assign stock report to store (1-100)
      productId: (index % 200) + 1, // Assign stock report to product (1-200)
      startStock: Math.floor(Math.random() * 100) + 1, // Random start stock between 1 and 100
      endStock: Math.floor(Math.random() * 100) + 1, // Random end stock between 1 and 100
      totalAdded: Math.floor(Math.random() * 50) + 1, // Random total added between 1 and 50
      totalReduced: Math.floor(Math.random() * 50) + 1, // Random total reduced between 1 and 50
      month: Math.floor(Math.random() * 12) + 1, // Random month between 1 and 12
      year: 2025, // Hardcoded year
    })),
  });

  console.log('Seed data successfully added!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
