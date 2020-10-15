import jwt from "jsonwebtoken";
import Cupons from "../models/Cupons";
import Usuario_Profissionais from "../models/Usuario_Profissionais";
import Endereco from "../models/Endereco";

class CuponsController {
  async store(req, res) {

    await Cupons.create(
      {
        valor: req.body.cupons.valor,
        status: req.body.cupons.status,
        validade: req.body.cupons.validade,
        quantidade: req.body.cupons.quantidade
      }
    )
      .then(cupons => {
        return res.status(201).json({
          cupons: cupons,
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const cupons = await Cupons.findAll({
      attributes: ["id", "valor", "status", "validade", "quantidade"],
      limit: 20,
      offset: (page - 1) * 20
    });

    return res.status(201).json({ cupons });
  }

  async showById(req, res) {

    await Cupons.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "valor", "status", "validade", "quantidade"],
    })
    .then(cupons => {
      return res.status(201).json({
        cupons
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
  }

  async update(req, res) {

    const cuponsData = await Cupons.findOne({
      where: { id: req.params.id }
    });

    const { cupons } = req.body;

    const cupom = await cuponsData.update(
      cupons
    );
    return res.status(201).json({ cupom });
  }

  async delete(req, res) {
    const cupons = await Cupons.findOne({
      where: { id: req.params.id },
    });
    await cupons.destroy().then(() => {
        return res.status(201).json({
          message: "Cupom deletado com sucesso!"
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

}

export default new CuponsController();
