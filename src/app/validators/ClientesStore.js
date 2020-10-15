import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioClientes = Yup.object().shape({
      cpf: Yup.string().required(),
      telefone_fixo: Yup.string(),
      telefone_celular: Yup.string(),
      dt_nascimento: Yup.string().required(),
      especialidade: Yup.string().required()
    });

    await schemaUsuarioClientes.validate(req.body.usuario_clientes , {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario clientes não esta de acordo",
      messages: err.inner
    });
  }
};
