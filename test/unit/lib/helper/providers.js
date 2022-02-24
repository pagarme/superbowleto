import test from 'ava'
import {
  isEmptyOrNull,
  changeIssuerWhenInterestOrFine,
} from '../../../../src/lib/helpers/providers'

const randomOperationId = 'randomOperationId'

const createFakeBoletoCaixa = (customParameters) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-caixa',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: {
      amount: 100,
    },
    interest: {
      amount: 100,
    },
  }

  return { ...boleto, ...customParameters }
}

test('isEmptyOrNull: when is not empty or null', async (t) => {
  const interest = {
    amount: 100,
  }

  const result = isEmptyOrNull(interest)

  t.is(result, false)
})

test('isEmptyOrNull: when is empty and an object', async (t) => {
  const interest = {}

  const result = isEmptyOrNull(interest)

  t.is(result, true)
})

test('isEmptyOrNull: when is null', async (t) => {
  const interest = null

  const result = isEmptyOrNull(interest)

  t.is(result, true)
})

test('isEmptyOrNull: when is undefined', async (t) => {
  const interest = undefined

  const result = isEmptyOrNull(interest)

  t.is(result, true)
})

test('isEmptyOrNull: when is empty and an array', async (t) => {
  const interest = []

  const result = isEmptyOrNull(interest)

  t.is(result, true)
})

test('changeIssuerWhenInterestOrFine: when interest is not empty or null and provider is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    interest: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
  t.is(result.issuer_agency, '1229')
  t.is(result.issuer_account, '469')
  t.is(result.issuer_wallet, '26')
})

test('changeIssuerWhenInterestOrFine: when interest is not empty or null and provider is not boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'development',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    interest: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'development')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when interest is empty', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    interest: {},
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when interest is null', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    interest: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when fine is not empty or null and provider is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
  t.is(result.issuer_agency, '1229')
  t.is(result.issuer_account, '469')
  t.is(result.issuer_wallet, '26')
})

test('changeIssuerWhenInterestOrFine: when fine is not empty or null and provider is not boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'development',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto)

  t.is(result.issuer, 'development')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when fine is empty', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: {},
  }

  const result = changeIssuerWhenInterestOrFine(boleto)

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when fine is null', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when fine is null, interest has info and is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: null,
    interest: {
      amount: 100,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
  t.is(result.issuer_agency, '1229')
  t.is(result.issuer_account, '469')
  t.is(result.issuer_wallet, '26')
})

test('changeIssuerWhenInterestOrFine: when interest is null, fine has info and is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: {
      amount: 100,
    },
    interest: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
  t.is(result.issuer_agency, '1229')
  t.is(result.issuer_account, '469')
  t.is(result.issuer_wallet, '26')
})

test('changeIssuerWhenInterestOrFine: when interest is null, fine has info and is not boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'development',
    issuer_agency: '123',
    issuer_account: '1234',
    issuer_wallet: '25',
    fine: {
      amount: 100,
    },
    interest: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'development')
  t.is(result.issuer_agency, '123')
  t.is(result.issuer_account, '1234')
  t.is(result.issuer_wallet, '25')
})

test('changeIssuerWhenInterestOrFine: when interest is null, fine has info and is boleto-api-caixa', async (t) => {
  const boleto = createFakeBoletoCaixa({ interest: null })

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, boleto.issuer)
  t.is(result.issuer_agency, boleto.issuer_agency)
  t.is(result.issuer_account, boleto.issuer_account)
  t.is(result.issuer_wallet, boleto.issuer_wallet)
})

test('changeIssuerWhenInterestOrFine: when fine is null, interest has info and is boleto-api-caixa', async (t) => {
  const boleto = createFakeBoletoCaixa({ fine: null })

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, boleto.issuer)
  t.is(result.issuer_agency, boleto.issuer_agency)
  t.is(result.issuer_account, boleto.issuer_account)
  t.is(result.issuer_wallet, boleto.issuer_wallet)
})

test('changeIssuerWhenInterestOrFine: when fine is empty', async (t) => {
  const boleto = createFakeBoletoCaixa({ fine: {}, interest: undefined })

  const result = changeIssuerWhenInterestOrFine(boleto)

  t.is(result.issuer, boleto.issuer)
  t.is(result.issuer_agency, boleto.issuer_agency)
  t.is(result.issuer_account, boleto.issuer_account)
  t.is(result.issuer_wallet, boleto.issuer_wallet)
})

test('changeIssuerWhenInterestOrFine: when fine is null', async (t) => {
  const boleto = createFakeBoletoCaixa({ fine: null, interest: undefined })

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, boleto.issuer)
  t.is(result.issuer_agency, boleto.issuer_agency)
  t.is(result.issuer_account, boleto.issuer_account)
  t.is(result.issuer_wallet, boleto.issuer_wallet)
})

test('changeIssuerWhenInterestOrFine: when interest is empty', async (t) => {
  const boleto = createFakeBoletoCaixa({ interest: {}, fine: undefined })

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, boleto.issuer)
  t.is(result.issuer_agency, boleto.issuer_agency)
  t.is(result.issuer_account, boleto.issuer_account)
  t.is(result.issuer_wallet, boleto.issuer_wallet)
})

test('changeIssuerWhenInterestOrFine: when interest is null', async (t) => {
  const boleto = createFakeBoletoCaixa({ interest: null, fine: undefined })

  const result = changeIssuerWhenInterestOrFine(boleto, randomOperationId)

  t.is(result.issuer, boleto.issuer)
  t.is(result.issuer_agency, boleto.issuer_agency)
  t.is(result.issuer_account, boleto.issuer_account)
  t.is(result.issuer_wallet, boleto.issuer_wallet)
})
