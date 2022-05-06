
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    bio: DataTypes.STRING,
    picture: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.User.hasMany(models.Message,{
          foreignKey: 
            'userId',
            
          });
      }
    }
  });
  return User;
};