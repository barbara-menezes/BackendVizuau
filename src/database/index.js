import Sequelize from "sequelize";
import databaseConfig from '../config/database';
import Tipo_Usuario from "../app/models/Tipo_Usuario";
import Usuario from "../app/models/Usuario";
import Endereco from "../app/models/Endereco";
import Cupons from "../app/models/Cupons";
import Servicos from "../app/models/Servicos";
import Agendamentos from "../app/models/Agendamentos";
import Usuario_Administradores from "../app/models/Usuario_Administradores";
import Usuario_Profissionais from "../app/models/Usuario_Profissionais";
import Usuario_Clientes from "../app/models/Usuario_Clientes";
import Token_Senha from "../app/models/Token_Senha";
require('dotenv').config()

const models = [
  Tipo_Usuario,
  Usuario,
  Endereco,
  Cupons,
  Servicos,
  Agendamentos,
  Usuario_Administradores,
  Usuario_Profissionais,
  Usuario_Clientes,
  Token_Senha
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    
    this.connection = new Sequelize(process.env.DATABASE_URL,{
      dialect: 'postgres',
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      },
    });
    // this.connection.sync();
    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
