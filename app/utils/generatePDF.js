const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

exports.createPrescription = async prescription => {
  // Load an existing PDF or create a new one
  const dirPath = path.join(process.cwd(), "app", `views/NavLogo.png`);
  const pdfDoc = await PDFDocument.create();

  // Load the font
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Create a new page
  const page = pdfDoc.addPage();

  // Set clinic name and info
  const clinicName = "Clinic Prescription";
  const clinicAddress = "123 Main St, City, State, ZIP";
  const clinicPhone = "123-456-7890";
  const appointmentDate = new Date(
    prescription?.prescription_id?.date,
  ).toLocaleDateString();
  const doctorName = prescription?.doctor_name;
  // Set patient information
  const patientName = prescription?.patient_name;
  const patientEmail = prescription?.user_id?.email;
  const patientGender = prescription?.user_id?.phone_number.toString();
  const patientDOB = new Date(
    prescription?.user_id?.date_of_birth,
  ).toLocaleDateString();

  // Set medications
  const medications = ["Medication 1", "Medication 2", "Medication 3"];

  // Set doctor notes
  const doctorNotes = prescription?.prescription_id?.notes;

  // Draw clinic header
  page.drawText(clinicName, {
    x: 50,
    y: page.getHeight() - 50,
    size: 18,
    font,
  });
  page.drawText("Address:", {
    x: 50,
    y: page.getHeight() - 75,
    size: 12,
    font,
  });
  page.drawText(clinicAddress, {
    x: 108,
    y: page.getHeight() - 75,
    size: 12,
    font,
  });
  page.drawText("Phone No:", {
    x: 50,
    y: page.getHeight() - 90,
    size: 12,
    font,
  });
  page.drawText(clinicPhone, {
    x: 115,
    y: page.getHeight() - 90,
    size: 12,
    font,
  });
  page.drawText("Appointment Date:", {
    x: 50,
    y: page.getHeight() - 105,
    size: 12,
    font,
  });
  page.drawText(appointmentDate, {
    x: 165,
    y: page.getHeight() - 105,
    size: 12,
    font,
  });

  // Draw clinic logo (replace 'path_to_logo' with the actual path to your logo image)
  const logoImage = await pdfDoc.embedPng(fs.readFileSync(dirPath));
  page.drawImage(logoImage, {
    x: page.getWidth() - 200,
    y: page.getHeight() - 75,
    width: 150,
    height: 50,
  });

  // Draw patient information
  page.drawText("Patient Information:", {
    x: 50,
    y: page.getHeight() - 150,
    size: 15,
    font,
    bold: true,
  });
  page.drawText("Patient Name:", {
    x: 50,
    y: page.getHeight() - 175,
    size: 12,
    font,
  });
  page.drawText(patientName, {
    x: 150,
    y: page.getHeight() - 175,
    size: 12,
    font,
  });
  page.drawText("Email:", { x: 50, y: page.getHeight() - 200, size: 12, font });
  page.drawText(patientEmail, {
    x: 150,
    y: page.getHeight() - 200,
    size: 12,
    font,
  });
  page.drawText("Phone No:", {
    x: page.getWidth() - 200,
    y: page.getHeight() - 175,
    size: 12,
    font,
    textAlign: "right",
  });
  page.drawText(patientGender, {
    x: page.getWidth() - 100,
    y: page.getHeight() - 175,
    size: 12,
    font,
  });
  page.drawText("Date of Birth:", {
    x: page.getWidth() - 200,
    y: page.getHeight() - 200,
    size: 12,
    font,
    textAlign: "right",
  });
  page.drawText(patientDOB, {
    x: page.getWidth() - 100,
    y: page.getHeight() - 200,
    size: 12,
    font,
  });

  // Draw medications
  page.drawText("Medications:", {
    x: 50,
    y: page.getHeight() - 250,
    size: 15,
    font,
    bold: true,
  });
  prescription?.prescription_id?.medications.forEach((medication, index) => {
    page.drawText(`${index + 1}. ${medication?.name}`, {
      x: 75,
      y: page.getHeight() - 275 - index * 20,
      size: 12,
      font,
    });
  });

  // Draw doctor notes
  page.drawText("Notes:", {
    x: 50,
    y: page.getHeight() - 375,
    size: 15,
    font,
    bold: true,
  });
  page.drawText(doctorNotes, {
    x: 50,
    y: page.getHeight() - 400,
    size: 12,
    font,
  });

  // Draw "Signature"
  page.drawText("Signature", {
    x: page.getWidth() - 200,
    y: 150,
    size: 12,
    font,
    bold: true,
  });
  page.drawText(doctorName, {
    x: page.getWidth() - 200,
    y: 130,
    size: 12,
    font,
    bold: true,
  });

  // // Draw doctor signature (replace 'path_to_signature' with the actual path to your signature image)
  // const signatureImage = await pdfDoc.embedPng(fs.readFileSync(dirPath));
  // page.drawImage(signatureImage, {
  //   x: page.getWidth() - 200,
  //   y: 50,
  //   width: 150,
  //   height: 50,
  // });

  // Save the PDF to a file
  // const pdfBytes = await pdfDoc.save();
  // fs.writeFileSync("prescription.pdf", pdfBytes);
  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  return buffer;
};
