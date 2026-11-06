import { Router } from 'express';
import multer from 'multer';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { uploadGerber, sampleDfm } from '../controllers/gerberController.js';

// Ensure uploads directory exists
const uploadDir = join(process.cwd(), 'uploads');
try { mkdirSync(uploadDir, { recursive: true }); } catch {}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (_req, file, cb) => {
    const allowedExts = /\.(zip|gbr|rar|tar|gz|zip)$/i;
    if (allowedExts.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only Gerber ZIP archives are allowed (.zip, .gbr, .rar)'));
    }
  }
});

const router = Router();

// POST /api/gerber/upload  — full Gerber file DFM analysis
router.post('/upload', upload.single('gerberFile'), uploadGerber);

// POST /api/gerber/sample-dfm  — load & analyze demo sample board
router.post('/sample-dfm', sampleDfm);

export default router;

