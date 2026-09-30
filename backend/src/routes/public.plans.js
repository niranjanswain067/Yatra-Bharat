const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all published travel plans
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.travelPlan.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        destinations: {
          include: { destination: true }
        }
      }
    });
    res.json({ data: plans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch travel plans' });
  }
});

// GET single travel plan by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const plan = await prisma.travelPlan.findUnique({
      where: { slug },
      include: {
        destinations: {
          include: { destination: true }
        },
        days: true
      }
    });
    
    if (!plan || plan.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Travel plan not found' });
    }
    
    res.json({ data: plan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch travel plan details' });
  }
});

module.exports = router;
