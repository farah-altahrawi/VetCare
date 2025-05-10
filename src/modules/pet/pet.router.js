import { Router } from "express";
import {auth} from "../../middleware/auth.js";
import * as controller from './pet.controller.js';

const router = Router();

router.get('/',auth(['user']),controller.getAllPets);
router.get('/:id',auth(['user']),controller.getPetInfo);
router.post('/',auth(['user']),controller.addPet);
router.put('/:id',auth(['user']),controller.updatePet);
router.delete('/:id',auth(['user']),controller.removePet);



export default router; 