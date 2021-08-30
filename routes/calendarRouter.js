const express = require('express')
const router = express.Router()
const cors = require('cors')
const calendarController = require('../controllers/calendarController')
router.use(express.json())
router.use(cors())


router.post('/events', calendarController.allEvents)
router.post('/save', calendarController.saveEvent)
router.post('/edit', calendarController.editEvent)
router.delete('/delete', calendarController.deleteEvent)

module.exports = router
