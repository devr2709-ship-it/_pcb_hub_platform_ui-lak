/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns structured JSON responses
 */
export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ERROR ${statusCode} ${req.method} ${req.url} — ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * 404 Not Found Handler
 */
export const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`
  });
};

/**
 * Request Logger Middleware
 */
export const requestLogger = (req, _res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next();
};

