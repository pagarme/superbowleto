const moment = require('moment')

const isBradescoOff = () => {
  const now = moment()
  const bradescoStartTime = moment('2019-01-28 23:30:00')
  const bradescoEndTime = moment('2019-01-29 01:00:00')
  return now.isBetween(bradescoStartTime, bradescoEndTime)
}

module.exports = {
  isBradescoOff,
}
