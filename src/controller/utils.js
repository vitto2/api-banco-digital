const {
  banco,
  contas,
  depositos,
  saques,
  transferencias,
} = require("../bancodedados");

const verifyPassword = (password, res) => {
  const bank_password = banco.senha;

  if (password != bank_password) {
    autenticationError(res);
  } else {
    return true;
  }
};

const autenticationError = (res) => {
  return res
    .status(401)
    .json({ mensagem: "A senha está incorreta ou não foi informada." });
};

const validateAccount = (email, cpf) => {
  let error;

  if (contas.length > 0) {
    contas.forEach((conta) => {
      let infos = Object.values(conta);
      if (infos.includes(cpf) || infos.includes(email)) {
        error = true;
      } else {
        error = false;
      }
    });
  }

  return error;
};

const numberAccountGenerator = () => {
  const randomNumber = Math.floor(Math.random() * 10000);
  const accountNumber = String(randomNumber).padStart(4, "0");
  const existingAccounts = contas.map((account) => {
    return account.numero;
  });

  if (existingAccounts.includes(accountNumber)) {
    randomNumber = Math.floor(Math.random() * 10000);
  }

  return accountNumber;
};

const fieldsValidation = (account) => {
  const fields = Object.keys(account);

  return fields.length < 6 ? true : false;
};

const validateAccountNumber = (number) => {
  const findAccount = findIndexAccount(number);

  return number.length < 4 || number.length > 4 || findAccount == -1
    ? true
    : false;
};

const findIndexAccount = (number) => {
  const index = contas.findIndex((conta) => {
    return conta.numero == number;
  });

  return index;
};

const findAccount = (number) => {
  const account = contas.find((conta) => {
    return conta.numero == number;
  });

  return account;
};

const registerTransferOperation = (conta, contaDestino, valor) => {
  const dataHoraAtual = new Date();

  const formatoDataHora = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  const dataHoraString = dataHoraAtual.toLocaleDateString(
    "pt-BR",
    formatoDataHora
  );

  transferencias.push({
    data: dataHoraString,
    numero_conta: conta,
    numero_conta_destino: contaDestino,
    valor: valor,
  });
};

const registerOperation = (conta, valor, operacao) => {
  const dataHoraAtual = new Date();

  const formatoDataHora = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  const dataHoraString = dataHoraAtual.toLocaleDateString(
    "pt-BR",
    formatoDataHora
  );

  operacao.push({
    data: dataHoraString,
    numero_conta: conta,
    valor: valor,
  });
};

const passwordValidation = (numero, password) => {
  const account = findAccount(numero);

  return account.senha == password ? true : false;
};

const showDeposits = () => {
  return depositos;
};

const listWithdraw = () => {
  return saques;
};

const listTransfer = () => {
  return transferencias;
};

const generatebankStatement = (numero) => {
  const meusDepositos = depositos.filter((deposito) => {
    return deposito.numero_conta == numero;
  });
  const meusSaques = saques.filter((saques) => {
    return saques.numero_conta == numero;
  });
  const transferenciasEnviadas = transferencias.filter((transferencia) => {
    return transferencia.numero_conta == numero;
  });
  const transferenciaRecebidas = transferencias.filter((transferencia) => {
    return transferencia.numero_conta_destino == numero;
  });

  const infos = {
    depositos: meusDepositos,
    saques: meusSaques,
    transferencias_enviadas: transferenciasEnviadas,
    transferencias_recebidas: transferenciaRecebidas,
  };

  return infos;
};
module.exports = {
  verifyPassword,
  autenticationError,
  validateAccount,
  numberAccountGenerator,
  fieldsValidation,
  validateAccountNumber,
  findIndexAccount,
  findAccount,
  registerOperation,
  passwordValidation,
  showDeposits,
  listWithdraw,
  listTransfer,
  generatebankStatement,
  registerTransferOperation,
};
