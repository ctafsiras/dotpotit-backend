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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.verifyEmail = exports.sendVerificationEmail = exports.generateVerificationToken = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const apiError_1 = require("../utils/apiError");
const emailService = __importStar(require("./emailService"));
const prisma = new client_1.PrismaClient();
const createUser = async (email, password) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new apiError_1.ApiError(400, 'Email already in use');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
};
exports.createUser = createUser;
const generateVerificationToken = async (userId) => {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    await prisma.user.update({
        where: { id: userId },
        data: { verificationToken: token },
    });
    return token;
};
exports.generateVerificationToken = generateVerificationToken;
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `https://dotpotit-backend.vercel.app/api/auth/verify-email/${token}`;
    await emailService.sendEmail(email, 'Verify Your Email', `Please click the button below to verify your email:
    
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify</a>`);
};
exports.sendVerificationEmail = sendVerificationEmail;
const verifyEmail = async (token) => {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
        throw new apiError_1.ApiError(400, 'Invalid verification token');
    }
    await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verificationToken: null },
    });
};
exports.verifyEmail = verifyEmail;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    }
    if (!user.isVerified) {
        throw new apiError_1.ApiError(401, 'Please verify your email before logging in');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return { user: { id: user.id, email: user.email }, token };
};
exports.loginUser = loginUser;
