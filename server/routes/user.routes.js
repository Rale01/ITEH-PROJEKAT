//Uvoz biblioteke Express koja se koristi za upravljanje rutama i zahtevima
import express from 'express';
//funkcije iz kontrolera
import { createUser, getAllUsers, getUserInfoByID} from '../controllers/user.controller.js';

//Kreiranje novog router objekta koji se koristi za definisanje novih ruta
const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/').post(createUser);

router.route('/:id').get(getUserInfoByID);

export default router;