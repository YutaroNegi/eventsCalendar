const express = require('express')
const router = express.Router()
const cors = require('cors')
const userController = require('../controllers/userController')
router.use(express.urlencoded({extended: true}), express.json())
router.use(cors())


router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm)

router.post('/login',userController.login)
router.post('/register',userController.register)


module.exports = router
