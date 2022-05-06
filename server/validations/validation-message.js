const Joi = require('joi') 
function messageValidation(body)  { 
const createPostValidation = Joi.object().keys({ 
    
    title: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required(),
    content: Joi.string().min(2).max(500)
    
  }) 
 return createPostValidation.validate(body)
}; 
module.exports = messageValidation;