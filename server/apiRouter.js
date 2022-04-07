//Import
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');

//Router
exports.router = (function(){
    const apiRouter = express.Router();

    //Users routes
    apiRouter.route('/users/register').post(usersCtrl.register);
    apiRouter.route('/users/login').get(usersCtrl.login);

    return apiRouter;
})();