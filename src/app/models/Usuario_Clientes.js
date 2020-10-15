import Sequelize, { Model } from "sequelize";

class Usuario_clientes extends Model {
  static init(sequelize) {
    super.init(
      {
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate (models){
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
  };
}

export default Usuario_clientes;