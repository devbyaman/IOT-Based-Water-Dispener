import { validationResult } from 'express-validator';

// Sanitize response data
export const sanitizeResponse = (req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
        if (data && typeof data === 'object') {
            // Remove sensitive fields
            const sanitizedData = JSON.parse(JSON.stringify(data));
            if (sanitizedData.password) delete sanitizedData.password;
            if (sanitizedData.tokens) delete sanitizedData.tokens;
            if (sanitizedData.otp) delete sanitizedData.otp;
            if (sanitizedData.__v) delete sanitizedData.__v;
            
            return originalJson.call(this, sanitizedData);
        }
        return originalJson.call(this, data);
    };
    next();
};

// Validate request data
export const validateRequest = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    };
};

// Rate limiting middleware
export const rateLimiter = (req, res, next) => {
    // Implement rate limiting logic here
    // This is a placeholder - you should implement proper rate limiting
    next();
};

// Authorization middleware
export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    next();
}; 