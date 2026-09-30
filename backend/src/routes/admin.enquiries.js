const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyAdmin);

// GET all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: enquiries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// PUT update enquiry status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status }
    });
    res.json({ data: enquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

module.exports = router;
