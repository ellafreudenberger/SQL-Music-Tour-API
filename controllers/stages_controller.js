// DEPENDENCIES
const stages = require('express').Router();
const db = require('../models');
const { Stage, Event } = db;
const { Op } = require('sequelize');

// FIND ALL STAGES 
// Updated to search by stage_name
stages.get('/', async (req, res) => {
  try {
    const foundStages = await Stage.findAll({
      where: {
        stage_name: { [Op.like]: `%${req.query.stage_name ? req.query.stage_name : ''}%` },
      },
    });
    res.status(200).json(foundStages);
  } catch (error) {
    res.status(500).json(error);
  }
});

// FIND A SPECIFIC STAGE 
// Updated to search by stage_name
stages.get('/name/:name', async (req, res) => {
  try {
    const foundStage = await Stage.findOne({
      where: { stage_name: req.params.name },
      include: {
        model: Event,
        as: 'events',
        through: { attributes: [] },
      },
      order: [[{ model: Event, as: 'events' }, 'date', 'ASC']],
    });
    res.status(200).json(foundStage);
  } catch (error) {
    res.status(500).json(error);
  }
});

// EXPORT
module.exports = stages;
