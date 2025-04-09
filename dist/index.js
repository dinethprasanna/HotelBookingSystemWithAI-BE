"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import .env npm package to project
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var hotel_1 = __importDefault(require("./api/hotel"));
var booking_1 = __importDefault(require("./api/booking"));
var db_1 = __importDefault(require("./infrastructure/db"));
var global_error_handling_middleware_1 = __importDefault(require("./api/middlewares/global-error-handling-middleware"));
var express_2 = require("@clerk/express");
var payment_1 = require("./application/payment");
var body_parser_1 = __importDefault(require("body-parser"));
var payment_2 = __importDefault(require("./api/payment"));
//mongodb ps - t2z342Tm2Ua9di0v
//mongodb+srv://dinethprasanna58:<db_password>@dinsfirstmogodb.rklzk.mongodb.net/?retryWrites=true&w=majority&appName=DinsFirstMogoDB
var app = (0, express_1.default)();
var port = 8080;
app.use((0, express_2.clerkMiddleware)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL }));
app.post("/api/stripe/webhook", body_parser_1.default.raw({ type: "application/json" }), payment_1.handleWebhook);
//middleware test - pre middleware
// app.use((req, res, next) => {
//     console.log("Test Middleware Log");
//     next();
// });
//Default route
app.get("/", function (req, res) {
    // console.log(req.ip);
    res.status(200).send("Dins Hotel Booking BE");
});
app.use("/api/hotels", hotel_1.default);
app.use("/api/bookings", booking_1.default);
app.use("/api/payments", payment_2.default);
//global-error-handling post middleware
app.use(global_error_handling_middleware_1.default);
app.listen(port, function () {
    console.log("Dins Hotel Booking BE - Server runs on port ".concat(port));
});
//# sourceMappingURL=index.js.map