//Conexão com MysSQL
// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("pilacoinapp", "admin", "123456", {
//   host: "127.0.0.1",
//   dialect: "mysql",
// });

//verifica se há conexão - não é necessário
// sequelize
//   .authenticate()
//   .then(function () {
//     console.log("Conectado com sucesso.");
//   })
//   .catch(function (erro) {
//     console.log("Falha ao se conectar> ", erro);
//   });

//criando a model blockchain
// const Blockchain = sequelize.define("blockchains", {
//   cotacao: {
//     type: Sequelize.DECIMAL(6, 2),
//   },
//   valorPila: {
//     type: Sequelize.DECIMAL(6, 2),
//   },
//   valorReal: {
//     type: Sequelize.DECIMAL(6, 2),
//   },
// });

//adicionar item na tabela do db
// function add(table, cotacao, valorPila, valorReal) {
//   table.create({
//     cotacao: cotacao,
//     valorPila: valorPila,
//     valorReal: valorReal,
//   });
// }

// var find_all = function (req, res, next) {
//   Blockchain.findAll().then((blockchains) => {
//     console.log(res);
//     // res.json(blockchain);
//   });
// };
// find_all();
// const blockchains = Blockchain.findAll();
// console.log(
//   blockchains.every((blockchain) => blockchain instanceof Blockchain)
// );

// usuarios.every((usuario) => usuario instanceof Usuario

// add(Blockchain, 5, 5, 5);

// Blockchain.sync({ force: true });
