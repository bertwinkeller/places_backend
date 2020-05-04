const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config() 

const placesRoutes = require('./routes/places-routes')
const userRoutes = require('./routes/users-routes')
const app = express()

app.use(bodyParser.json())
app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

mongoose
.connect('mongodb+srv://bertwinkeller:Daintydeethegolden15!@placesdb-c9vha.mongodb.net/placesDB?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => app.listen(5000))
  .catch(e => console.error(e))

