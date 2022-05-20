const jwt = require('jsonwebtoken');

const JWT_SIGN_TOKEN = 'bienheureuxestceluiquinesaitpasquilestriste';

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SIGN_TOKEN);
        const userUuid = decodedToken.uuid;
        if (req.params.uuid && req.params.uuiid != userUuid) {
            throw 'Invalid user ID !'
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: new Error('Invalid request !')
        })

    }
}