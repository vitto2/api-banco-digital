const { depositos, saques, transferencias } = require("../bancodedados");
const {
  validateAccountNumber,
  findAccount,
  registerOperation,
  showDeposits,
  listWithdraw,
  passwordValidation,
  listTransfer,
  registerTransferOperation,
  generatebankStatement,
} = require("./utils");

const deposit = (req, res) => {
  const { numero, valor } = req.body;
  const fieldsValidation = Object.keys(req.body).length == 2;
  const account = findAccount(numero);

  if (validateAccountNumber(numero)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (!fieldsValidation) {
    return res.status(400).json({
      mensagem:
        "O número da conta e o valor do deposito precisam ser preenchidos.",
    });
  }

  if (!account) {
    return res.status(400).json({
      mensagem: "A conta informada não existe.",
    });
  }

  if (valor <= 0) {
    return res.status(400).json({
      mensagem:
        "Não é possível fazer deposito deste valor. Verifique e tente novamente.",
    });
  }

  account.saldo += valor / 100;
  registerOperation(numero, valor / 100, depositos);
  res.status(200).json(showDeposits());
};

const withdraw = (req, res) => {
  const { numero, valor, senha } = req.body;
  const fieldsValidation = Object.keys(req.body).length == 3;
  const account = findAccount(numero);

  if (fieldsValidation == false) {
    return res.status(400).json({
      mensagem:
        "As informações necessárias para saque provavelmente não foram passadas. Verifique e tente novamente.",
    });
  }

  if (validateAccountNumber(numero)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (!passwordValidation(numero, senha)) {
    return res.status(400).json({
      mensagem: "senha incorreta! Tente novamente!",
    });
  }

  if (account.saldo < valor / 100) {
    return res.status(400).json({
      mensagem: "Saldo insuficiente!",
    });
  }

  account.saldo -= valor / 100;
  registerOperation(numero, valor / 100, saques);
  res.status(200).json(listWithdraw());
};

const bankTransfer = (req, res) => {
  const fieldsValidation = Object.keys(req.body).length == 4;
  const { numero, numeroDestino, valor, senha } = req.body;
  const account = findAccount(numero);
  const accountReceiver = findAccount(numeroDestino);

  if (fieldsValidation == false) {
    return res.status(400).json({
      mensagem:
        "As informações necessárias para saque provavelmente não foram passadas. Verifique e tente novamente.",
    });
  }

  if (validateAccountNumber(numero) && validateAccountNumber(numeroDestino)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (!passwordValidation(numero, senha)) {
    return res.status(400).json({
      mensagem: "senha incorreta! Tente novamente!",
    });
  }

  if (account.saldo < valor / 100) {
    return res.status(400).json({
      mensagem: "Saldo insuficiente!",
    });
  }

  account.saldo -= valor / 100;
  accountReceiver.saldo += valor / 100;
  registerTransferOperation(numero, numeroDestino, valor / 100, transferencias);
  res.status(200).json(listTransfer());
};

const bankBalance = (req, res) => {
  const { numero, senha } = req.body;
  const fieldsValidation = Object.keys(req.body).length == 2;
  const account = findAccount(numero);

  if (fieldsValidation == false) {
    return res.status(400).json({
      mensagem:
        "As informações necessárias para saque provavelmente não foram passadas. Verifique e tente novamente.",
    });
  }

  if (validateAccountNumber(numero)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (!passwordValidation(numero, senha)) {
    return res.status(400).json({
      mensagem: "senha incorreta! Tente novamente!",
    });
  }

  res.status(200).json({ saldo: account.saldo });
};

const bankStatement = (req, res) => {
  const { numero, senha } = req.query;
  const infos = generatebankStatement(numero);
  const fieldsValidation = numero != undefined && senha != undefined;

  
  if (fieldsValidation == false) {
    return res.status(400).json({
      mensagem:
        "As informações necessárias para saque provavelmente não foram passadas. Verifique e tente novamente.",
    });
  }

  if (validateAccountNumber(numero)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (!passwordValidation(numero, senha)) {
    return res.status(400).json({
      mensagem: "senha incorreta! Tente novamente!",
    });
  }

  res.status(200).send(infos);
};
module.exports = {
  deposit,
  withdraw,
  bankTransfer,
  bankBalance,
  bankStatement,
};
