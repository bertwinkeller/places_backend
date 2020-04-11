
const uuid = require('uuid/v4')
const {validationResult} = require('express-validator')

const HttpError = require('../models/http-error')

const dummyUsers = [

    {
        id: 'u1', 
        name: "Bert Keller ",
        email: "bertwinkeller@gmail.com",
        password: "password"
    }
]




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

const signUp = (req, res, next ) =>  {

    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors)
        throw new HttpError('Invalid inputs, check your data', 422)
    }

    const {name, email, password} = req.body
    const hasUser = dummyUsers.find(u => u.email === email)

    if(hasUser){
        throw new HttpError('Sorry this user already exists')
    }

    const createdUser = {
        id: uuid(),
        name, 
        email,
        password,
    }

    dummyUsers.push(createdUser)
    res.status(201).json({user: createdUser})

}

exports.getUsers = getUsers
exports.login = login
exports.signUp = signUp

