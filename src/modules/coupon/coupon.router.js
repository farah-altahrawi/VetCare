import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as controller from './coupon.controller.js';

const router = Router();

router.post('/',auth(['superadmin','admin']),controller.createCoupon);
router.get('/',auth(['superadmin','admin']),controller.getCoupon);
router.patch('/:id',auth(['superadmin','admin']),controller.updateCoupon);
router.delete('/:id',auth(['superadmin','admin']),controller.removeCoupon);





export default router; 