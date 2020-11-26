import admin from '../../config/firebase';
import Usuario_clientes from '../models/Usuario_Clientes';
import Usuario_profissionais from '../models/Usuario_Profissionais';

const sendMessage = (payload, token) => admin.messaging().sendToDevice(token, payload, {
    priority: "high",
    timeToLive: 60 * 60 * 24
  });

export const enviarMensagemParaCliente = async (title, body, data, userId) => {
    // const { deviceToken } = await Usuario_clientes.findOne({ where: {id: userId }}).toJSON();
    // const payload = { title, body, data };
    // return sendMessage(payload, deviceToken);
    console.log("Enviando notificação para o cliente");
}

export const enviarMensagemParaFornecedor = async (title, body, data, userId) => {
    // const { deviceToken } = await Usuario_profissionais.findOne({ where: {id: userId}}).toJSON();
    // const payload = { title, body, data };
    // return sendMessage(payload, deviceToken);
    console.log("enviando notificação para fornecedor");
}