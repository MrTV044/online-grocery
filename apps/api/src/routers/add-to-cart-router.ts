import express from 'express';
import { addToCart } from '../controllers/add-to-cart-controller.js';

const router = express.Router();

router.route('/cart').post(addToCart).get(addToCart);

export default router;
