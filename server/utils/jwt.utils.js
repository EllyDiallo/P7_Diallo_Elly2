const jwt = require('jsonwebtoken');

const JWT_SIGN_TOKEN = 'bienheureuxestceluiquinesaitpasquilestriste';

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin

        },
        JWT_SIGN_TOKEN,
        {
            expiresIn:'3h'
        })
    }
}