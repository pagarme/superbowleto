module.exports = {
  0: {
    message: 'REGISTRO EFETUADO COM SUCESSO',
    status: 'registered',
  },
  '-399': {
    message: 'Dados mínimos da requisição não informado (Verifique: merchantid, orderid, codigo do meio de pagamento e chave da loja)',
    status: 'refused',
  },
  '-395': {
    message: 'Formato do campo orderid invalido ',
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
  '-393': {
    message: 'Ja foi gerado um título com outra identificação (nosso numero) para o pedido informado',
    status: 'refused',
  },
  '-394': {
    message: 'O nosso número informado pertence a outro titulo',
    status: 'refused',
  },
  '-902': {
    message: 'Erro ao realizar a comunicação com a loja (url de confirmação do pedido) ou SISTEMA INDISPONIVEL (carteira de cobrança inativa)',
    status: 'refused',
  },
  '-415': {
    message: 'Loja com URL de Notificação em branco.',
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
  '-998': {
    message: 'Erro nos parâmetros de requisição do boleto',
    status: 'refused',
  },
  930051: {
    message: 'REGISTRO EFETUADO COM SUCESSO',
    status: 'registered',
  },
  930052: {
    message: 'PARAMETROS INVALIDOS',
    status: 'refused',
  },
  930053: {
    message: 'REGISTRO EFETUADO COM SUCESSO',
    status: 'registered',
  },
  930054: {
    message: 'TIPO DE PESQUISA INVALIDO',
    status: 'refused',
  },
  930055: {
    message: 'CODIGO DE USUARIO INVALIDO',
    status: 'refused',
  },
  930056: {
    message: 'CPF/CNPJ INVALIDO',
    status: 'refused',
  },
  930057: {
    message: 'NOSSO NUMERO INVALIDO',
    status: 'refused',
  },
  930058: {
    message: 'CODIGO DA PESSOA JURIDICA DO CONTRATO INVALIDO',
    status: 'refused',
  },
  930059: {
    message: 'TIPO DO CONTRATO DE NEGOCIO INVALIDO',
    status: 'refused',
  },
  9300510: {
    message: 'CODIGO DO PRODUTO DE SERVICO DA OPERACAO INVALIDO',
    status: 'refused',
  },
  9300511: {
    message: 'NOSSO NUMERO INVALIDO',
    status: 'refused',
  },
  9300512: {
    message: 'CODIGO DO BANCO INVALIDO',
    status: 'refused',
  },
  9300513: {
    message: 'CODIGO DA AGENCIA CENTRALIZADORA INVALIDA',
    status: 'refused',
  },
  9300514: {
    message: 'CPF OU CNPJ DO SACADO INVALIDO',
    status: 'refused',
  },
  9300515: {
    message: 'CODIGO DO PRODUTO INVALIDO',
    status: 'refused',
  },
  9300516: {
    message: 'NUMERO DE SEQUENCIA DO CONTRATO INVALIDO',
    status: 'refused',
  },
  9300517: {
    message: 'DATA DE EMISSAO INVALIDA',
    status: 'refused',
  },
  9300518: {
    message: 'TIPO DE VENCIMENTO INVALIDO',
    status: 'refused',
  },
  9300519: {
    message: 'REGISTRO DE TITULO NAO PERMITIDO, DE ACORDO COM PARAMETRO NEGOCIADO PARA O CONTRATO',
    status: 'refused',
  },
  9300520: {
    message: 'VALOR DO TITULO INVALIDO',
    status: 'refused',
  },
  9300521: {
    message: 'ESPECIE DO TITULO INVALIDA',
    status: 'refused',
  },
  9300522: {
    message: 'DATA LIMITE OBRIGATORIA PARA BONIFICACAO',
    status: 'refused',
  },
  9300523: {
    message: 'A SOMATORIA DOS CAMPOS ABATIMENTO, DESCONTO E BONIFICACAO, EXCEDEU O VALOR DO TITULO',
    status: 'refused',
  },
  9300524: {
    message: 'VALOR DO JUROS/MORA INFORMADO EXCEDEU O PARAMETRO',
    status: 'refused',
  },
  9300525: {
    message: 'CONTRATO BLOQUEADO POR CLIENTE COM RESTRICOES E/OU IMPEDIMENTOS',
    status: 'refused',
  },
  9300526: {
    message: 'E-MAIL INVALIDO',
    status: 'refused',
  },
  9300527: {
    message: 'CODIGO DO CONTRATO INVALIDO',
    status: 'refused',
  },
  9300528: {
    message: 'DATA DE VENCIMENTO INVALIDA',
    status: 'refused',
  },
  9300529: {
    message: 'DEVERA SER INFORMADO ALGUM ARGUMENTO',
    status: 'refused',
  },
  9300530: {
    message: 'INFORMAR APENAS PERCENTUAL OU VALOR DE JUROS',
    status: 'refused',
  },
  9300531: {
    message: 'INFORMAR APENAS PERCENTUAL OU VALOR DE MULTA',
    status: 'refused',
  },
  9300532: {
    message: 'DIAS PARA COBRANCA DE MULTA INVALIDO',
    status: 'refused',
  },
  9300533: {
    message: 'SITUACAO OPERACIONAL DO CONTRATO NAO PERMITE O REGISTRO DO TITULO',
    status: 'refused',
  },
  9300534: {
    message: 'INFORMAR APENAS PERCENTUAL OU VALOR DO DESCONTO',
    status: 'refused',
  },
  9300535: {
    message: 'DATA LIMITE DE DESCONTO INVALIDA',
    status: 'refused',
  },
  9300536: {
    message: 'INFORMAR APENAS PERCENTUAL OU VALOR DA BONIFICACAO',
    status: 'refused',
  },
  9300537: {
    message: 'DATA LIMITE PARA BONIFICACAO INVALIDA',
    status: 'refused',
  },
  9300538: {
    message: 'CODIGO DO TIPO DE BOLETO INVALIDO',
    status: 'refused',
  },
  9300539: {
    message: 'UTILIZAR 3 DESCONTOS OU 2 DESCONTOS E BONIFICACAO',
    status: 'refused',
  },
  9300540: {
    message: 'DESCONTO - DATA LIMITE 2 IGUAL OU MAIOR QUE DATA LIMITE 3',
    status: 'refused',
  },
  9300541: {
    message: 'DESCONTO - DATA LIMITE 1 IGUAL OU MAIOR QUE DATA LIMITE 3',
    status: 'refused',
  },
  9300542: {
    message: 'DESCONTO - DATA LIMITE 1 IGUAL OU MAIOR QUE DATA LIMITE 2',
    status: 'refused',
  },
  9300543: {
    message: 'CPF/CNPJ OBRIGATORIO PARA DEBITO AUTOMATICO',
    status: 'refused',
  },
  9300544: {
    message: 'CEP SACADO INVALIDO',
    status: 'refused',
  },
  9300545: {
    message: 'CEP SACADOR AVALISTA INVALIDO',
    status: 'refused',
  },
  9300546: {
    message: 'USUARIO NAO AUTORIZADO',
    status: 'refused',
  },
  9300547: {
    message: 'DATA DESCONTO MENOR OU IGUAL DATA EMISSAO',
    status: 'refused',
  },
  9300548: {
    message: 'VALOR DESCONTO MAIOR OU IGUAL VALOR TITULO',
    status: 'refused',
  },
  9300549: {
    message: 'VALOR ABATIMENTO MAIOR OU IGUAL VALOR TITULO',
    status: 'refused',
  },
  9300550: {
    message: 'CEP INVALIDO',
    status: 'refused',
  },
  9300551: {
    message: 'DATA EMISSAO INVALIDA',
    status: 'refused',
  },
  9300552: {
    message: 'DATA VENCIMENTO INVALIDA',
    status: 'refused',
  },
  9300553: {
    message: 'VALOR IOF MAIOR OU IGUAL VALOR TITULO',
    status: 'refused',
  },
  9300554: {
    message: 'PERCENTUAL INFORMADO MAIOR OU IGUAL 100,00',
    status: 'refused',
  },
  9300555: {
    message: 'NUMERO CGC/CPF INVALIDO',
    status: 'refused',
  },
  9300556: {
    message: 'NEGOCIACAO/CLIENTE BLOQUEADO OU PENDENTE',
    status: 'refused',
  },
  9300557: {
    message: 'BANCO/AGENCIA DEPOSITARIA INVALIDO',
    status: 'refused',
  },
  9300558: {
    message: 'ESPECIE DE DOCUMENTO INVALIDO',
    status: 'refused',
  },
  9300559: {
    message: 'DIAS PARA INSTRUCAO DE PROTESTO INVALIDO',
    status: 'refused',
  },
  9300560: {
    message: 'DIAS PARA DECURSO DE PRAZO INVALIDO',
    status: 'refused',
  },
  9300561: {
    message: 'CODIGO PARA DESCONTO INVALIDO',
    status: 'refused',
  },
  9300562: {
    message: 'CODIGO PARA MULTA INVALIDO',
    status: 'refused',
  },
  9300563: {
    message: 'CODIGO DA COMISSAO DE PERMANENCIA INVALIDO',
    status: 'refused',
  },
  9300564: {
    message: 'DATA EMISSAO MAIOR OU IGUAL DATA VENCIMENTO',
    status: 'refused',
  },
  9300565: {
    message: 'DATA DESCONTO INVALIDA',
    status: 'refused',
  },
  9300566: {
    message: 'Percentual multa informado maior que o permitido',
    status: 'refused',
  },
  9300567: {
    message: 'PERCENTUAL BONIFICACAO INFORMADO MAIOR QUE O PERMITIDO',
    status: 'refused',
  },
  9300568: {
    message: 'VALOR IOF INCOMPATIVEL COM ID PROD',
    status: 'refused',
  },
  9300569: {
    message: 'NAO PODE HAVER MAIS DE UMA BONIFICACAO',
    status: 'refused',
  },
  9300570: {
    message: 'DIGITO INVALIDO',
    status: 'refused',
  },
  9300571: {
    message: 'CLIENTE INEXISTENTE',
    status: 'refused',
  },
  9300572: {
    message: 'Percentual comissão permanência informado maior que o permitido',
    status: 'refused',
  },
  9300573: {
    message: 'CNPJ/CPF INVALIDO',
    status: 'refused',
  },
  9300574: {
    message: 'TITULO JA CADASTRADO',
    status: 'refused',
  },
  9300575: {
    message: 'INFORME A DATA DE VENCIMENTO',
    status: 'refused',
  },
  9300576: {
    message: 'DATA VENCIMENTO POSTERIOR A 10 ANOS',
    status: 'refused',
  },
  9300577: {
    message: 'VALOR IOF OBRIGATORIO',
    status: 'refused',
  },
  9300578: {
    message: 'INFORME TODOS OS CAMPOS P/ ABATIMENTO',
    status: 'refused',
  },
  9300579: {
    message: 'TIPO INVALIDO',
    status: 'refused',
  },
  9300580: {
    message: 'INFORME TODOS OS DADOS DO SACADOR AVALISTA',
    status: 'refused',
  },
  9300581: {
    message: 'REGISTRO ON-LINE NAO PERMITIDO - BANCO-CLIENTE DIFERENTE DE 237',
    status: 'refused',
  },
  9300582: {
    message: 'INFORME TODOS OS DADOS PARA DESCONTO/BONIFICACAO',
    status: 'refused',
  },
  9300583: {
    message: 'VL ACUMULADO DESCONTO/BONIFICACAO MAIOR OU IGUAL VL TITULO',
    status: 'refused',
  },
  9300584: {
    message: 'DATAS DE DESCONTO/BONIFICACAO FORA DE SEQUENCIA',
    status: 'refused',
  },
  9300585: {
    message: 'INFORME TODOS OS CAMPOS PARA MULTA',
    status: 'refused',
  },
  9300586: {
    message: 'Informe todos os campos para comissão de permanência',
    status: 'refused',
  },
  9300587: {
    message: 'ACESSO NAO AUTORIZADO A ESTA NEGOCIACAO',
    status: 'refused',
  },
  9300588: {
    message: 'NEGOCIACAO BLOQUEADA',
    status: 'refused',
  },
  9300599: {
    message: 'TIPO DE BOLETO SMS, INFORMAR O DDD/CELULAR DO SACADO',
    status: 'refused',
  },
  93005100: {
    message: 'DIAS DE JUROS INVALIDO',
    status: 'refused',
  },
  93005101: {
    message: 'VALOR DA MULTA INFORMADO EXCEDEU O PARAMETRO',
    status: 'refused',
  },
  93005102: {
    message: 'MULTA NAO PERMITIDA PARA BOLETO DE PROPOSTA',
    status: 'refused',
  },
  93005103: {
    message: 'JUROS NAO PERMITIDO PARA BOLETO DE PROPOSTA',
    status: 'refused',
  },
  93005104: {
    message: 'CADASTRO DE PROTESTO AUTOMATICO NAO PERMITIDO - BOLETO DE PROPOSTA',
    status: 'refused',
  },
  93005105: {
    message: 'ESPECIE DO TITULO NAO PERMITIDA - BOLETO DE PROPOSTA NAO CONTRATADO',
    status: 'refused',
  },
  93005106: {
    message: 'NAO E POSSIVEL REGISTRAR O TITULO',
    status: 'refused',
  },
  93005107: {
    message: 'DIAS PARA NEGATIVACAO MENOR QUE O PERMITIDO EM CONTRATO',
    status: 'refused',
  },
  93005108: {
    message: 'ESPECIE DE TITULO NAO PERMITE NEGATIVACAO',
    status: 'refused',
  },
  93005109: {
    message: 'SOLICITACAO DE SERVICO DE NEGATIVACAO NAO NEGOCIADO',
    status: 'refused',
  },
  93005110: {
    message: 'DIAS UTEIS PARA NEGATIVACAO NAO PERMITIDO - CONTRATO EM DIAS CORRIDOS',
    status: 'refused',
  },
  93005111: {
    message: 'DIAS CORRIDOS PARA NEGATIVACAO NAO PERMITIDO - CONTRATO EM DIAS UTEIS',
    status: 'refused',
  },
  93005112: {
    message: 'Dados mínimos para registro não informados',
    status: 'refused',
  },
  93005113: {
    message: 'O CODIGO DA LOJA ENVIADO NA REQUISICAO NAO CONFERE',
    status: 'refused',
  },
  93005114: {
    message: 'CODIGO DA LOJA NAO ENCONTRADO',
    status: 'refused',
  },
  93005115: {
    message: 'CHAVE DE ACESSO NAO ENCONTRADA/INVALIDA',
    status: 'refused',
  },
  93005116: {
    message: 'ERRO NA FORMATACAO DOS DADOS DE EMISSAO',
    status: 'pending_registration',
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
  93005121: {
    message: 'NOME DO SACADO INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005122: {
    message: 'ENDEREÇO DO SACADO INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005123: {
    message: 'NUMERO DE ENDEREÇO DO SACADA INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005124: {
    message: 'BAIRRO DO SACADO INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005125: {
    message: 'CIDADE DO SACADO INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005126: {
    message: 'UF SACADO INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005127: {
    message: 'DOCUMENTO SACADO INVÁLIDO OU EM BRANCO',
    status: 'refused',
  },
  93005128: {
    message: 'CAMPO DOCUMENTO DO SACADO INVALIDO',
    status: 'refused',
  },
  93005999: {
    message: 'BOLETO GERADO COM SUCESSO – REGISTRO EM PROCESSAMENTO',
    status: 'unknown',
  },
  '-549': {
    message: 'Erro - A Tag DATAVENCIMENTO do Boleto nao pode ser alterada quando o titulo ja foi registrado',
    status: 'refused',
  },
}
