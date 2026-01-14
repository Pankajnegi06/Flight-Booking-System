const PDFDocument = require("pdfkit");
const cloudinary = require("../config/cloudinary");
const { PassThrough } = require("stream");

const generateAndUploadTicketPDF = ({
  passenger_name,
  flight_id,
  airline,
  route,
  price_paid,
  booking_time,
  pnr
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      // 1️⃣ Create Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "flight_tickets",
          public_id: pnr,
          overwrite: true
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      // 2️⃣ Pipe PDF directly into Cloudinary stream
      doc.pipe(uploadStream);

      /* ===== HEADER ===== */
      doc.rect(0, 0, 600, 100).fill("#0A2540");

      doc
        .fillColor("#FFFFFF")
        .fontSize(26)
        .text("FLIGHT TICKET", 50, 35);

      doc.fontSize(14).text(airline, 420, 40);

      /* ===== BODY ===== */
      doc.moveDown(4);
      doc.fillColor("#000");

      doc.roundedRect(40, 130, 520, 260, 10).stroke("#0A2540");

      doc.fontSize(14).text("Passenger Details", 60, 150);
      doc.moveTo(60, 170).lineTo(540, 170).stroke();

      doc.fontSize(12);
      doc.text("Name:", 60, 190);
      doc.text(passenger_name, 200, 190);

      doc.text("PNR:", 60, 215);
      doc.fillColor("#D72638").text(pnr, 200, 215);
      doc.fillColor("#000");

      doc.fontSize(14).text("Flight Information", 60, 255);
      doc.moveTo(60, 275).lineTo(540, 275).stroke();

      doc.fontSize(12);
      doc.text("Flight ID:", 60, 295);
      doc.text(flight_id, 200, 295);

      doc.text("Route:", 60, 320);
      doc.text(route, 200, 320);

      doc.text("Booking Time:", 60, 345);
      doc.text(new Date(booking_time).toLocaleString(), 200, 345);

      doc.rect(60, 380, 480, 60).fill("#F1F5F9");

      doc
        .fillColor("#000")
        .fontSize(16)
        .text(`Total Paid: ₹${price_paid}`, 70, 400);

      /* ===== FOOTER ===== */
      doc
        .fontSize(10)
        .fillColor("#555")
        .text(
          "This is a system-generated ticket. Please carry a valid ID.",
          50,
          470,
          { align: "center" }
        );

      // 3️⃣ End PDF (this triggers upload completion)
      doc.end();

    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateAndUploadTicketPDF;
