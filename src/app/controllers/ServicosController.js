import Servicos from "../models/Servicos";
import Usuario_Profissionais from "../models/Usuario_Profissionais";

class ServicosController {
  async store(req, res) {

    const idExist = await Usuario_Profissionais.findOne({
      where: { id: req.body.servicos.id_usuario_profissional }
    });

    if (!idExist) {
      return res.status(200).json({ error: "Id não já cadastrado." });
    }

    await Servicos.create(
      {
        id_usuario_profissional: req.body.servicos.id_usuario_profissional,
        nome: req.body.servicos.nome,
        valor: req.body.servicos.valor,
      }
    )
      .then(servicos => {
        return res.status(201).json({
           servicos: servicos,
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const servicos = await Servicos.findAll({
      attributes: ["id", "nome", "valor"],
      limit: 20,
      offset: (page - 1) * 20
    });

    return res.status(201).json({ servicos });
  }

  async showById(req, res) {

    await Servicos.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "nome", "valor"],
    })
    .then(servicos => {
      return res.status(201).json({
        servicos
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
  }

  async showByProfissionais(req, res) {

    await Servicos.findAll({
      where: {
        id_usuario_profissional: req.params.id,
      },
      attributes: ["id", "nome", "valor"],
    })
    .then(servicos => {
      return res.status(201).json({
        servicos
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
  }

  async update(req, res) {

    const servicosData = await Servicos.findOne({
      where: { id: req.params.id }
    });

    const { servicos } = req.body;

    const servico = await servicosData.update(
      servicos
    );
    return res.status(201).json({ servico });
  }

  async delete(req, res) {
    const servicos = await Servicos.findOne({
      where: { id: req.params.id },
    });
    await servicos.destroy().then(() => {
        return res.status(201).json({
          message: "Servico deletado com sucesso!"
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }
}

export default new ServicosController();
