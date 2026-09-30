const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth middleware to all routes in this file
router.use(verifyAdmin);

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: { category: true }
    });
    res.json({ data: destinations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// POST a new destination
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newDestination = await prisma.destination.create({
      data: {
        name: data.name,
        slug: data.slug,
        region: data.region,
        categoryId: data.categoryId,
        summary: data.summary,
        description: data.description,
        bestSeason: data.bestSeason,
        status: data.status,
      }
    });
    res.status(201).json({ data: newDestination });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create destination' });
  }
});

// PUT update a destination
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Prevent mass-assignment of sensitive fields
    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        region: data.region,
        categoryId: data.categoryId,
        summary: data.summary,
        description: data.description,
        bestSeason: data.bestSeason,
        status: data.status,
      }
    });
    res.json({ data: updated });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update destination' });
  }
});

// DELETE a destination
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete destination' });
  }
});

module.exports = router;
