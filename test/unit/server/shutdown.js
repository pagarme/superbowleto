import test from 'ava'
import sinon from 'sinon'
import { is } from 'ramda'
import {
  shutdown,
  shutdownEvent,
  setupGracefulShutdown,
} from '../../../src/server/shutdown'

test('should shutdown the process after the server is closed', (t) => {
  const mockProcess = {
    exit: sinon.spy(),
  }

  const mockServer = {
    close: sinon.spy(),
  }

  const mockValue = 15

  shutdown(mockProcess, mockServer, mockValue)()

  const closeCallback = mockServer.close.args[0][0]
  closeCallback()

  t.is(mockServer.close.callCount, 1)
  t.is(mockProcess.exit.callCount, 1)
  t.is(mockProcess.exit.args[0][0], 128 + mockValue)
})

test('should add event to process', (t) => {
  const mockProcess = {
    on: sinon.spy(),
  }

  const mockServer = {}

  const mockValue = 15

  const mockSignal = 'SIGTERM'

  shutdownEvent(mockProcess, mockServer)(mockValue, mockSignal)

  const [signalArg, callbackArg] = mockProcess.on.args[0]

  t.is(mockProcess.on.callCount, 1)
  t.true(is(Function, callbackArg))
  t.is(signalArg, mockSignal)
})

test('should add events for all shutdown signals of the process', (t) => {
  const mockSignals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGTERM: 15,
  }

  const mockProcess = {
    on: sinon.spy(),
  }

  const mockServer = {}

  setupGracefulShutdown(mockProcess, mockServer)

  const [SIGHUP] = mockProcess.on.args[0]
  const [SIGINT] = mockProcess.on.args[1]
  const [SIGTERM] = mockProcess.on.args[2]

  t.is(mockProcess.on.callCount, 3)
  t.true(SIGHUP in mockSignals)
  t.true(SIGINT in mockSignals)
  t.true(SIGTERM in mockSignals)
})
