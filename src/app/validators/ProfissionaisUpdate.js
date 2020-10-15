import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioProfissionais = Yup.object().shape({
      cnpj: Yup.string(),
      razao_social: Yup.string(),
      telefone_fixo: Yup.string(),
      telefone_celular: Yup.string()
    });

    await schemaUsuarioProfissionais.validate(req.body.usuario_profissionais, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario profissionais não esta de acordo",
      messages: err.inner
    });
  }
};
