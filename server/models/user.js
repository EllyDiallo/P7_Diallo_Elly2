
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false
      },
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    bio: DataTypes.STRING,
    picture: {
      type: DataTypes.STRING,
      defaultValue:'../images/profil/default_profil.png',
      allowNull: true
      },
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
 
