const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔗 Render ML Service URL
const ML_URL = "https://jobnest-ml.onrender.com/match-file";

router.post("/match", upload.single("resume"), async (req, res) => {
  try {
    // ✅ Validation
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }
    if (!req.body.job_text) {
      return res.status(400).json({ error: "Job description is required" });
    }

    // ✅ Prepare multipart form-data
    const formData = new FormData();
    formData.append("resume", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("job_text", req.body.job_text);

    // ✅ Call Flask ML API
    const response = await axios.post(ML_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 60000, // Render cold start safe
    });

    // ✅ Send ML response to frontend
    return res.status(200).json(response.data);

  } catch (err) {
    console.error("ML SERVICE ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      error: "ML processing failed",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
