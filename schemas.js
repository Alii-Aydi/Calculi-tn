const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHtml': '{{#label}} must not include HTML !'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedAttributes: {},
                    allowedTags: []
                })
                if (clean !== value) return helpers.error('string.escapeHtml', { value })
                return clean;
            }
        }
    }
})

const joi = baseJoi.extend(extension)

module.exports.subscriberSchema = joi.object({
    email: joi.string().email().required().escapeHTML(),
})