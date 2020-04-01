
const HttpError = require('../models/http-error')

const uuid = require('uuid/v4')


const dummyPlaces = [
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

const getPlaceByUserId = (req, res, next) => {
    const userID = req.params.uid 
    const place = dummyPlaces.find(p => {
        return p.creator === userID
    })

    if (!place) {
        return next(
          new HttpError('Could not find a place for the provided user id.', 404)
        );
      } 
    
      res.json({ place });
}

const createPlace = (req, res, next ) => {
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


}



exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace