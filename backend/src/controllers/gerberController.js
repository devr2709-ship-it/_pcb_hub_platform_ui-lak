import { analyzeDfm } from '../services/dfmEngine.js';

/**
 * POST /api/gerber/upload
 * Accepts Gerber ZIP via multipart/form-data, runs automated DFM rule checks
 */
export const uploadGerber = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please attach a Gerber ZIP archive (.zip, .gbr, .rar).'
      });
    }

    const allowedMimes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'application/x-rar-compressed'
    ];
    const allowedExtensions = ['.zip', '.gbr', '.rar', '.tar', '.gz'];
    const fileExt = '.' + req.file.originalname.split('.').pop().toLowerCase();

    if (!allowedMimes.includes(req.file.mimetype) && !allowedExtensions.includes(fileExt)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported file type: ${req.file.mimetype}. Please upload a Gerber ZIP archive.`
      });
    }

    // Run automated DFM analysis
    const dfmResult = analyzeDfm(req.file);

    return res.json({
      success: true,
      uploadId: `DFM-${Date.now()}`,
      ...dfmResult
    });
  } catch (err) {
    console.error('[Gerber Upload Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Internal DFM analysis error. Please try again.'
    });
  }
};

/**
 * POST /api/gerber/sample-dfm
 * Runs DFM on a demo sample board (no file needed — for the "Load Sample" button)
 */
export const sampleDfm = (_req, res) => {
  const sampleFile = {
    originalname: 'sample_pcb_arduino_shield.zip',
    size: 2450000,
    mimetype: 'application/zip'
  };

  const dfmResult = analyzeDfm(sampleFile);

  return res.json({
    success: true,
    uploadId: `DFM-SAMPLE-${Date.now()}`,
    isSample: true,
    ...dfmResult
  });
};

