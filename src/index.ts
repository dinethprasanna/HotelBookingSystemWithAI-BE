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
const port = 8080;

app.use(clerkMiddleware());

app.use(express.json());
app.use(cors());

connectDB();

// app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(cors({ origin: "https://hotel-booking-system-with-ai-fe.vercel.app" }));

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

//middleware test - pre middleware
// app.use((req, res, next) => {
//     console.log("Test Middleware Log");
//     next();
// });

//https://www.youtube.com/watch?v=B-T69_VP2Ls


//Default route
app.get("/", (req, res) => {
    // console.log(req.ip);
    res.status(200).send("Dins Hotel Booking BE");
});


app.use("/api/hotels", hotelRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentsRouter);


//global-error-handling post middleware
app.use(globalErrorHandlingMiddleware);

app.listen(port, () => {
    console.log(`Dins Hotel Booking BE - Server runs on port ${port}`);
});
