import app from './app';
import agendamentoConsumidorController from './app/controllers/AgendamentoConsumidorController';

agendamentoConsumidorController.init();
app.listen(process.env.PORT|| 8080);