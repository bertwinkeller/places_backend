
const uuid = require('uuid/v4')
const {validationResult} = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')




const getUsers = (req, res, next ) => {
    res.json({users: dummyUsers})
}


const login = (req, res, next ) => {

   const {email, password} = req.body
   const identifiedUser = dummyUsers.find(u => u.email === email)

   if(!identifiedUser || identifiedUser.password !== password){
       throw new HttpError('Could not identify users,', 401)
   }
   res.json({message: 'Logged In'})
}

const signUp = async(req, res, next ) =>  {

    const errors = validationResult(req)
    if (!errors.isEmpty()){
     return next(
     newHttpError('Invalid inputs, check your data', 422)
     )
    }

    const {name, email, password, places} = req.body

    let existingUser
    try{
    existingUser = await User.findOne({ email: email})
    } catch(err){
        const error = new HttpError('Signing up failed, please try again', 500)
        return next(error)
    }


    if(existingUser){
       const error = new HttpError('User already exists, please login', 422) 
       return next(error)
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://static.amazon.jobs/locations/58/thumbnails/NYC.jpg?1547618123',
        password,
        places
    })


try{
    await createdUser.save()
}catch (err){
    const error = new HttpError(
        'Signing up failed, please try again', 500
    )
    return next(error)
}
    res.status(201).json({user: createdUser.toObject({getters: true})})

}

exports.getUsers = getUsers
exports.login = login
exports.signUp = signUp

