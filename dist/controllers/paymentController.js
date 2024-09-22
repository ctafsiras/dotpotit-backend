"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = exports.getPaymentHistory = exports.confirmPayment = exports.createPaymentIntent = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const paymentService = __importStar(require("../services/paymentService"));
const cartService = __importStar(require("../services/cartService"));
exports.createPaymentIntent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const cart = await cartService.getCart(userId);
    const paymentIntent = await paymentService.createPaymentIntent(userId, cart);
    res.json(paymentIntent);
});
exports.confirmPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const { paymentIntentId } = req.body;
    const order = await paymentService.confirmPayment(userId, paymentIntentId);
    res.json(order);
});
exports.getPaymentHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const history = await paymentService.getPaymentHistory(userId);
    res.json(history);
});
exports.generateInvoice = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const { orderId } = req.params;
    const invoice = await paymentService.generateInvoice(userId, orderId);
    res.json(invoice);
});
