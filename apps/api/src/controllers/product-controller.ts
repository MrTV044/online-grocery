import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js'; // Menggunakan Prisma Client

// Fungsi untuk mendapatkan daftar produk dengan pencarian (untuk User)
export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const searchQuery = req.query.search || ''; // Ambil parameter search dari query string

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: searchQuery.toString(), // Cari nama produk yang mengandung query
          mode: 'insensitive', // Membuat pencarian tidak peka huruf besar/kecil
        },
      },
      include: {
        ProductImage: true,
        Category: true,
        Store: true,
        Stock: { include: { store: true } }, // Menampilkan stok per toko
      },
    });

    const productList = products.map((product) => {
      const totalStock = product.Stock.reduce(
        (sum, stock) => sum + stock.quantity,
        0,
      ); // Hitung stok total

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.ProductImage.map((img) => img.imageUrl),
        category: product.Category.name,
        store: product.Store.name,
        isOutOfStock: totalStock === 0,
        stocks: product.Stock.map((stock) => ({
          storeId: stock.storeId,
          storeName: stock.store.name,
          quantity: stock.quantity,
        })),
      };
    });

    res.status(200).json(productList); // Kirimkan data produk yang sudah diolah
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
}

// Fungsi untuk mendapatkan detail produk (untuk User/Admin)
export async function getProductDetail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const productId = parseInt(req.params.id); // Ambil ID produk dari parameter URL

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductImage: true,
        Category: true,
        Store: true,
        Stock: { include: { store: true } },
      },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const totalStock = product.Stock.reduce(
      (sum, stock) => sum + stock.quantity,
      0,
    );

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.Category.name,
      images: product.ProductImage.map((img) => img.imageUrl),
      isOutOfStock: totalStock === 0,
      stocks: product.Stock.map((stock) => ({
        storeId: stock.storeId,
        storeName: stock.store.name,
        quantity: stock.quantity,
      })),
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    next(error);
  }
}

// Fungsi untuk menambahkan produk ke keranjang (untuk User)
export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { Stock: true },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const totalStock = product.Stock.reduce(
      (sum, stock) => sum + stock.quantity,
      0,
    );

    if (totalStock < quantity) {
      res.status(400).json({ message: 'Not enough stock available' });
      return;
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, totalPrice: 0, CartItem: { create: [] } },
        include: { CartItem: true },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      res.status(200).json(updatedItem);
      return;
    } else {
      const newItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
      res.status(201).json(newItem);
      return;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    next(error);
  }
}

// ADMIN SITE - Functions to Manage Products (Admin)
// Backend: Fetching products from Prisma
export async function getProductsAdmin(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const products = await prisma.product.findMany({
      include: {
        ProductImage: true,
        Category: true,
        Store: true,
      },
    });
    res.json(products); // Kirimkan data produk yang sudah diolah dalam format JSON
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error); // Error handler
  }
}

// Fungsi untuk membuat produk baru (Admin)
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { name, description, price, categoryId, storeId } = req.body;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { name },
    });

    if (existingProduct) {
      res
        .status(400)
        .json({ message: 'Product with this name already exists' });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        storeId,
        weight: req.body.weight,
        Category: { connect: { id: categoryId } },
        Store: { connect: { id: storeId } },
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
}

// Fungsi untuk memperbarui produk (Admin)
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = parseInt(req.params.id);
  const { name, description, price, categoryId, storeId } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { name, description, price, categoryId, storeId },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
}

// Fungsi untuk menghapus produk (Admin)
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = parseInt(req.params.id);

  try {
    await prisma.product.delete({ where: { id: productId } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    next(error);
  }
}

// Fungsi untuk mengupload gambar produk (Admin)
export async function uploadProductImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { productId } = req.body;

  try {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => `/uploads/${file.filename}`,
    );

    const productImages = await prisma.productImage.createMany({
      data: imageUrls.map((url) => ({ productId, imageUrl: url })),
    });

    res
      .status(201)
      .json({ message: 'Images uploaded successfully', data: productImages });
  } catch (error) {
    console.error('Error uploading images:', error);
    next(error);
  }
}

// ADMIN SITE

// Fungsi untuk mendapatkan daftar kategori produk (Admin)
export async function getCategoriesAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const searchQuery = req.query.search || ''; // Ambil parameter search dari query string
  console.log('Search Query:', searchQuery);
  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: searchQuery.toString(), // Memfilter kategori berdasarkan nama yang mengandung query pencarian
          mode: 'insensitive', // Membuat pencarian tidak sensitif terhadap huruf besar/kecil
        },
      },
      include: {
        products: true, // Menampilkan produk terkait kategori
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next(error);
  }
}

// Fungsi untuk membuat kategori produk baru (Admin)
export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { name } = req.body;

  try {
    // Validasi kategori tidak boleh memiliki nama yang sama
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      res
        .status(400)
        .json({ message: 'Category with this name already exists' });
      return;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    next(error);
  }
}

// Fungsi untuk memperbarui kategori produk (Admin)
export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const categoryId = parseInt(req.params.id);
  const { name } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    next(error);
  }
}

// Fungsi untuk menghapus kategori produk (Admin)
export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const categoryId = parseInt(req.params.id);

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    next(error);
  }
}
