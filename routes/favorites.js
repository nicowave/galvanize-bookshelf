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
router.get('/check', function(req, res, next) {
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
        //  do a join to books table from favorites
    } else {
      return next(boom.create(401, 'Unauthorized'))
    }
})


router.post('/', function(req, res, next) {

  console.log(req.body.bookId);
  let bookId = req.body.bookId

  if (req.cookies.token) {
    // verify jwt token to retrieve paload and user_id
    console.log(`Token found! Continue...\n ${req.cookies.token}`)
    let payload = jwt.verify(req.cookies.token, process.env.JWT_KEY)
    console.log('payload', payload)
    console.log('id', payload.id)

    knex('favorites')
      .join('books', 'books.id', 'book_id')
      .returning(['id', 'book_id', 'user_id'])
         .insert({
           id: req.body.id,
           book_id: bookId,
           user_id: payload.id
         })
         .then(function(favorite){

           console.log(favorite[0])
           res.status(200)
           res.send(humps.camelizeKeys(favorite[0]))
         })

  } else {
    return next(boom.create(401, 'Unauthorized'))
  }
})



router.delete('/', function(req, res, next) {

  if (req.cookies.token) {
    knex('favorites')
      .returning(['book_id',
                  'user_id'])
      .where('book_id', req.body.bookId)
      .del()
      .then(function(dBook) {
        // res.set('Content-Type', 'application/json')
        // res.status(200)
        delete dBook[0].id
        res.send(humps.camelizeKeys(dBook[0]))
      })

  } else {
    return next(boom.create(401, 'Unauthorized'))
  }
})





module.exports = router;
