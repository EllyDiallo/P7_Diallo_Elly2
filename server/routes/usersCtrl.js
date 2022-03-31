//Import
const bcrypt = require("bcrypt");
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
const userValidation = require('../validations/validations');

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

        
        //TODO: verify pseudo length,  mail regex, password ect

        models.User.findOne({
            attributes: ['email'],
            where: {email: email}
        })
        .then(function(userFound){
            if(!userFound){
                 bcrypt.hash(password, 10, function(err, bcryptedPassword){
                      const newUser = models.User.create({
                          email: email,
                          username : username,
                          password: bcryptedPassword,
                          bio: bio,
                          isAdmin: 0,
                          picture: picture
                      })
                      .then(function(newUser){

                        return res.status(201).json({
                            'userId': newUser.id
                        })
                      })
                      .catch(function(err){
                        return res.status(500).json({"err":"cannot add user"})                      })
                      
                 })
            }else{
                res.status(409).json({'error': "user already exist"});
            }
        })
        .catch(function(err){
            res.status(500).json({'error': "unable to verify user"});
        })
    },
    login: function(req,res){
        
         const email = req.body.email;
         const password = req.body.password;

         if(email == null || password == null ){
            res.status(400).json({err : "misssing  parameters"})
        }

        models.User.findOne({
            //attributes: ['email'],
            where: {email: email}
        })
        .then(function(userFound){
            if (userFound) {

                bcrypt.compare(password, userFound.password, function(errBcrypt, resBcrypt){
                    if (resBcrypt) {
                     return     res.status(200).json({
                                'userId': userFound.id,
                                'token': jwtUtils.generateTokenForUser(userFound)
                    })
                    } else {
                       return   res.status(403).json({'error' : "invalid password"});
                    }
                    
                });
                
            } else {
               return res.status(404).json({'error' : "user not exist in db"});
            }
        })
        .catch(function(err){
            return res.status(500).json({'error':"unable to verify user"});
        })
    }
}