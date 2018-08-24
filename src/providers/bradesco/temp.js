const moment = require('moment-timezone')

const SP_TZ = 'America/Sao_Paulo'

const isBradescoOff = () => {
  const now = moment().tz(SP_TZ)
  const bradescoStartTime = moment('2018-08-26 23:00:00').tz(SP_TZ)
  const bradescoEndTime = moment('2018-08-27 05:01:00').tz(SP_TZ)
  return now.isBetween(bradescoStartTime, bradescoEndTime)
}

module.exports = {
  isBradescoOff,
}
