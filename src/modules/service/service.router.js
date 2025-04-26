import { Router } from "express";
import {auth} from "../../middleware/auth.js";
import fileUpload , {fileValidation} from '../../utils/multer.js';
import * as controller from './service.controller.js';

const router = Router();

router.get('/',controller.getAllServices);
router.post('/create',auth(['superadmin','admin']),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:4}
]),controller.createService);
router.get('/:id',controller.getServiceDetails);
router.patch('/:id',auth(['superadmin','admin']),controller.updateService);
router.delete('/:id',auth(['superadmin','admin']),controller.removeService);




export default router; 
