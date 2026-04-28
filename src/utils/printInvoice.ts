import { Invoice, ServiceBooking, User, GarageSettings, Vehicle } from '../types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(amount);
};

export const generateInvoiceHTML = (
  invoice: Invoice,
  customer: User,
  settings: GarageSettings,
  booking?: ServiceBooking,
  vehicle?: Vehicle
) => {
  const isSpecial = invoice.type === 'Special';
  const items = invoice.items ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.amount), 0);
  const vatAmount = invoice.type === 'VAT' ? subtotal * 0.13 : 0;
  
  const formattedDate = new Date(invoice.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${invoice.id}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #334155;
          margin: 0;
          padding: 40px;
          background-color: #f8fafc;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 30px;
          margin-bottom: 30px;
        }
        .company-details h1 {
          color: #2563eb;
          margin: 0 0 8px 0;
          font-size: 28px;
          letter-spacing: -0.5px;
        }
        .company-details p {
          margin: 3px 0;
          color: #64748b;
          font-size: 14px;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h2 {
          color: ${isSpecial ? '#db2777' : '#0f172a'};
          margin: 0 0 10px 0;
          font-size: 32px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .invoice-title .status {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          background-color: ${invoice.status === 'Paid' ? '#dcfce7' : '#fef9c3'};
          color: ${invoice.status === 'Paid' ? '#166534' : '#854d0e'};
          letter-spacing: 0.5px;
        }
        .meta-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          background-color: #f8fafc;
          padding: 24px;
          border-radius: 12px;
        }
        .billing-to, .invoice-details {
          width: 48%;
        }
        .section-title {
          font-size: 12px;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }
        .info-text {
          margin: 6px 0;
          font-size: 15px;
          color: #0f172a;
        }
        .info-text strong {
          color: #475569;
          display: inline-block;
          width: 80px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          padding: 16px 12px;
          text-align: left;
          letter-spacing: 0.5px;
        }
        th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
        td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 15px;
          color: #334155;
        }
        .text-right {
          text-align: right;
        }
        .totals-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }
        .totals-table {
          width: 320px;
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 16px;
        }
        .totals-table td {
          padding: 10px 16px;
          border-bottom: none;
        }
        .total-row {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }
        .total-row td {
          border-top: 2px solid #e2e8f0;
          padding-top: 16px;
          margin-top: 8px;
        }
        .paid-row {
          color: #16a34a;
          font-weight: 600;
        }
        .due-row {
          color: #dc2626;
          font-weight: 800;
        }
        .footer {
          border-top: 2px solid #f1f5f9;
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #64748b;
        }
        .bank-details {
          white-space: pre-wrap;
          line-height: 1.6;
        }
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        @media print {
          body {
            padding: 0;
            background-color: #fff;
            font-size: 12px;
            color: #000;
          }
          .invoice-container {
            border: none;
            box-shadow: none;
            padding: 0;
            max-width: 100%;
            page-break-inside: avoid;
          }
          .header {
            padding-bottom: 15px;
            margin-bottom: 15px;
          }
          .company-details h1 { font-size: 22px; margin-bottom: 4px; }
          .invoice-title h2 { font-size: 22px; margin-bottom: 4px; }
          .meta-info {
            padding: 12px;
            margin-bottom: 15px;
            background-color: transparent;
            border: 1px solid #e2e8f0;
          }
          .info-text { font-size: 12px; margin: 3px 0; }
          .section-title { margin-bottom: 8px; font-size: 10px; }
          table { margin-bottom: 15px; }
          th, td { padding: 8px; font-size: 12px; }
          .totals-container { margin-bottom: 15px; }
          .totals-table { padding: 10px; border: 1px solid #e2e8f0; }
          .total-row { font-size: 16px; }
          .footer {
            padding-top: 15px;
            margin-top: 15px;
            page-break-inside: avoid;
          }
          .bank-details { font-size: 11px; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-details">
            <h1>Sewa Automobile</h1>
            ${settings.vatNumber ? `<p style="font-weight: 600; color: #475569; margin-bottom: 8px;">VAT / PAN: ${settings.vatNumber}</p>` : ''}
            <p>123 Garage Street, Auto City</p>
            <p>Phone: +977 1-2345678</p>
            <p>Email: contact@sewaauto.com</p>
          </div>
          <div class="invoice-title">
            <h2>${isSpecial ? 'Special Bill' : 'Invoice'}</h2>
            <p style="margin: 5px 0 12px; font-size: 15px; color: #64748b;">Invoice Number: #${invoice.id}</p>
            <span class="status">${invoice.status}</span>
          </div>
        </div>

        <div class="meta-info">
          <div class="billing-to">
            <div class="section-title">Billed To</div>
            <p class="info-text" style="font-weight: 800; font-size: 18px; color: #0f172a;">${customer.name}</p>
            <p class="info-text">${customer.phone}</p>
            ${customer.email ? `<p class="info-text">${customer.email}</p>` : ''}
            ${customer.vatNumber ? `<p class="info-text"><strong>VAT/PAN:</strong> ${customer.vatNumber}</p>` : ''}
          </div>
          
          <div class="invoice-details">
            <div class="section-title">Invoice Details</div>
            <p class="info-text"><strong>Date:</strong> ${formattedDate}</p>
            <p class="info-text"><strong>Type:</strong> ${invoice.type}</p>
            ${vehicle ? `<p class="info-text"><strong>Vehicle:</strong> ${vehicle.model} (${vehicle.number})</p>` : ''}
            ${booking ? `<p class="info-text"><strong>Service:</strong> ${booking.type}</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.length > 0 ? items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${formatCurrency(item.amount)}</td>
              </tr>
            `).join('') : `
              <tr>
                <td>General Service - ${invoice.description || 'Service Bill'}</td>
                <td class="text-right">${formatCurrency(invoice.total)}</td>
              </tr>
            `}
          </tbody>
        </table>

        <div class="totals-container">
          <table class="totals-table">
            <tr>
              <td>Subtotal</td>
              <td class="text-right">${formatCurrency(subtotal)}</td>
            </tr>
            ${invoice.type === 'VAT' ? `
            <tr>
              <td>VAT (13%)</td>
              <td class="text-right">${formatCurrency(vatAmount)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td>Total</td>
              <td class="text-right">${formatCurrency(invoice.total)}</td>
            </tr>
            <tr class="paid-row">
              <td>Amount Paid</td>
              <td class="text-right">${formatCurrency(invoice.paid)}</td>
            </tr>
            ${invoice.remaining > 0 ? `
            <tr class="due-row">
              <td>Balance Due</td>
              <td class="text-right">${formatCurrency(invoice.remaining)}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div class="footer">
          <div class="bank-details">
            <div class="section-title">Payment Information</div>
            ${settings.bankDetails}
          </div>
          <div style="text-align: right; align-self: flex-end;">
            <div style="border-top: 2px solid #cbd5e1; width: 180px; margin-top: 50px; padding-top: 10px;">
              <p style="margin: 0; font-weight: bold; color: #0f172a;">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.print();
        }, 500);
      </script>
    </body>
    </html>
  `;
};

export const printInvoice = (
  invoice: Invoice,
  customer: User,
  settings: GarageSettings,
  booking?: ServiceBooking,
  vehicle?: Vehicle
) => {
  const htmlContent = generateInvoiceHTML(invoice, customer, settings, booking, vehicle);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    alert("Please allow popups for this website to print the invoice.");
  }
};
