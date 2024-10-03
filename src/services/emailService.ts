import nodemailer from 'nodemailer';
import { PDFDocument } from 'pdf-lib';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, attachments?: nodemailer.SendMailOptions['attachments']) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html: text,
    attachments,
  });
};

export const generatePDF = async (user: any, cartItems: any[], calculateTotal: () => number): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
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
  page.drawText(`Customer Name: ${user?.name || 'John Doe'}`, { x: 50, y: yPos, size: fontSize });
  yPos -= 20;
  page.drawText(`Email: ${user?.email || 'johndoe@example.com'}`, { x: 50, y: yPos, size: fontSize });
  yPos -= 20;
  page.drawText(`Shipping Address: ${user?.address || '123 Main St, Anytown, USA'}`, { x: 50, y: yPos, size: fontSize });
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
