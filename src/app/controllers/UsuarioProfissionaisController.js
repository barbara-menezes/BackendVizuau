import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import Usuario_Profissionais from "../models/Usuario_Profissionais";
import Endereco from "../models/Endereco";
import authConfig from "../../config/auth";
import bcrypt from "bcryptjs";

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

class Usuario_ProfissionaisController {
  async store(req, res) {
    console.log(req.body);
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);

    if (emailExists) {
      return res.status(409).json({ error: "Email ja esta em uso." });
    }

    await Usuario_Profissionais.create(
      {
        atend_domicilio: req.body.usuario_profissionais.atend_domicilio,
        horario_func_inicio: req.body.usuario_profissionais.horario_func_inicio,
        horario_func_final: req.body.usuario_profissionais.horario_func_final,
        tipo: req.body.usuario_profissionais.tipo,
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
      .then(usuario_profissionais => {
        usuario_profissionais.Usuario.senha = undefined;
        return res.status(201).json({
          profissionais: usuario_profissionais,
          token: jwt.sign(
            {
              id_usuario: usuario_profissionais.Usuario.id,
              tipo_usuario: usuario_profissionais.Usuario.id_tipo_usuario
            },
            authConfig.secret,
            {
              expiresIn: authConfig.expiresIn
            }
          )
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const profissionais = await Usuario_Profissionais.findAll({
      attributes: ["id", "atend_domicilio", "horario_func_inicio", "horario_func_final", "tipo"],
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

    return res.status(201).json({ profissionais });
  }

  async showById(req, res) {

    await Usuario_Profissionais.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "atend_domicilio", "horario_func_inicio", "horario_func_final", "tipo"],
      include: [
        { model: Usuario, as: "Usuario",
         attributes: ["nome", "email"] },
        { model: Endereco, as: "Endereco",
        attributes: ["id", "estado", "cidade", "bairro", "cep", "logradouro", "numero", "complemento", "latitude", "longitude"] }
      ]
    })
    .then(profissionais => {
      return res.status(201).json({
        profissionais
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
  }

  async update(req, res) {

    const profissionaisData = await Usuario_Profissionais.findOne({
      where: { id_usuario: req.params.id },
      include: [
        { model: Usuario, as: "Usuario" },
        { model: Endereco, as: "Endereco" }
      ]
    });

    const { usuario, usuario_profissionais, endereco } = req.body;

    const profissionais = await profissionaisData.update(
      usuario_profissionais,
      profissionaisData.Usuario.update(usuario),
      profissionaisData.Endereco.update(endereco)
    );
    return res.status(201).json({ profissionais });
  }
}

export default new Usuario_ProfissionaisController();
