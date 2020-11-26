import Cupons from "../models/Cupons";
import { QueueProdutor } from "../queues/QueueProdutor";
import { sendMessageAllClientes } from "./NotificationController";
import UsuarioClientesController from "./UsuarioClientesController";

class CuponsController {
  async store(req, res) {

    await Cupons.create(
      {
        valor: req.body.cupons.valor,
        status: "AGUARDANDO_LIBERACAO",
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
    try {
      const { id } = req.params;
      const idCupom = Number(id);
      await Cupons.update({ status: "CANCELANDO" }, { where: { id: idCupom }});
      const produtor = new QueueProdutor("agendamentos", "cancelar.cupons.agendamento");
      await produtor.publish({ idCupom });
      return res.status(200).send({ mensagem: "O Cupom está sendo cancelado"});
    } catch(e) {
      return res.status(500).send({ mensagem: "Ocorreu um erro ao cancelar o cupom, tente novamente mais tarde"});
    }
  }

  async aplicarCupom(cupom) {
    const quantidade = cupom.quantidade - 1;
    const status = cupom.quantidade === 0 ? "ESGOTADO" : "LIBERADO";
    await Cupons.update({ quantidade, status }, { where: {id: cupom.id }});
  }

  async oberCupomDisponivel() {
    const cupom =  await Cupons.findOne({
      where: { status: "LIBERADO", }
    });
    if(cupom && cupom.validade < new Date())
      await Cupons.update({ stauts: "INVALIDO"}, {where: {id: cupom.id}});
    else
      return cupom;
  }

  async reverterAplicacao(cupomId) {
    if(!cupomId) return;
    const cupom =  await Cupons.findOne({
      where: { id: cupomId, }
    });
    const quantidade = cupom.quantidade + 1;
    const status = cupom.status === "ESGOTADO" ? "LIBERADO" : cupom.status;
    await Cupons.update({ quantidade, status }, { where: {id: cupomId }});
  }

  async liberarCupom(req, res) {
    try {
      const { id } = req.params;
      const idCupom = Number(id);
      await Cupons.update({ status: "LIBERADO"}, { where: { id: idCupom }});
      sendMessageAllClientes("cupom disponível", "um novo cupom está disponível");
      return res.status(200).send({ mensagem: "Cupom liberado com sucesso"});
    } catch(e) {
      console.log(e);
      return res.status(500).send({ mensagem: "Ocorreu um erro ao liberar o cupom, tente novamente mais tarde"});
    }
  }


  cancelarCupom(id) {
    return this.atualizar({status: 'CANCELADO'}, id);
  }

  atualizar(payload, id) {
    return Cupons.update(payload, { where: { id } });
  }
}

export default new CuponsController();
