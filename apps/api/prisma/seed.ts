import { PrismaClient, Role, DiscountType, OrderStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding with Indonesian data...');

  // Delete all existing data (in reverse order of dependencies)
  console.log('Cleaning existing data...');

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});

  await prisma.stockLog.deleteMany({});
  await prisma.stock.deleteMany({});

  await prisma.discountReport.deleteMany({});
  await prisma.discount.deleteMany({});

  await prisma.productImage.deleteMany({});
  await prisma.stockReport.deleteMany({});
  await prisma.salesReport.deleteMany({});
  await prisma.product.deleteMany({});

  await prisma.category.deleteMany({});
  await prisma.store.deleteMany({});

  await prisma.address.deleteMany({});
  await prisma.resetPasswordToken.deleteMany({});
  await prisma.confirmToken.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.voucher.deleteMany({});

  console.log('All existing data cleared.');

  // Create Users with Indonesian names
  console.log('Creating users with Indonesian names...');
  const hashedPassword = await hash('Password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Budi Santoso',
        email: 'budi.santoso@example.com',
        emailConfirmed: true,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        referralCode: 'ADMIN001',
        userPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dewi Lestari',
        email: 'dewi.lestari@example.com',
        emailConfirmed: true,
        password: hashedPassword,
        role: Role.STORE_ADMIN,
        referralCode: 'STORE001',
        userPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Agus Hermawan',
        email: 'agus.hermawan@example.com',
        emailConfirmed: true,
        password: hashedPassword,
        role: Role.CUSTOMER,
        referralCode: 'CUST001',
        userPhoto: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Siti Rahayu',
        email: 'siti.rahayu@example.com',
        emailConfirmed: true,
        password: hashedPassword,
        role: Role.CUSTOMER,
        referralCode: 'CUST002',
        userPhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Addresses with Indonesian cities
  console.log('Creating addresses with Indonesian locations...');
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: users[0].id,
        street: 'Jl. Sudirman No. 123',
        city: 'Jakarta Pusat',
        postalCode: 10220,
        isDefault: true,
        latitude: -6.175392,
        longitude: 106.827153,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[1].id,
        street: 'Jl. Gatot Subroto No. 456',
        city: 'Jakarta Selatan',
        postalCode: 12950,
        isDefault: true,
        latitude: -6.23511,
        longitude: 106.823036,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[2].id,
        street: 'Jl. Asia Afrika No. 789',
        city: 'Bandung',
        postalCode: 40112,
        isDefault: true,
        latitude: -6.921022,
        longitude: 107.607526,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[2].id,
        street: 'Jl. Ahmad Yani No. 101',
        city: 'Bandung',
        postalCode: 40111,
        isDefault: false,
        latitude: -6.914744,
        longitude: 107.60981,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[3].id,
        street: 'Jl. Malioboro No. 202',
        city: 'Yogyakarta',
        postalCode: 55271,
        isDefault: true,
        latitude: -7.797068,
        longitude: 110.370529,
      },
    }),
  ]);

  console.log(`Created ${addresses.length} addresses`);

  // Create Stores with Indonesian names
  console.log('Creating stores with Indonesian names...');
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Toko Berkah Sejahtera',
        userId: users[1].id,
        address: 'Jl. Raya Bogor Km 25, Jakarta Timur',
        latitude: -6.29234,
        longitude: 106.855335,
        maxDistance: 10.0,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Elektronik Jaya Abadi',
        userId: users[1].id,
        address: 'Jl. Mangga Dua Raya No. 45, Jakarta Utara',
        latitude: -6.138338,
        longitude: 106.82846,
        maxDistance: 15.0,
      },
    }),
  ]);

  console.log(`Created ${stores.length} stores`);

  // Create Categories with Indonesian names
  console.log('Creating product categories in Indonesian...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Buah & Sayur',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Susu & Telur',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Smartphone',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Laptop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Roti & Kue',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create Products with Indonesian names and IDR prices
  console.log('Creating products with Indonesian names and IDR prices...');
  const products = await Promise.all([
    // Toko Berkah Sejahtera Products
    prisma.product.create({
      data: {
        name: 'Apel Malang Segar',
        description: 'Apel merah organik dari Malang, 1kg',
        price: 35000, // IDR 35,000
        weight: 1.0,
        categoryId: categories[0].id,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pisang Cavendish Organik',
        description: 'Pisang cavendish segar dari kebun, 1kg',
        price: 25000, // IDR 25,000
        weight: 1.0,
        categoryId: categories[0].id,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Susu Ultra Full Cream',
        description: 'Susu segar full cream, 1 liter',
        price: 18500, // IDR 18,500
        weight: 1.0,
        categoryId: categories[1].id,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Telur Ayam Kampung',
        description: 'Telur ayam kampung segar, 10 butir',
        price: 26000, // IDR 26,000
        weight: 0.6,
        categoryId: categories[1].id,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Roti Tawar Premium',
        description: 'Roti tawar premium tanpa pengawet, 500g',
        price: 15000, // IDR 15,000
        weight: 0.5,
        categoryId: categories[4].id,
        storeId: stores[0].id,
      },
    }),
    // Elektronik Jaya Abadi Products
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S23',
        description: 'Smartphone terbaru dengan fitur canggih',
        price: 12999000, // IDR 12,999,000
        weight: 0.2,
        categoryId: categories[2].id,
        storeId: stores[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'ASUS ROG Zephyrus',
        description: 'Laptop gaming performa tinggi',
        price: 21500000, // IDR 21,500,000
        weight: 2.0,
        categoryId: categories[3].id,
        storeId: stores[1].id,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // Create Product Images
  console.log('Creating product images...');
  const productImages = await Promise.all([
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        imageUrl:
          'https://dummyimage.com/600x400/90ee90/fff&text=Apel-Malang-Segar',
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[1].id,
        imageUrl:
          'https://dummyimage.com/600x400/90ee90/fff&text=pisang-canvedish',
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[2].id,
        imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=susu-ultra',
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[5].id,
        imageUrl:
          'https://dummyimage.com/600x400/90ee90/fff&text=samsung-galaxy',
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[6].id,
        imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=asus-rog',
      },
    }),
  ]);

  console.log(`Created ${productImages.length} product images`);

  // Create Stocks
  console.log('Creating product stocks...');
  const stocks = await Promise.all([
    prisma.stock.create({
      data: {
        productId: products[0].id,
        storeId: stores[0].id,
        quantity: 100,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[1].id,
        storeId: stores[0].id,
        quantity: 150,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[2].id,
        storeId: stores[0].id,
        quantity: 80,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[3].id,
        storeId: stores[0].id,
        quantity: 120,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[4].id,
        storeId: stores[0].id,
        quantity: 50,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[5].id,
        storeId: stores[1].id,
        quantity: 25,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[6].id,
        storeId: stores[1].id,
        quantity: 15,
      },
    }),
  ]);

  console.log(`Created ${stocks.length} stock entries`);

  // Create Stock Logs
  console.log('Creating stock logs...');
  const stockLogs = await Promise.all([
    prisma.stockLog.create({
      data: {
        stockId: stocks[0].id,
        change: 100,
        reason: 'Stok awal',
      },
    }),
    prisma.stockLog.create({
      data: {
        stockId: stocks[1].id,
        change: 150,
        reason: 'Stok awal',
      },
    }),
    prisma.stockLog.create({
      data: {
        stockId: stocks[2].id,
        change: 80,
        reason: 'Stok awal',
      },
    }),
    prisma.stockLog.create({
      data: {
        stockId: stocks[0].id,
        change: -5,
        reason: 'Penjualan',
      },
    }),
    prisma.stockLog.create({
      data: {
        stockId: stocks[0].id,
        change: 5,
        reason: 'Pengembalian',
      },
    }),
  ]);

  console.log(`Created ${stockLogs.length} stock logs`);

  // Create Discounts with IDR values
  console.log('Creating discounts with IDR values...');
  const discounts = await Promise.all([
    prisma.discount.create({
      data: {
        productId: products[0].id,
        storeId: stores[0].id,
        type: DiscountType.PERCENTAGE,
        value: 10.0, // 10% off
        minPurchase: 50000, // Min IDR 50,000
        buyOneGetOne: false,
        maxDiscount: 10000, // Max IDR 10,000
      },
    }),
    prisma.discount.create({
      data: {
        productId: products[5].id,
        storeId: stores[1].id,
        type: DiscountType.FIXED_AMOUNT,
        value: 500000, // IDR 500,000 off
        minPurchase: 10000000, // Min IDR 10,000,000
        buyOneGetOne: false,
        maxDiscount: 500000, // Max IDR 500,000
      },
    }),
    prisma.discount.create({
      data: {
        productId: products[4].id,
        storeId: stores[0].id,
        type: DiscountType.PERCENTAGE,
        value: 15.0,
        minPurchase: null,
        buyOneGetOne: true,
        maxDiscount: 15000, // Max IDR 15,000
      },
    }),
  ]);

  console.log(`Created ${discounts.length} discounts`);

  // Create Vouchers with IDR values
  console.log('Creating vouchers with IDR values...');
  const vouchers = await Promise.all([
    prisma.voucher.create({
      data: {
        code: 'SELAMATDATANG',
        type: DiscountType.PERCENTAGE,
        value: 10.0,
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'GRATISONGKIR',
        type: DiscountType.FIXED_AMOUNT,
        value: 20000, // IDR 20,000
      },
    }),
  ]);

  console.log(`Created ${vouchers.length} vouchers`);

  // Create Carts for Customers with IDR prices
  console.log('Creating shopping carts with IDR prices...');
  const carts = await Promise.all([
    prisma.cart.create({
      data: {
        userId: users[2].id, // First customer
        totalPrice: 87000, // IDR 87,000
      },
    }),
    prisma.cart.create({
      data: {
        userId: users[3].id, // Second customer
        totalPrice: 12999000, // IDR 12,999,000
      },
    }),
  ]);

  console.log(`Created ${carts.length} carts`);

  // Create Cart Items
  console.log('Creating cart items...');
  const cartItems = await Promise.all([
    prisma.cartItem.create({
      data: {
        cartId: carts[0].id,
        productId: products[0].id, // Apel
        quantity: 1,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: carts[0].id,
        productId: products[3].id, // Telur
        quantity: 2,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: carts[1].id,
        productId: products[5].id, // Samsung Galaxy
        quantity: 1,
      },
    }),
  ]);

  console.log(`Created ${cartItems.length} cart items`);

  // Create Orders with Indonesian data and IDR values
  console.log('Creating orders with Indonesian data...');
  const now = new Date();
  const paymentDueDate = new Date(now);
  paymentDueDate.setDate(paymentDueDate.getDate() + 1);

  const shippedDate = new Date(now);
  shippedDate.setHours(shippedDate.getHours() - 24);

  const deliveredDate = new Date(now);
  deliveredDate.setHours(deliveredDate.getHours() - 12);

  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[2].id,
        storeId: stores[0].id,
        orderNumber: 'ORD-2025-0001',
        addressId: '1', // Customer's address
        orderStatus: OrderStatus.COMPLETED,
        paymentMethod: 'BANK_TRANSFER',
        paymentProof: 'https://example.com/proofs/payment1.jpg',
        paymentProofTime: shippedDate,
        paymentDueDate: paymentDueDate,
        shippingMethod: 'JNE Regular',
        shippingCost: 15000, // IDR 15,000
        discountTotal: 5000, // IDR 5,000
        total: 115000, // IDR 115,000
        notes: 'Mohon dikirim pagi hari',
        shippedAt: shippedDate,
        deliveredAt: deliveredDate,
      },
    }),
    prisma.order.create({
      data: {
        userId: users[3].id,
        storeId: stores[1].id,
        orderNumber: 'ORD-2025-0002',
        addressId: '5', // Second customer's address
        orderStatus: OrderStatus.PENDING_PAYMENT,
        paymentMethod: 'PAYMENT_GATEWAY',
        paymentDueDate: paymentDueDate,
        shippingMethod: 'Sicepat Express',
        shippingCost: 45000, // IDR 45,000
        discountTotal: 500000, // IDR 500,000
        total: 12544000, // IDR 12,544,000
        notes: 'Tolong bungkus dengan kardus ekstra',
      },
    }),
  ]);

  console.log(`Created ${orders.length} orders`);

  // Create Order Items with IDR prices
  console.log('Creating order items with IDR prices...');
  const orderItems = await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[0].id, // Apel
        quantity: 1,
        price: 35000, // IDR 35,000
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[2].id, // Susu
        quantity: 2,
        price: 18500, // IDR 18,500
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[3].id, // Telur
        quantity: 1,
        price: 26000, // IDR 26,000
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        productId: products[5].id, // Samsung Galaxy
        quantity: 1,
        price: 12999000, // IDR 12,999,000
      },
    }),
  ]);

  console.log(`Created ${orderItems.length} order items`);

  // Create Sales Reports with IDR values
  console.log('Creating sales reports with IDR values...');
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const salesReports = await Promise.all([
    prisma.salesReport.create({
      data: {
        storeId: stores[0].id,
        productId: products[0].id,
        Quantity: 25,
        total: 875000, // IDR 875,000
        month: currentMonth - 1,
        year: currentYear,
      },
    }),
    prisma.salesReport.create({
      data: {
        storeId: stores[0].id,
        productId: products[1].id,
        Quantity: 30,
        total: 750000, // IDR 750,000
        month: currentMonth - 1,
        year: currentYear,
      },
    }),
    prisma.salesReport.create({
      data: {
        storeId: stores[1].id,
        productId: products[5].id,
        Quantity: 5,
        total: 64995000, // IDR 64,995,000
        month: currentMonth - 1,
        year: currentYear,
      },
    }),
  ]);

  console.log(`Created ${salesReports.length} sales reports`);

  // Create Stock Reports
  console.log('Creating stock reports...');
  const stockReports = await Promise.all([
    prisma.stockReport.create({
      data: {
        storeId: stores[0].id,
        productId: products[0].id,
        startStock: 125,
        endStock: 100,
        totalAdded: 0,
        totalReduced: 25,
        month: currentMonth - 1,
        year: currentYear,
      },
    }),
    prisma.stockReport.create({
      data: {
        storeId: stores[0].id,
        productId: products[1].id,
        startStock: 100,
        endStock: 150,
        totalAdded: 80,
        totalReduced: 30,
        month: currentMonth - 1,
        year: currentYear,
      },
    }),
    prisma.stockReport.create({
      data: {
        storeId: stores[1].id,
        productId: products[5].id,
        startStock: 30,
        endStock: 25,
        totalAdded: 0,
        totalReduced: 5,
        month: currentMonth - 1,
        year: currentYear,
      },
    }),
  ]);

  console.log(`Created ${stockReports.length} stock reports`);

  // Create Discount Reports
  console.log('Creating discount reports...');
  const discountReports = await Promise.all([
    prisma.discountReport.create({
      data: {
        userId: users[2].id,
        dicountId: discounts[0].id,
      },
    }),
    prisma.discountReport.create({
      data: {
        userId: users[3].id,
        dicountId: discounts[1].id,
      },
    }),
  ]);

  console.log(`Created ${discountReports.length} discount reports`);

  // Create Confirm Tokens
  console.log('Creating confirm tokens...');
  const tokenExpiry = new Date();
  tokenExpiry.setDate(tokenExpiry.getDate() + 1);

  const confirmTokens = await Promise.all([
    prisma.confirmToken.create({
      data: {
        userId: users[0].id,
        token: 'token123456',
        expiredDate: tokenExpiry,
        used: true,
      },
    }),
    prisma.confirmToken.create({
      data: {
        userId: users[3].id,
        token: 'token789012',
        expiredDate: tokenExpiry,
        used: false,
      },
    }),
  ]);

  console.log(`Created ${confirmTokens.length} confirm tokens`);

  // Create Reset Password Tokens
  console.log('Creating reset password tokens...');
  const resetPasswordTokens = await Promise.all([
    prisma.resetPasswordToken.create({
      data: {
        userId: users[2].id,
        token: 'reset123456',
        expiredDate: tokenExpiry,
        used: false,
      },
    }),
  ]);

  console.log(`Created ${resetPasswordTokens.length} reset password tokens`);

  console.log('Database seeding with Indonesian data completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
