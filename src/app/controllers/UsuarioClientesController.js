import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import Usuario_Clientes from "../models/Usuario_Clientes";
import Endereco from "../models/Endereco";
import authConfig from "../../config/auth";
import bcrypt from "bcryptjs";
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import Sequelize from 'sequelize';
const routes = new Router();
const Op = Sequelize.Op;

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
  return token;
}

function cryptPass(senha) {
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
}

class UsuarioClientesController {
  async store(req, res) {
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);

    if (emailExists) {
      return res.status(400).json({ error: "Email ja esta em uso." });
    }

    await Usuario_Clientes.create(
      {
        Usuario: req.body.usuario,
        Endereco: req.body.endereco
      },
      {
        include: [
          { model: Usuario, as: "Usuario" },
          { model: Endereco, as: "Endereco" }
        ]
      }
    )
      .then(usuario_clientes => {
        usuario_clientes.Usuario.senha = undefined;
        return res.status(201).json({
          usuario_clientes: usuario_clientes,
          token: generateToken({
            id_usuario: usuario_clientes.Usuario.id,
            tipo_usuario: usuario_clientes.Usuario.id_tipo_usuario,
          })
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const clientes = await Usuario_Clientes.findAll({
      attributes: ["id"],
      include: [
        {
          model: Endereco,
          as: "Endereco",
          attributes: ["id", "estado", "cidade", "bairro", "cep", "logradouro", "numero", "complemento", "latitude", "longitude"]
        },
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["nome", "email"]
        }
      ],
      limit: 20,
      offset: (page - 1) * 20
    });

    return res.status(201).json({ clientes });
  }
  
  async showById(req, res) {

    await Usuario_Clientes.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id"],
      include: [
        { model: Usuario, as: "Usuario",
         attributes: ["nome", "email"] },
        { model: Endereco, as: "Endereco",
        attributes: ["id", "estado", "cidade", "bairro", "cep", "logradouro", "numero", "complemento", "latitude", "longitude"] }
      ]
    })
    .then(clientes => {
      return res.status(201).json({
        clientes
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
  }

  async update(req, res) {

    const clientesData = await Usuario_Clientes.findOne({
      where: { id_usuario: req.params.id },
      include: [
        { model: Usuario, as: "Usuario" },
        { model: Endereco, as: "Endereco" }
      ]
    });

    const { usuario, usuario_clientes, endereco } = req.body;

    const clientes = await clientesData.update(
      usuario_clientes,
      clientesData.Usuario.update(usuario),
      clientesData.Endereco.update(endereco)
    );
    return res.status(201).json({ clientes });
  }
}

export default new UsuarioClientesController();
