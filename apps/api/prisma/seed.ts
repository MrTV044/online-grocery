import { PrismaClient, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

const prisma = new PrismaClient();

async function main() {
  //NOTE: IF ANY OF THE DELETEMANY IS REQUIRED, JUST TURN IT ON

  // await prisma.salesReport.deleteMany();
  // await prisma.stock.deleteMany();
  // await prisma.stockReport.deleteMany();
  // await prisma.discount.deleteMany();
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.productImage.deleteMany();

  // 2️⃣ Now, delete products
  // await prisma.product.deleteMany();

  // // 3️⃣ Then delete categories and stores
  // await prisma.category.deleteMany();
  // await prisma.store.deleteMany();

  // // 4️⃣ Finally, delete users and addresses
  // await prisma.address.deleteMany();
  // await prisma.user.deleteMany();

  // Generate Salt
  const salt = bcrypt.genSaltSync(10);

  // ✅ Seed Users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        emailConfirmed: true,
        password: bcrypt.hashSync('password123', salt), // Hash with generated salt
        role: 'CUSTOMER',
        userPhoto: 'https://example.com/photos/johndoe.jpg',
        address: '123 Main St, New York, NY',
        referralCode: 'REF12345',
      },
      {
        id: 2,
        name: 'Alice Smith',
        email: 'alice@example.com',
        emailConfirmed: false,
        password: bcrypt.hashSync('securepassword', salt),
        role: 'CUSTOMER',
        userPhoto: null,
        address: '456 Elm St, Los Angeles, CA',
        referralCode: 'REF67890',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        emailConfirmed: true,
        password: bcrypt.hashSync('bobpassword', salt),
        role: 'CUSTOMER',
        userPhoto: 'https://example.com/photos/bob.jpg',
        address: '789 Oak St, Chicago, IL',
        referralCode: 'REF11223',
      },
      {
        id: 4,
        name: 'Emma Davis',
        email: 'emma@example.com',
        emailConfirmed: false,
        password: bcrypt.hashSync('emmapassword', salt),
        role: 'CUSTOMER',
        userPhoto: null,
        address: '321 Pine St, Houston, TX',
        referralCode: 'REF44556',
      },
      {
        id: 5,
        name: 'Michael Brown',
        email: 'michael@example.com',
        emailConfirmed: true,
        password: bcrypt.hashSync('michaelpassword', salt),
        role: 'CUSTOMER',
        userPhoto: 'https://example.com/photos/michael.jpg',
        address: '654 Birch St, Phoenix, AZ',
        referralCode: 'REF77889',
      },
      {
        id: 6,
        name: 'Sophia Wilson',
        email: 'sophia@example.com',
        emailConfirmed: false,
        password: bcrypt.hashSync('sophiapassword', salt),
        role: 'CUSTOMER',
        userPhoto: null,
        address: '987 Cedar St, Philadelphia, PA',
        referralCode: 'REF99001',
      },
      {
        id: 7,
        name: 'Daniel Martinez',
        email: 'daniel@example.com',
        emailConfirmed: true,
        password: bcrypt.hashSync('danielpassword', salt),
        role: 'CUSTOMER',
        userPhoto: 'https://example.com/photos/daniel.jpg',
        address: '741 Maple St, San Diego, CA',
        referralCode: 'REF22334',
      },
    ],
  });

  console.log('✅ Users seeded successfully!');

  const users1 = await prisma.user.findMany({ select: { id: true } });

  // ✅ Seed Addresses
  await prisma.address.createMany({
    data: [
      {
        userId: users1[0].id,
        street: '123 Main St',
        city: 'New York',
        postalCode: 10001,
        isDefault: true,
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        userId: users1[1].id,
        street: '456 Elm St',
        city: 'Los Angeles',
        postalCode: 90001,
        isDefault: false,
        latitude: 34.0522,
        longitude: -118.2437,
      },
      {
        userId: users1[2].id,
        street: '789 Oak St',
        city: 'Chicago',
        postalCode: 60601,
        isDefault: true,
        latitude: 41.8781,
        longitude: -87.6298,
      },
      {
        userId: users1[3].id,
        street: '321 Pine St',
        city: 'Houston',
        postalCode: 77002,
        isDefault: false,
        latitude: 29.7604,
        longitude: -95.3698,
      },
      {
        userId: users1[4].id,
        street: '654 Birch St',
        city: 'Phoenix',
        postalCode: 85001,
        isDefault: true,
        latitude: 33.4484,
        longitude: -112.074,
      },
      {
        userId: users1[5].id,
        street: '987 Cedar St',
        city: 'Philadelphia',
        postalCode: 19106,
        isDefault: false,
        latitude: 39.9526,
        longitude: -75.1652,
      },
      {
        userId: users1[6].id,
        street: '741 Maple St',
        city: 'San Diego',
        postalCode: 92101,
        isDefault: true,
        latitude: 32.7157,
        longitude: -117.1611,
      },
    ],
  });

  // Seed untuk tabel Store
  const storeCount = 100;
  await prisma.store.createMany({
    data: Array.from({ length: storeCount }).map((_, index) => ({
      id: index + 1, // Explicit store IDs
      name: `Store ${index + 1}`,
      userId: 1, // Make sure this user exists

      address: `Address ${index + 1}`,
      latitude: 40.7128 + index * 0.01,
      longitude: -74.006 + index * 0.01,
      maxDistance: 50.0,
    })),
  });

  // Seed untuk tabel Category
  // await prisma.category.createMany({
  //   data: Array.from({ length: 10 }).map((_, index) => ({
  //     name: `Category ${index + 1}`,
  //   })),
  // });

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
      weight: 0.5 + Math.random() * 2.5, // Random weight between 0.5 and 3
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

  console.log('Seed data successfully added!');

  const users = await prisma.user.findMany({ select: { id: true } });
  const stores = await prisma.store.findMany({ select: { id: true } });
  const addresses = await prisma.address.findMany({ select: { id: true } });
  const products = await prisma.product.findMany({
    select: { id: true, price: true },
  });

  // Ensure there is data available before seeding orders
  if (
    users.length === 0 ||
    stores.length === 0 ||
    addresses.length === 0 ||
    products.length === 0
  ) {
    console.log(
      '❌ Missing essential data! Please seed users, stores, addresses, and products first.',
    );
    return;
  }

  // Seed Orders
  console.log('✅ Orders seeded successfully!');

  const orderStatuses = [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PENDING_CONFIRMATION,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
  ];

  // Now, seed OrderItems for each order
  const ordersData = users.map((user) => ({
    id: crypto.randomUUID(),
    userId: user.id,
    storeId: Math.floor(Math.random() * 100) + 1,
    orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
    addressId: String(addresses.find((addr) => addr.id === user.id)?.id || ''),
    orderStatus:
      orderStatuses[Math.floor(Math.random() * orderStatuses.length)], // Use the correct enum value here
    paymentMethod: 'CREDIT_CARD',
    paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    shippingMethod: 'STANDARD',
    shippingCost: Math.random() * 10 + 5,
    discountTotal: Math.random() * 20,
    total: Math.random() * 100 + 20,
  }));

  await prisma.order.createMany({ data: ordersData });
  console.log('✅ Orders seeded successfully!');

  // ✅ Seed OrderItems
  const createdOrders = await prisma.order.findMany({
    select: { id: true, storeId: true },
  });
  const orderItemsData = createdOrders.flatMap((order) => {
    const orderItemCount = Math.floor(Math.random() * 5) + 1;
    return Array.from({ length: orderItemCount }).map(() => {
      const product = products[Math.floor(Math.random() * products.length)];
      return {
        orderId: order.id,
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: product.price,
      };
    });
  });

  // Seed OrderItems
  await prisma.orderItem.createMany({
    data: orderItemsData,
  });

  // ✅ Seed Carts
  const cartsData = users.map((user) => ({
    userId: user.id,
    totalPrice: 0,
  }));

  await prisma.cart.createMany({ data: cartsData });
  console.log('✅ Carts seeded successfully!');

  // Fetch created carts
  const carts = await prisma.cart.findMany({
    select: { id: true, userId: true },
  });

  // ✅ Seed CartItems
  const cartItemsData = carts.flatMap((cart) => {
    const cartItemCount = Math.floor(Math.random() * 5) + 1; // Random 1-5 items per cart
    return Array.from({ length: cartItemCount }).map(() => {
      const product = products[Math.floor(Math.random() * products.length)];
      return {
        cartId: cart.id,
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1, // Random quantity 1-3
      };
    });
  });

  await prisma.cartItem.createMany({ data: cartItemsData });
  console.log('✅ Cart Items seeded successfully!');

  console.log('✅ Order Items seeded successfully!');

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
