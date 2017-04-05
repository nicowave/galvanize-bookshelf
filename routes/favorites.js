'use strict';

const express = require('express');
const humps = require('humps')
const jwt = require('jsonwebtoken')
const boom = require('boom')
const cookieSession = require('cookie-session')
const knex = require('../knex')

const router = express.Router()



router.get('/', function(req, res, next) {
    if (!req.cookies.token) {
        return next(boom.create(401, 'Unauthorized'))
    } else {
      console.log('else\n\n');
        knex('favorites')
            .join('books', 'books.id', 'book_id')
            .then(function(favs) {
                res.set('Content-Type', 'application/json')
                res.send(humps.camelizeKeys(favs))
                console.log(favs)
            })
    }
})

// GET request for a specific 'book' data-object
router.get('/check?', function(req, res, next) {
    if (req.cookies.token) {
      let qiD = req.query.bookId
      knex('favorites')
        .where('book_id', qiD)
        .then(function(book) {
          if (book[0]) {
            res.status(200).send(true)
          } else {
            res.status(200).send(false)
          }
        })
    } else {
      return next(boom.create(401, 'Unauthorized'))
    }
})


router.post('/', function(req, res, next) {

  if (req.cookies.token) {
      

  }


})






module.exports = router;
