"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const pdf_lib_1 = require("pdf-lib");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = async (to, subject, text, attachments) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: text,
        attachments,
    });
};
exports.sendEmail = sendEmail;
const generatePDF = async (user, cartItems, calculateTotal) => {
    const pdfDoc = await pdf_lib_1.PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    let yPos = height - 50;
    // Add title
    page.drawText('Bill', { x: width / 2 - 15, y: yPos, size: 20 });
    yPos -= 30;
    // Add bill details
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: yPos, size: fontSize });
    yPos -= 20;
    page.drawText(`Order ID: ${Math.random().toString(36).substr(2, 9)}`, { x: 50, y: yPos, size: fontSize });
    yPos -= 20;
    page.drawText(`Customer Name: ${(user === null || user === void 0 ? void 0 : user.name) || 'John Doe'}`, { x: 50, y: yPos, size: fontSize });
    yPos -= 20;
    page.drawText(`Email: ${(user === null || user === void 0 ? void 0 : user.email) || 'johndoe@example.com'}`, { x: 50, y: yPos, size: fontSize });
    yPos -= 20;
    page.drawText(`Shipping Address: ${(user === null || user === void 0 ? void 0 : user.address) || '123 Main St, Anytown, USA'}`, { x: 50, y: yPos, size: fontSize });
    yPos -= 40;
    // Add order summary
    page.drawText('Order Summary', { x: 50, y: yPos, size: 16 });
    yPos -= 20;
    cartItems.forEach((item) => {
        page.drawText(`${item.product.name} (x${item.quantity})`, { x: 50, y: yPos, size: fontSize });
        page.drawText(`$${(item.product.price * item.quantity).toFixed(2)}`, { x: width - 70, y: yPos, size: fontSize });
        yPos -= 20;
    });
    // Add total
    yPos -= 10;
    page.drawText('Total:', { x: 50, y: yPos, size: 14 });
    page.drawText(`$${calculateTotal().toFixed(2)}`, { x: width - 70, y: yPos, size: 14 });
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
};
exports.generatePDF = generatePDF;
