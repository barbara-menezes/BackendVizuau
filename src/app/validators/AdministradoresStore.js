import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioAdministradores = Yup.object().shape({
      rg: Yup.string().required(),
      telefone_fixo: Yup.string(),
      telefone_celular: Yup.string(),
      dt_nascimento: Yup.date().required(),
      laudo_url: Yup.string(),
      id_tipo_deficiencia: Yup.string().required()
    });

    await schemaUsuarioAdministradores.validate(req.body.usuario_administradores, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario_administradores não esta de acordo",
      messages: err.inner
    });
  }
};
