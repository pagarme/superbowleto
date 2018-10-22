const moment = require('moment')

const isBradescoOff = () => {
  const now = moment()
  const bradescoStartTime = moment('2018-08-26 23:00:00')
  const bradescoEndTime = moment('2018-08-27 05:01:00')
  return now.isBetween(bradescoStartTime, bradescoEndTime)
}

module.exports = {
  isBradescoOff,
}
