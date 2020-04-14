
const HttpError = require('../models/http-error')

const uuid = require('uuid/v4')
const {validationResult} = require('express-validator')
const getCoordinates = require('../utils/location.js')
const Place = require('../models/place')



const getPlaceById = (req, res, next) => {
    const placeID = req.params.pid 
    const place = dummyPlaces.find(p => {
        return p.id === placeID
    })

    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);
      }
    
      res.json({ place }); // => { place } => { place: place }
}

const getPlacesByUserId = (req, res, next) => {
    const userID = req.params.uid 
    const places = dummyPlaces.filter(p => {
        return p.creator === userID
    })

    if (!places) {
        return next(
          new HttpError('Could not find places for the provided user id.', 404)
        );
      } 
    
      res.json({ places });
}

const createPlace = async (req, res, next ) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors)
        next (new HttpError('Invalid inputs, check your data', 422))
    }
const {title, description, address, creator} = req.body

let coordinates
try{
coordinates = await getCoordinates(address)
} catch (error){
    console.log(error)
   return next(error)
}

const createdPlace = new Place ({

title,
description,
address,
location: coordinates,
image: 'https://static.amazon.jobs/locations/58/thumbnails/NYC.jpg?1547618123',
creator
})

try{
await createdPlace.save()
} catch (err){
    const error = new HttpError('Creating place failed, please try again', 500)
    return next(error)
}
res.status(201).json({place: createdPlace})
}


const updatePlace = (req, res, next ) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors)
        throw new HttpError('Invalid inputs, check your data', 422)
    }


const {title, description} = req.body

const placeId = req.params.pid

const updatedPlace = {...dummyPlaces.find(p => p.id === placeId) }
const placeIndex = dummyPlaces.findIndex(p => p.id === placeId)

updatedPlace.title = title
updatedPlace.description = description

dummyPlaces[placeIndex] = updatedPlace

res.status(200).json({place: updatedPlace})
}

const deletePlace = (req, res, next ) => {
const placeId = req.params.pid
if(!dummyPlaces.find(p => p.id === place)){
    throw new HttpError('Could not find a place for that id', 404)
}
dummyPlaces = dummyPlaces.filter(p => p.id !== placeId)
res.status(200).json("You deleted the place")
}



exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace