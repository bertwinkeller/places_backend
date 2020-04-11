const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config() 

const placesRoutes = require('./routes/places-routes')
const userRoutes = require('./routes/users-routes')
const app = express()

const API_KEY = process.env.API_KEY

app.use(bodyParser.json())
app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

app.listen(5000)

console.log(API_KEY)