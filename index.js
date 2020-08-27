const http = require('http')
const config = require('./utils/config')
const databaseService = require('./databaseService')
const packageService = require('./services/packages')

const server = http.createServer((req, res) => {
  const packages = packageService.getAll()
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(packages)
})

server.listen(config.PORT, () => {
  databaseService.init()
  console.log(`Server running at ${config.baseUrl}`);
})