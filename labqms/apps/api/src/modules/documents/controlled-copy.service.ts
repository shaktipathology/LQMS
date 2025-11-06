import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import QRCode from 'qrcode';

@Injectable()
export class ControlledCopyService {
  async renderPdf(options: {
    documentTitle: string;
    documentCode: string;
    version: number;
    lifecycle: string;
    content: string;
    issuedTo: string;
    issueDate: string;
    canonicalUrl: string;
  }): Promise<Buffer> {
    const qrData = await QRCode.toDataURL(options.canonicalUrl);
    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: 'Inter', sans-serif; margin: 40px; }
      header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #999; padding-bottom: 8px; margin-bottom: 16px; }
      footer { position: fixed; bottom: 16px; left: 40px; right: 40px; font-size: 12px; color: #555; }
      .watermark { position: fixed; top: 40%; left: 20%; font-size: 64px; opacity: 0.08; transform: rotate(-30deg); color: #bf0a30; }
      .meta { font-size: 12px; color: #333; }
      .qr { width: 120px; }
      .content { margin-top: 24px; white-space: pre-wrap; }
      table.signature { width: 100%; margin-top: 32px; border-collapse: collapse; }
      table.signature td { border: 1px solid #ccc; padding: 8px; height: 64px; }
    </style>
  </head>
  <body>
    <div class="watermark">CONTROLLED COPY</div>
    <header>
      <div>
        <h1>${options.documentCode} – ${options.documentTitle}</h1>
        <div class="meta">Version ${options.version} | Lifecycle ${options.lifecycle} | Issued ${options.issueDate}</div>
        <div class="meta">Issued to: ${options.issuedTo}</div>
      </div>
      <img class="qr" src="${qrData}" />
    </header>
    <section class="content">${options.content}</section>
    <table class="signature">
      <tr>
        <td>Prepared by</td>
        <td>Reviewed by</td>
        <td>Approved by</td>
        <td>Recipient signature</td>
      </tr>
    </table>
    <footer>
      AIIMS Bhopal – Department of Pathology & Lab Medicine | Controlled copy. Verify at ${options.canonicalUrl}
    </footer>
  </body>
</html>`);
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
  }
}
