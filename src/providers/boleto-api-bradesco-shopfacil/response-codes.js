module.exports = {
  '-399': {
    message: 'Dados mínimos da requisição não informado (Verifique: merchantid, orderid, codigo do meio de pagamento e chave da loja)',
    status: 'refused',
  },
  '-395': {
    message: 'Formato do campo orderid invalido',
    status: 'refused',
  },
  '-400': {
    message: 'Código da loja não encontrado',
    status: 'refused',
  },
  '-398': {
    message: 'Loja informa um Merchant no corpo da mensagem e outro no header (Authorization)',
    status: 'refused',
  },
  '-518': {
    message: 'A chave informada no header não confere com a chave do meio de pagamento cadastrada na base',
    status: 'refused',
  },
  '-394': {
    message: 'O nosso número informado pertence a outro titulo',
    status: 'refused',
  },
  '-902': {
    message: 'Erro ao realizar a comunicação com a loja (url de confirmação do pedido)',
    status: 'refused',
  },
  '-401': {
    message: 'Código de compra já autorizado',
    status: 'refused',
  },
  '-999': {
    message: 'Compra já foi autorizada para este número de pedido',
    status: 'refused',
  },
  '-397': {
    message: 'A ordem de compra existe na orders (esta paga), porém não existe na tb_boletos',
    status: 'refused',
  },
  '-396': {
    message: 'Erro ao recuperar logotipo da loja',
    status: 'refused',
  },
  '-513': {
    message: 'Erro - O valor da Tag VALOR não pode ser igual a zero ou Nulo',
    status: 'refused',
  },
  '-514': {
    message: 'Erro - A Tag CEDENTE do boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-516': {
    message: 'Erro - A Tag NUMEROAGENCIA do boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-5162': {
    message: 'Erro - O número da agência deve ter no máximo 4 dígitos.',
    status: 'refused',
  },
  '-517': {
    message: 'Erro - A Tag NUMEROCONTA do boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-5163': {
    message: 'Erro - O número da conta deve ter no máximo 7 dígitos.',
    status: 'refused',
  },
  '-519': {
    message: 'Erro - A Tag DATAEMISSAO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-520': {
    message: 'Erro - A Tag DATAPROCESSAMENTO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-521': {
    message: 'Erro - A Tag DATAVENCIMENTO do Boleto não foi encontrada ou não foi encontrada',
    status: 'refused',
  },
  '-522': {
    message: 'Erro - A Tag NOMESACADO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-523': {
    message: 'Erro - A Tag ENDERECOSACADO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-524': {
    message: 'Erro - A Tag CIDADESACADO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-525': {
    message: 'Erro - A Tag UFSACADO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-526': {
    message: 'Erro - A Tag CEPSACADO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-527': {
    message: 'Erro - A Tag CPFSACADO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-528': {
    message: 'Erro - A Tag NUMEROPEDIDO do Boleto não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-529': {
    message: 'Erro - A Tag VALORDOCUMENTOFORMATADO não foi encontrada ou está malformada',
    status: 'refused',
  },
  '-530': {
    message: 'Erro - A Tag SHOPPINGID não foi encontrada ou está mal-formada',
    status: 'refused',
  },
  '-531': {
    message: 'Erro - A Tag NUMERODOCUMENTO do Boleto não foi encontrada ou está mal formatada',
    status: 'refused',
  },
  '-545': {
    message: 'Valor máximo deve ser R$1,00',
    status: 'refused',
  },
  '-546': {
    message: 'Carteira de cobrança invalida (Diferente de 25/26)',
    status: 'refused',
  },
  '-548': {
    message: 'Falha na comunicação',
    status: 'unknown',
  },
  93005117: {
    message: 'Registro não encontrado nas bases CDDA/CIP',
    status: 'refused',
  },
  93005118: {
    message: 'Informações de entrada inconsistentes CDDA/CIP',
    status: 'refused',
  },
  93005119: {
    message: 'Registro efetuado com sucesso - CIP CONFIRMADA',
    status: 'registered',
  },
  93005120: {
    message: 'Carteira de cobrança não aceita',
    status: 'refused',
  },
}
