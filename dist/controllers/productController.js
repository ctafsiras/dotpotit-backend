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
exports.listCategories = exports.getProductDetails = exports.listProducts = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const productService = __importStar(require("../services/productService"));
exports.listProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { category, search } = req.query;
    const products = await productService.getProducts(category, search);
    res.json(products);
});
exports.getProductDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json(product);
});
exports.listCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categories = await productService.getCategories();
    res.json(categories);
});
