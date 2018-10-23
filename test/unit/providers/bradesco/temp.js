import test from 'ava'
import sinon from 'sinon'
import moment from 'moment'
import { isBradescoOff } from '../../../../src/providers/bradesco/temp'

test('isBradescoOff when Bradesco is online', (t) => {
  const time = moment('2018-10-22 22:14:59').valueOf()
  const timer = sinon.useFakeTimers(time)

  t.is(isBradescoOff(), false)

  timer.restore()
})

test('isBradescoOff when Bradesco is offline', (t) => {
  const time = moment('2018-10-22 22:31:00').valueOf()
  const timer = sinon.useFakeTimers(time)

  t.is(isBradescoOff(), true)

  timer.restore()
})
