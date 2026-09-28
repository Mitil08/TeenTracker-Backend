export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `No endpoint matched ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.stack || err.message,
  });
};
