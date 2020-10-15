module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("agendamentos_servicos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_agendamentos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agendamentos",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_servicos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "servicos",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      created_at: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("agendamentos_servicos");
  }
};