
const uuid = require('uuid/v4')
const {validationResult} = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')




const getUsers = async (req, res, next ) => {
    let users
    try{
    users = await User.find({}, '-password')
    }
    catch (err){
        const error = new HttpError('Fetching users failed, please try again', 500)
        return next(error)
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
}



const login = async (req, res, next ) => {

   const {email, password} = req.body

   let existingUser

   try{
   existingUser = await User.findOne({ email: email})
   } catch(err){
       const error = new HttpError('Logging In failed, please try again', 500)
       return next(error)
   }

   if(!existingUser || existingUser.password !== password){
       const error = new HttpError(
           'Invalid credentials could not log you in',
           401
       )
       return next(error)
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

    const {name, email, password} = req.body

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
        places: []
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

