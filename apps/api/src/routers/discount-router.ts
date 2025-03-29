import express from 'express';
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscounts,
  getDiscountById,
} from '../controllers/discount-controller.js';

const router = express.Router();

// Rute untuk membuat diskon baru (Admin)
router.route('/discount').post(createDiscount);

// Rute untuk memperbarui diskon (Admin)
router.route('/discount/:id').put(updateDiscount);

// Rute untuk menghapus diskon (Admin)
router.route('/discount/:id').delete(deleteDiscount);

// Rute untuk mendapatkan semua diskon (user/admin)
router.route('/discounts').get(getDiscounts);

// Rute untuk mendapatkan detail diskon berdasarkan ID (user/admin)
router.route('/discount/:id').get(getDiscountById);

export default router;
