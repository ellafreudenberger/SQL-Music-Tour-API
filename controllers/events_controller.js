// DEPENDENCIES
const events = require('express').Router();
const db = require('../models');
const { Event, MeetGreet, SetTime, Stage, Band } = db;
const { Op } = require('sequelize');

// FIND ALL EVENTS 
// Updated to search by name
events.get('/', async (req, res) => {
  try {
    const foundEvents = await Event.findAll({
      order: [['date', 'ASC']],
      where: {
        name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` },
      },
    });
    res.status(200).json(foundEvents);
  } catch (error) {
    res.status(500).json(error);
  }
});

// FIND A SPECIFIC EVENT 
// Updated to search by name
events.get('/name/:name', async (req, res) => {
  try {
    const foundEvent = await Event.findOne({
      where: { name: req.params.name },
      include: [
        {
          model: MeetGreet,
          as: 'meet_greets',
          attributes: { exclude: ['event_id', 'band_id'] },
          include: {
            model: Band,
            as: 'band',
          },
        },
        {
          model: SetTime,
          as: 'set_times',
          attributes: { exclude: ['event_id', 'stage_id', 'band_id'] },
          include: [
            { model: Band, as: 'band' },
            { model: Stage, as: 'stage' },
          ],
        },
        {
          model: Stage,
          as: 'stages',
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).json(foundEvent);
  } catch (error) {
    res.status(500).json(error);
  }
});

// EXPORT
module.exports = events;
