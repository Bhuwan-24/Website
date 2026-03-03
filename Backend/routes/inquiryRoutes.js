const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// @route   POST /api/inquiry
// @desc    Submit a new student inquiry
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;

        // Basic validation
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and phone number.'
            });
        }

        const newInquiry = new Inquiry(req.body);
        await newInquiry.save();

        res.status(201).json({
            success: true,
            message: 'Thank you! Our admissions team will contact you soon.'
        });

    } catch (error) {
        console.error('Error saving inquiry:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error. Please try again later.'
        });
    }
});

module.exports = router;
