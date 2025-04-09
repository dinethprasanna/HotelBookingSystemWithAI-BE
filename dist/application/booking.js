"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.deleteBookingById = exports.updateBookingStatus = exports.getBookingById = exports.getAllBookingsForUser = exports.getAllBookings = exports.getAllBookingsForHotel = exports.createBooking = void 0;
var Booking_1 = __importDefault(require("../infrastructure/schemas/Booking"));
var booking_1 = require("../domain/dtos/booking");
var validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
var express_1 = require("@clerk/express");
var not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
var createBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var booking, user, newBooking, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                booking = booking_1.CreateBookingDTO.safeParse(req.body);
                console.log(booking);
                // Validate the request data
                if (!booking.success) {
                    throw new validation_error_1.default(booking.error.message);
                }
                user = req.auth;
                return [4 /*yield*/, Booking_1.default.create({
                        hotelId: booking.data.hotelId,
                        userId: user.userId,
                        checkIn: booking.data.checkIn,
                        checkOut: booking.data.checkOut,
                        roomNumber: booking.data.roomNumber,
                        note: booking.data.note,
                        booking_price: booking.data.booking_price
                    })];
            case 1:
                newBooking = _a.sent();
                // await Booking.deleteMany({});
                // Return the response
                res.status(201).json(newBooking);
                return [2 /*return*/];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createBooking = createBooking;
var getAllBookingsForHotel = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var hotelId, bookings, bookingsWithUser, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                (0, exports.updateBookingStatus)();
                hotelId = req.params.hotelId;
                return [4 /*yield*/, Booking_1.default.find({ hotelId: hotelId })];
            case 1:
                bookings = _a.sent();
                return [4 /*yield*/, Promise.all(bookings.map(function (el) { return __awaiter(void 0, void 0, void 0, function () {
                        var user;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, express_1.clerkClient.users.getUser(el.userId)];
                                case 1:
                                    user = _b.sent();
                                    return [2 /*return*/, { _id: el._id, hotelId: el.hotelId, checkIn: el.checkIn, checkOut: el.checkOut, roomNumber: el.roomNumber, note: el.note, bookedDateTime: el.bookedDateTime, booking_price: el.booking_price, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: (_a = user.primaryEmailAddress) === null || _a === void 0 ? void 0 : _a.emailAddress } }];
                            }
                        });
                    }); }))];
            case 2:
                bookingsWithUser = _a.sent();
                res.status(200).json(bookingsWithUser);
                return [2 /*return*/];
            case 3:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllBookingsForHotel = getAllBookingsForHotel;
var getAllBookings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookings, userIds, userPromises, users, userMap_1, bookingsWithUserInfo, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                (0, exports.updateBookingStatus)();
                return [4 /*yield*/, Booking_1.default.find().populate("hotelId")];
            case 1:
                bookings = _a.sent();
                userIds = Array.from(new Set(bookings.map(function (b) { return b.userId.toString(); })));
                userPromises = userIds.map(function (userId) { return express_1.clerkClient.users.getUser(userId); });
                return [4 /*yield*/, Promise.all(userPromises)];
            case 2:
                users = _a.sent();
                userMap_1 = users.reduce(function (acc, user) {
                    var _a, _b;
                    acc[user.id] = {
                        fullName: "".concat(user.firstName || "", " ").concat(user.lastName || "").trim(),
                        email: ((_b = (_a = user.emailAddresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.emailAddress) || "",
                    };
                    return acc;
                }, {});
                bookingsWithUserInfo = bookings.map(function (booking) {
                    var user = userMap_1[booking.userId] || { fullName: "Unknown", email: "N/A" };
                    return __assign(__assign({}, booking.toObject()), { user: user });
                });
                res.status(200).json(bookingsWithUserInfo);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllBookings = getAllBookings;
var getAllBookingsForUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, bookings, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                (0, exports.updateBookingStatus)();
                userId = req.params.userId;
                // Get user ID from Clerk authentication
                if (!userId) {
                    res.status(401).json({ message: "Unauthorized" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Booking_1.default.find({ userId: userId })];
            case 1:
                bookings = _a.sent();
                res.status(200).json(bookings);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllBookingsForUser = getAllBookingsForUser;
var getBookingById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookingId, booking, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                bookingId = req.params.bookingId;
                return [4 /*yield*/, Booking_1.default.findById(bookingId)];
            case 1:
                booking = _a.sent();
                if (!booking) {
                    throw new not_found_error_1.default("Booking not found");
                }
                res.status(200).json(booking);
                return [2 /*return*/];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getBookingById = getBookingById;
//Update the booking status function
var updateBookingStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bookings, now, updatedBookings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Booking_1.default.find()];
            case 1:
                bookings = _a.sent();
                now = new Date();
                return [4 /*yield*/, Promise.all(bookings.map(function (booking) { return __awaiter(void 0, void 0, void 0, function () {
                        var newStatus;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (now < booking.checkIn) {
                                        newStatus = 'Upcoming';
                                    }
                                    else if (now >= booking.checkIn && now <= booking.checkOut) {
                                        newStatus = 'Ongoing';
                                    }
                                    else {
                                        newStatus = 'Completed';
                                    }
                                    if (!(booking.booking_status !== newStatus)) return [3 /*break*/, 2];
                                    booking.booking_status = newStatus;
                                    return [4 /*yield*/, booking.save()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/, booking];
                            }
                        });
                    }); }))];
            case 2:
                updatedBookings = _a.sent();
                return [2 /*return*/, updatedBookings];
        }
    });
}); };
exports.updateBookingStatus = updateBookingStatus;
var deleteBookingById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookingId, booking, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                bookingId = req.params.id;
                return [4 /*yield*/, Booking_1.default.findByIdAndDelete(bookingId)];
            case 1:
                booking = _a.sent();
                if (!booking) {
                    throw new not_found_error_1.default("Booking not found");
                }
                (0, exports.updateBookingStatus)();
                res.status(200).send();
                return [2 /*return*/];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteBookingById = deleteBookingById;
//# sourceMappingURL=booking.js.map