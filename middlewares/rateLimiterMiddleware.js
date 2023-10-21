const { rateLimit } = require('express-rate-limit');

exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    'Too many requests created from this IP, please try again after  15 Min',
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

// Apply the rate limiting middleware to all requests
