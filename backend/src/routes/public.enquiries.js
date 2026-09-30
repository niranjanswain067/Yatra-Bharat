const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST a new enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        status: 'NEW'
      }
    });
    
    res.status(201).json({ message: 'Enquiry submitted successfully', data: enquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

module.exports = router;
