import Cupons from "../models/Cupons";
import CuponsController from "./CuponsController";
import UsuarioController from "./UsuarioController";

const { QueueConsumidor } = require("../queues/QueueConsumidor");
const { default: AgendamentosController } = require("./AgendamentosController");
const { sendMessageProfissional, sendMessageCliente } = require("./NotificationController");

class AgendamentoConsumidorController {
    constructor() {
        this.consumidor = new QueueConsumidor("vizuau", "agendamentos");
    }

    async init() {
        await this.consumidor.connect();
        const getConsumerHandler = (key) => {
            switch(key) {
                case "request.agendamentos": return this.criarAgendamento;
                case "cancelar.agendamentos": return this.cancelarAgendamento;
                case "cancelar.cupons.agendamentos": return this.cancelarCupom;
            }
        }
        this.consumidor.consume((key, msg) => {
            console.log("processando");
            getConsumerHandler(key)(msg)
        });
    }

    async criarAgendamento(payload) {
        try{
            const { idAgendamento, idCliente, idProfissional } = payload;
            const cupom = await CuponsController.oberCupomDisponivel();
            if(!cupom) {
                await AgendamentosController.atualizar({ status: "APROVADO" }, idAgendamento);
            } else {
                const agendamento = await AgendamentosController.getAgendamentoById(idAgendamento);
                const valor_final = cupom.valor > agendamento.valor_final ? 0 : agendamento.valor_final - cupom.valor;
                await AgendamentosController.atualizar({ status: "APROVADO", valor_final, id_cupom: cupom.id }, idAgendamento);
                await CuponsController.atualizar({quantidade: cupom.quantidade - 1}, cupom.id);
            }
            await sendMessageProfissional("Agendamento marcado", "Você tem um novo agendamento", {}, idProfissional);
            await sendMessageCliente("Agendamento marcado", "Os serviços foram agendados com sucesso!", {}, idCliente);
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
        
        await sendMessageProfissional('Agendamento cancelado', "O agendamento foi cancelado", responsePayload, agendamento.id_profissional);
        await sendMessageCliente('Agendamento cancelado', 'O agendamento foi cancelado', responsePayload , agendamento.id_cliente);
    }

    async cancelarCupom(payload){
        await CuponsController.cancelarCupom(payload.idCupom); 
    }
}

export default new AgendamentoConsumidorController();