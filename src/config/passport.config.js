const passport = require('passport')
const local = require('passport-local')
const userService = require('../models/User')
const {createHash, isValidatePassword} = require('../../utils')
const jwt = require('passport-jwt')

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token
}

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "coderSecret"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (err) {
            return done(err)
        }
    }
    ))
}


module.exports = initializePassport;