import mongoose from "mongoose";

//connectDB  uspostavlja vezu sa MongoDB bazom podataka preko mongoose biblioteke. 
const connectDB = (url) => {
    //mongoose ce bacati greške ako se pokuša izvršiti query (upit) sa nepostojećim poljima u modelu.
    mongoose.set("strictQuery", true);

    mongoose
    //uspostavlja vezu sa bazom podataka preko url argumenta koji se prosleđuje funkciji. 
        .connect(url)
        .then(() => console.log("MongoDB connected"))
        .catch((error) => console.log(error));
};

export default connectDB;