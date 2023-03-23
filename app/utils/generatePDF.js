const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "views", "Prescription.html");
const PDFdoc = PDFDocument.load(fs.readFileSync(filePath), {
  updateMetadata: false,
});

console.log(PDFdoc);
