'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.belongsTo(models.Category)
      Restaurant.hasMany(models.Comment)
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'RestaurantId',
        as: 'FavoriteUsers'
      })
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'RestaurantId',
        as: 'LikeUsers'
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};