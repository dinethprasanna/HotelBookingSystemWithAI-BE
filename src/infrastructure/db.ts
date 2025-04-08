import mongoose from "mongoose";
//mongodb ps - t2z342Tm2Ua9di0v
//mongodb+srv://dinethprasanna58:<db_password>@dinsfirstmogodb.rklzk.mongodb.net/?retryWrites=true&w=majority&appName=DinsFirstMogoDB
//ABOVE MONGODB URL MOVED INTO .ENV FILE
const connectDB = async () => {
    try {

        //Get mongodb url from .env file also for read .env install npm package - npm i dotenv
        //now import dotenv on index.js file
        const MONGODB_URL = process.env.MONGODB_URL;

        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not set or missing!");
        }

        await mongoose.connect(MONGODB_URL);

        console.log("Connected to the DB.:)");
    } catch (error) {
        console.log("Error connecting to the DB.:(");
        console.log(error);
    }
}

//created a collection clicking on create my own data here we created db called "DevDB"
//and that db name on > mongodb+srv after / and ? between them place the DB Name --> "...ngodb.net/DevDB?retryWrite..."
//wriet export default connectDB

export default connectDB;
