const path = require('path')

const PORT = 3000
const host = 'localhost'
const sourceFileUrl = path.join(path.dirname(__dirname), 'db', 'status.real')
const dbFileUrl = path.join(path.dirname(__dirname), 'db', 'db.json')
const baseUrl = `http://${host}:${PORT}/`

module.exports = {
  PORT,
  host,
  sourceFileUrl,
  dbFileUrl,
  baseUrl
}