const { subscriberSchema } = require('./schemas')

module.exports.validSub = (req, res, next) => {
    const { error } = subscriberSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        req.flash('error', msg)
        res.redirect('/')
    } else {
        next()
    }
}