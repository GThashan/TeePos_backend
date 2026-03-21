"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceipt = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateReceipt = (sale, res) => {
    // 80mm roll paper width is approx 226 points. 
    // We'll set a standard receipt width (226) and a somewhat long height.
    const pageWidth = 226;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const doc = new pdfkit_1.default({ size: [pageWidth, 400], margin: margin });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt-${sale._id}.pdf`);
    doc.pipe(res);
    // Helper for star dashed line
    const generateDashedLine = () => {
        doc.fontSize(8).font("Helvetica").text("***********************************************************", { align: "center", width: contentWidth, lineBreak: false });
    };
    doc.moveDown(0.5);
    // ===== SHOP HEADER =====
    doc.fontSize(14).font("Helvetica-Bold").text("TeePOS", { align: "center", width: contentWidth });
    doc.moveDown(0.2);
    doc.fontSize(8).font("Helvetica").text("Address: No 1245/34 Embilipitiya new town road", { align: "center", width: contentWidth });
    doc.text("Telp. 077-1234567", { align: "center", width: contentWidth });
    doc.moveDown(0.5);
    // ===== DASH LINE =====
    generateDashedLine();
    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica").text("CASH RECEIPT", { align: "center", width: contentWidth });
    doc.moveDown(0.2);
    generateDashedLine();
    doc.moveDown(0.2);
    // ===== TABLE HEADER =====
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Description", margin, doc.y, { continued: true });
    doc.text("Price", { align: "right", width: contentWidth });
    doc.moveDown(0.2);
    // ===== ITEMS =====
    doc.font("Helvetica").fontSize(8);
    let total = 0;
    if (sale.items && sale.items.length > 0) {
        sale.items.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            doc.text(`${item.name} x${item.quantity}`, margin, doc.y, { continued: true });
            doc.text(`${itemTotal.toFixed(2)}`, { align: "right", width: contentWidth });
        });
    }
    doc.moveDown(0.2);
    generateDashedLine();
    doc.moveDown(0.2);
    // ===== TOTAL =====
    doc.fontSize(11).font("Helvetica-Bold");
    doc.text("Total", margin, doc.y, { continued: true });
    doc.text(`${sale.totalAmount ? sale.totalAmount.toFixed(2) : total.toFixed(2)}`, { align: "right", width: contentWidth });
    doc.moveDown(0.2);
    // Optional: Cash / Change (if available)
    doc.fontSize(8).font("Helvetica");
    if (sale.cash !== undefined) {
        doc.text("Cash", margin, doc.y, { continued: true });
        doc.text(`${sale.cash.toFixed(2)}`, { align: "right", width: contentWidth });
    }
    if (sale.change !== undefined) {
        doc.text("Change", margin, doc.y, { continued: true });
        doc.text(`${sale.change.toFixed(2)}`, { align: "right", width: contentWidth });
    }
    if (sale.paymentMethod) {
        doc.moveDown(0.2);
        generateDashedLine();
        doc.moveDown(0.2);
        doc.text(`Payment`, margin, doc.y, { continued: true });
        doc.text(`${sale.paymentMethod}`, { align: "right", width: contentWidth });
        if (sale.paymentMethod.toLowerCase() === 'card') {
            doc.text(`Approval Code`, margin, doc.y, { continued: true });
            doc.text(`#${Math.floor(Math.random() * 900000) + 100000}`, { align: "right", width: contentWidth });
        }
    }
    doc.moveDown(0.2);
    generateDashedLine();
    doc.moveDown(0.5);
    // ===== THANK YOU =====
    doc.fontSize(10).font("Helvetica-Bold").text("THANK YOU!", { align: "center", width: contentWidth });
    // ===== BARCODE (simple lines) =====
    doc.moveDown(1);
    const barcodeY = doc.y;
    const barcodeHeight = 25;
    const barcodeWidth = 120;
    const startX = (pageWidth - barcodeWidth) / 2;
    let currentX = startX;
    while (currentX < startX + barcodeWidth) {
        const lineW = Math.random() > 0.7 ? 2.5 : Math.random() > 0.4 ? 1.5 : 0.5;
        const gap = Math.random() > 0.5 ? 2 : 1;
        if (currentX + lineW <= startX + barcodeWidth) {
            doc.lineWidth(lineW);
            doc.moveTo(currentX, barcodeY)
                .lineTo(currentX, barcodeY + barcodeHeight)
                .stroke();
        }
        currentX += lineW + gap;
    }
    doc.end();
};
exports.generateReceipt = generateReceipt;
