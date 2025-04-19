import express from 'express';
import {
  addToCart,
  showAllCartItems,
  deleteCartItem,
} from '../controllers/carting-controller.js';

const router = express.Router();

router.route('/addcart').post(addToCart);
router.route('/showcart').get(showAllCartItems);
router.route('/deletecart').delete(deleteCartItem);

export default router;
