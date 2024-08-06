const { PDFDocument } = require('pdf-lib');
const puppeteer = require('puppeteer');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }))
const PORT = 5715;


app.post('/convert-pdf', async (req, res) => {
    try {
        debugger
        // Get HTML content from request body
        const { html, filename = "test-file.pdf" } = await req.body;

        if (!html) {
            return { status: 400, body: 'HTML content is required' };
        }

        // Launch browser
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set content and generate PDF
        await page.setContent(html);
        const pdfOptions = {
      format: 'A4',
      printBackground: true,
    };
        const pdf = await page.pdf({ format: 'A4' });

        // Close browser
        await browser.close();

        // Return PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + filename,
            'Content-Length': Buffer.byteLength(pdf),
        });
        res.send(Buffer.from(pdf));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
})

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
});
