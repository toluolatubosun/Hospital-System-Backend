// products model
const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
    {
        hospitalNumber: {
            type: Number,
            required: true
        },
        occupation: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        otherNames: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        religion: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: String,
            required: true
        },
        dateAdmitted: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true
        },
        dateTransferred: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: true
        },
        ward: {
            type: String,
            required: true
        },
        sex: {
            type: String,
            required: true,
            enum: ["M", "F"]
        },
        maritalStatus: {
            type: String,
            required: true,
            enum: ["Divorced", "Married", "Single"]
        },
        dateDischarged: {
            type: String,
            required: false
        },
        consultant: {
            type: String,
            required: true,
        },
        diagnosis: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('patient', ProductSchema)
