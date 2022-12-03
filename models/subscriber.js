const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model("Subscriber", subscriberSchema)