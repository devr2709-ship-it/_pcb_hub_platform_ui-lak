import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ORDERS_FILE = join(__dirname, '../../data/orders.json');

const readOrders = () => {
  try {
    return JSON.parse(readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const saveOrders = (orders) => {
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
};

/**
 * GET /api/orders
 * Returns all orders (admin view)
 */
export const getAllOrders = (_req, res) => {
  const orders = readOrders();
  return res.json({ success: true, count: orders.length, orders });
};

/**
 * GET /api/orders/:orderId
 * Live order tracking — returns milestones, cleanroom telemetry, shipping status
 */
export const getOrderById = (req, res) => {
  const { orderId } = req.params;
  const orders = readOrders();
  const order = orders.find(
    (o) => o.orderId.toLowerCase() === orderId.trim().toLowerCase()
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      error: `Order #${orderId} not found. Please check the order ID or contact support.`
    });
  }

  return res.json({ success: true, order });
};

/**
 * POST /api/orders
 * Place a new PCB order — creates order record from checkout payload
 */
export const placeOrder = (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      taxDetails,
      payment,
      items,
      pricing,
      configSnapshot
    } = req.body;

    if (!customer?.email || !shippingAddress || !items?.length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customer email, shippingAddress, and items are mandatory.'
      });
    }

    const orderId = `PCB-${Math.floor(10000 + Math.random() * 89999)}`;

    const newOrder = {
      orderId,
      customer,
      shippingAddress,
      taxDetails: taxDetails || null,
      payment: {
        method: payment?.method || 'upi',
        status: 'CONFIRMED',
        transactionId: `TXN-${uuidv4().split('-')[0].toUpperCase()}`
      },
      items,
      pricing,
      configSnapshot: configSnapshot || null,
      status: 'QUEUED_FOR_CAM',
      currentStation: 'Station 01 • CAM Engineering Queue',
      estimatedDispatch: '3–4 Business Days',
      createdAt: new Date().toISOString(),
      cleanroomTelemetry: {
        temperatureCelsius: 21.4,
        relativeHumidity: 44,
        isoCleanroomClass: 'ISO 7 (Class 10,000)',
        laserWavelengthNm: 405,
        lotBatchId: `LOT-BLR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      },
      milestones: [
        {
          id: 1, title: 'CAM & Engineering DFM Review',
          station: 'Station 01 • Cleanroom CAM Office',
          time: 'Scheduled: Within 2 Hours', status: 'upcoming',
          details: 'Netlist DRC verification, copper clearances, and panel layout serialization.'
        },
        {
          id: 2, title: 'Laser Direct Imaging & Inner Layer Etching',
          station: 'Station 02 • Photolithography Bay 02',
          time: 'Day 1', status: 'upcoming',
          details: 'Photoresist exposed via 405nm ultraviolet laser; chemical micro-etch completed.'
        },
        {
          id: 3, title: 'Lamination & High-Speed CNC Drilling',
          station: 'Station 03 • Spindle CNC Array 04',
          time: 'Day 1–2', status: 'upcoming',
          details: 'Multilayer prepreg pressure cured; 0.3mm vias drilled at 180,000 RPM.'
        },
        {
          id: 4, title: 'Chemical Copper Bath & Surface Plating',
          station: 'Station 04 • Electroplating Line B',
          time: 'Day 2', status: 'upcoming',
          details: 'Electroless copper seeding and surface metallurgy deposited on exposed pads.'
        },
        {
          id: 5, title: 'High-Res LPI Solder Mask & UV Curing',
          station: 'Station 05 • LPI Coating Chamber 01',
          time: 'Day 2–3', status: 'upcoming',
          details: 'Liquid photo-imageable solder resist applied and thermally baked.'
        },
        {
          id: 6, title: 'Flying Probe E-Test & Optical AOI',
          station: 'Station 06 • QA Diagnostic Bay',
          time: 'Day 3', status: 'upcoming',
          details: '100% netlist electrical continuity test and double-sided vision inspection.'
        },
        {
          id: 7, title: 'ESD Vacuum Armor Packaging & Air Logistics',
          station: 'Station 07 • Dispatch Dock 03',
          time: `Day 3–4`, status: 'upcoming',
          details: 'Vacuum sealed with silica gel desiccant; handed over to express courier.'
        }
      ]
    };

    const orders = readOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! Your PCB is queued for CAM engineering review.',
      orderId,
      transactionId: newOrder.payment.transactionId,
      estimatedDispatch: newOrder.estimatedDispatch,
      order: newOrder
    });
  } catch (err) {
    console.error('[Order Placement Error]', err);
    return res.status(500).json({ success: false, error: 'Order processing failed.' });
  }
};

