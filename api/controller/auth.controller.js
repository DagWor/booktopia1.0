const User = require('../data/user.model')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

module.exports.authenticateUser = (req, res) => {
    const response = {
        status: 200,
        message: ""
    }

    if (req.body && req.body.username && req.body.password) {
        let authUser = {
            username: req.body.username
        }
        if (req.body.name) newUser.name = req.body.name

        User.findOne(authUser).then(user => {
            if(user) {
                
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const token = jwt.sign({ username: user.name }, 'cs572', { expiresIn: 3600 })
                    res.status(200).json(token)
                }
                else res.status(401).json({ "message": 'uauthorized' })
            }
            else res.status(404).json({message: 'User not found'})
        }).catch(err => res.status(500).json({ 'message': err }))

    } else {
        response.status = 400
        response.message = { 'message': 'Username or password requied' }
        res.status(response.status).json(response.message)
    }
}

module.exports.authenticate = (req, res, next) => {
    const headerExists = req.headers.authorization;

    if (headerExists) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'cs572', (err, decoded) => {
            if (err) {
                let message = { 'message': 'Unauthorized' }
                res.status(401).json(message)
            } else {
                req.user = decoded.user
                next();
            }
        })
    }
    else {
        let message = { 'message': 'No token provided' }
        res.status(403).json(message)
    }
}