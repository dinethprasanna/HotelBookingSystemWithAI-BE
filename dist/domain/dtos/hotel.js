"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHotelDTO = void 0;
var zod_1 = require("zod");
// DTO => Domain Transfer Object
exports.CreateHotelDTO = zod_1.z.object({
    name: zod_1.z.string(),
    location: zod_1.z.string(),
    image: zod_1.z.string(),
    price: zod_1.z.number(),
    description: zod_1.z.string(),
    rating: zod_1.z.number(),
});
//# sourceMappingURL=hotel.js.map