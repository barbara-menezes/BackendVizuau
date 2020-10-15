module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('tipo_usuarios', [
    {
      tipo: "usuario_administradores",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "usuario_profissionais",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "usuario_clientes",
      created_at: new Date(),
      updated_at: new Date()
    },
  ], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('tipo_usuarios', null, {})
};
