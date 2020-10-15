import Sequelize, { Model } from "sequelize";

class Usuario_administradores extends Model {
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
  static associate(models){
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
  };
}

export default Usuario_administradores;
