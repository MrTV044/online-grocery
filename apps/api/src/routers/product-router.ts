import express from 'express';
import {
  getProducts,
  getProductDetail,
  addToCart,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getProductsAdmin,
  getCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/product-controller.js';
import upload from '../middlewares/uploud-middleware.js';

const router = express.Router();

// Rute untuk mendapatkan daftar produk dengan pencarian (User Site)
router.route('/products').get(getProducts);

// Rute untuk mendapatkan detail produk berdasarkan ID (User Site)
router.route('/products/:id').get(getProductDetail);

// Rute untuk menambahkan produk ke keranjang (User Site)
router.route('/cart').post(addToCart);

// Admin Routes
// Rute untuk mendapatkan daftar produk (Admin Site)
router.route('/admin/products').get(getProductsAdmin);

// Rute untuk membuat produk baru (Admin Site)
router.route('/admin/products').post(createProduct);

// Rute untuk memperbarui produk berdasarkan productId (Admin Site)
router.route('/admin/products/:id').put(updateProduct);

// Rute untuk menghapus produk berdasarkan productId (Admin Site)
router.route('/admin/products/:id').delete(deleteProduct);

// Rute untuk mengupload gambar produk (Admin Site)
router
  .route('/admin/product/upload-image')
  .post(upload.array('images', 5), uploadProductImage);

// Admin Routes

// Rute untuk mendapatkan daftar kategori produk (Admin)
router.route('/admin/categories').get(getCategoriesAdmin);

// Rute untuk membuat kategori produk baru (Admin)
router.route('/admin/category').post(createCategory);

// Rute untuk memperbarui kategori produk berdasarkan ID (Admin)
router.route('/admin/category/:id').put(updateCategory);

// Rute untuk menghapus kategori produk berdasarkan ID (Admin)
router.route('/admin/category/:id').delete(deleteCategory);

export default router;
