import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONSULTATIONS_FILE = join(__dirname, '../../data/consultations.json');

const readConsultations = () => {
  try {
    return JSON.parse(readFileSync(CONSULTATIONS_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const saveConsultations = (data) => {
  writeFileSync(CONSULTATIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * POST /api/consultations
 * Submit hardware design help / engineering consultation request
 */
export const submitConsultation = (req, res) => {
  try {
    const { name, email, phone, scope, edaTool, notes } = req.body;

    if (!name || !email || !scope) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and scope are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format.'
      });
    }

    const consultation = {
      ticketId: `ENG-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone: phone || null,
      scope,
      edaTool: edaTool || 'Not specified',
      notes: notes || '',
      status: 'PENDING_ASSIGNMENT',
      createdAt: new Date().toISOString()
    };

    const consultations = readConsultations();
    consultations.push(consultation);
    saveConsultations(consultations);

    return res.status(201).json({
      success: true,
      message: 'Engineering consultation request submitted successfully. Our CAM lead will respond within 2 business hours.',
      ticketId: consultation.ticketId,
      consultation
    });
  } catch (err) {
    console.error('[Consultation Submit Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to submit consultation request.' });
  }
};

/**
 * GET /api/consultations
 * List all consultation requests (admin view)
 */
export const getAllConsultations = (_req, res) => {
  const data = readConsultations();
  return res.json({ success: true, count: data.length, consultations: data });
};

