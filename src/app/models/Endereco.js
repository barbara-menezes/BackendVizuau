import Sequelize, { Model } from 'sequelize';

class Endereco extends Model {
  static init(sequelize) {
    super.init(
      {
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        bairro: Sequelize.STRING,
        cep: Sequelize.INTEGER,
        logradouro: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
        latitude: Sequelize.STRING,
        longitude: Sequelize.STRING,
      },  
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Endereco;
