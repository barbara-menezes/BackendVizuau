import { Router } from "express";

import UsuarioAdministradoresController from "./app/controllers/UsuarioAdministradoresController";
import SessionController from "./app/controllers/SessionController";
import UsuarioClientesController from "./app/controllers/UsuarioClientesController";
import UsuarioProfissionaisController from "./app/controllers/UsuarioProfissionaisController";
import CuponsController from "./app/controllers/CuponsController";
import ServicosController from "./app/controllers/ServicosController";
import AgendamentosController from "./app/controllers/AgendamentosController";
import AgendamentoProdutorController from "./app/controllers/AgendamentoProdutorController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
routes.get("/", (req, res) => {
  return res.status(200).json("tudo certo");
});

routes.post("/sessions", SessionController.store);

routes.post(
  "/usuarios/administradores",
  // validatePcdStore,
  // validateUsuarioStore,
  // validateEnderecoStore,
  UsuarioAdministradoresController.store
);

routes.post(
  "/usuarios/clientes",
  // validateFreelancerStore,
  // validateUsuarioStore,
  // validateEnderecoStore,
  UsuarioClientesController.store
);

routes.post(
  "/usuarios/profissionais",
  // validateEmpresaStore,
  // validateUsuarioStore,
  // validateEnderecoStore,
  UsuarioProfissionaisController.store
);

routes.post(
  "/cupons",
  // validatePcdStore,
  // validateUsuarioStore,
  // validateEnderecoStore,
  CuponsController.store
);

routes.post(
  "/cupons/:id/liberar",
  CuponsController.liberarCupom
);

routes.post(
  "/servicos",
  // validatePcdStore,
  // validateUsuarioStore,
  // validateEnderecoStore,
  ServicosController.store
);

routes.post(
  "/agendamentos",
  AgendamentoProdutorController.agendar
);

routes.put(
  "/usuarios/profissionais/:id",
  // validateEmpresaUpdate,
  // validateEnderecoUpdate,
  // validateUsuarioUpdate,
  UsuarioProfissionaisController.update
);

routes.put(
  "/usuarios/clientes/:id",
  // validateEmpresaUpdate,
  // validateEnderecoUpdate,
  // validateUsuarioUpdate,
  UsuarioClientesController.update
);

routes.put(
  "/usuarios/administradores/:id",
  // validateEmpresaUpdate,
  // validateEnderecoUpdate,
  // validateUsuarioUpdate,
  UsuarioAdministradoresController.update
);

routes.put(
  "/cupons/:id",
  // validateEmpresaUpdate,
  // validateEnderecoUpdate,
  // validateUsuarioUpdate,
  CuponsController.update
);

routes.put(
  "/servicos/:id",
  // validateEmpresaUpdate,
  // validateEnderecoUpdate,
  // validateUsuarioUpdate,
  ServicosController.update
);

routes.put(
  "/agendamentos/:id",
  // validateEmpresaUpdate,
  // validateEnderecoUpdate,
  // validateUsuarioUpdate,
  AgendamentosController.update
);

routes.get("/usuarios/profissionais", UsuarioProfissionaisController.index);
routes.get("/usuarios/profissionais/:id", UsuarioProfissionaisController.showById);

routes.get("/usuarios/clientes", UsuarioClientesController.index);
routes.get("/usuarios/clientes/:id", UsuarioClientesController.showById);

routes.get("/usuarios/administradores", UsuarioAdministradoresController.index);

routes.get("/cupons", CuponsController.index);
routes.get("/cupons/:id", CuponsController.showById);
routes.delete("/cupons/:id", AgendamentoProdutorController.cancelarCupom);

routes.get("/servicos", ServicosController.index);
routes.get("/servicos/:id", ServicosController.showById);
routes.get("/servicos/profissionais/:id", ServicosController.showByProfissionais);
routes.delete("/servicos/:id", ServicosController.delete);

routes.get("/agendamentos", AgendamentosController.index);
routes.get("/agendamentos/:id", AgendamentosController.showById);
routes.get("/agendamentos/profissionais/:id", AgendamentosController.showByProfissional);
routes.get("/agendamentos/clientes/:id", AgendamentosController.showByClientes);

routes.delete("/agendamentos/:id", AgendamentoProdutorController.cancelarAgendamento);


// routes.post(
//   "/vagas",
//   validateVagasStore,
//   validateEnderecoStore,
//   VagasController.store
// );

// routes.post("/esqueciSenha", SessionController.forgotpassword);
// routes.patch("/resetarSenha/:token", SessionController.resetPass);

// routes.get("/usuario/usuarioExiste/:usuario", UsuarioController.UsuarioExists);
// routes.get("/usuario/emailExiste/:email", UsuarioController.EmailExists);
// routes.get("/tipoDeficiencia", TipoDeficienciaController.listAll);
// routes.get("/vagas", VagasController.index);
// routes.get("/vagas/:id", VagasController.showById);


// routes.use(authMiddleware);

// routes.patch("/usuario", UsuarioController.updateSenha);

// routes.post("/candidato", CandidatoController.store);

// routes.delete("/candidato", CandidatoController.delete);
// routes.delete("/vagas/:id", VagasController.delete);
// routes.delete("/curriculos/:id", CurriculoController.delete);

// routes.put(
//   "/pcd",
//   validatePcdUpdate,
//   validateEnderecoUpdate,
//   validateUsuarioUpdate,
//   UsuarioPcdController.update
// );



// routes.put(
//   "/vagas/:id",
//   validateVagasUpdate,
//   validateEnderecoUpdate,
//   VagasController.update
// );

// routes.put(
//   "/freelancer",
//   validateFreelancerUpdate,
//   validateEnderecoUpdate,
//   validateUsuarioUpdate,
//   UsuarioFreelancerController.update
// );

// routes.put("/pcd/:pcd_id/curriculos", CurriculoController.update);
// routes.put("/freelancer/:freelancer_id/curriculos", CurriculoController.update);

// routes.get("/empresas/pesquisa/:empresa?", UsuarioEmpresaController.show);
// routes.get("/vagas/pesquisa/:query?", VagasController.indexByQuery);
// routes.get("/freelancer/pesquisa/:query?", UsuarioFreelancerController.indexByQuery);
// routes.get("/freelancer/pesquisa/nome/:query?", UsuarioFreelancerController.indexByNome);

// routes.get("/pcd/:freelancer_id/curriculos", CurriculoController.index);
// routes.get("/curriculos/:id", CurriculoController.index);

// routes.get("/pcd/usuario/:usuario", UsuarioPcdController.showByUsuario);
// routes.get("/pcd/id/:id", UsuarioPcdController.showById);
// routes.get("/pcd", UsuarioPcdController.index);

// routes.get(
//   "/freelancer/usuario/:usuario",
//   UsuarioFreelancerController.showByUsuario
// );
// routes.get("/freelancer/:id", UsuarioFreelancerController.showById);
// routes.get("/freelancer", UsuarioFreelancerController.index);

// routes.get("/candidato", CandidatoController.showByUsuario);
// routes.get("/candidato/:vaga", CandidatoController.showByVaga);

export default routes;
