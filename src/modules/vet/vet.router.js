import { Router } from "express";
import {auth} from "../../middleware/auth.js";
import * as controller from './vet.controller.js';
import reviewRouter from '../review/review.router.js';

const router = Router();

router.use('/:vetId/reviews',reviewRouter);
router.get('/',auth(['superadmin','admin']),controller.getAllVets);
router.get('/active',controller.getActiveVets);
router.get('/:id',controller.getVet);
router.patch('/availableAppointments',auth(['vet']),controller.addAvailableAppointments);
router.patch('/updateVet',auth(['vet']),controller.updateVet);

//router.delete('/:id',auth(['superadmin']),controller.removeUser);



export default router; 