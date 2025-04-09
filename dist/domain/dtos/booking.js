"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingDTO = void 0;
var zod_1 = require("zod");
exports.CreateBookingDTO = zod_1.z.object({
    hotelId: zod_1.z.string(),
    checkIn: zod_1.z.string(),
    checkOut: zod_1.z.string(),
    roomNumber: zod_1.z.number(),
    note: zod_1.z.string().optional(),
    // bookedDateTime: z.string()
    booking_price: zod_1.z.number()
});
//# sourceMappingURL=booking.js.map