const express = require('express')

const usersControllers = require('../controllers/users-controller')

const router = express.Router() 

const HttpError = require('../models/http-error')




router.get('/', usersControllers.getUsers)

router.post('/signup', usersControllers.signUp)

router.post('/login', usersControllers.login)


 

module.exports = router