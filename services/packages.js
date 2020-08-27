const fs = require('fs')
const config = require('../utils/config')

const getAll = () => {
  const packagesList = fs.readFileSync(config.dbFileUrl)
  return JSON.parse(packagesList)
}

module.exports = {
  getAll
}