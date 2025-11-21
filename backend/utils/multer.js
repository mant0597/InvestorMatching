const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_BASE = path.join(__dirname, '..', 'uploads', 'pitchDeck');
// ensure folder exists
fs.mkdirSync(UPLOAD_BASE, { recursive: true });

function sanitizeName(name = '') {
  return name.toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 120);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_BASE);
  },
  filename: (req, file, cb) => {
    // prefer companyName, fall back to name, else timestamp
    const base = sanitizeName(req.body.name);
    const end = sanitizeName(req.body.email);
    const ts = Date.now();
    const filename = `${base}_${end}.pdf`;
    cb(null, filename);
  }
});

function fileFilter(req, file, cb) {
  // accept only pdf
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for pitch deck'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15 MB
});

module.exports = upload;