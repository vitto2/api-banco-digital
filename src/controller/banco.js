const { contas } = require("../bancodedados");
const {
  verifyPassword,
  validateAccount,
  numberAccountGenerator,
  fieldsValidation,
  validateAccountNumber,
  findIndexAccount,
  findAccount,
} = require("./utils");

const listBankAccounts = (req, res) => {
  const { senha_banco } = req.query;

  verifyPassword(senha_banco, res);

  return res.status(200).send(contas);
};

const registerAccount = (req, res) => {
  const { senha_banco } = req.query;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const newAccount = {
    numero: numberAccountGenerator(),
    saldo: 0,
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };
  let validate = validateAccount(email, cpf);

  verifyPassword(senha_banco, res);

  if (fieldsValidation(req.body)) {
    return res.status(400).json({
      mensagem:
        "Você provavelmente não informou todos os dados necessários para criar uma conta. Verifique e tente novamente.",
    });
  }
  if (validate) {
    return res.status(400).json({
      mensagem: "Já existe uma conta com o cpf ou e-mail informado!",
    });
  }

  contas.push(newAccount);
  return res.status(201).send();
};

const updateAccount = (req, res) => {
  const { numero } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const accountUpdate = findAccount(numero)

  if (fieldsValidation(req.body)) {
    return res.status(400).json({
      mensagem:
        "Você provavelmente não informou todos os dados necessários para completar a operação. Verifique e tente novamente.",
    });
  }

  if (validateAccountNumber(numero)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (validateAccount(email, cpf)) {
    return res.status(400).json({
      mensagem:
        "O cpf ou e-mail informados já foram indetificados em outra conta. Verifique e tente novamente.",
    });
  }

  accountUpdate.nome = nome;
  accountUpdate.cpf = cpf;
  accountUpdate.data_nascimento = data_nascimento;
  accountUpdate.telefone = telefone;
  accountUpdate.email = email;
  accountUpdate.senha = senha;

  res.status(200).send();
};

const deleteAccount = (req, res) => {
  const { numero } = req.params;
  const accountIndex = findIndexAccount(numero);
  const account = findAccount(numero);

  if (validateAccountNumber(numero)) {
    return res.status(400).json({
      mensagem:
        "O número da conta informado é inválido ou não foi encontrado no sistema. Verifique e tente novamente.",
    });
  }

  if (account.saldo > 0) {
    return res.status(400).json({
      mensagem: "O saldo da conta não permite que o sistema faça a exclusão.",
    });
  }

  contas.splice(accountIndex, 1);
  res.status(200).send();
};
module.exports = {
  listBankAccounts,
  registerAccount,
  updateAccount,
  deleteAccount,
};
