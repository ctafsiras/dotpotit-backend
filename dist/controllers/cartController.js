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
exports.sendBillEmail = exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const cartService = __importStar(require("../services/cartService"));
const emailService_1 = require("../services/emailService");
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.json(cart);
});
exports.removeFromCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(userId, productId);
    res.json(cart);
});
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.user;
    const cart = await cartService.getCart(userId);
    res.json(cart);
});
const sendBillEmail = async (req, res) => {
    var _a;
    try {
        const { email, user } = req.body;
        const cartItems = await cartService.getCartItems((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const pdfBuffer = await (0, emailService_1.generatePDF)(user, cartItems, () => cartService.calculateTotal(cartItems));
        const emailText = `
      <h1>Your Bill</h1>
      <p>Thank you for your order. Please find your bill attached to this email.</p>
      <h2>Order Summary</h2>
      <ul>
        ${cartItems.map((item) => `<li>${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: $${cartService.calculateTotal(cartItems).toFixed(2)}</strong></p>
    `;
        await (0, emailService_1.sendEmail)(email, 'Your Order Bill', emailText, [{ filename: 'bill.pdf', content: pdfBuffer }]);
        res.status(200).json({ message: 'Bill email sent successfully' });
    }
    catch (error) {
        console.error('Error sending bill email:', error);
        res.status(500).json({ error: 'Failed to send bill email' });
    }
};
exports.sendBillEmail = sendBillEmail;
