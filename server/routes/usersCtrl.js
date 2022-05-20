//Import
const bcrypt = require("bcrypt");
const jwtUtils = require('../utils/jwt.utils');
//const models = require('../models');
const {Message, User} = require('../models');
const userValidation = require('../validations/validations-user');
const asyncLib = require('async');
const user = require("../models/user");



//Routes

module.exports = {
    
    register: function(req,res){
        //params
        const {body} = req;

        const {error} = userValidation(body);
        if(error) return res.status(401).json(error.details.map(i => i.message).join(',')+ " pas ok")

        const { email, username, password, bio, picture } = req.body
          

        asyncLib.waterfall([
      function(callback) {
            User.findOne({
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
          return res.status(409).json({ err: 'user already exist' });
        }
      },
      function(userFound, bcryptedPassword, callback) {
        var newUser = User.create({
          email: email,
          username: username,
          password: bcryptedPassword,
          isAdmin: 0,
          bio: bio,
          picture: picture
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
          'uuid':newUser.uuid,
          'pseudo':newUser.username
        });
      } else {
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
    },
    login: function(req,res){
        const {email, password} = req.body;
        
         if(email == null || password == null ){
            res.status(400).json({err : "misssing  parameters"})
        }


        asyncLib.waterfall([
      function(callback) {
            User.findOne({
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
            if (errBycrypt){
              return  res.status(404).json({ 'invalid password' : errBycrypt });
            }else{callback(null, userFound, resBycrypt);
            }
            
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
          'userUuid': userFound.uuid,
          'userName': userFound.username,
          'token': jwtUtils.generateTokenForUser(userFound)
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
        
    },
   getUserProfile  : async (req, res) => {
      const uuid = req.params.uuid;
      try {
        const user = await User.findOne({
          attributes: ['uuid','username','bio','picture'],
          where:{uuid}
        })
        return res.json(user)

      } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong'})
        
      }
    },
    /*getUserProfile: function(req, res) {
    
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

        User.findOne({
      attributes: [ 'uuid', 'email', 'username', 'bio','picture' ],
      where: { id: userId }
    }).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
  },*/
  updateUserProfile: async (req, res) => {
    
   const uuid = req.params.uuid;
   const {userModified} = req.body;
    var bio = req.body.bio;
    var picture = req.body.picture;


    try {
        const userFound = await User.findOne({
          attributes: ['bio'],
          where:{uuid}
        })
        await userFound.then(userData){
          
        }
    }
      catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong'})
        
      }
    

   
  /*updateUserProfile: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var bio = req.body.bio;
    var picture = req.body.picture;

    asyncLib.waterfall([
      function(callback) {
            User.findOne({
          attributes: ['uuid', 'bio','picture'],
          where: { id: userId }
        }).then(function (userFound) {
          callback(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, callback) {
        if(userFound) {
          userFound.update({
            bio: (bio ? bio : userFound.bio),
            picture: (picture ? picture : userFound.picture)
          }).then(function() {
            callback(userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user profile' });
      }
    });
  }*/
}}