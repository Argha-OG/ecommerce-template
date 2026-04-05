import jsPDF from "jspdf";

export function generateInvoice(orderData) {
  const doc = new jsPDF();
  
  // Zynzyr Brand Colors & Fonts (approximated for jsPDF)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  
  // Title / Logo text
  doc.text("ZYNZYR", 20, 30);
  
  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Premium Fashion E-Commerce", 20, 36);

  // Invoice Details
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", 150, 30);
  
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 36);
  doc.text(`Order ID: #${orderData.orderId || Math.floor(Math.random() * 10000)}`, 150, 42);

  // Line Separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, 190, 50);

  // Customer Details
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text(orderData.customerName || "Customer Name", 20, 66);
  doc.text(orderData.customerEmail || "customer@example.com", 20, 72);
  doc.text(orderData.shippingAddress || "123 Fashion Street, KL, MY", 20, 78);

  // Order Items Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 90, 170, 10, "F");
  
  doc.setFont("helvetica", "bold");
  doc.text("Item / SKU", 25, 97);
  doc.text("Qty", 130, 97);
  doc.text("Price (RM)", 160, 97);

  // Order Items
  doc.setFont("helvetica", "normal");
  let yPos = 110;
  let total = 0;

  const items = orderData.items || [
    { name: "Signature Piece #1", sku: "SKU-001", qty: 1, price: 350.00 }
  ];

  items.forEach(item => {
    doc.text(`${item.name} (${item.sku})`, 25, yPos);
    doc.text(`${item.qty}`, 130, yPos);
    doc.text(`${item.price.toFixed(2)}`, 160, yPos);
    total += item.qty * item.price;
    yPos += 10;
  });

  // Totals
  doc.line(120, yPos, 190, yPos);
  doc.setFont("helvetica", "bold");
  doc.text("Total", 130, yPos + 8);
  doc.text(`RM ${total.toFixed(2)}`, 160, yPos + 8);

  // Footer Message
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your purchase. We hope you enjoy the premium quality.", 105, 280, null, null, "center");

  // Save the PDF
  doc.save(`zynzyr-invoice-${orderData.orderId || 'new'}.pdf`);
}
