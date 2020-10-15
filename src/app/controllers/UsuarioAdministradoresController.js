import Usuario from "../models/Usuario";
import Usuario_Administradores from "../models/Usuario_Administradores";
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import bcrypt from 'bcryptjs';

function generateToken(params = {}){
  const token = jwt.sign(params,authConfig.secret,{
      expiresIn: 86400,
  });
  return token;
}

function cryptPass(senha){
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
};

class UsuarioAdministradoresController {
  async store(req, res) {
    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);
    

   if(emailExists){
      return res.status(409).json({ error: "Email ja esta em uso." });
    }

     await Usuario_Administradores.create({
      Usuario:req.body.usuario,
    }, {
      include: [
        {model: Usuario, as: 'Usuario'}
      ],
    }).then((usuario_administradores) => {
      usuario_administradores.Usuario.senha=undefined;
      return res.status(201).json({
        usuario_administradores: usuario_administradores,
        token: generateToken({
          id_usuario: usuario_administradores.Usuario.id,
          tipo_usuario: usuario_administradores.Usuario.id_tipo_usuario
        })
      })
    }).catch((err)=>{
      console.log("ERRO: "+err)
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const administradores = await Usuario_Administradores.findAll({
      attributes: ["id"],
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["nome", "email"]
        }
      ],
      limit: 20,
      offset: (page - 1) * 20
    });

    return res.status(201).json({ administradores });
  }

  async update(req, res) {

    const administradoresData = await Usuario_Administradores.findOne({
      where: { id_usuario: req.params.id },
      include: [
        { model: Usuario, as: "Usuario" }
      ]
    });

    const { usuario, usuario_administradores } = req.body;

    const administradores = await administradoresData.update(
      usuario_administradores,
      administradoresData.Usuario.update(usuario)
    );
    return res.status(201).json({ administradores });
  }

}

export default new UsuarioAdministradoresController();
