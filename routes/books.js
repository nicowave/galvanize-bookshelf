'use strict'

const express = require('express')
const knex = require('../knex')
const humps = require('humps')

// eslint-disable-next-line new-cap
const router = express.Router()


// make a 'get' request to ''\books' 'route'
router.get('/books', function(req, res, next) {
  // use 'knex' to make query to grab 'books' object from database
  // order by title ascending
    knex('books')
    .orderBy('title', 'asc')
    .then(function(books) {
      res.send(humps.camelizeKeys(books));
    })
    .catch(function(err) {
        next(err)
    })
})


router.get('/books/:id', function(req, res, next) {
  knex('books')
    .where('id', req.params.id)
    .then(function(books) {
      if (!books) {
        return next()
      }
      res.send(humps.camelizeKeys(books[0]));
    })
    .catch(function(err) {
      next(err)
    })
})

// post all book objects?
router.post('/books', function(req, res, next) {
  knex('books')
    .then(function(books) {
      if (!books) {
       const err = new Error('book does not exist')
       err.status = 404
       throw err
      }
    knex('books')
      .insert({'id': req.body.id,
              'title': req.body.title,
              'author': req.body.author,
              'genre': req.body.genre,
              'description': req.body.description,
              'cover_url': req.body.coverUrl,
              'created_at': req.body.createdAt,
              'updated_at': req.body.updatedAt
            })
            .returning('*')
            .then(function(newbooks) {
              res.json(humps.camelizeKeys(newbooks[0]))
      })
    })
    .catch(function(err)  {
      next(err)
  })
})


// patch is the equivalent of update in SQL/Knex
router.patch('/books/:id', function(req, res, next) {
  knex('books')
    .where('id', req.params.id)
    .update({
        'id': req.body.id,
        'title': req.body.title,
        'author': req.body.author,
        'genre': req.body.genre,
        'description': req.body.description,
        'cover_url': req.body.coverUrl
    })
    .returning('*')
    .then(function(updatedBook) {
      res.json(humps.camelizeKeys(updatedBook[0]))
    })
    .catch(function(err) {
      next(err)
    })
})


router.delete('/books/:id', function(req, res, next)  {
  let bookNine;

  // begin 'knex' query
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next()
      }
      // set book object 'bookNine' variable to the 'row'
      bookNine = row

      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(function() {
      delete bookNine.id;
      res.send(humps.camelizeKeys(bookNine));
    })
    .catch(function(err) {
      next(err)
    })
    // end 'knex' query
})

module.exports = router;
