'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      item.belongsTo(models.Lista, 
      );
    }
  }
  item.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    fechaCreacion: DataTypes.DATE,
    fechaResolucion: DataTypes.DATE,
    fechaLimite: DataTypes.DATE,
    prioridad: DataTypes.STRING,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'item',
    tableName: 'item',
    timestamps: false
  });
  return item;
};