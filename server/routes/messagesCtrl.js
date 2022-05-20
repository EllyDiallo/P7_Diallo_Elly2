//const models = require('../models');
const {Message, User} = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');
const messageValidation = require('../validations/validation-message');

// Constants
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;


module.exports = {
    createMessage: function(req,res){
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        const {body} = req;

        const {error} = messageValidation(body);
        if(error) return res.status(401).json(error.details.map(i => i.message).join(','))

        const title = req.body.title;
        const content = req.body.content;
        const attachment = req.body.attachment;
        

        asyncLib.waterfall([
            function(callback) {
                    User.findOne({
                where: { id: userId }
                })
                .then(function(userFound) {
                  console.log(userFound);
                callback(null, userFound);
                })
                .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user 1'});
                });
            },
            function(userFound, callback) {
                if(userFound) {
                      Message.create({
                    title  : title,
                    content: content,
                    likes  : 0,
                    userId : userFound.id
                })
                .then(function(newMessage) {
                    callback(newMessage);
                })
                 .catch(function(err) {
                  return res.status(500).json(console.log(err));;
                })} else {
                res.status(404).json({ 'error': 'user not found' });
                }
            },
            ], function(newMessage) {
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'cannot post message' });
            }
            }
        );
    },
    listMessages: function(req, res) {
  

          Message.findAll({
      attributes: [ 'title','content','attachment' ],
      include    : [{
          model: User,
          attributes: ['username']
        }
      ]
      }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}