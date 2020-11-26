import { QueueProdutor } from "../queues/QueueProdutor";
import CuponsController from "./CuponsController";
const { default: AgendamentosController } = require("./AgendamentosController");

class AgendamentoProdutorController {


    async cancelarAgendamento(req, res) {
        try {
          const idAgendamento = Number(req.params.id);
          await AgendamentosController.atualizar({ status: "CANCELANDO"}, idAgendamento);
          const produtor = new QueueProdutor("cancelar.agendamentos");
          await produtor.publish({ idAgendamento }, 2);
          return res.status(200).json({ mensagem: "O agendamento está sendo cancelado"});
        } catch(e) {
          return res.status(500).json({ mensagem: "Ocorreu um erro ao cancelar o agendamento, tente novamente mais tarde"});
        }
      }
    
    async agendar(req, res) {
        try {
            const { servicos, ...data } = req.body;
            if(!servicos || !servicos.length) return res.status(403).json({ mensagem: "não é possível criar um agendamento sem serviços" });
            console.log(data);
            const agendamentos =  await AgendamentosController.criarAgendamento(data, servicos);
            const produtor = new QueueProdutor("request.agendamentos", 1);
            await produtor.publish({ idAgendamento: agendamentos.id, idCliente: agendamentos.id_cliente, idProfissional: agendamentos.id_profissional });
            return res.status(200).json({ mensagem: "O pedido de agendamento está sendo processado" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    }

    async cancelarCupom(req, res) {
        try {
            const idCupom = Number(req.params.id);
            await CuponsController.atualizar({ status: "CANCELANDO" }, idCupom);
            const produtor = new QueueProdutor("cancelar.cupons.agendamentos");
            await produtor.publish({ idCupom }, 0);
            return res.status(200).send({ mensagem: "O Cupom está sendo cancelado"});
          } catch(e) {
            return res.status(500).send({ mensagem: "Ocorreu um erro ao cancelar o cupom, tente novamente mais tarde"});
          }
    }
}

export default new AgendamentoProdutorController();