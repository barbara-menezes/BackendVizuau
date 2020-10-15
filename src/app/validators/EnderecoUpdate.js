import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaEndereco = Yup.object().shape({
      estado: Yup.string(),
      cidade: Yup.string(),
      bairro: Yup.string(),
      cep: Yup.number(),
      logradouro: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string()
    });

    await schemaEndereco.validate(req.body.endereco, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo endereco não esta de acordo",
      messages: err.inner
    });
  }
};
