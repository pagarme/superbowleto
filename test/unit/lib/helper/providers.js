import test from 'ava'
import {
  isEmptyOrNull,
  changeIssuerWhenInterestOrFine,
} from '../../../../src/lib/helpers/providers'

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
    interest: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
})

test('changeIssuerWhenInterestOrFine: when interest is not empty or null and provider is not boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'development',
    interest: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'development')
})

test('changeIssuerWhenInterestOrFine: when interest is empty', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    interest: {},
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
})

test('changeIssuerWhenInterestOrFine: when interest is null', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    interest: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
})

test('changeIssuerWhenInterestOrFine: when fine is not empty or null and provider is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    fine: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
})

test('changeIssuerWhenInterestOrFine: when fine is not empty or null and provider is not boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'development',
    fine: {
      amount: 200,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto)

  t.is(result.issuer, 'development')
})

test('changeIssuerWhenInterestOrFine: when fine is empty', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    fine: {},
  }

  const result = changeIssuerWhenInterestOrFine(boleto)

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
})

test('changeIssuerWhenInterestOrFine: when fine is null', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    fine: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'boleto-api-bradesco-shopfacil')
})

test('changeIssuerWhenInterestOrFine: when fine is null, interest has info and is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    fine: null,
    interest: {
      amount: 100,
    },
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
})

test('changeIssuerWhenInterestOrFine: when interest is null, fine has info and is boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'boleto-api-bradesco-shopfacil',
    fine: {
      amount: 100,
    },
    interest: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'bradesco')
})

test('changeIssuerWhenInterestOrFine: when interest is null, fine has info and is not boleto-api', async (t) => {
  const boleto = {
    amount: 100,
    issuer: 'development',
    fine: {
      amount: 100,
    },
    interest: null,
  }

  const result = changeIssuerWhenInterestOrFine(boleto, 'randomOperationId')

  t.is(result.issuer, 'development')
})
