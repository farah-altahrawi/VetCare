import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as controller from './admin.controller.js';

const router = Router();

router.get('/',auth(['superadmin']),controller.getAllAdmins);
router.post('/add',auth(['superadmin']),controller.addAdmin);
router.put('/update/:id',auth(['superadmin']),controller.updateAdmin);
router.delete('/remove/:id',auth(['superadmin']),controller.removeAdmin);
router.patch('/adminStatus/:id',auth(['superadmin']),controller.changeAdminStatus);






export default router; 