//biblioteka za rad s MongoDB bazom podataka u Node.js okruženju
import mongoose from "mongoose";

//definicija seme
const PropertySchema = new mongoose.Schema ({
    title: {type:String, required: true},
    description: {type:String, required: true},
    propertyType: {type:String, required: true},
    location: {type:String, required: true},
    price: {type:Number, required: true},
    photo: {type:String, required: true},
    //povezano s drugim modelom "User".
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

})

// Mongoose model za "Property" koji se temelji na prethodno definisanoj šemi 
const propertyModel = mongoose.model('Property', PropertySchema);

export default propertyModel;