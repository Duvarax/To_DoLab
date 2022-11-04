'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lista.hasMany(models.item);
    }
  }
  Lista.init({
    titulo: DataTypes.STRING,
    fechaCreacion: DataTypes.DATE,
    fechaResolucion: DataTypes.DATE,
    estado: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Lista',
    tableName: 'lista',
    timestamps: false
  });
  return Lista;
};