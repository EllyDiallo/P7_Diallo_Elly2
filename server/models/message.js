

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
    

  
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        
        models.Message.belongsTo(models.User, {
          foreignKey: 
            'userId',
            
          }
        )
      }
    }
  });
  return Message;
};
