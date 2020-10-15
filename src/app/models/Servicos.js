import Sequelize, { Model } from "sequelize";

class Servicos extends Model {
  static init(sequelize) {
    super.init(
      {
        id_usuario_profissional: Sequelize.INTEGER,
        nome: Sequelize.STRING,
        valor: Sequelize.DOUBLE,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsToMany(models.Agendamentos, {
      through: "agendamentos_servicos",
      as: "agendamentos",
      foreignKey: 'id_servicos'
    });
  };
}

export default Servicos;
