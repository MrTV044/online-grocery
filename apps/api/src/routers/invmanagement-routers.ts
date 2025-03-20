import { Router } from 'express';
import {
  createStock,
  updateStock,
  deleteStock,
  selectStoreForStockUpdate,
  updateStockForStoreAdmin,
} from '../controllers/invmanagement-controller.js'; // Import controller yang sudah dibuat

const stockRouter = Router();

// Route untuk membuat stok baru
stockRouter.route('/create').post(createStock);

// Route untuk memperbarui stok
stockRouter.route('/update').put(updateStock);

// Route untuk menghapus stok
stockRouter.route('/delete/:stockId').delete(deleteStock);

// Route untuk admin utama memilih toko
stockRouter.route('/select-store').post(selectStoreForStockUpdate);

// Route untuk store admin memperbarui stok (toko otomatis terpilih)
stockRouter.route('/update-store-admin').put(updateStockForStoreAdmin);

export default stockRouter;
