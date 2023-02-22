import express from 'express';
//za citanje iz env fajla
import * as dotenv from 'dotenv';
//omogucavanje pristupa iz drugih domena
import cors from 'cors';

import connectDB from './mongodb/connect.js';
//rute
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js'

//ucitava konfiguracione varijable iz env fajla
dotenv.config();

//kreira instancu Express aplikacije koja se kasnije koristi za definisanje ruta i ponasanja
const app = express();
// Cors middleware omogucava da se omoguci pristup aplikaciji iz drugih domena
app.use(cors());
app.use(express.json({limit: '50mb'}));

//ruta za pocetnu stranicu
app.get('/', (req,res) => {
    res.send({message: 'Hello World!' });
})

// metoda use za registraciju ruta koje su importovane iz drugih fajlova. 
//prefiksi ruta
app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRouter);


//povezivanje na MongoDB bazu podataka koristeći "connectDB" funkciju koja se nalazi u "mongodb/connect.js
const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);

        //slusaju se zahtevi na tom portu
        app.listen(8080, () => console.log('Server started on port http://localhost:8080'));
    } catch (error) {
        console.log(error);
    }
}

startServer();