import { calculateQuote } from '../services/pricingEngine.js';

/**
 * POST /api/quote
 * Live PCB Fabrication Quote Engine — accepts PCB config params, returns itemized breakdown
 */
export const getQuote = (req, res) => {
  try {
    const params = req.body;

    // Basic input validation
    if (!params || typeof params !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body. Expected PCB configuration object.'
      });
    }

    const quote = calculateQuote(params);

    return res.json({
      success: true,
      quoteId: `QT-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      validForMinutes: 30,
      ...quote
    });
  } catch (err) {
    console.error('[Quote Engine Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Internal pricing engine error.'
    });
  }
};

/**
 * GET /api/quote/estimate?layers=2&length=100&width=100&quantity=5
 * Quick GET-based estimator (for the HomePage instant estimator widget)
 */
export const getQuickEstimate = (req, res) => {
  try {
    const { layers, length, width, quantity } = req.query;
    const quote = calculateQuote({ layers, length, width, quantity });

    return res.json({
      success: true,
      estimated: {
        totalINR: quote.pricing.currencyINR.total,
        formattedTotal: quote.pricing.currencyINR.formattedTotal,
        totalUSD: quote.pricing.currencyUSD.total,
        formattedTotalUSD: quote.pricing.currencyUSD.formattedTotal,
        dispatchEstimateDays: quote.dispatchEstimateDays
      }
    });
  } catch (err) {
    console.error('[Quick Estimate Error]', err);
    return res.status(500).json({ success: false, error: 'Estimation failed.' });
  }
};

