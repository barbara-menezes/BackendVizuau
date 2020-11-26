import admin from '../../config/firebase';
import UsuarioClientesController from './UsuarioClientesController';
import UsuarioProfissionaisController from './UsuarioProfissionaisController';

export const sendMessageCliente = (title, body, data, idCliente) => {
    console.log("enviando mensagem para o cliente");
    return sendMessage({title, body, data }, idCliente,UsuarioClientesController.getDeviceToken);
}

export const sendMessageProfissional = async (title, body, data, idProfissional) => {
    console.log("enviando mensagem para o profissional");
    return sendMessage({title, body, data }, idProfissional, UsuarioProfissionaisController.getDeviceToken);
}

export const sendMessageAllClientes = async (title, body) => {
    const clientes = await UsuarioClientesController.findAll();
    const tokens = clientes.map(c => c.Usuario.device_token);
    const notification = {body, title}
    return admin.messaging().sendMulticast({ notification, tokens });
}

const sendMessage = async (payload, id, getDeviceToken) => {
    try{
        const data = await getDeviceToken(id);
        const {body, title} = payload;
        const notification = {body, title};
        const {Usuario} = data;
        return await admin.messaging().send({ notification, token: Usuario.device_token});
    }catch(e){
        console.log(e);
    }
}