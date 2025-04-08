import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: {
        type: Number,
      },
      image: {
        type: String,
        required: true,
      },
      stripePriceId: {
        type: String,
        required: true,
      },
});

//Now we make this as a Model. Model use to manipulate Db using JS
const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;