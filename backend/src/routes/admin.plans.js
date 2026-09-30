const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyAdmin);

// GET all travel plans
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.travelPlan.findMany({
      include: {
        days: true,
        destinations: { include: { destination: true } }
      }
    });
    res.json({ data: plans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch travel plans' });
  }
});

// POST a new travel plan
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newPlan = await prisma.travelPlan.create({
      data: {
        name: data.name,
        slug: data.slug,
        durationDays: data.durationDays,
        priceAmount: data.priceAmount,
        priceCurrency: data.priceCurrency,
        status: data.status,
      }
    });
    res.status(201).json({ data: newPlan });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create travel plan' });
  }
});

// PUT update a travel plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updated = await prisma.travelPlan.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        durationDays: data.durationDays,
        priceAmount: data.priceAmount,
        priceCurrency: data.priceCurrency,
        status: data.status,
      }
    });
    res.json({ data: updated });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update travel plan' });
  }
});

// DELETE a travel plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.travelPlan.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete travel plan' });
  }
});

module.exports = router;
