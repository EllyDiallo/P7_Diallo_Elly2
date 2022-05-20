//Import
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const messageCtrl = require('./routes/messagesCtrl');
const auth = require('./middlewares/auth');



//Router
exports.router = (function(){
    const apiRouter = express.Router();

    //Users routes
    apiRouter.route('/users/register').post(usersCtrl.register);
    apiRouter.route('/users/login').post(usersCtrl.login);
    apiRouter.route('/users/:uuid').get(auth,usersCtrl.getUserProfile);
    apiRouter.route('/users/:uuid').put(auth,usersCtrl.updateUserProfile);

    apiRouter.route('/messages/new').post(messageCtrl.createMessage);
    apiRouter.route('/messages').get(messageCtrl.listMessages);
    return apiRouter;
})();