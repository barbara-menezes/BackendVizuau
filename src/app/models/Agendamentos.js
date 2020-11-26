import Sequelize, { Model } from "sequelize";

class Agendamentos extends Model {
  static init(sequelize) {
    super.init(
      {
        id_cliente: Sequelize.INTEGER,
        id_profissional: Sequelize.INTEGER,
        id_cupom: Sequelize.INTEGER,
        status: Sequelize.STRING,
        data: Sequelize.DATEONLY,
        horario: Sequelize.TIME,
        valor_final: Sequelize.DOUBLE
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsToMany(models.Servicos, {
      through: "agendamentos_servicos",
      as: "servicos",
      foreignKey: 'id_agendamentos'
    });
    this.belongsTo(models.Usuario_clientes, {as:"Cliente",foreignKey: 'id_cliente'});
  };
}

export default Agendamentos;