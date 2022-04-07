//Import
const bcrypt = require("bcrypt");
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
const userValidation = require('../validations/validations');
const asyncLib = require('async');



//Routes

module.exports = {
    register: function(req,res){
        //params
        const {body} = req;

        const {error} = userValidation(body);
        if(error) return res.status(401).json(error.details.map(i => i.message).join(','))

        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const bio = req.body.bio;
        const picture = req.body.picture;



        asyncLib.waterfall([
      function(callback) {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email }
        })
        .then(function(userFound) {
          callback(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, callback) {
        if (!userFound) {
          bcrypt.hash(password, 10, function( err, bcryptedPassword ) {
            callback(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      function(userFound, bcryptedPassword, callback) {
        var newUser = models.User.create({
          email: email,
          username: username,
          password: bcryptedPassword,
          bio: bio,
          isAdmin: 0
        })
        .then(function(newUser) {
          callback(newUser);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], function(newUser) {
      if (newUser) {
        return res.status(201).json({
          'userId': newUser.id
        });
      } else {
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
    },
    login: function(req,res){
        
         const email = req.body.email;
         const password = req.body.password;

         if(email == null || password == null ){
            res.status(400).json({err : "misssing  parameters"})
        }


        asyncLib.waterfall([
      function(callback) {
        models.User.findOne({
          where: { email: email }
        })
        .then(function(userFound) {
          callback(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, callback) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            callback(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ 'error': 'user not exist in DB' });
        }
      },
      function(userFound, resBycrypt, callback) {
        if(resBycrypt) {
          callback(userFound);
        } else {
          return res.status(403).json({ 'error': 'invalid password' });
        }
      }
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json({
          'userId': userFound.id,
          'token': jwtUtils.generateTokenForUser(userFound)
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
        
    }
}