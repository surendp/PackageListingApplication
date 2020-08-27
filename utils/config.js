const path = require('path')

const PORT = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const sourceFileUrl = process.env.SOURCE_FILE_URL || path.join(path.dirname(__dirname), 'test.real')
const dbFileUrl = process.env.DB_FILE_URL || path.join(path.dirname(__dirname), 'db.json')
const baseUrl = `http://${host}:${PORT}/`

module.exports = {
  PORT,
  host,
  sourceFileUrl,
  dbFileUrl,
  baseUrl
}