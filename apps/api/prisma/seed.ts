import { PrismaClient, Role, DiscountType, OrderStatus } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.discountReport.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.confirmToken.deleteMany();
  await prisma.address.deleteMany();
  await prisma.stock.deleteMany(); // Delete dependent records first
  await prisma.product.deleteMany();
  // Deklarasi data untuk User
  const adminSuper = {
    name: 'Admin Super',
    email: 'admin@super.com',
    password: 'superadminpassword',
    role: Role.SUPER_ADMIN,
    emailConfirmed: true,
    referralCode: 'SUPER123',
  };

  const storeAdmin = {
    name: 'Store Admin',
    email: 'store@admin.com',
    password: 'storeadminpassword',
    role: Role.STORE_ADMIN,
    emailConfirmed: true,
    referralCode: 'STORE123',
  };

  const customerUser = {
    name: 'Customer User',
    email: 'customer@user.com',
    password: 'customerpassword',
    role: Role.CUSTOMER,
    emailConfirmed: true,
    referralCode: 'CUSTOMER123',
  };

  // Membuat User
  await prisma.user.create({
    data: adminSuper,
  });

  const user2 = await prisma.user.create({
    data: storeAdmin,
  });

  const user3 = await prisma.user.create({
    data: customerUser,
  });

  // Deklarasi data untuk kategori produk
  const categoryData = [{ name: 'Electronics' }, { name: 'Home Appliances' }];

  // Membuat kategori produk
  const category1 = await prisma.category.create({
    data: categoryData[0],
  });

  const category2 = await prisma.category.create({
    data: categoryData[1],
  });

  // Deklarasi data untuk toko
  const storeData = {
    name: 'Super Store',
    userId: user2.id,
    address: '123 Store St, Cityville',
    latitude: 12.34,
    longitude: 56.78,
    maxDistance: 50,
  };

  // Membuat Toko
  const store = await prisma.store.create({
    data: storeData,
  });

  // Deklarasi data produk
  const productData = [
    {
      name: 'Smartphone',
      description: 'Latest model of smartphone',
      price: 499.99,
      categoryId: category1.id,
      storeId: store.id,
      weight: 4.5,
    },
    {
      name: 'Washing Machine',
      description: 'High-efficiency washing machine',
      price: 349.99,
      categoryId: category2.id,
      storeId: store.id,
      weight: 8.2,
    },
  ];

  // Membuat Produk
  const product1 = await prisma.product.create({
    data: productData[0],
  });

  const product2 = await prisma.product.create({
    data: productData[1],
  });

  // Deklarasi data stok
  const stockData = [
    { productId: product1.id, storeId: store.id, quantity: 100 },
    { productId: product2.id, storeId: store.id, quantity: 50 },
  ];

  // Membuat Stok
  await prisma.stock.create({
    data: stockData[0],
  });

  await prisma.stock.create({
    data: stockData[1],
  });

  // Deklarasi data diskon
  const discountData = [
    {
      productId: product1.id,
      storeId: store.id,
      type: DiscountType.PERCENTAGE,
      value: 10,
      maxDiscount: 50,
    },
    {
      productId: product2.id,
      storeId: store.id,
      type: DiscountType.FIXED_AMOUNT,
      value: 30,
      maxDiscount: 50,
    },
  ];

  // Membuat diskon
  await prisma.discount.create({
    data: discountData[0],
  });

  await prisma.discount.create({
    data: discountData[1],
  });

  // Deklarasi data order
  const orderData = {
    userId: user3.id,
    storeId: store.id,
    orderNumber: 'ORD001',
    addressId: 'ADDRESS001', // Example address ID, make sure to create an address in actual use
    orderStatus: OrderStatus.PENDING_PAYMENT,
    paymentMethod: 'BANK_TRANSFER',
    paymentDueDate: new Date(),
    shippingMethod: 'Standard',
    shippingCost: 10,
    total: 499.99,
    discountTotal: 50,
    notes: 'Please deliver with care',
  };

  // Membuat order
  const order1 = await prisma.order.create({
    data: orderData,
  });

  // Deklarasi data order item
  const orderItemData = {
    orderId: order1.id,
    productId: product1.id,
    quantity: 1,
    price: 499.99,
  };

  // Membuat Order Item
  await prisma.orderItem.create({
    data: orderItemData,
  });

  const productList = await prisma.product.findMany();
  const userList = await prisma.user.findMany();
  const storeList = await prisma.store.findMany();

  // Create Carts
  await Promise.all(
    userList.map((user) =>
      prisma.cart.create({
        data: {
          userId: user.id,
          totalPrice: 0,
        },
      }),
    ),
  );

  const cartList = await prisma.cart.findMany();

  // Create CartItems
  await Promise.all(
    cartList.map((cart, index) =>
      prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productList[index % productList.length].id,
          quantity: 2,
        },
      }),
    ),
  );

  // Create Orders
  await Promise.all(
    userList.map((user, index) =>
      prisma.order.create({
        data: {
          userId: user.id,
          storeId: storeList[index % storeList.length].id,
          orderNumber: `ORDER${index + 1}`,
          addressId: 'testing', // Link to the created address
          orderStatus: 'PENDING_PAYMENT',
          paymentMethod: 'BANK_TRANSFER',
          paymentDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          shippingMethod: 'Standard',
          shippingCost: 5.0,
          total: 100.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );

  // Create ConfirmTokens
  await Promise.all(
    userList.map((user) =>
      prisma.confirmToken.create({
        data: {
          token: crypto.randomBytes(20).toString('hex'),
          expiredDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day expiration
          userId: user.id,
        },
      }),
    ),
  );

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
