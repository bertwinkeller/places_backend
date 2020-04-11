
const HttpError = require('../models/http-error')

const uuid = require('uuid/v4')
const {validationResult} = require('express-validator')


let dummyPlaces = [
    {
        id: 'p1',
        title: "Empire State Building",
        description: 'One of the most famous skyskrapers in the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: "Wall Street",
        description: 'Makin Money',
        location: {
            lat: 39.99,
            lng: -75.00
        },
        address: ' 234 Wall St, New York, NY 10001',
        creator: 'u1'
    }
]

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

const createPlace = (req, res, next ) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors)
        throw new HttpError('Invalid inputs, check your data', 422)
    }


const {title, description, coordinates, address, creator} = req.body
const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
}

dummyPlaces.push(createdPlace)

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