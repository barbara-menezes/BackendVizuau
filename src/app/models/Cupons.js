import Sequelize, { Model } from "sequelize";

class Cupons extends Model {
  static init(sequelize) {
    super.init(
      {
        valor: Sequelize.DOUBLE,
        status: Sequelize.STRING,
        validade: Sequelize.DATEONLY,
        quantidade: Sequelize.INTEGER,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate(models){
    //this.belongsTo(models.Agendamento, {as:"Agendamento", foreignKey: "id_cupom"});
  };
}

export default Cupons;
