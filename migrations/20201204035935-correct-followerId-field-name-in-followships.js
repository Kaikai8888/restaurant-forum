'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Followships', 'follwerId', 'followerId')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Followships', 'followerId', 'follwerId')
  }
};
