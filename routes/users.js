'use strict'

const express = require('express')
const humps = require('humps')
const knex = require('../knex')
const bcrypt = require('bcrypt-as-promised')

const router = express.Router()





// http POST  user with hashed_password
router.post('/users', function(req, res, next) {
  let hashed_password = bcrypt.hash(req.body.password, 12)
    .then(function(hashed_password) {
      return knex('users').insert({
          'first_name': req.body.firstName ,
          'last_name': req.body.lastName,
          'email': req.body.email,
          'hashed_password': hashed_password
        }, '*')
    })

    .then(function(users) {
      const user = users[0]
      delete user.hashed_password
      res.send(humps.camelizeKeys(user))
      res.sendStatus(200)
    })

    .catch(function(err) {
        next(err)
    })
})

module.exports = router;
