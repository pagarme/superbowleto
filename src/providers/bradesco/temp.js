const moment = require('moment')

const isBradescoOff = () => {
  const now = moment()
  const bradescoStartTime = moment('2018-10-22 22:15:00')
  const bradescoEndTime = moment('2018-10-22 22:50:00')
  return now.isBetween(bradescoStartTime, bradescoEndTime)
}

module.exports = {
  isBradescoOff,
}
