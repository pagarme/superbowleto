import test from 'ava'
import moment from 'moment'
import cuid from 'cuid'
import { createBoleto } from '../../../helpers/boleto'
import {
  buildHeaders,
  buildPayload,
  translateResponseCode,
  isHtml,
  getBoletoUrl,
} from '../../../../src/providers/boleto-api-caixa'
import {
  getDocumentType,
} from '../../../../src/providers/boleto-api-caixa/formatter'
import {
  getPagarmeAddress,
} from '../../../../src/resources/boleto/model'


const noStrictRules = {
  acceptDivergentAmount: true,
  maxDaysToPayPastDue: 60,
}

const strictExpirateDateRules = {
  acceptDivergentAmount: false,
  maxDaysToPayPastDue: 0,
}

function getDefaultInstruction (companyName = 'company name test', companyDocumentNumber) {
  return ` A emissão deste boleto foi solicitada e/ou intermediada pela empresa ${companyName} - CNPJ: ${companyDocumentNumber}. Para confirmar a existência deste boleto consulte em pagar.me/boletos`
}

test('buildPayload without rules and wallet then title.rules should be null', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  delete boleto.issuer_wallet

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.rules, null)
})

test('buildPayload with no_strict rules then title.rules should have no_strict rules', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    rules: ['no_strict'],
  })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.rules, noStrictRules)
})

test('buildPayload with strict_expiration_date rules then title.rules should have strict_expiration_date rules', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    rules: ['strict_expiration_date'],
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.rules, strictExpirateDateRules)
})

test('buildPayload without rules and wallet 25 then title.rules should have strict_expiration_date rules', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    issuer_wallet: '25',
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.rules, strictExpirateDateRules)
})

test('buildPayload without rules and wallet 26 then title.rules should have no_strict rules', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    issuer_wallet: '26',
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.rules, noStrictRules)
})

test('buildPayload with full payer_address', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    payer_address: {
      zipcode: '5555555',
      street_number: '308',
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      street: 'lalalalalalal',
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.buyer.address, {
    street: boleto.payer_address.street,
    number: boleto.payer_address.street_number,
    complement: boleto.payer_address.complementary,
    district: boleto.payer_address.neighborhood,
    zipCode: boleto.payer_address.zipcode,
    city: boleto.payer_address.city,
    stateCode: boleto.payer_address.state,
  })
})

test('buildPayload with payer_address incomplete', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.buyer.address, undefined)
})

test('buildPayload with the instruction field filled should return the received instruction with the default instruction', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ company_name: 'company name test' })
  const payload = buildPayload(boleto, operationId)

  let instructionsExpected = boleto.instructions
  instructionsExpected += getDefaultInstruction(
    boleto.companyName,
    boleto.company_document_number
  )

  t.deepEqual(payload.title.instructions, instructionsExpected)
})

test('buildPayload with empty instruction field should return default instruction', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ instructions: '', company_name: 'company name test' })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.instructions, getDefaultInstruction(
    boleto.companyName,
    boleto.company_document_number
  ))
})

test('buildPayload with null instruction field should return default instruction', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ instructions: null, company_name: 'company name test' })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.instructions, getDefaultInstruction(
    boleto.companyName,
    boleto.company_document_number
  ))
})

test('buildPayload with undefined instruction field should return default instruction', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ instructions: undefined, company_name: 'company name test' })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.title.instructions, getDefaultInstruction(
    boleto.companyName,
    boleto.company_document_number
  ))
})

test('buildPayload with undefined fine should return the fine fields with default values in the payload correctly', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  delete boleto.fine

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.fine,
    null
  )
})

test('buildPayload with undefined fine and interest should return the fine and interest fields with default values in the payload correctly', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  delete boleto.fine
  delete boleto.interest

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees,
    null
  )
})

test('buildPayload with empty fine should return the fine fields with default values in the payload correctly', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ fine: {} })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.fine,
    null
  )
})

test('buildPayload with empty fine and interest should return the fine and interest fields with default values in the payload correctly', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ fine: {}, interest: {} })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees,
    null
  )
})

test('buildPayload with fine per amount should return the fine fields in the payload correctly', async (t) => {
  const operationId = cuid()
  const percentageOnTotalExpected = 0
  const boleto = await createBoleto()

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.fine.daysAfterExpirationDate,
    boleto.fine.days
  )
  t.deepEqual(
    payload.title.fees.fine.amountInCents,
    boleto.fine.amount
  )
  t.deepEqual(
    payload.title.fees.fine.percentageOnTotal,
    percentageOnTotalExpected
  )
})

test('buildPayload with fine per percentage should return the fine fields in the payload correctly', async (t) => {
  const operationId = cuid()
  const percentageOnTotalExpected = 2.34
  const amountInCentsExpected = 0
  const daysAfterExpirationDateExpected = 4
  const boleto = await createBoleto({
    fine: {
      days: daysAfterExpirationDateExpected,
      percentage: percentageOnTotalExpected,
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.fine.daysAfterExpirationDate,
    daysAfterExpirationDateExpected
  )
  t.deepEqual(
    payload.title.fees.fine.amountInCents,
    amountInCentsExpected
  )
  t.deepEqual(
    payload.title.fees.fine.percentageOnTotal,
    percentageOnTotalExpected
  )
})

test('buildPayload with fine per percentage and amount should return the fine fields in the payload correctly', async (t) => {
  const operationId = cuid()
  const percentageOnTotalExpected = 1.10
  const amountInCentsExpected = 200
  const daysAfterExpirationDateExpected = 1
  const boleto = await createBoleto({
    fine: {
      amount: amountInCentsExpected,
      days: daysAfterExpirationDateExpected,
      percentage: percentageOnTotalExpected,
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.fine.daysAfterExpirationDate,
    daysAfterExpirationDateExpected
  )
  t.deepEqual(
    payload.title.fees.fine.amountInCents,
    amountInCentsExpected
  )
  t.deepEqual(
    payload.title.fees.fine.percentageOnTotal,
    percentageOnTotalExpected
  )
})

test('buildPayload with undefined interest should return the interest fields with default values in the payload correctly', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  delete boleto.interest

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.interest,
    null
  )
})

test('buildPayload with empty interest should return the interest fields with default values in the payload correctly', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({ interest: {} })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.interest,
    null
  )
})

test('buildPayload with interest per amount should return the interest fields in the payload correctly', async (t) => {
  const operationId = cuid()
  const percentagePerMonthExpected = 0
  const boleto = await createBoleto()

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.interest.daysAfterExpirationDate,
    boleto.interest.days
  )
  t.deepEqual(
    payload.title.fees.interest.amountPerDayInCents,
    boleto.interest.amount
  )
  t.deepEqual(
    payload.title.fees.interest.percentagePerMonth,
    percentagePerMonthExpected
  )
})

test('buildPayload with interest per percentage should return the interest fields in the payload correctly', async (t) => {
  const operationId = cuid()
  const percentagePerMonthExpected = 2.34
  const amountPerDayInCentsExpected = 0
  const daysAfterExpirationDateExpected = 4
  const boleto = await createBoleto({
    interest: {
      days: daysAfterExpirationDateExpected,
      percentage: percentagePerMonthExpected,
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.interest.daysAfterExpirationDate,
    daysAfterExpirationDateExpected
  )
  t.deepEqual(
    payload.title.fees.interest.amountPerDayInCents,
    amountPerDayInCentsExpected
  )
  t.deepEqual(
    payload.title.fees.interest.percentagePerMonth,
    percentagePerMonthExpected
  )
})

test('buildPayload with interest per percentage and amount should return the interest fields in the payload correctly', async (t) => {
  const operationId = cuid()
  const percentagePerMonthExpected = 1.10
  const amountPerDayInCentsExpected = 200
  const daysAfterExpirationDateExpected = 1
  const boleto = await createBoleto({
    interest: {
      amount: amountPerDayInCentsExpected,
      days: daysAfterExpirationDateExpected,
      percentage: percentagePerMonthExpected,
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(
    payload.title.fees.interest.daysAfterExpirationDate,
    daysAfterExpirationDateExpected
  )
  t.deepEqual(
    payload.title.fees.interest.amountPerDayInCents,
    amountPerDayInCentsExpected
  )
  t.deepEqual(
    payload.title.fees.interest.percentagePerMonth,
    percentagePerMonthExpected
  )
})

test('buildPayload complete', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: 'company name test',
    payer_address: {
      zipcode: '5555555',
      street_number: '308',
      street: 'Rua dos bancos',
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
    },
  })
  const payload = buildPayload(boleto, operationId)

  let { instructions } = boleto
  instructions += getDefaultInstruction(
    boleto.companyName,
    boleto.company_document_number
  )

  t.deepEqual(payload, {
    bankNumber: 104,
    agreement: {
      agreementNumber: 1103388,
      agency: '3337',
    },
    title: {
      expireDate: moment(boleto.expiration_date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
      amountInCents: boleto.amount,
      ourNumber: boleto.title_id,
      instructions,
      documentNumber: String(boleto.title_id),
      rules: {
        acceptDivergentAmount: true,
        maxDaysToPayPastDue: 60,
      },
      fees: {
        fine: {
          daysAfterExpirationDate: boleto.fine.days,
          amountInCents: boleto.fine.amount,
          percentageOnTotal: 0,
        },
        interest: {
          daysAfterExpirationDate: boleto.interest.days,
          amountPerDayInCents: boleto.interest.amount,
          percentagePerMonth: 0,
        },
      },
    },
    payeeGuarantor: {
      name: boleto.company_name,
      document: {
        type: getDocumentType(boleto.company_document_number),
        number: boleto.company_document_number,
      },
    },
    recipient: {
      name: 'Pagar.me Pagamentos S/A',
      document: {
        type: 'CNPJ',
        number: '18727053000174',
      },
      address: {
        street: boleto.company_address.street,
        number: boleto.company_address.street_number,
        complement: boleto.company_address.complementary,
        zipCode: boleto.company_address.zipcode,
        district: boleto.company_address.neighborhood,
        city: boleto.company_address.city,
        stateCode: boleto.company_address.state,
      },
    },
    buyer: {
      name: boleto.payer_name,
      document: {
        type: boleto.payer_document_type.toUpperCase(),
        number: boleto.payer_document_number,
      },
      address: {
        zipCode: '5555555',
        number: '308',
        street: 'Rua dos bancos',
        complement: '11º andar',
        district: 'Brooklin',
        city: 'São Paulo',
        stateCode: 'SP',
      },
    },
    requestKey: operationId,
  })
})

test('when payer_address is different than company_address and pagarme address then address should be buyer address', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: 'company name test',
    payer_address: {
      zipcode: '5555555',
      street_number: '308',
      street: 'Rua dos bancos',
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.buyer.address, {
    zipCode: '5555555',
    number: '308',
    street: 'Rua dos bancos',
    complement: '11º andar',
    district: 'Brooklin',
    city: 'São Paulo',
    stateCode: 'SP',
  })
})

test('when payer_address is equals than company_address then buyer address should be undefined', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: 'company name test',
    payer_address: {
      zipcode: '5555555',
      street_number: '308',
      street: 'Rua dos bancos',
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
    },
    company_address: {
      zipcode: '5555555',
      street_number: '308',
      street: 'Rua dos bancos',
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
    },
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.buyer.address, undefined)
})

test('when payer_address is equals than address pagarme then buyer address should be undefined', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: 'company name test',
    payer_address: getPagarmeAddress(),
  })

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.buyer.address, undefined)
})

test('buildPayload with payeeGuarantor fields null', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: null,
    company_document_number: null,
  })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.payeeGuarantor, {
    name: '',
    document: {
      type: '',
      number: '',
    },
  })
})

test('buildPayload with payeeGuarantor fields undefined', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: undefined,
    company_document_number: undefined,
  })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.payeeGuarantor, {
    name: '',
    document: {
      type: '',
      number: '',
    },
  })
})

test('buildPayload with payeeGuarantor fields empty', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto({
    company_name: '',
    company_document_number: '',
  })
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.payeeGuarantor, {
    name: '',
    document: {
      type: '',
      number: '',
    },
  })
})

test('translateResponseCode: with a "registered" code', (t) => {
  const axiosResponse = {
    status: 200,
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [{
        href: 'https://blablahtml.com',
        rel: 'html',
        method: 'GET',
      },
      {
        href: 'https://blablapdf.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'registered')
  t.is(response.boleto_url, 'https://blablahtml.com')
  t.is(response.digitable_line, '98139178390283012831893193103293')
  t.is(response.barcode, '804284028402804820482')
})

test('translateResponseCode: registered with empty errors', (t) => {
  const axiosResponse = {
    status: 200,
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [{
        href: 'https://blablapdf.com',
        rel: 'PDF',
        method: 'GET',
      },
      {
        href: 'https://blablahtml.com',
        rel: 'html',
        method: 'GET',
      }],
      errors: [],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'registered')
  t.is(response.boleto_url, 'https://blablahtml.com')
  t.is(response.digitable_line, '98139178390283012831893193103293')
  t.is(response.barcode, '804284028402804820482')
})

test('translateResponseCode: with a "refused" code', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: '1',
        message: '(27) UF DO PAGADOR NAO INFORMADA',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('translateResponseCode: with a "unknown" code (should refuse for Caixa)', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: '1',
        message: '(XX) unknownnnnnn',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('translateResponseCode: with a "MP" error', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: 'MP400',
        message: 'O nome de usuário e senha devem ser preenchidos',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('translateResponseCode: with response missing html link', (t) => {
  const axiosResponse = {
    status: 200,
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [
        {
          href: 'https://blablapdf.com',
          rel: 'PDF',
          method: 'GET',
        }],
    },
  }

  const error = t.throws(() => {
    translateResponseCode(axiosResponse)
  })

  t.is(error.message, 'URL do boleto não foi retornada')
})

test('translateResponseCode: with response missing digitable line', (t) => {
  const axiosResponse = {
    status: 200,
    data: {
      id: '37279202382',
      barCodeNumber: '804284028402804820482',
      links: [
        {
          href: 'https://blablahtml.com',
          rel: 'html',
          method: 'GET',
        }],
    },
  }

  const error = t.throws(() => {
    translateResponseCode(axiosResponse)
  })

  t.is(error.message, 'linha digitável do boleto não foi retornada')
})

test('translateResponseCode: with response missing barcode', (t) => {
  const axiosResponse = {
    status: 200,
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      links: [
        {
          href: 'https://blablahtml.com',
          rel: 'html',
          method: 'GET',
        }],
    },
  }

  const error = t.throws(() => {
    translateResponseCode(axiosResponse)
  })

  t.is(error.message, 'código de barras do boleto não foi retornado')
})

test('buildHeaders', (t) => {
  const encryptedHeaders = buildHeaders()

  const expectedHeader = {
    Authorization: 'Basic RkFLRVVTUkNBSVhBOkZBS0VQV0RDQUlYQQ==',
  }

  t.deepEqual(encryptedHeaders, expectedHeader)
})

test('isHtml: when rel prop is html', (t) => {
  const links = {
    href: 'https://blablahtml.com',
    rel: 'html',
    method: 'GET',
  }

  const response = isHtml(links)

  t.is(response, true)
})

test('isHtml: when rel prop is pdf', (t) => {
  const links = {
    href: 'https://blablahtml.com',
    rel: 'pdf',
    method: 'GET',
  }

  const response = isHtml(links)

  t.is(response, false)
})

test('getBoletoUrl', (t) => {
  const axiosResponse = {
    id: '37279202382',
    digitableLine: '98139178390283012831893193103293',
    barCodeNumber: '804284028402804820482',
    links: [{
      href: 'https://blablahtml.com',
      rel: 'html',
      method: 'GET',
    },
    {
      href: 'https://blablapdf.com',
      rel: 'PDF',
      method: 'GET',
    }],
  }

  const response = getBoletoUrl(axiosResponse)

  t.is(response, 'https://blablahtml.com')
})
