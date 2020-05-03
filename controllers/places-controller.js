
const HttpError = require('../models/http-error')

const uuid = require('uuid/v4')
const {validationResult} = require('express-validator')
const getCoordinates = require('../utils/location.js')
const Place = require('../models/place')

 

const getPlaceById = async (req, res, next) => {
    const placeID = req.params.pid 

    let place

    try {
    place = await Place.findById(placeID)
    } catch (err){
        const error = new HttpError('Could not find a place', 500)
        return next(error)
    }
    if (!place) {
        const error = new HttpError('Could not find a place for the provided id.', 404)
        return next(error)
      }
      res.json({ place: place.toObject( {getters: true}) }); // => { place } => { place: place }
}

const getPlacesByUserId = async (req, res, next) => {
    const userID = req.params.uid 
    let places
    try{ 
        places = await Place.find( {creator: userID})
    } catch(err){
        const error = new HttpError('Couldnt find place for this user', 500)
        return next(error)
    }
        

    if (!places) {
        return next(
          new HttpError('Could not find places for the provided user id.', 404)
        );
      } 
    
      res.json({ places: places.map(place => place.toObject({getters: true})) });
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


const updatePlace = async (req, res, next ) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors)
        return next
        (HttpError('Invalid inputs, check your data', 422))
    }


const {title, description} = req.body
const placeId = req.params.pid

let place
try{
    place = await Place.findById(placeId)
}catch (err){
    const error = new HttpError('Could not update place', 500)
    return next(error)
}

place.title = title
place.description = description

try{
    await place.save()
}catch(err){
    const error = new HttpError('Could not update place', 500)
    return next(error)
}
res.status(200).json({place: place.toObject({getters: true})})
}

const deletePlace = async (req, res, next ) => {
const placeId = req.params.pid

let place
try{
    place = await Place.findById(placeId)
} catch(err){
 const error = new HttpError('Something went wrong, could not delete place', 500)
 return next(error)
}
try {
    await place.remove()

}catch(err){
    const error = new HttpError('Something went wrong, could not delete place',
    500)
    return next(error)
}
res.status(200).json({message: 'Place Deleted'})
} 



exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace