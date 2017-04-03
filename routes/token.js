'use strict'

const humps = require('humps')
const express = require('express')
const jwt = require('jsonwebtoken')
const knex = require('../knex');
const boom = require('boom');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router()
const cookieParser = require('cookie-parser')



// get token from user
router.get('/token', function(req, res, next) {
  res.status(200)
  res.send(false)
})

router.post('/token', function(req, res, next) {
  console.log(req.body);
  knex('users')
    .where('email', req.body.email)
    .then(function(users){
      var encode = bcrypt.compareSync(req.body.password, users[0].hashed_password)
      console.log(encode)

      if (encode) {
        delete users[0].hashed_password
        let token = jwt.sign(users[0], 'nico')
        res.cookie('token', token, {httpOnly:true})
        res.send(humps.camelizeKeys(users[0]))
      }

    })

  res.end()
})




//   let token = req.cookies.token
//   jwt.verify(token, process.env.JWT_KEY, function(err, payload){
//     if (err) {
//       res.send(false)
//     }
//     console.log('unlocked, payload is:\t', payload)
//     res.send(true)
//   })
// })

// router.post('/', function(req, res, next) {
//   // check email
//   const {
//     email
//   } = req.body
//
//   // NOTE: we are skipping bcrypt/hashed_password check to simplify this example
//   knex('users').select().where("email", email).then((data) => {
//     if (!data[0]) {
//       return next(boom.create(400, "Invalid User.  Go Away."))
//     }
//
//     let user = data[0]
//     let token = jwt.sign(user, process.env.JWT_KEY)
//     res.cookie("token", token)
//     res.send(user)
//   })
// });

//
// router.delete('/', function(req, res, next) {
//   res.clearCookie("token")
//
//   res.send(true)
// });
//
// // these are cookie tests....
// router.get('/set-cookie', function(req, res, next) {
//   res.cookie("token", "this is your amazing token")
//
//   res.send("I think I set the cookie, can you check?")
// });
//
// router.get('/get-cookie', function(req, res, next) {
//   let token = req.cookies.token
//   console.log("Your token is", token);
//
//   res.send("Your token is" + token)
// });

module.exports = router;
