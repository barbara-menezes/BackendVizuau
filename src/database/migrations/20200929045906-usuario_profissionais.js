module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuario_profissionais", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_endereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "enderecos",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      atend_domicilio: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      horario_func_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      horario_func_final: {
        type: Sequelize.TIME,
        allowNull: false
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable("usuario_profissionais");
  }
};
