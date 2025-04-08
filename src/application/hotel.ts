import { Request, Response, NextFunction } from "express";

import Hotel from "../infrastructure/schemas/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

import { CreateHotelDTO } from "../domain/dtos/hotel";

import OpenAI from "openai";

import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";

import stripe from "../infrastructure/stripe";



export const getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hotelsFromDb = await Hotel.find();
        res.status(200).json(hotelsFromDb);
        return;
    } catch (error) {
        next(error);
    }
};


export const getSingleHotelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const selectedHotelId = req.params.id;
        const foundHotel = await Hotel.findById(selectedHotelId);

        if (!foundHotel) {
            //since we have defiened error handlings
            throw new NotFoundError("Hotel not found!");
        }

        res.status(200).send(foundHotel);
    } catch (error) {
        next(error);//this is error handling and this is a post-middleware
    }
};


export const addNewHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newHotelData = CreateHotelDTO.safeParse(req.body);

        //Validate the request data

        //After Zod Validation with DTO
        if (!newHotelData.success) {
            throw new ValidationError(newHotelData.error.message);
        }

        // Create a product in Stripe
        const stripeProduct = await stripe.products.create({
            name: newHotelData.data.name,
            description: newHotelData.data.description,
            default_price_data: {
                unit_amount: Math.round(newHotelData.data.price * 100), // Convert to cents
                currency: "usd",
            },
        });

        // Add the hotel
        const storedHotelData = await Hotel.create({
            name: newHotelData.data.name,
            location: newHotelData.data.location,
            price: newHotelData.data.price,
            rating: newHotelData.data.rating,
            description: newHotelData.data.description,
            image: newHotelData.data.image,
            stripePriceId: stripeProduct.default_price,
        });

        console.log("New Hotel added!!!");
        console.log(storedHotelData);

        //add new hotelvector
        const embeddingsModel = new OpenAIEmbeddings({
            model: "text-embedding-ada-002",
            apiKey: process.env.OPENAI_API_KEY,
        });

        const vectorIndex = new MongoDBAtlasVectorSearch(embeddingsModel, {
            collection: mongoose.connection.collection("hotelVectors"),
            indexName: "vector_index",
        });

        const { _id, location, price, description } = storedHotelData;
        const doc = new Document({
            pageContent: `${description} Located in ${location}. Price per night: ${price}`,
            metadata: {
                _id,
            },
        });

        await vectorIndex.addDocuments([doc]);

        // Return the response
        res.status(201).send();
        return;
    } catch (error) {
        next(error);
    }
};


export const deleteHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getRemoveHotelId = req.params.id;

        await Hotel.findByIdAndDelete(getRemoveHotelId);

        res.status(200).send();
        return;
    } catch (error) {
        next(error);
    }
};


export const updateHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateHotelId = req.params.id;
        const updateHotelData = req.body;

        if (
            !updateHotelData.rating || !updateHotelData.name || !updateHotelData.location || !updateHotelData.price || !updateHotelData.description
        ) {
            throw new ValidationError("Invalid Updating hotel information");
        }

        //Update the Hotel Data
        await Hotel.findByIdAndUpdate(updateHotelId, updateHotelData);

        res.status(200).send();
    } catch (error) {
        next(error);
    }
};


// export const generateResponse = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { prompt } = req.body;

//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY,
//     });

//     const completion = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//             // {
//             //   role: "system",
//             //   content:
//             //     "You are assistant that will categorize the words that a user gives and give them labels and show an output. Return this response as in the following examples: user: Lake, Cat, Dog, Tree; response: [{label:Nature, words:['Lake', 'Tree']}, {label:Animals, words:['Cat', 'Dog']}] ",
//             // },
//             { role: "user", content: prompt },
//         ],
//         store: true,
//     });

//     res.status(200).json({
//         message: {
//             role: "assistant",
//             content: completion.choices[0].message.content,
//         },
//     });
//     return;
// };