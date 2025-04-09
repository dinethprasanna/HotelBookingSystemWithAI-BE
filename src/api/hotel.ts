import express from "express";
import {
    getAllHotels,
    getSingleHotelById,
    addNewHotel,
    deleteHotel,
    updateHotel,
    // generateResponse,
} from "../application/hotel";

import { isAuthenticated } from './middlewares/authentication-middleware';
import { isAdmin } from "./middlewares/authorization-middleware";

import { createEmbeddings } from "../application/embedding";

import { retrieve } from "../application/retrieve";

const hotelRouter = express.Router();


hotelRouter.route("/")
    .get(getAllHotels)
    .post(isAuthenticated, isAdmin, addNewHotel);


hotelRouter.route("/:id")
    .get(getSingleHotelById)
    .delete(deleteHotel)
    .put(updateHotel);

// hotelRouter.route("/llm").post(generateResponse);

hotelRouter.route("/embeddings/create").post(createEmbeddings);

hotelRouter.route("/search/retrieve").get(retrieve);


export default hotelRouter;