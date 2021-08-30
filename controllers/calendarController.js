const Event = require('../models/Event')
const User = require('../models/User')

const calendarController = {
    allEvents: async function (req,res){
        let myId = req.body.myId

        try {
            let events = await Event.find({userId: myId})
            res.send(events)
        } catch (error) {
            res.status(400).send(error)
        }
    },


    saveEvent: async function (req, res) {
        let title = req.body.title
        let date = req.body.date
        let startTime = req.body.startTime
        let endTime = req.body.endTime
        let userId = req.body.userId

        let event = new Event({title,date,startTime,endTime,userId})

        try {
            await event.save()
            res.send('event saved')
        } catch (error) {
            res.status(400).send(error)
        }

    },

    editEvent: async function (req, res) {
        let eventId = req.body.eventId

        let title = req.body.title
        let date = req.body.date
        let startTime = req.body.startTime
        let endTime = req.body.endTime
        let userId = req.body.userId

        try {
            await Event.findByIdAndUpdate({_id: eventId},{title, date, startTime, endTime, userId})
            res.send('event edited')
        } catch (error) {
            res.status(400).send(error)
        }

    },

    deleteEvent: async function (req, res) {
        let eventId = req.body.eventId
        try {
            await Event.findByIdAndDelete({_id: eventId})
            res.send('event deleted')
        } catch (error) {
            res.status(400).send(error.message)
        }

    },
}

module.exports = calendarController