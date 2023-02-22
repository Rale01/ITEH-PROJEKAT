import mongoose from 'mongoose';
//modeli koji su potrebni
import Property from '../mongodb/models/property.js';
import User from '../mongodb/models/user.js';

import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

//biblioteka dotenv učitava .env fajl
dotenv.config();

//loudinary.config() koja prihvata tri parametra  Ovi parametri se prosleđuju iz .env fajla preko process.env,
//aplikacija može da koristi Cloudinary API za preuzimanje, otpremanje i manipulisanje slikama
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})



const getAllProperties = async (req, res) => {
    //parametri za filtriranje podataka,ograničavanje broja povratnih podataka i sortiranje podataka
    const { _end, _order, _start, _sort, title_like = "", propertyType = ""} = req.query;

    //kasnije se koristi za definisanje različitih parametara za pretraživanje baze podataka
    const query = {};

    //proverava se "propertyType" iz zahteva i ako je definisan, dodaje se u "query" objekat kao parametar
    if(propertyType !== ""){
        query.propertyType = propertyType;
    }

    // Pronađene nekretnine se dodaju u "query" objekat
    if(title_like){
        query.title = {$regex: title_like, $options: 'i' };
    }

    try {
        //countDocuments funkcija da bi se izbrojao broj pronađenih nekretnina pre slanja upita bazi podataka
        const count = await Property.countDocuments({query});

        //vracaju se nekretnine na osnovu zahteva,ogranicenje broja rezultata i da li ima preskakanje, i sortiranje
        const properties = await Property
            .find(query)
            .limit(_end)
            .skip(_start)
            .sort({[_sort]: _order})

        // uključuje se informacija o ukupnom broju pronađenih nekretnina
        res.header('x-total-count', count);
        res.header('Access-Control-Expose-Headers', 'x-total-count');
        //sve pronađene nekretnine se šalju kao JSON odgovor klijentskoj aplikaciji.
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({message:error.message}) 
    }
};

const getPropertyDetail = async (req, res) => {
    //iz parametara zahteva se izdvaja id
    const { id } = req.params;
    //da se nadje ta nekretnina sa tim id-em
    const propertyExists = await Property.findOne({
        _id: id
    }).populate('creator',); //da se prikaze i kreator nekretnine

    //salje odgovor sa detaljima nekretnine
    if(propertyExists) { res.status(200).json(propertyExists) 
    }else{
        res.status(404).json({ message: 'Property not found'});
    }
};

const createProperty = async (req, res) => {

    try {
        //req.body sadrži parametre za kreiranje nekretnine koje je korisnik poslao preko HTTP zahteva.
        const {title, description, propertyType, location, price, photo, email} = req.body;

    //zapocinje se nova transakcija u bazi podataka
    const session = await mongoose.startSession();
    session.startTransaction();

    //pronađe korisnika na osnovu njihove adrese e-pošte
    const user = await User.findOne({ email }).session(session);

    if(!user) throw new Error('User not found');

    //servis da bi se slika nekretnine postavila na mrežu i dobila javni URL.
    const photoUrl = await cloudinary.uploader.upload(photo);

    //novu instanca Property modela, koja se zatim dodaje u bazu podataka. 
    const newProperty = await Property.create({
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url,
        creator: user._id
    });
    // ID nove nekretnine u listu svih nekretnina korisnika. Zatim se ovo ažuriranje čuva u bazi podataka.
    user.allProperties.push(newProperty._id);
    await user.save({ session });

    //izvrsava transakciju, promene tokom transakcije se potvrđuju.
    await session.commitTransaction();

    res.status(200).json({ message: 'Property created succesfully'}) 

    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
   

};
//editovanje propertija
const updateProperty = async (req, res) => {
    try {
        //koji se menja
        const {id} = req.params;
        //req.body sadrži parametre za kreiranje nekretnine koje je korisnik poslao preko HTTP zahteva.
        const {title, description, propertyType, location, price, photo} = req.body;

        const photoUrl = await cloudinary.uploader.upload(photo);

        await Property.findByIdAndUpdate({_id: id}, {
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url || photo

        })

        res.status(200).json({message: 'Property updated successfully'})

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
};


//brisanje propertija
const deleteProperty = async (req, res) => {
    try {
        //koji se brise
        const { id } = req.params;

        //koristi za pronalaženje nekretnine u bazi
        const propertyToDelete = await Property.findById({
            _id: id
        }).populate('creator'); //učitali podaci korisnika koji je kreirao nekretninu

        if(!propertyToDelete) throw new Error('Property not found'); //ako ne postoji

        //zapocinje se nova transakcija u bazi podataka
        const session = await mongoose.startSession();
        session.startTransaction();

        //Uklanjanje nekretnine iz baze podataka koristeći remove funkciju 
        propertyToDelete.remove({session});
        //uklanja referenca na nekretninu kod korisnika sa pull funkcijom
        propertyToDelete.creator.allProperties.pull(propertyToDelete);

        //Ažuriranje korisničkog objekta u bazi podataka kako bi se uklonila referenca
        await propertyToDelete.creator.save({session});
        await session.commitTransaction();

        res.status(200).json({message: 'Property deleted successfully'});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

export {
    getAllProperties,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty,
}