const express = require('express')

const placesControllers = require('../controllers/places-controller')

const router = express.Router() 

const HttpError = require('../models/http-error')




router.get('/user/:uid', placesControllers.getPlaceByUserId)

router.get('/:pid', placesControllers.getPlaceById )

router.post('/', placesControllers.createPlace)

router.patch('/:pid', placesControllers.updatePlace)

router.delete('/:pid', placesControllers.deletePlace)


module.exports = router