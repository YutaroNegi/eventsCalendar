const express = require('express')
const app = express()
const path = require('path')
const userRouter = require('./routes/userRouter')
const calendarRouter = require('./routes/calendarRouter')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

app.get('/', (req,res)=>{res.redirect('/user/login')})
app.use('/user', userRouter)
app.use('/calendar', calendarRouter)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))
app.use('/public', express.static(path.join(__dirname, "public")))

db.on('error', () => {console.log("error ocured");})
db.once('open', () => {console.log("mongo db running");})


app.listen(process.env.PORT, ()=>{console.log('server running');})