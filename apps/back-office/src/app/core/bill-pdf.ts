/** Minimal text PDF for a successful bill — no extra npm deps. */

export interface BillPdfLine {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface BillPdfInput {
  shopName: string;
  orderNumber?: string | null;
  customerName: string;
  customerPhone?: string | null;
  paymentMethod: string;
  lines: BillPdfLine[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency?: string;
  createdAt?: Date;
}

export function downloadBillPdf(input: BillPdfInput): void {
  const bytes = buildSimplePdf(renderBillLines(input));
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const stamp = (input.createdAt ?? new Date()).toISOString().slice(0, 10);
  const orderPart = input.orderNumber?.trim() || 'bill';
  anchor.href = url;
  anchor.download = `junction-${orderPart}-${stamp}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function renderBillLines(input: BillPdfInput): string[] {
  const currency = input.currency || 'INR';
  const when = (input.createdAt ?? new Date()).toLocaleString();
  const rows: string[] = [
    'Junction — Bill',
    input.shopName || 'Shop',
    `Date: ${when}`,
  ];
  if (input.orderNumber) {
    rows.push(`Order: ${input.orderNumber}`);
  }
  rows.push(`Customer: ${input.customerName}`);
  if (input.customerPhone) {
    rows.push(`Phone: ${input.customerPhone}`);
  }
  rows.push(`Payment: ${input.paymentMethod}`);
  rows.push('--------------------------------');
  for (const line of input.lines) {
    rows.push(
      `${line.name}  x${line.quantity}  @ ${currency} ${line.unitPrice.toFixed(2)}  = ${currency} ${line.lineTotal.toFixed(2)}`,
    );
  }
  rows.push('--------------------------------');
  rows.push(`Subtotal: ${currency} ${input.subtotal.toFixed(2)}`);
  rows.push(`Tax: ${currency} ${input.taxAmount.toFixed(2)}`);
  rows.push(`Total: ${currency} ${input.totalAmount.toFixed(2)}`);
  rows.push('Thank you');
  return rows;
}

function buildSimplePdf(lines: string[]): Uint8Array {
  const sanitized = lines.map((line) => pdfEscape(line.slice(0, 110)));
  const contentLines = ['BT', '/F1 11 Tf', '50 780 Td', '14 TL'];
  sanitized.forEach((line, index) => {
    if (index === 0) {
      contentLines.push(`(${line}) Tj`);
    } else {
      contentLines.push('T*', `(${line}) Tj`);
    }
  });
  contentLines.push('ET');
  const stream = contentLines.join('\n');
  const objects: string[] = [];
  objects.push('1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n');
  objects.push('2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n');
  objects.push(
    '3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n',
  );
  objects.push(
    `4 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream\nendobj\n`,
  );
  objects.push('5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n');

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  const encoder = new TextEncoder();
  return encoder.encode(pdf);
}

function pdfEscape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '?');
}
