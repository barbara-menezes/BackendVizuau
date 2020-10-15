import Sequelize, { Model } from "sequelize";

class Usuario_profissionais extends Model {
  static init(sequelize) {
    super.init(
      {
        atend_domicilio: Sequelize.BOOLEAN,
        horario_func_inicio: Sequelize.TIME,
        horario_func_final: Sequelize.TIME,
        tipo: Sequelize.STRING,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate(models){
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
  };
}



export default Usuario_profissionais;
