//Uvoz biblioteke Express koja se koristi za upravljanje rutama i zahtevima
import express from 'express';
//funkcije iz kontrolera
import { createProperty,deleteProperty,getAllProperties,getPropertyDetail,updateProperty } from '../controllers/property.controller.js';

//Kreiranje novog router objekta koji se koristi za definisanje novih ruta
const router = express.Router();

router.route('/').get(getAllProperties);

router.route('/:id').get(getPropertyDetail);

router.route('/').post(createProperty);

//za azuriranje samo odredjenih delova
router.route('/:id').patch(updateProperty);

router.route('/:id').delete(deleteProperty);

export default router;

