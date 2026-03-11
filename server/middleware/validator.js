/**
 * Input validation middleware
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

/**
 * Validate text input
 */
export const validateText = (text, minLength = 1, maxLength = 100000) => {
  if (!text || typeof text !== 'string') {
    return { valid: false, message: 'Text is required' };
  }
  if (text.trim().length < minLength) {
    return { valid: false, message: `Text must be at least ${minLength} characters` };
  }
  if (text.length > maxLength) {
    return { valid: false, message: `Text must not exceed ${maxLength} characters` };
  }
  return { valid: true };
};

/**
 * Validate URL format
 */
export const validateURL = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Request validation middleware factory
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body
    if (schema.body) {
      for (const [field, validator] of Object.entries(schema.body)) {
        const value = req.body[field];
        const result = validator(value);
        if (!result.valid) {
          errors.push({ field, message: result.message });
        }
      }
    }

    // Validate params
    if (schema.params) {
      for (const [field, validator] of Object.entries(schema.params)) {
        const value = req.params[field];
        const result = validator(value);
        if (!result.valid) {
          errors.push({ field: `param.${field}`, message: result.message });
        }
      }
    }

    // Validate query
    if (schema.query) {
      for (const [field, validator] of Object.entries(schema.query)) {
        const value = req.query[field];
        if (value !== undefined) {
          const result = validator(value);
          if (!result.valid) {
            errors.push({ field: `query.${field}`, message: result.message });
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors
      });
    }

    next();
  };
};


