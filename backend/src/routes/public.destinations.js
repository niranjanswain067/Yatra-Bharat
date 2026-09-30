const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all published destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true }
    });
    res.json({ data: destinations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET single destination by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        category: true,
        plans: {
          include: { travelPlan: true }
        }
      }
    });
    if (!destination || destination.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ data: destination });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination details' });
  }
});

module.exports = router;
