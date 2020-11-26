import { QueueProdutor } from "../queues/QueueProdutor";
const { default: AgendamentosController } = require("./AgendamentosController");

class AgendamentoProdutorController {


    async cancelarAgendamento(req, res) {
        try {
          const idAgendamento = Number(req.params.id);
          const idUser = Number(req.body.idUser);
          await AgendamentosController.atualizar({ status: "CANCELANDO"}, idAgendamento);
          const produtor = new QueueProdutor("agendamentos");
          produtor.publish({ idAgendamento, idUser }, 2);
          return res.status(200).json({ mensagem: "O agendamento está sendo cancelado"});
        } catch(e) {
          return res.status(500).json({ mensagem: "Ocorreu um erro ao cancelar o agendamento, tente novamente mais tarde"});
        }
      }
    
    async agendar(req, res) {
        try {
            const { servicos, ...data } = req.body;
            if(!servicos || !servicos.length) return res.status(403).json({ mensagem: "não é possível criar um agendamento sem serviços" });
            const agendamentos =  await AgendamentosController.criarAgendamento(data, servicos);
            const produtor = new QueueProdutor("agendamentos", 1);
            produtor.publish({ idAgendamento: agendamentos.id, idCliente: agendamentos.id_cliente, idProfissional: agendamentos.id_profissional });
            return res.status(200).json({ mensagem: "O pedido de agendamento está sendo processado" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    }

    async cancelarCupom(req, res) {
        try {
            const idCupom = Number(req.params.id);
            await Cupons.update({ status: "CANCELANDO" }, { where: { id: cumpoId }});
            const produtor = new QueueProdutor("agendamentos");
            await produtor.publish({ idCupom }, 0);
            return res.status(200).send({ mensagem: "O Cupom está sendo cancelado"});
          } catch(e) {
            return res.status(500).send({ mensagem: "Ocorreu um erro ao cancelar o cupom, tente novamente mais tarde"});
          }
    }
}

export default new AgendamentoProdutorController();