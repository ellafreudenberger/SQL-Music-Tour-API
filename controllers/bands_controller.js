// DEPENDENCIES
const bands = require('express').Router()
const db = require('../models')
const { Band, MeetGreet, SetTime, Event } = db
const { Op } = require('sequelize')

// FIND ALL BANDS 
// Updated to search by name
bands.get('/', async (req, res) => {
    try {
        const foundBands = await Band.findAll({
            order: [['available_start_time', 'ASC']],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundBands)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC BAND 
// Updated to search by name
bands.get('/:name', async (req, res) => {
    try {
        const foundBand = await Band.findOne({
            where: { name: req.params.name },
            include: [
                {
                    model: MeetGreet,
                    as: 'meet_greets',
                    attributes: { exclude: ['band_id', 'event_id'] },
                    include: {
                        model: Event,
                        as: 'event',
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } }
                    }
                },
                {
                    model: SetTime,
                    as: 'set_times',
                    attributes: { exclude: ['band_id', 'event_id'] },
                    include: {
                        model: Event,
                        as: 'event',
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } }
                    }
                }
            ],
            order: [
                [{ model: MeetGreet, as: 'meet_greets' }, { model: Event, as: 'event' }, 'date', 'DESC'],
                [{ model: SetTime, as: 'set_times' }, { model: Event, as: 'event' }, 'date', 'DESC']
            ]
        })
        res.status(200).json(foundBand)
    } catch (error) {
        res.status(500).json(error)
    }
})
