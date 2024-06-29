'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reseps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        },
        allowNull:false
      },
      nama_resep: {
        type: Sequelize.STRING
      },
      porsi: {
        type: Sequelize.INTEGER
      },
      waktu_masak: {
        type: Sequelize.STRING
      },
      bahan: {
        type: Sequelize.TEXT
      },
      langkah: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reseps');
  }
};