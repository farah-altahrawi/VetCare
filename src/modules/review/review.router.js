import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as controller from './review.controller.js';

const router = Router({mergeParams:true});

router.post('/:id',auth(['user']),controller.create);
router.delete('/:id',auth(['user']),controller.remove);
router.put('/:id',auth(['user']),controller.update);




export default router; 