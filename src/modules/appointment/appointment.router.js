import { Router } from "express";
import {auth} from "../../middleware/auth.js";
import * as controller from './appointment.controller.js';

const router = Router();

router.post('/',auth(['user']),controller.createAppointment);
router.get('/',auth(['user']),controller.getAppointments);
router.patch('/changeStatus/:id',auth(['admin','vet']),controller.changeStatus);
router.delete('/:id',auth(['user']),controller.removeAppointment);





export default router; 