'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Resep.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }
  Resep.init({
    id_user: {
      type:DataTypes.INTEGER,
      references:{
        model:"Users",
        key:"id"
      }
    },
    nama_resep: DataTypes.STRING,
    porsi: DataTypes.INTEGER,
    waktu_masak: DataTypes.STRING,
    bahan: DataTypes.TEXT,
    langkah: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Resep',
  });
  return Resep;
};