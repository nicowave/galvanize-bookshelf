'use strict'

const humps = require('humps')
const express = require('express')
const jwt = require('jsonwebtoken')
const knex = require('../knex')
const boom = require('boom')
const bcrypt = require('bcrypt')
const router = express.Router()
const cookieParser = require('cookie-parser')



// get token from user
router.get('/token', function(req, res, next)  {
  if (req.cookies.token) {
    res.status(200);
    res.send(true);
  }
  else {
    res.status(200);
    res.send(false);
  }
});


router.post('/token', function(req, res, next) {

  knex('users')
    .where('email', req.body.email)
    .then(function(users) {
      
      if (users.length === 0) {
        res.status(400)
        res.set('Content-Type', 'plain/text')
        res.send('Bad email or password')

      } else {

        const match = bcrypt.compareSync(req.body.password, users[0].hashed_password)

        if (match === true) {
          delete users[0].hashed_password

          const token = jwt.sign(users[0], process.env.JWT_KEY)
          res.cookie('token', token, { httpOnly:true })
          res.status(200)
          res.send(humps.camelizeKeys(users[0]))

        } else {
          res.status(400)
          res.set('Content-Type', 'plain/text')
          res.send('Bad email or password')
        }

      }

    })
})


router.delete('/token', function(req, res, next) {

  res.clearCookie('token');
  res.status(200);
  res.send(true);
})


module.exports = router;
