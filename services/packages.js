const fs = require('fs')
const config = require('../utils/config')

const getAll = () => {
  const packagesList = fs.readFileSync(config.dbFileUrl)
  return packagesList
}

module.exports = {
  getAll
}