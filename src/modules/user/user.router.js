import { Router } from "express";
import {auth} from "../../middleware/auth.js";
import * as controller from './user.controller.js';

const router = Router();

router.get('/',auth(['superadmin','admin']),controller.getAllUsers);
router.patch('/status/:id',auth(['superadmin','admin']),controller.changeStatus);
router.get('/:id',controller.getUser);
router.delete('/:id',auth(['superadmin']),controller.removeUser);



export default router; 