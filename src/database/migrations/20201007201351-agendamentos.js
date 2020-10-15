module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("agendamentos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_profissional: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_cupom: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horario: {
        type: Sequelize.TIME,
        allowNull: false
      },
      valor_final: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable("agendamentos");
  }
};
