"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
router.post('/add', cartController_1.addToCart);
router.delete('/remove/:productId', cartController_1.removeFromCart);
router.get('/', cartController_1.getCart);
router.post('/send-bill', cartController_1.sendBillEmail);
exports.default = router;
