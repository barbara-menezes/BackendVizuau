#### Automação da manipulação de dados do banco

1. Rodar quando precisar atualizar os pacotes do sistema
yarn install

2. Rodar quando precisar colocar o sistema no ambiente local
yarn dev

3. Rodar quando precisar excluir as tabelas e relacionamemtos do banco
yarn sequelize db:migrate:undo:all

4. Rodar quando precisar de subir o banco
yarn sequelize db:migrate
yarn sequelize db:seed:all

5. Rodar quando precisar criar uma migration
yarn sequelize migration:create --name=incluirAquiONomeDaMigrationQueVocêQuerCriar