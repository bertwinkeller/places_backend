
const uuid = require('uuid')


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
    const {name, email, password} = req.body

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

