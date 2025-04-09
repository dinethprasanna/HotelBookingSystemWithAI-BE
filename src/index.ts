//import .env npm package to project
import "dotenv/config";

import express from "express";
import cors from "cors";
import hotelRouter from "./api/hotel";
import bookingRouter from "./api/booking";
import connectDB from './infrastructure/db';
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";
import paymentsRouter from "./api/payment";


//mongodb ps - t2z342Tm2Ua9di0v
//mongodb+srv://dinethprasanna58:<db_password>@dinsfirstmogodb.rklzk.mongodb.net/?retryWrites=true&w=majority&appName=DinsFirstMogoDB

const app = express();
const port = process.env.PORT || 8080;

app.use(clerkMiddleware());

app.use(express.json());

app.use(globalErrorHandlingMiddleware);
connectDB();

app.use(cors({ origin: "https://hotel-booking-system-with-ai-fe.vercel.app" }));


app.listen(port, () => {
    console.log(`Dins Hotel Booking BE - Server runs on port ${port}`);
});
