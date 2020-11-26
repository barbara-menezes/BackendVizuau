import CuponsController from "./CuponsController";
import UsuarioController from "./UsuarioController";

const { QueueConsumidor } = require("../queues/QueueConsumidor");
const { default: AgendamentosController } = require("./AgendamentosController");
const { enviarMensagemParaFornecedor, enviarMensagemParaCliente } = require("./NotificationController");

class AgendamentoConsumidorController {
    constructor() {
        this.consumidor = new QueueConsumidor("vizuau", "agendamentos");
    }

    async init() {
        console.log("iniciando consumo");
        await this.consumidor.connect();
        const getConsumerHandler = (key) => {
            console.log(key);
            switch(key) {
                case "request.agendamentos": return this.criarAgendamento;
                case "cancelar.agendamentos": return this.cancelarAgendamento;
                case "cancelar.cupons.agendamentos": return this.cancelarCupom;
            }
        }
        this.consumidor.consume((key, msg) => getConsumerHandler(key)(msg));
    }

    async criarAgendamento(payload) {
        try{
            const { idAgendamento, idCliente, idProfissional } = payload;
            const cupom = await CuponsController.oberCupomDisponivel();
            if(!cupom) {
                await AgendamentosController.atualizar({ status: "APROVADO" }, idAgendamento);
            } else {
                await CuponsController.aplicarCupom(cupom);
                const agendamento = await AgendamentosController.getAgendamentoById(idAgendamento);
                const valor_final = cupom.valor > agendamento.valor_final ? 0 : agendamento.valor_final - cupom.valor;
                await AgendamentosController.atualizar({ status: "APROVADO", valor_final, id_cupom: cupom.id }, idAgendamento);
            }
            await enviarMensagemParaCliente('Agendamento marcado', 'Os serviços foram agendados com sucesso', payload, idCliente);
            await enviarMensagemParaFornecedor('Agendamento marcado', 'Um agendamento foi criado', payload, idProfissional);
        } catch(e) {
            console.log(e);
        }
    }

    async cancelarAgendamento(payload) {
        const { idAgendamento, idUser } = payload;
        const usuario = await UsuarioController.getUserById(idUser);
        const agendamento = await AgendamentosController.getAgendamentoById(idAgendamento);
        await CuponsController.reverterAplicacao(agendamento.id_cupom);
        await AgendamentosController.atualizar({ status: "CANCELADO"}, agendamento.id);
        const responsePayload = { idAgendamento: agendamento.id };
        if (usuario.id_tipo_usuario === 1) {
          await enviarMensagemParaCliente('Agendamento cancelado', 'Seu agendamento foi cancelado pelo fornecedor', responsePayload , agendamento.id_cliente);
        } else {
          await enviarMensagemParaFornecedor('Agendamento cancelado', "O Cliente cancelou o agendamento", responsePayload, agendamento.id_profissional);
        }
    }

    async cancelarCupom(payload){
        await CuponsController.cancelarCupom(payload.idCupom); 
    }
}

export default new AgendamentoConsumidorController();