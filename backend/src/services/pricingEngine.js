/**
 * Precision Foundry PCB Pricing Engine
 * Implements IPC Class 2/3 rapid fabrication calculation formulas
 */

const EXCHANGE_RATE = 0.012; // 1 INR ~ 0.012 USD

export const calculateQuote = (params = {}) => {
  const {
    layers = 2,
    length = 100, // in mm
    width = 100,  // in mm
    quantity = 5,
    surfaceFinish = 'hasl', // 'hasl', 'enig', 'osp', 'silver'
    copperWeight = '1oz',   // '1oz', '2oz', '3oz'
    thickness = '1.6mm',
    castellated = false,
    edgeChamfer = false,
    turnaround = 'standard', // 'standard', 'express'
    dfmChecked = true
  } = params;

  const validLayers = parseInt(layers, 10) || 2;
  const validLength = Math.max(10, Math.min(500, parseFloat(length) || 100));
  const validWidth = Math.max(10, Math.min(500, parseFloat(width) || 100));
  const validQuantity = Math.max(1, parseInt(quantity, 10) || 5);

  // 1. Base Layer Stackup Rate (in INR)
  let basePrice = 299;
  if (validLayers === 1) basePrice = 199;
  else if (validLayers === 2) basePrice = 299;
  else if (validLayers === 4) basePrice = 899;
  else if (validLayers === 6) basePrice = 1899;
  else if (validLayers === 8) basePrice = 3499;
  else if (validLayers >= 10) basePrice = 5999;

  // 2. Area Dimension Factor (Base is 100mm x 100mm = 10,000 mm² = 100 cm²)
  const areaCm2 = (validLength * validWidth) / 100;
  const areaRatio = Math.max(1, areaCm2 / 100);
  const areaMultiplier = 1 + (areaRatio - 1) * 0.42;

  // 3. Quantity Scale Factor (Industrial Volume Curve)
  let qtyMultiplier = 1;
  if (validQuantity <= 5) {
    qtyMultiplier = 1;
  } else if (validQuantity <= 10) {
    qtyMultiplier = 1.5;
  } else if (validQuantity <= 20) {
    qtyMultiplier = 2.6;
  } else if (validQuantity <= 50) {
    qtyMultiplier = 5.4;
  } else if (validQuantity <= 100) {
    qtyMultiplier = 9.5;
  } else {
    // Custom volume scale
    qtyMultiplier = 9.5 + ((validQuantity - 100) / 10) * 0.7;
  }

  // Base Board Subtotal
  const fabricationSubtotal = Math.round(basePrice * areaMultiplier * qtyMultiplier);

  // 4. Metallurgy / Surface Finish Plating Surcharge
  let surfaceFinishSurcharge = 0;
  const finishKey = typeof surfaceFinish === 'object' ? surfaceFinish.id : surfaceFinish;
  switch (finishKey) {
    case 'enig':
      surfaceFinishSurcharge = 150;
      break;
    case 'osp':
      surfaceFinishSurcharge = 80;
      break;
    case 'silver':
      surfaceFinishSurcharge = 210;
      break;
    case 'hasl':
    default:
      surfaceFinishSurcharge = 0;
      break;
  }

  // 5. Copper Weight Surcharge
  let copperSurcharge = 0;
  if (copperWeight.includes('2oz')) copperSurcharge = 120;
  if (copperWeight.includes('3oz')) copperSurcharge = 280;

  // 6. Mechanical Machining Add-ons
  const castellatedSurcharge = castellated ? 150 : 0;
  const edgeChamferSurcharge = edgeChamfer ? 180 : 0;

  // 7. Turnaround Speed Surcharge
  const turnaroundSurcharge = turnaround === 'express' ? 199 : 0;

  // Total Subtotal before taxes
  const subtotalINR = fabricationSubtotal + surfaceFinishSurcharge + copperSurcharge + castellatedSurcharge + edgeChamferSurcharge + turnaroundSurcharge;

  // 8. Tax Calculation (18% GST: 9% CGST + 9% SGST)
  const gstRate = 0.18;
  const gstINR = Math.round(subtotalINR * gstRate);
  const cgstINR = Math.round(gstINR / 2);
  const sgstINR = gstINR - cgstINR;

  // 9. Shipping (Free above ₹999 across India, otherwise ₹120)
  const shippingINR = subtotalINR >= 999 ? 0 : 120;

  // Grand Total
  const totalINR = subtotalINR + gstINR + shippingINR;
  const unitPriceINR = parseFloat((totalINR / validQuantity).toFixed(2));

  // USD conversions
  const totalUSD = parseFloat((totalINR * EXCHANGE_RATE).toFixed(2));
  const subtotalUSD = parseFloat((subtotalINR * EXCHANGE_RATE).toFixed(2));
  const unitPriceUSD = parseFloat((unitPriceINR * EXCHANGE_RATE).toFixed(2));

  return {
    dimensions: {
      lengthMm: validLength,
      widthMm: validWidth,
      areaCm2: parseFloat(areaCm2.toFixed(1))
    },
    specs: {
      layers: validLayers,
      quantity: validQuantity,
      surfaceFinish: finishKey,
      copperWeight,
      thickness,
      turnaround,
      castellated,
      edgeChamfer,
      dfmChecked
    },
    breakdown: {
      fabricationINR: fabricationSubtotal,
      surfaceFinishINR: surfaceFinishSurcharge,
      copperINR: copperSurcharge,
      castellatedINR: castellatedSurcharge,
      edgeChamferINR: edgeChamferSurcharge,
      turnaroundINR: turnaroundSurcharge,
      subtotalINR,
      gstRatePercent: 18,
      cgstINR,
      sgstINR,
      totalGstINR: gstINR,
      shippingINR,
      isFreeShipping: shippingINR === 0
    },
    pricing: {
      currencyINR: {
        unitPrice: unitPriceINR,
        subtotal: subtotalINR,
        total: totalINR,
        formattedTotal: `₹${totalINR.toLocaleString('en-IN')}`,
        formattedUnitPrice: `₹${unitPriceINR.toLocaleString('en-IN')}`
      },
      currencyUSD: {
        unitPrice: unitPriceUSD,
        subtotal: subtotalUSD,
        total: totalUSD,
        formattedTotal: `$${totalUSD.toFixed(2)}`,
        formattedUnitPrice: `$${unitPriceUSD.toFixed(2)}`
      }
    },
    dispatchEstimateDays: turnaround === 'express' ? '24–48 Hours' : '3–4 Business Days'
  };
};

