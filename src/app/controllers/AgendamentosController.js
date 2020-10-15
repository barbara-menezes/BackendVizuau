import Agendamentos from "../models/Agendamentos";
import Servicos from "../models/Servicos";
import Usuario_Clientes from "../models/Usuario_Clientes";
import Usuario_Profissionais from "../models/Usuario_Profissionais";
import Cupons from "../models/Cupons";

class AgendamentosController {
  async store(req, res) {
    try {
      const {
        servicos,
        ...data
      } = req.body;

      const agendamentos = await Agendamentos.create(data);

      if (servicos && servicos.length > 0){
        agendamentos.setServicos(servicos);
      }

      return res.status(200).json(agendamentos);
    } catch (err) {
      return res.status(500).json({
        err,
      });
    }
  }

  async index(req, res) {
    await Agendamentos.findAll({
        include: [{
            model: Servicos,
            as: "servicos",
            attributes: ["id", "nome", "valor"],
          }
        ]
      })
      .then((agendamentos) => {
        return res.status(201).json({
          agendamentos,
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

  async showById(req, res) {

    const agendamentoData = await Agendamentos.findOne({
      where: {
        id: req.params.id,
      }
    });

    const clientes = await Usuario_Clientes.findOne({
      where: {
        id: agendamentoData.id_cliente,
      },
    });

    const profissionais = await Usuario_Profissionais.findOne({
      where: {
        id: agendamentoData.id_profissional,
      },
    });

    const cupons = await Cupons.findOne({
      where: {
        id: agendamentoData.id_cupom,
      },
    });

    await Agendamentos.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: Servicos,
        as: "servicos",
        attributes: ["id", "nome", "valor"],
      }
    ]
    })
    .then((agendamentos) => {
      return res.status(201).json({
        agendamentos,
        clientes,
        profissionais,
        cupons
      });
    })
    .catch((err) => {
      console.log("ERRO: " + err);
    });
  }

  async showByProfissional(req, res) {

    await Agendamentos.findAll({
      where: {
        id_profissional: req.params.id,
      }
    })
    .then((agendamentos) => {
      return res.status(201).json({
        agendamentos
      });
    })
    .catch((err) => {
      console.log("ERRO: " + err);
    });
  }

  async showByClientes(req, res) {

    await Agendamentos.findAll({
      where: {
        id_cliente: req.params.id,
      }
    })
    .then((agendamentos) => {
      return res.status(201).json({
        agendamentos
      });
    })
    .catch((err) => {
      console.log("ERRO: " + err);
    });
  }


  async update(req, res) {
    const idExist = await Agendamentos.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!idExist) {
      return res.status(200).json({
        error: "ID do Agendamento informado não encontrado.",
      });
    }

    await Agendamentos.findOne({
        where: {
          id: req.params.id,
        },
      })
      .then(async (agendamentos) => {
        if (agendamentos) {
          await agendamentos.update(req.body.agendamentos);
          return res.status(201).json({
            agendamentos,
          });
        } else {
          return res.status(200).json({
            error: "Agendamento não encontrado.",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Erro no servidor.",
        });
      });
  }
}

export default new AgendamentosController();