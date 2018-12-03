import test from 'ava'
import { getConfig } from '../../../src/config/index'

const configMock = {
  development: {
    host: '172.171.344.32/development',
    port: 5000,
  },
  test: {
    host: '172.171.344.32/test',
    port: 3000,
  },
  production: {
    host: '172.171.344.32/production',
    port: 5631,
  },
}

test.afterEach(() => {
  process.env.NODE_ENV = 'test'
})

test('getConfig: with argument', (t) => {
  const config = getConfig(configMock, 'production')

  t.deepEqual(config, {
    host: '172.171.344.32/production',
    port: 5631,
  }, 'should be the `production` config')
})

test('getConfig: with process.env.NODE_ENV', (t) => {
  process.env.NODE_ENV = 'development'
  const config = getConfig(configMock, 'development')

  t.deepEqual(config, {
    host: '172.171.344.32/development',
    port: 5000,
  }, 'should be the `development` config')
})

test('getConfig: with no argument and no process.env.NODE_ENV', (t) => {
  process.env.NODE_ENV = ''
  const config = getConfig(configMock)

  t.deepEqual(config, {
    host: '172.171.344.32/test',
    port: 3000,
  }, 'should be the default `test` config')
})

