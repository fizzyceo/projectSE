const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 2000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        result: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        data: {}
    },
})

module.exports = {
    apiLimiter,
}