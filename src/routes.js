const express = require("express");
const routes = express();
const {
  listBankAccounts,
  registerAccount,
  updateAccount,
  deleteAccount,
} = require("./controller/banco");

const {
  deposit,
  withdraw,
  bankTransfer,
  bankBalance,
  bankStatement
} = require("./controller/transacoes");

routes.get("/contas", listBankAccounts);
routes.post("/contas", registerAccount);
routes.put("/contas/:numero/usuario", updateAccount);
routes.delete("/contas/:numero", deleteAccount);

routes.post("/transacoes/depositar", deposit);
routes.post("/transacoes/sacar", withdraw);
routes.post("/transacoes/transferir", bankTransfer);
routes.post("/transacoes/saldo", bankBalance);
routes.get("/contas/extrato",bankStatement)
module.exports = routes;
