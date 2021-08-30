const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const userController = {
    loginForm: function (req, res) {
        let error = false
        let email = ''
        res.render('login', { error, email })
    },

    registerForm: function (req, res) {
        let error = false
        let email = ''
        res.render('register', { error, email })
    },

    login: async function (req, res) {
        let email = req.body.email
        let password = req.body.password
        const selectedUser = await User.findOne({email})
        if (!selectedUser) {
            let error = true
            return res.render('login', { error, email})   
        }

        const passwordAndUserMatch = await bcrypt.compareSync(password, selectedUser.password)
        if (!passwordAndUserMatch) {
            let error = true
            return  res.render('login', { error, email})
        } else {
            const token = jwt.sign({ _id: selectedUser._id, adm: selectedUser.adm }, process.env.TOKEN_SECRET)
            res.header("auth-token", token)
            res.redirect('/public')
        }
    },

    register: async function (req, res) {
        let selectedUser = await User.findOne({ email: req.body.email })
        if (selectedUser) {
            let error = true
            return res.render('login', { error })
        }
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        })

        try {
            await user.save()
            res.redirect('/')
        } catch (error) {
            res.status(400).send("error occurred", erro)
        }


    }
}

module.exports = userController