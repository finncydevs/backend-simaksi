const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add the contact name"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "please add the contact email"]
    },
    phone: {
        type: String,
        required: [true, "please add the contact phone"]
    },
    password: {
        type: String,
        required: [true, "please add the contact deignation"],
        minlength: 6,

    }
   
},

{
    timestamps: true
}
)

module.exports = mongoose.model('Admin', adminSchema)