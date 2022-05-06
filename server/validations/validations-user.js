const Joi = require('joi') 
function userValidation(body)  { 
const registerValidation = Joi.object().keys({ 
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','fr','de'] } }),
    username: Joi.string()
        .trim()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .trim()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
    isAdmin : Joi.number(),
    bio: Joi.string().min(2).max(500).allow(null),
    picture : Joi.allow(null)
  }) 
 return registerValidation.validate(body)
}; 
module.exports = userValidation;