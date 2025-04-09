"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHotel = exports.deleteHotel = exports.addNewHotel = exports.getSingleHotelById = exports.getAllHotels = void 0;
var Hotel_1 = __importDefault(require("../infrastructure/schemas/Hotel"));
var not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
var validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
var hotel_1 = require("../domain/dtos/hotel");
var openai_1 = require("@langchain/openai");
var documents_1 = require("@langchain/core/documents");
var mongodb_1 = require("@langchain/mongodb");
var mongoose_1 = __importDefault(require("mongoose"));
var stripe_1 = __importDefault(require("../infrastructure/stripe"));
var getAllHotels = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var hotelsFromDb, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Hotel_1.default.find()];
            case 1:
                hotelsFromDb = _a.sent();
                res.status(200).json(hotelsFromDb);
                return [2 /*return*/];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllHotels = getAllHotels;
var getSingleHotelById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var selectedHotelId, foundHotel, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                selectedHotelId = req.params.id;
                return [4 /*yield*/, Hotel_1.default.findById(selectedHotelId)];
            case 1:
                foundHotel = _a.sent();
                if (!foundHotel) {
                    //since we have defiened error handlings
                    throw new not_found_error_1.default("Hotel not found!");
                }
                res.status(200).send(foundHotel);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2); //this is error handling and this is a post-middleware
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleHotelById = getSingleHotelById;
var addNewHotel = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var newHotelData, stripeProduct, storedHotelData, embeddingsModel, vectorIndex, _id, location, price, description, doc, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                newHotelData = hotel_1.CreateHotelDTO.safeParse(req.body);
                //Validate the request data
                //After Zod Validation with DTO
                if (!newHotelData.success) {
                    throw new validation_error_1.default(newHotelData.error.message);
                }
                return [4 /*yield*/, stripe_1.default.products.create({
                        name: newHotelData.data.name,
                        description: newHotelData.data.description,
                        default_price_data: {
                            unit_amount: Math.round(newHotelData.data.price * 100), // Convert to cents
                            currency: "usd",
                        },
                    })];
            case 1:
                stripeProduct = _a.sent();
                return [4 /*yield*/, Hotel_1.default.create({
                        name: newHotelData.data.name,
                        location: newHotelData.data.location,
                        price: newHotelData.data.price,
                        rating: newHotelData.data.rating,
                        description: newHotelData.data.description,
                        image: newHotelData.data.image,
                        stripePriceId: stripeProduct.default_price,
                    })];
            case 2:
                storedHotelData = _a.sent();
                console.log("New Hotel added!!!");
                console.log(storedHotelData);
                embeddingsModel = new openai_1.OpenAIEmbeddings({
                    model: "text-embedding-ada-002",
                    apiKey: process.env.OPENAI_API_KEY,
                });
                vectorIndex = new mongodb_1.MongoDBAtlasVectorSearch(embeddingsModel, {
                    collection: mongoose_1.default.connection.collection("hotelVectors"),
                    indexName: "vector_index",
                });
                _id = storedHotelData._id, location = storedHotelData.location, price = storedHotelData.price, description = storedHotelData.description;
                doc = new documents_1.Document({
                    pageContent: "".concat(description, " Located in ").concat(location, ". Price per night: ").concat(price),
                    metadata: {
                        _id: _id,
                    },
                });
                return [4 /*yield*/, vectorIndex.addDocuments([doc])];
            case 3:
                _a.sent();
                // Return the response
                res.status(201).send();
                return [2 /*return*/];
            case 4:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addNewHotel = addNewHotel;
var deleteHotel = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var getRemoveHotelId, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getRemoveHotelId = req.params.id;
                return [4 /*yield*/, Hotel_1.default.findByIdAndDelete(getRemoveHotelId)];
            case 1:
                _a.sent();
                res.status(200).send();
                return [2 /*return*/];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteHotel = deleteHotel;
var updateHotel = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var updateHotelId, updateHotelData, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updateHotelId = req.params.id;
                updateHotelData = req.body;
                if (!updateHotelData.rating || !updateHotelData.name || !updateHotelData.location || !updateHotelData.price || !updateHotelData.description) {
                    throw new validation_error_1.default("Invalid Updating hotel information");
                }
                //Update the Hotel Data
                return [4 /*yield*/, Hotel_1.default.findByIdAndUpdate(updateHotelId, updateHotelData)];
            case 1:
                //Update the Hotel Data
                _a.sent();
                res.status(200).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateHotel = updateHotel;
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
//# sourceMappingURL=hotel.js.map